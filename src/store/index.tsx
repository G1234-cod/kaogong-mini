// 全局 Store（Context）：签名与原 PWA useData() 完全一致（data/ready/set），
// 页面代码近乎原样迁移；内部改造为「静默登录 bootstrap + 乐观 set + 异步持久化」。
//
// bootstrap 链路（Phase 1 验收观测点）：
//   ensureAuth（login→role 判定）→ flushWriteQueue（重放失败写）→ fetchSnapshot →
//   guest 无快照时注入 fixtures → mergeWithDefaults → ready
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { AppData } from '../types'
import type { AuthInfo, DataKey } from '../services/request'
import { ensureAuth, getRoleChosen, peekAuth, setRoleChosen } from '../services/api/auth'
import { initTransport } from '../services/httpTransport'
import { fetchSnapshot, flushWriteQueue, op, writeKeys } from '../services/api/data'
import { fetchGrants, fetchTasks } from '../services/api/rewards'
import { mergeServerRewards } from '../utils/rewards'
import { showToast } from '../utils/platform'
import { buildGuestData } from '../mocks/fixtures'
import { DEFAULTS, mergeWithDefaults } from './normalize'
import WelcomeScreen from '../components/WelcomeScreen'

interface DataContextValue {
  data: AppData
  ready: boolean
  /** 当前登录态（role 判定结果；guest=试玩账号） */
  auth: AuthInfo | null
  /** 首次身份选择是否已完成（false 时全局盖 WelcomeScreen） */
  onboarded: boolean
  set: <K extends keyof AppData>(key: K, value: AppData[K] | ((prev: AppData[K]) => AppData[K])) => void
  /** 身份预览切换/转正等场景：清状态重走 bootstrap */
  rebootstrap: () => Promise<void>
  /** WelcomeScreen 二选一：写入 kg-role-chosen 后重新引导（登录建档） */
  chooseRole: (role: 'user' | 'guest') => Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => ({ ...DEFAULTS }))
  const [ready, setReady] = useState(false)
  const [auth, setAuth] = useState<AuthInfo | null>(null)
  // 同步初始化，避免选择屏闪一下：已选过 / 旧版本已有登录态 → 直接视为已引导
  const [onboarded, setOnboarded] = useState<boolean>(() => Boolean(getRoleChosen() || peekAuth()))
  const bootRef = useRef(false)

  const bootstrap = useCallback(async () => {
    if (bootRef.current) return
    bootRef.current = true
    try {
      // 首次打开且未做身份选择：暂停引导，盖 WelcomeScreen（选择后 chooseRole 重走本流程）
      if (!getRoleChosen()) return
      await initTransport() // 后端可达 → 切 httpTransport；否则保留本地 stub 兜底
      const info = await ensureAuth()
      setAuth(info)
      await flushWriteQueue()
      let snap = await fetchSnapshot()
      // 游客沙盒首启或空壳快照（旧版本残留/写队列抢先落了空对象）→ 注入 Mock 样板；
      // 用户显式切过「空白模式」（guestDemo=false）则尊重选择不打扰
      const stored = (snap ?? {}) as Partial<AppData>
      const blankMode = stored.settings?.guestDemo === false
      const bare = !snap || Object.keys(stored).length === 0 || (!stored.checkins && !stored.notes && !stored.exams)
      if (info.role === 'guest' && !blankMode && bare) {
        // 此后读写均落本地沙盒命名空间，不污染真实数据
        const fixtures = buildGuestData()
        await writeKeys((Object.keys(fixtures) as DataKey[]).map((k) => op(k, fixtures[k])))
        snap = fixtures
      }
      const merged = mergeWithDefaults((snap ?? {}) as Record<string, unknown>)
      // 任务定义 + 发券：B 端每次启动下发，按 id 合并进奖励域（保留本地达成/领用状态）
      try {
        const [tasks, grants] = await Promise.all([fetchTasks(), fetchGrants()])
        const { rewards, changed, newGrants } = mergeServerRewards(merged.rewards, tasks, grants)
        if (changed) {
          merged.rewards = rewards
          void writeKeys([op('rewards', rewards)])
        }
        for (const g of newGrants) showToast(`🎉 收到新奖励：${g.title}`)
      } catch {
        // 离线/拉取失败：沿用本地奖励域，下次启动再同步
      }
      setData(merged)
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

  const chooseRole = useCallback(
    async (role: 'user' | 'guest') => {
      setRoleChosen(role)
      setOnboarded(true)
      await rebootstrap()
    },
    [rebootstrap]
  )

  return (
    <DataContext.Provider value={{ data, ready, auth, onboarded, set, rebootstrap, chooseRole }}>
      {children}
      {!onboarded && <WelcomeScreen onChoose={(r) => void chooseRole(r)} />}
    </DataContext.Provider>
  )
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData 必须在 DataProvider 内使用')
  return ctx
}
