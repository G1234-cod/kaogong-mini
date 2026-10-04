// httpTransport：Transport 的真实 HTTP 实现（自建后端，契约见 request.ts 顶部注释）
// - user 角色：读写全走后端 MySQL；guest 角色：数据操作委托 storageTransport 本地沙盒（不落库）
// - 登录态/token 持久化（kg-auth/kg-openid/kg-token），token 附 Authorization 头
// - initTransport() 启动探测 /healthz：可达则 setTransport 切换，不可达回退本地 stub（离线可用）
import Taro from '@tarojs/taro'
import type { AppData, GrantItem, TaskDef } from '../types'
import type { AuthInfo, Transport, WriteOp } from './request'
import { setTransport } from './request'
import { ensureAuth, logout } from './api/auth'
import { createStorageTransport, getCachedAuth } from './storageTransport'

/** 生产后端（微信小程序后台 request 合法域名需配置该 HTTPS 域名；/api 由 Nginx 反代到 FastAPI） */
export const API_BASE = 'https://app.gyx-a.cn/api'

const KEY_AUTH = 'kg-auth'
const KEY_OPENID = 'kg-openid'
const KEY_TOKEN = 'kg-token'
const KEY_DEV_ROLE = 'kg-dev-role'

const localStore = createStorageTransport() // guest 沙盒 + 离线兜底

export function getToken(): string {
  return String(Taro.getStorageSync(KEY_TOKEN) || '')
}

function devOverride(): 'user' | 'guest' | null {
  const raw = String(Taro.getStorageSync(KEY_DEV_ROLE) || '')
  return raw === 'user' || raw === 'guest' ? raw : null
}

/** 数据路由角色：settings 身份预览开关优先，否则用服务端判定结果 */
function dataRole(): 'user' | 'guest' {
  return devOverride() ?? getCachedAuth()?.role ?? 'guest'
}

// 静默登录单飞：并发请求同时发现没 token 时只发一次登录，避免重复 /auth/login
let authInFlight: Promise<unknown> | null = null

function ensureAuthOnce(): Promise<unknown> {
  if (!authInFlight) {
    authInFlight = ensureAuth().finally(() => {
      authInFlight = null
    })
  }
  return authInFlight
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT',
  path: string,
  data?: unknown,
  retried = false,
): Promise<T> {
  // 冷启动竞态：页面 proxy 请求可能抢在静默登录前发出（token 为空 → 401）→ 先补登录
  const needAuth = !path.startsWith('/auth/') && path !== '/healthz'
  if (needAuth && !getToken() && !retried) {
    await ensureAuthOnce().catch(() => {})
  }
  const res = await Taro.request({
    url: API_BASE + path,
    method,
    data,
    timeout: 10000,
    header: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
  })
  if (res.statusCode === 401 && needAuth && !retried) {
    // token 缺失/失效：清登录态重新静默登录后重试一次
    logout()
    await ensureAuthOnce().catch(() => {})
    return request<T>(method, path, data, true)
  }
  if (res.statusCode >= 400) throw new Error(`HTTP ${res.statusCode}`)
  return res.data as T
}

/** GET 带查询参数（极简拼接，不依赖 URLSearchParams） */
export async function httpGetQ<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const qs = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
  return request<T>('GET', `${path}?${qs}`)
}

export async function httpPost<T>(path: string, data: unknown): Promise<T> {
  return request<T>('POST', path, data)
}

/**
 * 流式 POST：enableChunked + onChunkReceived 逐块回调已解码文本
 * 小程序无 TextDecoder → 手写 UTF-8 增量解码（跨块断字节留待下一块拼接）
 */
