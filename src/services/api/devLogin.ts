// ==== 开发期临时：演示账号登录（账号+密码 → /auth/dev-login → 稳定伪 openid dev-acct-*） ====
// 用途：自己的微信 openid 已注册真实账号时，换一个预置全量数据的账号查看运行效果，与微信身份完全隔离。
// 上线前移除清单：本文件 + src/components/DevAccountPanel.tsx + settings-sub 引用与徽章标识
//                 + server/main.py /auth/dev-login 路由 + server/config.py DEV_ACCOUNTS
import Taro from '@tarojs/taro'
import type { AuthInfo } from '../request'
import { httpPost } from '../httpTransport'

/** 总开关：false 时前端入口整体隐藏（后端另由 config.DEV_ACCOUNTS 独立禁用） */
export const DEV_LOGIN_ENABLED = true

const KEY_AUTH = 'kg-auth'
const KEY_OPENID = 'kg-openid'
const KEY_TOKEN = 'kg-token'
const KEY_WRITE_QUEUE = 'kg-write-queue'

const DEV_OPENID_PREFIX = 'dev-acct-'

/** 当前是否为演示账号（openid 前缀判定，供徽章标识与重置数据按钮显隐） */
export function isDevAccount(): boolean {
  try {
    const raw = Taro.getStorageSync(KEY_AUTH)
    if (!raw) return false
    const info = JSON.parse(String(raw)) as AuthInfo
    return String(info.openid || '').startsWith(DEV_OPENID_PREFIX)
  } catch {
    return false
  }
}

/** 账号密码登录演示账号：成功后缓存登录态（role=user，数据真实落服务器） */
export async function devLogin(account: string, password: string): Promise<AuthInfo> {
  const res = await httpPost<{ role: 'user' | 'guest'; openid: string; nickname?: string; token: string }>(
    '/auth/dev-login',
    { account, password }
  )
  Taro.setStorageSync(KEY_TOKEN, res.token)
  Taro.setStorageSync(KEY_OPENID, res.openid)
  const info: AuthInfo = { role: res.role, openid: res.openid, nickname: res.nickname }
  Taro.setStorageSync(KEY_AUTH, JSON.stringify(info))
  return info
}

/** 退出演示账号：清登录态与未上传写队列（防演示数据串号到真实账号），下次引导回微信真实身份 */
export function devLogout(): void {
  Taro.removeStorageSync(KEY_AUTH)
  Taro.removeStorageSync(KEY_OPENID)
  Taro.removeStorageSync(KEY_TOKEN)
  Taro.removeStorageSync(KEY_WRITE_QUEUE)
}
