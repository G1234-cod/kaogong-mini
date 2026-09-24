// 数据传输层抽象（BFF 契约的端侧锚点）
// 设计原则：storageTransport（本地 stub，模拟网络延迟）与 httpTransport（Phase 4 接 FastAPI）
// 同签名可互换；store 只面向 Transport 接口编程，切换后端零改页面代码。
//
// 对齐后端契约：
//   POST /auth/login            → login(code)
//   GET  /data/snapshot         → getSnapshot()
//   PUT  /data/keys/{key}        → writeOps(ops)
//   GET  /rewards /grants       → getRewards() / getGrants()
//   GET  /proxy/weather|geocode|hitokoto、POST /proxy/ai/chat → services/api/proxy.ts
import type { AppData, GrantItem } from '../types'
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
  /** wx.login 的 code 换身份：白名单命中 → user（落库）；陌生 OpenID → guest（不落库） */
  login(code: string): Promise<AuthInfo>
  /** 全量/增量快照：user 读服务端；guest 由前端注入 fixtures（transport 返回 null 即可） */
  getSnapshot(): Promise<Partial<AppData> | null>
  /** 按域写（乐观更新落库）；guest 请求会在 transport 内被改写入本地沙盒命名空间 */
  writeOps(ops: WriteOp[]): Promise<void>
  /** 奖励池（B 端管理，只读下发） */
  getRewards(): Promise<GrantItem[]>
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