export async function httpStreamPost(
  path: string,
  data: unknown,
  onChunk: (text: string) => void,
  retried = false,
): Promise<void> {
  const needAuth = !path.startsWith('/auth/') && path !== '/healthz'
  if (needAuth && !getToken() && !retried) {
    await ensureAuthOnce().catch(() => {})
  }
  const decoder = new Utf8StreamDecoder()
  await new Promise<void>((resolve, reject) => {
    const task = Taro.request({
      url: API_BASE + path,
      method: 'POST',
      data,
      timeout: 60000,
      enableChunked: true,
      header: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
      success: (res) => {
        if (res.statusCode === 401) reject(new Error('HTTP 401'))
        else if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}`))
        else resolve()
      },
      fail: (err) => reject(new Error(err.errMsg || 'network error')),
    })
    task.onChunkReceived((res) => {
      try {
        const text = decoder.decode(res.data)
        if (text) onChunk(text)
      } catch {
        /* 单块解码异常忽略，不中断流 */
      }
    })
  }).catch(async (err: Error) => {
    // 401 → 重新登录重试一次（与 request() 一致）
    if (!retried && /401/.test(String(err.message))) {
      logout()
      await ensureAuthOnce().catch(() => {})
      return httpStreamPost(path, data, onChunk, true)
    }
    throw err
  })
}

/** UTF-8 增量解码器：处理跨 chunk 的多字节字符（小程序端无 TextDecoder） */
class Utf8StreamDecoder {
  private pending: number[] = []

  decode(chunk: ArrayBuffer | Uint8Array): string {
    const bytes = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk)
    const buf = this.pending.length ? new Uint8Array([...this.pending, ...bytes]) : bytes
    this.pending = []
    let out = ''
    let i = 0
    while (i < buf.length) {
      const b = buf[i]
      let cp = 0
      let extra = 0
      if (b < 0x80) {
        cp = b
        extra = 0
      } else if (b >= 0xc0 && b < 0xe0) {
        cp = b & 0x1f
        extra = 1
      } else if (b >= 0xe0 && b < 0xf0) {
        cp = b & 0x0f
        extra = 2
      } else if (b >= 0xf0) {
        cp = b & 0x07
        extra = 3
      } else {
        i++ // 非法首字节，跳过
        continue
      }
      if (i + extra >= buf.length) {
        // 尾部不完整序列 → 留给下一块
        this.pending = Array.from(buf.slice(i))
        break
      }
      let ok = true
      for (let k = 1; k <= extra; k++) {
        const cont = buf[i + k]
        if ((cont & 0xc0) !== 0x80) {
          ok = false
          break
        }
        cp = (cp << 6) | (cont & 0x3f)
      }
      if (!ok) {
        i++
        continue
      }
      // 码点 → 字符（手动处理代理对，String.fromCodePoint 部分环境缺失）
      if (cp > 0xffff) {
        const v = cp - 0x10000
        out += String.fromCharCode(0xd800 + (v >> 10), 0xdc00 + (v & 0x3ff))
      } else {
        out += String.fromCharCode(cp)
      }
      i += extra + 1
    }
    return out
  }
}

export function createHttpTransport(): Transport {
  async function login(code: string, register: boolean): Promise<AuthInfo> {
    const res = await request<{ role: 'user' | 'guest'; openid: string; nickname?: string; token: string }>(
      'POST',
      '/auth/login',
      { code, register },
    )
    Taro.setStorageSync(KEY_TOKEN, res.token)
    Taro.setStorageSync(KEY_OPENID, res.openid)
    const info: AuthInfo = { role: devOverride() ?? res.role, openid: res.openid, nickname: res.nickname }
    Taro.setStorageSync(KEY_AUTH, JSON.stringify(info))
    return info
  }

  async function upgrade(): Promise<AuthInfo> {
    const res = await request<{ role: 'user' | 'guest'; openid: string; token: string }>(
      'POST',
      '/auth/upgrade',
    )
    Taro.setStorageSync(KEY_TOKEN, res.token) // 转正后换发新 token
    const prev = getCachedAuth()
    const info: AuthInfo = { role: res.role, openid: res.openid, nickname: prev?.nickname }
    Taro.setStorageSync(KEY_AUTH, JSON.stringify(info))
    return info
  }

  async function getSnapshot(): Promise<Partial<AppData> | null> {
    if (dataRole() === 'guest') return localStore.getSnapshot()
    const res = await request<{ snapshot: Partial<AppData> | null }>('GET', '/data/snapshot')
    return res.snapshot
  }

  async function writeOps(ops: WriteOp[]): Promise<void> {
    if (dataRole() === 'guest') return localStore.writeOps(ops)
    await request<{ ok: boolean }>('PUT', '/data/keys', ops)
  }

  async function getTasks(): Promise<TaskDef[]> {
    return request<TaskDef[]>('GET', '/tasks')
  }

  async function getGrants(): Promise<GrantItem[]> {
    if (dataRole() === 'guest') return []
    return request<GrantItem[]>('GET', '/grants')
  }

  return { login, upgrade, getSnapshot, writeOps, getTasks, getGrants }
}

/** 启动探测：后端可达 → 切 httpTransport；不可达 → 保留本地 stub（演示/离线兜底） */
export async function initTransport(): Promise<boolean> {
  try {
    await request<{ ok: boolean }>('GET', '/healthz')
    setTransport(createHttpTransport())
    return true
  } catch {
    return false
  }
}
