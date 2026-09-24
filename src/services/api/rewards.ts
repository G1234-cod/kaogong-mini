// 奖励 API（只读）：奖励池由 B 端外部管理，小程序端仅接收与展示（如奶茶券弹窗）
// 契约：GET /rewards（奖池）、GET /grants（已发放到个人的奖励）
import type { GrantItem } from '../../types'
import { getTransport } from '../request'

export async function fetchRewards(): Promise<GrantItem[]> {
  return getTransport().getRewards()
}

export async function fetchGrants(): Promise<GrantItem[]> {
  return getTransport().getGrants()
}
