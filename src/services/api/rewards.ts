// 任务与发券 API（只读）：任务定义与发放均由 B 端管理，小程序端仅接收与展示
// 契约：GET /tasks（任务定义列表）、GET /grants（已发放到个人的奖励）
import type { GrantItem, TaskDef } from '../../types'
import { getTransport } from '../request'

export async function fetchTasks(): Promise<TaskDef[]> {
  return getTransport().getTasks()
}

export async function fetchGrants(): Promise<GrantItem[]> {
  return getTransport().getGrants()
}
