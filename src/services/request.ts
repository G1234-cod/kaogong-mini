// 数据传输层抽象（BFF 契约的端侧锚点）
// 设计原则：storageTransport（本地 stub，模拟网络延迟）与 httpTransport（Phase 4 接 FastAPI）
// 同签名可互换；store 只面向 Transport 接口编程，切换后端零改页面代码。
//
// 对齐后端契约：
//   POST /auth/login            → login(code, register)（注册制：首次选择决定建档角色）
//   POST /auth/upgrade          → upgrade()（游客转正：role guest → user）
//   POST /auth/dev-login        → services/api/devLogin.ts（开发期临时：演示账号登录，上线前移除）
//   GET  /data/snapshot         → getSnapshot()
//   PUT  /data/keys/{key}        → writeOps(ops)
//   GET  /tasks /grants         → getTasks() / getGrants()
//   GET  /proxy/weather|geocode|hitokoto、POST /proxy/ai/chat → services/api/proxy.ts
import type { AppData, GrantItem, TaskDef } from '../types'
import { createStorageTransport } from './storageTransport'

/** 用户身份（后端 code2Session 后下发；stub 阶段本地模拟） */
export interface AuthInfo {
  role: 'user' | 'guest'
  openid: string
  nickname?: string
  /** httpTransport 阶段补充 token 字段 */
}

export type DataKey = keyof AppData

/** 写操作单元（一次 set() 可能产生多个域的级联写） */
export interface WriteOp {
  key: DataKey
  value: unknown
  ts: number
}

export interface Transport {
  /** wx.login 的 code 换身份：register=true 建档 user；false 建档 guest（已有记录沿用原角色） */
  login(code: string, register: boolean): Promise<AuthInfo>
  /** 游客转正：服务端改 role=user 并返回新 token；沙盒数据随后由 writeOps 全量上传 */
  upgrade(): Promise<AuthInfo>
  /** 全量/增量快照：user 读服务端；guest 由前端注入 fixtures（transport 返回 null 即可） */
  getSnapshot(): Promise<Partial<AppData> | null>
  /** 按域写（乐观更新落库）；guest 请求会在 transport 内被改写入本地沙盒命名空间 */
  writeOps(ops: WriteOp[]): Promise<void>
  /** 任务定义列表（B 端管理，只读下发；GET /tasks） */
  getTasks(): Promise<TaskDef[]>
  /** 已发放奖励（如奶茶券弹窗数据流） */
  getGrants(): Promise<GrantItem[]>
}

let active: Transport | null = null

/** 当前传输层（默认 storageTransport stub） */
export function getTransport(): Transport {
  if (!active) active = createStorageTransport()
  return active
}

/** 切换传输层（Phase 4 秒切 httpTransport；测试注入也走这里） */
export function setTransport(t: Transport): void {
  active = t
}
