// 种花番茄钟：双模式（倒计时目标制 / 正计时自由专注可暂停）
// 自 PWA pages/Pomodoro.tsx 迁移：SVG 圆环 → conic-gradient 圆环（WXML 无 svg），
// localStorage → Taro storage（防小程序被杀后刷新丢会话），导航 → navigateTo
import { useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { Input, Label, Text, View } from '@tarojs/components'
import Icon from '../../components/Icon'
import { useData } from '../../store'
import Modal from '../../components/Modal'
import { pad2, todayStr } from '../../utils/date'
import { showToast } from '../../utils/platform'

/**
 * 进行中会话三持久化：module 级变量（小程序内切页不丢）
 * + Taro storage（防小程序被杀/切后台后重进丢失）。
 */
const LS_START = 'pomodoro_start_time'
const LS_MINUTES = 'pomodoro_target_minutes'
const LS_TASK = 'pomodoro_task'
const LS_MODE = 'pomodoro_mode'
const LS_PAUSED_AT = 'pomodoro_paused_at'
const LS_PAUSED_MS = 'pomodoro_paused_ms'

const PRESETS = [15, 25, 45, 60]

/** 专注模式：count 倒计时 / free 正计时 */
type PomoMode = 'count' | 'free'

interface Session {
  startAt: number
  /** 倒计时目标分钟数；正计时模式恒为 0（不设目标） */
  minutes: number
  task?: string
  mode: PomoMode
  /** 正计时暂停起点时间戳（未暂停则空） */
  pausedAt?: number
  /** 正计时历史累计暂停毫秒数 */
  pausedMs?: number
}

/** 小程序存活期内的进行中会话 */
let liveSession: Session | null = null

function readSession(): Session | null {
  const startAt = Number(Taro.getStorageSync(LS_START) ?? '')
  if (!startAt) return null
  // 旧数据没有 mode 字段，一律视为倒计时
  const mode: PomoMode = Taro.getStorageSync(LS_MODE) === 'free' ? 'free' : 'count'
  const minutes = Number(Taro.getStorageSync(LS_MINUTES) ?? '')
  if (mode === 'count' && !minutes) return null
  const task = (Taro.getStorageSync(LS_TASK) as string) || undefined
  const pausedAt = Number(Taro.getStorageSync(LS_PAUSED_AT) ?? '') || undefined
  const pausedMs = Number(Taro.getStorageSync(LS_PAUSED_MS) ?? '') || undefined
  return {
    startAt,
    minutes: mode === 'free' ? 0 : minutes,
    task: task || undefined,
    mode,
    pausedAt,
    pausedMs,
  }
}

function writeSession(s: Session | null) {
  if (s) {
    Taro.setStorageSync(LS_START, String(s.startAt))
    Taro.setStorageSync(LS_MODE, s.mode)
    if (s.mode === 'count') Taro.setStorageSync(LS_MINUTES, String(s.minutes))
    else Taro.removeStorageSync(LS_MINUTES) // 正计时无目标时长
    if (s.task) Taro.setStorageSync(LS_TASK, s.task)
    else Taro.removeStorageSync(LS_TASK)
    if (s.pausedAt) Taro.setStorageSync(LS_PAUSED_AT, String(s.pausedAt))
    else Taro.removeStorageSync(LS_PAUSED_AT)
    if (s.pausedMs) Taro.setStorageSync(LS_PAUSED_MS, String(s.pausedMs))
    else Taro.removeStorageSync(LS_PAUSED_MS)
  } else {
    Taro.removeStorageSync(LS_START)
    Taro.removeStorageSync(LS_MINUTES)
    Taro.removeStorageSync(LS_TASK)
    Taro.removeStorageSync(LS_MODE)
    Taro.removeStorageSync(LS_PAUSED_AT)
    Taro.removeStorageSync(LS_PAUSED_MS)
  }
  liveSession = s
}

function fmtMS(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`
}

/** 自定义时长合法性：5~120 分钟（2 小时） */
function isCustomValid(v: string): boolean {
  const n = Number(v)
  return v !== '' && !Number.isNaN(n) && n >= 5 && n <= 120
}

export default function Pomodoro() {
  const { data, ready, set } = useData()
  const today = todayStr()
  const storedMinutes = data.settings.pomoMinutes ?? 25
  const [minutesSel, setMinutesSel] = useState(storedMinutes)
  const [customMode, setCustomMode] = useState(!PRESETS.includes(storedMinutes))
  const [customInput, setCustomInput] = useState(PRESETS.includes(storedMinutes) ? '' : String(storedMinutes))
  const [taskInput, setTaskInput] = useState('')
  const [now, setNow] = useState(Date.now())
  const [bloomed, setBloomed] = useState(false)
  const [abandonAsk, setAbandonAsk] = useState(false)
  // 模式选择：倒计时 / 正计时；挂载时若恢复了会话则跟随会话模式
  const [modeSel, setModeSel] = useState<PomoMode>(() => {
    const s = liveSession ?? readSession()
    return s?.mode === 'free' ? 'free' : 'count'
  })
  // 挂载时恢复未过期会话（倒计时过期会话在下方 effect 补记录；
  // 正计时无自然完成概念，直接恢复进行中状态，含暂停态）
  const [session, setSession] = useState<Session | null>(() => {
    const s = liveSession ?? readSession()
    if (!s) return null
    if (s.mode === 'free') return s
    return Date.now() < s.startAt + s.minutes * 60000 ? s : null
  })

  // 当前生效模式：会话进行中以其自身模式为准，否则跟随用户选择
  const activeMode = session ? session.mode : modeSel

  // 挂载：检查 storage 中的过期倒计时会话（页面被杀期间自然走完）→ 补记录；
  // 正计时没有自然完成概念，跳过补记录
  useEffect(() => {
    const s = liveSession ?? readSession()
    if (!s || s.mode !== 'count') return
    const deadline = s.startAt + s.minutes * 60000
    if (Date.now() >= deadline) {
      set('pomodoroLogs', (prev) => [
        ...prev,
        { date: todayStr(), minutes: s.minutes, endedAt: deadline, task: s.task },
      ])
      writeSession(null) // 幂等清理，防重复记录
      showToast('🍅 上次专注已完成，已补记录')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 计时：按时间戳差值计算，防 drift；正计时暂停期间无需走秒
  useEffect(() => {
    if (!session || session.pausedAt) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [session])

  // 累计暂停毫秒（含当前正在暂停的时段）
  const pausedTotal = session
    ? (session.pausedMs ?? 0) + (session.pausedAt ? now - session.pausedAt : 0)
    : 0
  const totalMs = session && session.mode === 'count' ? session.minutes * 60000 : 0
  // 正计时有效专注毫秒（扣除全部暂停时段）
  const freeElapsedMs =
    session && session.mode === 'free'
      ? Math.max(0, now - session.startAt - pausedTotal)
      : 0
  const elapsed = session && session.mode === 'count' ? Math.min(totalMs, now - session.startAt) : 0
  const remainingMs = totalMs - elapsed
  const progress = session && totalMs > 0 ? elapsed / totalMs : 0
  // 自然完成仅倒计时有效（正计时 totalMs 恒为 0，done 恒 false）
  const done = !!session && session.mode === 'count' && now >= session.startAt + totalMs

  // 自然完成（仅倒计时）：记录 + 清会话 + 绽放
  useEffect(() => {
    if (!session || !done) return
    set('pomodoroLogs', (prev) => [
      ...prev,
      { date: todayStr(), minutes: session.minutes, endedAt: Date.now(), task: session.task },
    ])
    writeSession(null)
    setSession(null)
    setBloomed(true)
    showToast('🍅 专注完成！')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  const pickPreset = (m: number) => {
    setMinutesSel(m)
    setCustomMode(false)
    set('settings', (prev) => ({ ...prev, pomoMinutes: m }))
  }

  const enterCustom = () => {
    setCustomMode(true)
    if (!customInput) return
    if (!isCustomValid(customInput)) {
      showToast('自定义时长需在 5~120 分钟之间')
      return
    }
    const m = Math.round(Number(customInput))
    setMinutesSel(m)
    set('settings', (prev) => ({ ...prev, pomoMinutes: m }))
  }

  const changeCustom = (v: string) => {
    setCustomInput(v)
    if (!isCustomValid(v)) return // 非法输入不落库，等提示后修正
    const m = Math.round(Number(v))
    setMinutesSel(m)
    set('settings', (prev) => ({ ...prev, pomoMinutes: m }))
  }

  const start = () => {
    if (activeMode === 'count' && customMode && !isCustomValid(customInput)) {
      showToast('自定义时长需在 5~120 分钟之间')
      return
    }
    const s: Session = {
      startAt: Date.now(),
      minutes: activeMode === 'count' ? minutesSel : 0,
      task: taskInput.trim() || undefined,
      mode: activeMode,
    }
    writeSession(s)
    setSession(s)
    setNow(Date.now())
    setBloomed(false)
  }

  // 正计时暂停 / 继续：暂停记起点，继续把这段并入累计暂停毫秒
  const pauseOrResume = () => {
    if (!session || session.mode !== 'free') return
    if (session.pausedAt) {
      const next: Session = {
        ...session,
        pausedMs: (session.pausedMs ?? 0) + (Date.now() - session.pausedAt),
        pausedAt: undefined,
      }
      writeSession(next)
      setSession(next)
    } else {
      const next: Session = { ...session, pausedAt: Date.now() }
      writeSession(next)
      setSession(next)
    }
    setNow(Date.now())
  }

  // 正计时结束：有效专注毫秒（扣除暂停时段）向上取整记录；不足 1 分钟不记
  const finishFree = () => {
    if (!session || session.mode !== 'free') return
    const end = Date.now()
    const paused = (session.pausedMs ?? 0) + (session.pausedAt ? end - session.pausedAt : 0)
    const effMs = Math.max(0, end - session.startAt - paused)
    writeSession(null)
    setSession(null)
    if (effMs < 60000) {
      showToast('不足 1 分钟，就不记啦')
      return
    }
    const minutes = Math.ceil(effMs / 60000)
    set('pomodoroLogs', (prev) => [
      ...prev,
      { date: todayStr(), minutes, endedAt: end, task: session.task },
    ])
    showToast(`已记录 ${minutes} 分钟专注`)
  }

  const doAbandon = () => {
    writeSession(null)
    setSession(null)
    setBloomed(false)
    setAbandonAsk(false)
  }

  // 今日统计
  const todayLogs = useMemo(
    () => data.pomodoroLogs.filter((l) => l.date === today),
    [data.pomodoroLogs, today]
  )
  const todayCount = todayLogs.length
  const todayMinutes = todayLogs.reduce((sum, l) => sum + l.minutes, 0)
  const lastTask = todayLogs.length ? todayLogs[todayLogs.length - 1].task : undefined

  // 生长阶段：<25% 🌰 → <50% 🌱 → <75% 🌿 → <100% 🌸 → 完成 🌼
  const stage = progress < 0.25 ? '🌰' : progress < 0.5 ? '🌱' : progress < 0.75 ? '🌿' : '🌸'

  if (!ready) {
    return (
      <View className="page">
        <View className="skeleton sk-card" />
        <View className="skeleton sk-hero" />
        <View className="skeleton sk-card" />
      </View>
    )
  }

  return (
    <View className="page">
      {/* 模式切换：倒计时番茄 / 正计时自由专注；会话进行中锁定防误触 */}
      <View className="type-toggle" style={{ maxWidth: 252, margin: '0 auto 12px' }}>
        <View
          className={`type-btn ${activeMode === 'count' ? 'active' : ''}`}
          style={session ? { opacity: 0.5 } : undefined}
          onClick={() => {
            if (session) return
            setModeSel('count')
            setBloomed(false)
          }}
        >
          <Icon name="tomato" size={12} gap={4} /><Text>倒计时</Text>
        </View>
        <View
          className={`type-btn ${activeMode === 'free' ? 'active' : ''}`}
          style={session ? { opacity: 0.5 } : undefined}
          onClick={() => {
            if (session) return
            setModeSel('free')
            setBloomed(false)
          }}
        >
          <Icon name="clock" size={12} gap={4} /><Text>正计时</Text>
        </View>
      </View>

      {/* 时长选择（仅倒计时）：预设胶囊 + 自定义档 */}
      {activeMode === 'count' && (
        <View className="type-toggle">
          {PRESETS.map((m) => (
            <View
              key={m}
              className={`type-btn ${!customMode && minutesSel === m ? 'active' : ''}`}
              style={session ? { opacity: 0.5 } : undefined}
              onClick={() => {
                if (session) return
                pickPreset(m)
              }}
            >
              <Text>{m} 分</Text>
            </View>
          ))}
          <View
            className={`type-btn ${customMode ? 'active' : ''}`}
            style={session ? { opacity: 0.5 } : undefined}
            onClick={() => {
              if (session) return
              customMode ? pickPreset(PRESETS[1]) : enterCustom()
            }}
          >
            <Text>自定义</Text>
          </View>
        </View>
      )}
      {activeMode === 'count' && customMode && !session && (
        <View className="field" style={{ maxWidth: 220, margin: '0 auto 4px' }}>
          <Label>自定义时长（5-120 分钟）</Label>
          <Input
            type="number"
            value={customInput}
            onInput={(e) => changeCustom(e.detail.value)}
            onBlur={() => {
              if (!isCustomValid(customInput)) showToast('自定义时长需在 5~120 分钟之间')
            }}
            className={customInput && !isCustomValid(customInput) ? 'invalid' : ''}
            placeholder="如 17"
          />
        </View>
      )}

      {/* 舞台：正计时自由专注 / 倒计时种花（conic-gradient 圆环） */}
      {activeMode === 'free' ? (
        <View className="pomo-stage">
          <View
            className="pomo-ring"
            style={{ background: 'conic-gradient(var(--progress-bg) 0% 100%)' }}
          />
          <View className="pomo-ring-mask" />
          <View className="pomo-center">
            {session ? (
              <>
                <Text
                  className="pomo-flower"
                  style={
                    session.pausedAt
                      ? { opacity: 0.4 }
                      : // 呼吸感：透明度随秒针缓动（无 keyframes 的轻量实现）
                        { opacity: 0.6 + 0.4 * ((Math.sin(now / 1000) + 1) / 2) }
                  }
                >
                  {session.pausedAt ? '⏸' : '🧘'}
                </Text>
                <Text className="pomo-time">{fmtMS(freeElapsedMs)}</Text>
                {session.task && <Text className="pomo-task">{session.task}</Text>}
                {session.pausedAt && <Text className="sub">已暂停，随时继续</Text>}
              </>
            ) : (
              <>
                <Text className="pomo-flower dormant">⏱</Text>
                <Text className="pomo-time">00:00</Text>
                <Text className="sub">不限时长，专注到你想停为止</Text>
              </>
            )}
          </View>
        </View>
      ) : (
        <View className="pomo-stage">
          <View
            className="pomo-ring"
            style={{
              background: `conic-gradient(var(--primary) ${(progress * 100).toFixed(2)}%, var(--progress-bg) 0%)`,
            }}
          />
          <View className="pomo-ring-mask" />
          <View className="pomo-center">
            {bloomed ? (
              <>
                <Text className="pomo-flower bloom">🌼</Text>
                <Text className="pomo-time">完成！</Text>
                <Text className="sub">休息一下，喝口水 🌿</Text>
              </>
            ) : session ? (
              <>
                <Text className={`pomo-flower ${progress >= 0.75 ? 'pre-bloom' : ''}`}>{stage}</Text>
                <Text className="pomo-time">{fmtMS(remainingMs)}</Text>
                {session.task && <Text className="pomo-task">{session.task}</Text>}
              </>
            ) : (
              <>
                <Text className="pomo-flower dormant">🌰</Text>
                <Text className="pomo-time">{minutesSel}:00</Text>
              </>
            )}
          </View>
        </View>
      )}

      {/* 开始前：可选任务输入 */}
      {!session && !bloomed && (
        <View className="field" style={{ maxWidth: 340, margin: '0 auto' }}>
          <Input
            placeholder="（可选）比如：刷言语 20 题"
            value={taskInput}
            onInput={(e) => setTaskInput(e.detail.value)}
          />
        </View>
      )}

      {/* 控制按钮 */}
      <View className="row" style={{ justifyContent: 'center', marginTop: 14 }}>
        {bloomed ? (
          <View className="btn" onClick={start}>
            <Text>再来一个 🍅</Text>
          </View>
        ) : session && session.mode === 'free' ? (
          <>
            <View className="btn ghost" onClick={pauseOrResume}>
              <Text>{session.pausedAt ? '继续' : '暂停'}</Text>
            </View>
            <View className="btn" onClick={finishFree}>
              <Text>结束并记录</Text>
            </View>
          </>
        ) : session ? (
          <View className="btn danger" onClick={() => setAbandonAsk(true)}>
            <Text>放弃</Text>
          </View>
        ) : (
          <View className="btn hero" onClick={start}>
            <Text>开始专注</Text>
          </View>
        )}
      </View>

      {/* 今日统计 */}
      <View className="card" style={{ marginTop: 16 }}>
        <View className="card-title">
          <Icon name="tomato" size={16} gap={4} /><Text>今日番茄</Text>
          <View
            className="btn ghost small"
            onClick={() => Taro.navigateTo({ url: '/pages/pomo-logs/index' })}
          >
            <Text>查看记录 ›</Text>
          </View>
        </View>
        <View className="row-between">
          <Text className="pomo-stat-num">{todayCount}</Text>
          <Text className="sub">
            {todayCount === 0
              ? '种下一颗种子吧'
              : todayCount < 4
                ? '保持节奏，继续加油'
                : '太棒了，注意休息 💪'}
          </Text>
        </View>
        <Text className="sub" style={{ display: 'block', marginTop: 2 }}>
          共 {todayMinutes} 分钟
        </Text>
        {lastTask && (
          <Text className="sub" style={{ display: 'block', marginTop: 4 }}>
            最近一次：{lastTask}
          </Text>
        )}
      </View>

      {/* 放弃确认：App 内小弹窗 */}
      {abandonAsk && (
        <Modal variant="center" className="mini-modal" closeOnMask={false} onClose={() => setAbandonAsk(false)}>
          <Text className="mini-title">放弃这个番茄？</Text>
          <Text className="sub">剩下的专注时间会消失，种子也会枯萎 🥀</Text>
          <View className="row" style={{ justifyContent: 'center', marginTop: 16 }}>
            <View className="btn" onClick={() => setAbandonAsk(false)}>
              <Text>继续专注</Text>
            </View>
            <View className="btn danger" onClick={doAbandon}>
              <Text>忍痛放弃</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  )
}
