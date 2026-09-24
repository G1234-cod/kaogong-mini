// httpTransport：Transport 的真实 HTTP 实现（自建后端，契约见 request.ts 顶部注释）
// - user 角色：读写全走后端 MySQL；guest 角色：数据操作委托 storageTransport 本地沙盒（不落库）
// - 登录态/token 持久化（kg-auth/kg-openid/kg-token），token 附 Authorization 头
// - initTransport() 启动探测 /healthz：可达则 setTransport 切换，不可达回退本地 stub（离线可用）
import Taro from '@tarojs/taro'
import type { AppData, GrantItem } from '../types'
import type { AuthInfo, Transport, WriteOp } from './request'
import { setTransport } from './request'
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

async function request<T>(method: 'GET' | 'POST' | 'PUT', path: string, data?: unknown): Promise<T> {
  const res = await Taro.request({
    url: API_BASE + path,
    method,
    data,
    timeout: 10000,
    header: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
  })
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

export function createHttpTransport(): Transport {
  async function login(code: string): Promise<AuthInfo> {
    const res = await request<{ role: 'user' | 'guest'; openid: string; nickname?: string; token: string }>(
      'POST',
      '/auth/login',
      { code },
    )
    Taro.setStorageSync(KEY_TOKEN, res.token)
    Taro.setStorageSync(KEY_OPENID, res.openid)
    const info: AuthInfo = { role: devOverride() ?? res.role, openid: res.openid, nickname: res.nickname }
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

  async function getRewards(): Promise<GrantItem[]> {
    return request<GrantItem[]>('GET', '/rewards')
  }

  async function getGrants(): Promise<GrantItem[]> {
    if (dataRole() === 'guest') return []
    return request<GrantItem[]>('GET', '/grants')
  }

  return { login, getSnapshot, writeOps, getRewards, getGrants }
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
