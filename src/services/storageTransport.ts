// storageTransport：Transport 的本地 stub 实现
// - setStorageSync 包 Promise，附 80~200ms 随机延迟模拟真实网络节奏
// - guest 角色的写操作改写入 kg-guest-* 命名空间（随写随弃、不落库、不污染真实数据）
// - 角色判定当前由开发开关 kg-dev-role 模拟（真机上应经后端白名单判定）
import Taro from '@tarojs/taro'
import type { AppData, GrantItem, TaskDef } from '../types'
import { uid } from '../utils/date'
import type { AuthInfo, Transport, WriteOp } from './request'

const KEY_AUTH = 'kg-auth'
const KEY_OPENID = 'kg-openid'
const KEY_DATA = 'kg-data'
const KEY_GUEST_DATA = 'kg-guest-data'
const KEY_DEV_ROLE = 'kg-dev-role'

/** 模拟网络延迟 */
function delay(ms?: number): Promise<void> {
  const d = ms ?? 80 + Math.random() * 120
  return new Promise((resolve) => setTimeout(resolve, d))
}

function readJSON<T>(key: string): T | null {
  const raw = Taro.getStorageSync(key)
  if (!raw) return null
  try {
    return JSON.parse(String(raw)) as T
  } catch {
    return null
  }
}

function writeJSON(key: string, value: unknown): void {
  Taro.setStorageSync(key, JSON.stringify(value))
}

export function getCachedAuth(): AuthInfo | null {
  return readJSON<AuthInfo>(KEY_AUTH)
}

export function getDevRole(): 'user' | 'guest' | null {
  const r = Taro.getStorageSync(KEY_DEV_ROLE)
  return r === 'guest' ? 'guest' : r === 'user' ? 'user' : null
}

export function createStorageTransport(): Transport {
  async function login(_code: string, register: boolean): Promise<AuthInfo> {
    await delay()
    // stub：本地生成伪 openid（真实链路为后端 code2Session 换取）
    let openid = String(Taro.getStorageSync(KEY_OPENID) || '')
    if (!openid) {
      openid = 'stub-' + uid()
      Taro.setStorageSync(KEY_OPENID, openid)
    }
    // 注册制：register=true 正式建档；开发开关 kg-dev-role 可覆盖便于演示
    const info: AuthInfo = { role: getDevRole() ?? (register ? 'user' : 'guest'), openid }
    writeJSON(KEY_AUTH, info)
    return info
  }

  async function upgrade(): Promise<AuthInfo> {
    await delay()
    const prev = getCachedAuth()
    const info: AuthInfo = {
      role: 'user',
      openid: prev?.openid || String(Taro.getStorageSync(KEY_OPENID) || 'stub-' + uid()),
      nickname: prev?.nickname,
    }
    writeJSON(KEY_AUTH, info)
    return info
  }

  function dataKey(role: 'user' | 'guest'): string {
    return role === 'guest' ? KEY_GUEST_DATA : KEY_DATA
  }

  async function getSnapshot(): Promise<Partial<AppData> | null> {
    await delay()
    const auth = getCachedAuth()
    const key = dataKey(auth?.role ?? 'user')
    return readJSON<Partial<AppData>>(key)
  }

  async function writeOps(ops: WriteOp[]): Promise<void> {
    await delay()
    const auth = getCachedAuth()
    const key = dataKey(auth?.role ?? 'user')
    const snapshot = readJSON<Partial<AppData>>(key) ?? {}
    for (const op of ops) {
      ;(snapshot as Record<string, unknown>)[op.key] = op.value
    }
    writeJSON(key, snapshot)
  }

  async function getTasks(): Promise<TaskDef[]> {
    await delay(60)
    return [] // stub：任务由 B 端管理，Phase 4 走 GET /tasks（本地奖励池由 PRESET_REWARDS seed）
  }

  async function getGrants(): Promise<GrantItem[]> {
    await delay(60)
    return [] // stub：Phase 4 走 GET /grants（奶茶券弹窗数据流）
  }

  return { login, upgrade, getSnapshot, writeOps, getTasks, getGrants }
}
