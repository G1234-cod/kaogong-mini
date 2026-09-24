// 数据同步 API：快照拉取 + 按域写入 + 失败重试队列
// 队列为 httpTransport 预留：stub 阶段本地写入不会失败，但链路已就位
import Taro from '@tarojs/taro'
import type { AppData } from '../../types'
import { getTransport } from '../request'
import type { DataKey, WriteOp } from '../request'

const KEY_QUEUE = 'kg-write-queue'

interface QueuedOp extends WriteOp {
  tries: number
}

function readQueue(): QueuedOp[] {
  const raw = Taro.getStorageSync(KEY_QUEUE)
  if (!raw) return []
  try {
    return JSON.parse(String(raw)) as QueuedOp[]
  } catch {
    return []
  }
}

function writeQueue(q: QueuedOp[]): void {
  Taro.setStorageSync(KEY_QUEUE, JSON.stringify(q))
}

/** GET /data/snapshot：拉全量快照（无数据返回 null，由 store 决定注入 DEFAULTS 或 fixtures） */
export async function fetchSnapshot(): Promise<Partial<AppData> | null> {
  return getTransport().getSnapshot()
}

/** PUT /data/keys/{key}：按域批量写（失败自动入队，下次启动重放） */
export async function writeKeys(ops: WriteOp[]): Promise<void> {
  if (!ops.length) return
  try {
    await getTransport().writeOps(ops)
  } catch {
    const q = readQueue()
    q.push(...ops.map((o) => ({ ...o, tries: 0 })))
    writeQueue(q)
  }
}

/** 启动时重放写队列（bootstrap 阶段调用） */
export async function flushWriteQueue(): Promise<void> {
  const q = readQueue()
  if (!q.length) return
  try {
    await getTransport().writeOps(q)
    writeQueue([])
  } catch {
    // 仍失败：保留队列，下次再试（tries 计数留给 httpTransport 阶段做退避）
  }
}

/** 测试/调试：清空写队列 */
export function clearWriteQueue(): void {
  writeQueue([])
}

/** 组装 WriteOp 的便捷函数 */
export function op(key: DataKey, value: unknown): WriteOp {
  return { key, value, ts: Date.now() }
}
