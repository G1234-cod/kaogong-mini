// 认证 API：微信静默登录（wx.login → code → transport.login → AuthInfo 缓存）
// 首次打开自动登录，后续永远免登录（缓存命中不请求）
import Taro from '@tarojs/taro'
import { getTransport } from '../request'
import { getCachedAuth, setDevRole } from '../storageTransport'
import type { AuthInfo } from '../request'

const KEY_AUTH = 'kg-auth'

/** 读缓存的登录态（同步，UI 判断角色用） */
export function peekAuth(): AuthInfo | null {
  return getCachedAuth()
}

/** 确保已登录：缓存命中直接返回；否则走 wx.login 静默登录 */
export async function ensureAuth(): Promise<AuthInfo> {
  const cached = getCachedAuth()
  if (cached) return cached

  let code = ''
  try {
    const res = await Taro.login()
    code = res.code
  } catch {
    code = 'login-failed' // stub 阶段容忍：transport 不校验 code 内容
  }
  const info = await getTransport().login(code)
  return info
}

/** 身份预览切换（settings 演示用）：user ↔ guest，切换后由 store 触发 rebootstrap */
export async function switchRolePreview(role: 'user' | 'guest'): Promise<void> {
  setDevRole(role)
  Taro.removeStorageSync(KEY_AUTH) // 强制下次 ensureAuth 重新判定
}

/** 退出（清缓存登录态，下次打开重新静默登录） */
export function logout(): void {
  Taro.removeStorageSync(KEY_AUTH)
}
