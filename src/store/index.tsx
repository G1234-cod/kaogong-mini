// 全局 Store（Context）：签名与原 PWA useData() 完全一致（data/ready/set），
// 页面代码近乎原样迁移；内部改造为「静默登录 bootstrap + 乐观 set + 异步持久化」。
//
// bootstrap 链路（Phase 1 验收观测点）：
//   ensureAuth（login→role 判定）→ flushWriteQueue（重放失败写）→ fetchSnapshot →
//   guest 无快照时注入 fixtures → mergeWithDefaults → ready
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { AppData } from '../types'
import type { AuthInfo, DataKey } from '../services/request'
import { ensureAuth } from '../services/api/auth'
import { initTransport } from '../services/httpTransport'
import { fetchSnapshot, flushWriteQueue, op, writeKeys } from '../services/api/data'
import { buildGuestData } from '../mocks/fixtures'
import { DEFAULTS, mergeWithDefaults } from './normalize'

interface DataContextValue {
  data: AppData
  ready: boolean
  /** 当前登录态（role 判定结果；guest=演示模式） */
  auth: AuthInfo | null
  set: <K extends keyof AppData>(key: K, value: AppData[K] | ((prev: AppData[K]) => AppData[K])) => void
  /** 身份预览切换等场景：清状态重走 bootstrap */
  rebootstrap: () => Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => ({ ...DEFAULTS }))
  const [ready, setReady] = useState(false)
  const [auth, setAuth] = useState<AuthInfo | null>(null)
  const bootRef = useRef(false)

  const bootstrap = useCallback(async () => {
    if (bootRef.current) return
    bootRef.current = true
    try {
      await initTransport() // 后端可达 → 切 httpTransport；否则保留本地 stub 兜底
      const info = await ensureAuth()
      setAuth(info)
      await flushWriteQueue()
      let snap = await fetchSnapshot()
      if (info.role === 'guest' && !snap) {
        // 游客沙盒首启：注入 Mock 样板（此后读写均落本地沙盒命名空间，不污染真实数据）
        const fixtures = buildGuestData()
        await writeKeys((Object.keys(fixtures) as DataKey[]).map((k) => op(k, fixtures[k])))
        snap = fixtures
      }
      setData(mergeWithDefaults((snap ?? {}) as Record<string, unknown>))
    } catch {
      // 登录/读取异常：DEFAULTS 兜底，应用仍可用（数据在下次写入时补齐）
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  const set = useCallback<DataContextValue['set']>((key, value) => {
    // 乐观更新：UI 即时响应，持久化异步进行（失败由 writeKeys 内部队列兜底重放）
    setData((prev) => {
      const nextVal =
        typeof value === 'function' ? (value as (p: unknown) => unknown)(prev[key]) : value
      void writeKeys([op(key, nextVal)])
      return { ...prev, [key]: nextVal }
    })
  }, [])

  const rebootstrap = useCallback(async () => {
    bootRef.current = false
    setReady(false)
    await bootstrap()
  }, [bootstrap])

  return (
    <DataContext.Provider value={{ data, ready, auth, set, rebootstrap }}>{children}</DataContext.Provider>
  )
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData 必须在 DataProvider 内使用')
  return ctx
}
