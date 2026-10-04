// 认证 API：微信静默登录（wx.login → code → transport.login → AuthInfo 缓存）
// 注册制：首次打开由 WelcomeScreen 二选一（试玩/正式），选择写入 kg-role-chosen；
// 后续永远免登录（缓存命中不请求），换机/重装时服务端沿用原角色续档。
import Taro from '@tarojs/taro'
import { getTransport } from '../request'
import type { DataKey } from '../request'
import { getCachedAuth } from '../storageTransport'
import type { AuthInfo } from '../request'
import type { AppData } from '../../types'
import { op, writeKeys } from './data'

const KEY_AUTH = 'kg-auth'
const KEY_ROLE_CHOSEN = 'kg-role-chosen'
const KEY_GUEST_DATA = 'kg-guest-data'

/** 首次身份选择结果（null = 还没选过，需展示 WelcomeScreen） */
export function getRoleChosen(): 'user' | 'guest' | null {
  const r = String(Taro.getStorageSync(KEY_ROLE_CHOSEN) || '')
  return r === 'user' || r === 'guest' ? r : null
}

export function setRoleChosen(role: 'user' | 'guest'): void {
  Taro.setStorageSync(KEY_ROLE_CHOSEN, role)
}

/** 读缓存的登录态（同步，UI 判断角色用） */
export function peekAuth(): AuthInfo | null {
  return getCachedAuth()
}

/** 确保已登录：缓存命中直接返回；否则走 wx.login 静默登录（register 来自首次选择） */
export async function ensureAuth(): Promise<AuthInfo> {
  const cached = getCachedAuth()
  if (cached) {
    // 旧版本升级来的用户：无选择标记但已有登录态 → 补标记，不再弹选择屏
    if (!getRoleChosen()) setRoleChosen(cached.role)
    return cached
  }

  let code = ''
  try {
    const res = await Taro.login()
    code = res.code
  } catch {
    code = 'login-failed' // stub 阶段容忍：transport 不校验 code 内容
  }
  const info = await getTransport().login(code, getRoleChosen() === 'user')
  return info
}

/** 游客转正：改 role → （可选）沙盒数据全量上传 → 清沙盒
 *  注意时序：上传必须在调用方 rebootstrap（首次 hydrate）之前完成，否则会被 DEFAULTS 覆盖 */
export async function upgradeAccount(opts: { keepData: boolean }): Promise<AuthInfo> {
  // 先读沙盒（升级后命名空间切换就找不到了）
  let sandbox: Partial<AppData> | null = null
  if (opts.keepData) {
    const raw = Taro.getStorageSync(KEY_GUEST_DATA)
    if (raw) {
      try {
        sandbox = JSON.parse(String(raw)) as Partial<AppData>
      } catch {
        sandbox = null
      }
    }
  }
  const info = await getTransport().upgrade()
  setRoleChosen('user')
  if (sandbox) {
    // 转正上传：此刻 dataRole 已是 user，writeOps 走服务端（失败自动入 kg-write-queue 重放）
    await writeKeys((Object.keys(sandbox) as DataKey[]).map((k) => op(k, sandbox![k])))
  }
  Taro.removeStorageSync(KEY_GUEST_DATA) // 沙盒使命结束（数据已带走或已选择重来）
  return info
}

/** 退出（清缓存登录态，下次打开重新静默登录） */
export function logout(): void {
  Taro.removeStorageSync(KEY_AUTH)
}
