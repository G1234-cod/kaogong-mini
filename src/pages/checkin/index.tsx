// 打卡：打卡项父子交互 / 热力图周月年三档 / 奖励判定与盲盒庆祝 / 心情记录（含情绪安慰彩蛋）/ 奖券袋
// 自 PWA pages/Checkin.tsx 迁移：限高滚动区 → ScrollView（weapp view 不支持 CSS 滚动），
// localStorage → Taro storage，chatGLM → proxy.chatAI（Key 已上云，端侧仅 settings.intel 开关）
import { Fragment, useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { Input, ScrollView, Text, View } from '@tarojs/components'
import { useData } from '../../store'
import type { CheckinItem, Reward } from '../../types'
import { appConfirm } from '../../components/ConfirmDialog'
import { addDays, dateStr, daysBetween, todayStr, uid } from '../../utils/date'
import { genRedeemCode, MOOD_LABELS } from '../../utils/rewards'
import { COMFORT_QUOTES } from '../../constants/copy'
import { chatAI } from '../../services/api/proxy'
import { showToast } from '../../utils/platform'

const MOODS = ['😫', '😞', '😐', '🙂', '😄']

type HeatRange = 'week' | 'month' | 'year'

/** 达成条件上下文（隐藏任务特殊判定） */
interface RewardCtx {
  allStreak: number
  totalFullDays: number
  mood3High: boolean
  weekendFull: boolean
  pomoToday: number
}

function checkAchieve(r: Reward, ctx: RewardCtx): boolean {
  if (r.targetDays > 0) return ctx.allStreak >= r.targetDays
  if (r.hidden) {
    switch (r.id) {
      case 'rw-hidden-weekend':
        return ctx.weekendFull
      case 'rw-hidden-mood':
        return ctx.mood3High
      case 'rw-hidden-pomo':
        return ctx.pomoToday >= 3
      case 'rw-hidden-30':
        return ctx.totalFullDays >= 30
      default:
        return false
    }
  }
  return false
}

/** 某顶层项在某天是否完成：无子项看自身 id，有子项看子项是否全勾 */
function isItemDone(item: CheckinItem, ids: string[]): boolean {
  const kids = item.children
  if (kids?.length) return kids.every((c) => ids.includes(c.id))
  return ids.includes(item.id)
}

/** 某顶层项在某天是否有打卡痕迹（自身或任一子项被勾即算，用于连续天数） */
function hasItemMark(item: CheckinItem, ids: string[]): boolean {
  return ids.includes(item.id) || (item.children ?? []).some((c) => ids.includes(c.id))
}

/** 某天是否全勤：每个顶层项都完成 */
function isDayFull(checkins: Record<string, string[]>, items: CheckinItem[], ds: string): boolean {
  if (items.length === 0) return false
  const ids = checkins[ds] ?? []
  return items.every((it) => isItemDone(it, ids))
}

/** 单项连续天数（适配父子项）：今天没痕迹则从昨天起算 */
function streakForItem(checkins: Record<string, string[]>, item: CheckinItem): number {
  let streak = 0
  const d = new Date()
  if (!hasItemMark(item, checkins[dateStr(d)] ?? [])) d.setDate(d.getDate() - 1)
  while (hasItemMark(item, checkins[dateStr(d)] ?? [])) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

/** 连续全勤天数（适配父子项） */
function fullStreakItems(checkins: Record<string, string[]>, items: CheckinItem[]): number {
  if (items.length === 0) return 0
  let streak = 0
  const d = new Date()
  if (!isDayFull(checkins, items, dateStr(d))) d.setDate(d.getDate() - 1)
  while (isDayFull(checkins, items, dateStr(d))) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

/** 历史最长连续全勤（适配父子项） */
function bestFullStreakItems(checkins: Record<string, string[]>, items: CheckinItem[]): number {
  if (items.length === 0) return 0
  const days = Object.keys(checkins).sort()
  let best = 0
  let cur = 0
  let prev: string | null = null
  for (const day of days) {
    if (!isDayFull(checkins, items, day)) {
      cur = 0
      prev = null
      continue
    }
    cur = prev && daysBetween(prev, day) === 1 ? cur + 1 : 1
    best = Math.max(best, cur)
    prev = day
  }
  return best
}

export default function Checkin() {
  const { data, ready, set } = useData()
  const today = todayStr()
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('📌')
  const [moodNote, setMoodNote] = useState('')
  // 父子项：展开中的项 id 集合（默认全收起）；子项添加框草稿（按父项 id 区分）
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [childDrafts, setChildDrafts] = useState<Record<string, string>>({})

  const todayChecked = data.checkins[today] ?? []
  const itemCount = data.checkinItems.length
  // 今日进度 n/m：每个顶层项完成才算 1（有子项需子项全勾）
  const todayDone = data.checkinItems.filter((it) => isItemDone(it, todayChecked)).length
  const allStreak = fullStreakItems(data.checkins, data.checkinItems)
  const bestStreak = bestFullStreakItems(data.checkins, data.checkinItems)

  const toggleToday = (itemId: string) => {
    const next = todayChecked.includes(itemId)
      ? todayChecked.filter((x) => x !== itemId)
      : [...todayChecked, itemId]
    set('checkins', (prev) => ({ ...prev, [today]: next }))
  }

  /** 勾选顶层项：无子项勾自身；有子项一键全勾 / 全取消所有子项 */
  const toggleItem = (item: CheckinItem) => {
    const kids = item.children ?? []
    if (kids.length === 0) return toggleToday(item.id)
    const allDone = kids.every((c) => todayChecked.includes(c.id))
    const kidIds = kids.map((c) => c.id)
    const next = allDone
      ? todayChecked.filter((id) => !kidIds.includes(id))
      : [...todayChecked, ...kidIds.filter((id) => !todayChecked.includes(id))]
    set('checkins', (prev) => ({ ...prev, [today]: next }))
  }

  /** 展开 / 收起子项区 */
  const toggleExpand = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  /** 展开区添加子项（确认键提交） */
  const addChild = (parent: CheckinItem) => {
    const name = (childDrafts[parent.id] ?? '').trim()
    if (!name) return
    set('checkinItems', (prev) =>
      prev.map((it) =>
        it.id === parent.id
          ? { ...it, children: [...(it.children ?? []), { id: uid(), name }] }
          : it
      )
    )
    setChildDrafts((p) => ({ ...p, [parent.id]: '' }))
  }

  /** 列表排序：未完成在前；已完成的沉底，并按今天勾选先后排列 */
  const sortedItems = useMemo(() => {
    const orderOf = (item: CheckinItem) => {
      let idx = todayChecked.indexOf(item.id)
      for (const c of item.children ?? []) {
        const ci = todayChecked.indexOf(c.id)
        if (ci >= 0 && (idx < 0 || ci < idx)) idx = ci
      }
      return idx
    }
    return data.checkinItems
      .map((it, i) => ({ it, i, done: isItemDone(it, todayChecked), ord: orderOf(it) }))
      .sort((a, b) => Number(a.done) - Number(b.done) || (a.done ? a.ord - b.ord : a.i - b.i))
      .map((x) => x.it)
  }, [data.checkinItems, todayChecked])

  const mood = data.moods[today]
  const hour = new Date().getHours()

  // ---- 达成条件上下文 ----
  const rewardCtx = useMemo<RewardCtx>(() => {
    const full = (ds: string) => isDayFull(data.checkins, data.checkinItems, ds)
    // 累计全勤天数
    const totalFullDays = Object.keys(data.checkins).filter(full).length
    // 连续 3 天心情 ≥4（今天没记则从昨天起算）
    let moodStreak = 0
    for (let i = 0; i < 5; i++) {
      const d = addDays(today, -i)
      const m = data.moods[d]?.mood
      if (m === undefined) {
        if (i === 0) continue
        break
      }
      if (m >= 4) moodStreak++
      else break
    }
    // 最近一个周末双满勤（周末完整过去才判定）
    const now = new Date()
    const sat = new Date(now)
    sat.setDate(now.getDate() - ((now.getDay() + 1) % 7))
    const sun = new Date(sat)
    sun.setDate(sat.getDate() + 1)
    const weekendFull = dateStr(sun) <= today && full(dateStr(sat)) && full(dateStr(sun))
    const pomoToday = data.pomodoroLogs.filter((l) => l.date === today).length
    return { allStreak, totalFullDays, mood3High: moodStreak >= 3, weekendFull, pomoToday }
  }, [data.checkins, data.checkinItems, data.moods, data.pomodoroLogs, allStreak, today])

  // ---- 盲盒庆祝弹窗（达成后开盒领券） ----
  const [boxQueue, setBoxQueue] = useState<Reward[]>([])
  const [boxOpened, setBoxOpened] = useState(false)

  // 达成检测：新达成的任务自动入袋（code 券生成兑换码），弹盲盒庆祝
  useEffect(() => {
    if (!ready) return
    const newly = data.rewards.filter((r) => !r.claimed && checkAchieve(r, rewardCtx))
    if (newly.length === 0) return
    set('rewards', (prev) =>
      prev.map((r) => {
        const hit = newly.find((n) => n.id === r.id)
        if (!hit) return r
        return {
          ...r,
          claimed: true,
          granted: true,
          achievedAt: Date.now(),
          code: r.mode === 'code' ? (r.code ?? genRedeemCode()) : r.code,
        }
      })
    )
    for (const n of newly) {
      if (n.hidden) showToast(`🎉 解锁隐藏任务：${n.title}！`)
    }
    setBoxQueue((prev) => (prev.length > 0 ? prev : newly))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.rewards, rewardCtx, ready])

  const closeBox = () => {
    setBoxQueue((prev) => prev.slice(1))
    setBoxOpened(false)
  }

  // ---- 热力图三档：周（本周一起） / 月（整月是否打卡） / 年（每月打卡天数），均可前后翻 ----
  const [heatRange, setHeatRange] = useState<HeatRange>('week')
  const [weekOffset, setWeekOffset] = useState(0) // 0=本周，负数=往前
  const [monthOffset, setMonthOffset] = useState(0) // 0=本月，负数=往前
  const [yearOffset, setYearOffset] = useState(0) // 0=今年，负数=往年

  // 月视图点击某天 → 弹出当天打卡明细
  const [detailDate, setDetailDate] = useState<string | null>(null)

  /** 周视图 7 天：周一 → 周日 */
  const weekDays = useMemo(() => {
    const now = new Date(today + 'T00:00:00')
    const monday = addDays(today, -((now.getDay() + 6) % 7))
    return Array.from({ length: 7 }, (_, i) => addDays(monday, i + weekOffset * 7))
  }, [today, weekOffset])

  /** 周视图标题：如 09-15 ~ 09-21 */
  const weekTitle = `${weekDays[0].slice(5)} ~ ${weekDays[6].slice(5)}`

  /** 月视图格子：offset 前置空格 + 当月天数 */
  const monthCells = useMemo(() => {
    const base = new Date(today + 'T00:00:00')
    base.setDate(1)
    base.setMonth(base.getMonth() + monthOffset)
    const y = base.getFullYear()
    const m = base.getMonth()
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const offset = (new Date(y, m, 1).getDay() + 6) % 7 // 1 号前空格数（周一起始）
    return { y, m, daysInMonth, offset }
  }, [today, monthOffset])

  /** 年视图：12 个月各自的打卡天数 */
  const yearMonths = useMemo(() => {
    const y = new Date(today + 'T00:00:00').getFullYear() + yearOffset
    const now = new Date(today + 'T00:00:00')
    const counts: { label: string; days: number; level: number }[] = []
    for (let m = 0; m < 12; m++) {
      const dim = new Date(y, m + 1, 0).getDate()
      const last = y === now.getFullYear() && m === now.getMonth() ? now.getDate() : dim
      let days = 0
      for (let d = 1; d <= last; d++) {
        const ds = dateStr(new Date(y, m, d))
        if ((data.checkins[ds] ?? []).length > 0) days++
      }
      const ratio = last > 0 ? days / last : 0
      const level = ratio > 0.75 ? 4 : ratio > 0.5 ? 3 : ratio > 0.25 ? 2 : days > 0 ? 1 : 0
      counts.push({ label: `${m + 1}月`, days, level })
    }
    return counts
  }, [today, data.checkins, yearOffset])

  const heatActive = useMemo(
    () => weekDays.filter((d) => d <= today && (data.checkins[d] ?? []).length > 0).length,
    [weekDays, data.checkins, today]
  )

  /** 年视图当前选中年份 */
  const yearSel = useMemo(
    () => new Date(today + 'T00:00:00').getFullYear() + yearOffset,
    [today, yearOffset]
  )

  const cellLevel = (d: string) => {
    const n = (data.checkins[d] ?? []).length
    return n >= 4 ? 4 : n
  }

  // ---- 心情记录 ----
  const setMood = (val: number) => {
    const prevMood = mood?.mood
    set('moods', (prev) => ({
      ...prev,
      [today]: { mood: val, note: prev[today]?.note },
    }))
    showToast('今天的心情已记下 ✓')
    // 情绪安慰彩蛋：低心情 + 之前不是低心情 + 今天没触发过
    if (
      val <= 2 &&
      (prevMood === undefined || prevMood > 2) &&
      Taro.getStorageSync('last_comfort_date') !== today
    ) {
      openComfort()
    }
  }

  /** 话语提交：显式点按钮才写入 */
  const submitMoodNote = () => {
    if (!moodNote.trim()) return
    set('moods', (prev) => ({
      ...prev,
      [today]: { mood: prev[today]?.mood ?? 3, note: moodNote.trim() },
    }))
    showToast('话语已记下 ✓')
  }

  // 已有 note 同步进输入框（首次加载 / 提交后）
  useEffect(() => {
    setMoodNote(mood?.note ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood?.note])

  // ---- 情绪安慰彩蛋（心情 1/2 档触发，同日仅一次） ----
  const [comfortOpen, setComfortOpen] = useState(false)
  const [comfortText, setComfortText] = useState('')
  const [typed, setTyped] = useState(0)

  const openComfort = () => {
    Taro.setStorageSync('last_comfort_date', today)
    setComfortOpen(true)
    setComfortText('')
    setTyped(0)
    const run = async () => {
      let text: string | null = null
      if (data.settings.intel?.enabled) {
        try {
          text = await chatAI([
            { role: 'user', content: '你朋友备考心情很差，用幽默温暖的朋友口吻安慰她50个字，不要暧昧、不要说教' },
          ])
        } catch {
          text = null
        }
      }
      setComfortText(text ?? COMFORT_QUOTES[Math.floor(Math.random() * COMFORT_QUOTES.length)])
    }
    void run()
  }

  // 打字机效果
  useEffect(() => {
    if (!comfortText) return
    setTyped(0)
    let n = 0
    const t = setInterval(() => {
      n++
      setTyped(n)
      if (n >= comfortText.length) clearInterval(t)
    }, 45)
    return () => clearInterval(t)
  }, [comfortText])

  // ---- 奖券袋 ----
  const bag = data.rewards.filter((r) => r.granted)
  const visibleTasks = data.rewards.filter((r) => !r.hidden && r.targetDays > 0)
  const hiddenLeft = data.rewards.filter((r) => r.hidden && !r.claimed).length

  const useCoupon = (r: Reward) => {
    if (r.used) return
    set('rewards', (prev) => prev.map((x) => (x.id === r.id ? { ...x, used: true } : x)))
    showToast(`「${r.title}」已核销 💝`)
  }

  const curBox = boxQueue[0] ?? null

  const addCheckinItem = () => {
    if (!newName.trim()) return
    set('checkinItems', (prev) => [
      ...prev,
      { id: uid(), name: newName.trim(), emoji: newEmoji || '📌' },
    ])
    setNewName('')
  }

  if (!ready) {
    return (
      <View className="page">
        <View className="card">
          <Text className="sub">加载中…</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="page">
      <View className="page-title">
        <Text>✅ 每日打卡</Text>
      </View>

      {/* 晚间心情提示条：21 点后当天还没记心情 */}
      {hour >= 21 && !mood && <View className="mood-hint">今天过得怎么样？记一笔心情吧 🌙</View>}

      {/* 今日打卡 */}
      <View className="card">
        <View className="card-title">
          <Text>今天（{today.slice(5)}）</Text>
          <Text className="sub">
            {todayDone}/{itemCount}
          </Text>
        </View>
        <ScrollView scrollY className="checkin-scroll">
          {sortedItems.map((item) => {
            const kids = item.children ?? []
            const hasKids = kids.length > 0
            const done = isItemDone(item, todayChecked)
            const doneKids = kids.filter((c) => todayChecked.includes(c.id)).length
            const streak = streakForItem(data.checkins, item)
            const expanded = expandedIds.has(item.id)
            return (
              <Fragment key={item.id}>
                <View className={`list-item ${done ? 'done' : ''}`}>
                  <View className={`ms-check${done ? ' on' : ''}`} onClick={() => toggleItem(item)}>
                    {done ? '✓' : ''}
                  </View>
                  <Text
                    className={`grow name ${hasKids ? 'ci-toggle' : ''}`}
                    onClick={() => hasKids && toggleExpand(item.id)}
                  >
                    {item.emoji} {item.name}
                  </Text>
                  {hasKids && (
                    <Text className="ci-sub-count">
                      {doneKids}/{kids.length}
                    </Text>
                  )}
                  {streak > 0 && <Text className="chip">🔥 {streak} 天</Text>}
                  {hasKids && (
                    <View className="icon-btn ci-arrow" onClick={() => toggleExpand(item.id)}>
                      {expanded ? '▾' : '▸'}
                    </View>
                  )}
                  <View
                    className="icon-btn"
                    onClick={() => {
                      void appConfirm(
                        `删除打卡项「${item.name}」？`,
                        hasKids ? '子项会一起删除，历史记录保留' : '历史记录会保留',
                        {
                          danger: true,
                          confirmText: '删除',
                        }
                      ).then((ok) => {
                        if (ok) set('checkinItems', (prev) => prev.filter((x) => x.id !== item.id))
                      })
                    }}
                  >
                    ✕
                  </View>
                </View>
                {hasKids && expanded && (
                  <View className="child-list">
                    {kids.map((c) => {
                      const cDone = todayChecked.includes(c.id)
                      return (
                        <View
                          className={`child-item ${cDone ? 'done' : ''}`}
                          key={c.id}
                          onClick={() => toggleToday(c.id)}
                        >
                          <Text className={`child-dot ${cDone ? 'on' : ''}`}>
                            {cDone ? '✓' : ''}
                          </Text>
                          <Text className="child-name">
                            {c.emoji} {c.name}
                          </Text>
                        </View>
                      )
                    })}
                    <View className="child-add">
                      <Input
                        placeholder="+ 子项（确认键添加）"
                        value={childDrafts[item.id] ?? ''}
                        onInput={(e) =>
                          setChildDrafts((p) => ({ ...p, [item.id]: e.detail.value }))
                        }
                        onConfirm={() => addChild(item)}
                      />
                    </View>
                  </View>
                )}
              </Fragment>
            )
          })}
          {data.checkinItems.length === 0 && <Text className="empty">还没有打卡项</Text>}
        </ScrollView>
        <View className="form-row" style={{ marginTop: 10 }}>
          <View className="field" style={{ width: 60, marginBottom: 0 }}>
            <Input
              value={newEmoji}
              onInput={(e) => setNewEmoji(e.detail.value)}
              maxlength={2}
            />
          </View>
          <View className="field" style={{ flex: 1, marginBottom: 0 }}>
            <Input
              placeholder="新打卡项（如：练字）"
              value={newName}
              onInput={(e) => setNewName(e.detail.value)}
              onConfirm={addCheckinItem}
            />
          </View>
          <View className="btn small" onClick={addCheckinItem}>
            添加
          </View>
        </View>
      </View>

      {/* 打卡热力图：三档切换 + 前后翻日期 */}
      <View className="card">
        <View className="card-title">
          <Text>📅 打卡热力图</Text>
          <Text className="sub">
            {heatRange === 'week'
              ? `${heatActive} 天有打卡`
              : heatRange === 'month'
                ? `${monthCells.y} 年 ${monthCells.m + 1} 月`
                : `${yearSel} 年`}
          </Text>
        </View>
        <View className="seg-tabs" style={{ marginBottom: 10 }}>
          {([['week', '周'], ['month', '月'], ['year', '年']] as [HeatRange, string][]).map(
            ([k, label]) => (
              <View
                key={k}
                className={`seg-tab ${heatRange === k ? 'active' : ''}`}
                onClick={() => setHeatRange(k)}
              >
                {label}
              </View>
            )
          )}
        </View>

        {/* 日期导航：‹ 标题 ›（不能翻到未来） */}
        <View className="heat-nav">
          <View
            className="heat-nav-btn"
            onClick={() =>
              heatRange === 'week'
                ? setWeekOffset((o) => o - 1)
                : heatRange === 'month'
                  ? setMonthOffset((o) => o - 1)
                  : setYearOffset((o) => o - 1)
            }
          >
            ‹
          </View>
          <Text className="heat-nav-title">
            {heatRange === 'week'
              ? weekTitle
              : heatRange === 'month'
                ? `${monthCells.y} 年 ${monthCells.m + 1} 月`
                : `${yearSel} 年`}
          </Text>
          <View
            className="heat-nav-btn"
            style={{
              opacity:
                (heatRange === 'week'
                  ? weekOffset >= 0
                  : heatRange === 'month'
                    ? monthOffset >= 0
                    : yearOffset >= 0)
                  ? 0.35
                  : 1,
            }}
            onClick={() => {
              const blocked =
                heatRange === 'week'
                  ? weekOffset >= 0
                  : heatRange === 'month'
                    ? monthOffset >= 0
                    : yearOffset >= 0
              if (blocked) return
              heatRange === 'week'
                ? setWeekOffset((o) => o + 1)
                : heatRange === 'month'
                  ? setMonthOffset((o) => o + 1)
                  : setYearOffset((o) => o + 1)
            }}
          >
            ›
          </View>
        </View>

        {/* 周：本周（或任一周）周一→周日，记录每天打卡次数 */}
        {heatRange === 'week' && (
          <View className="heat-week">
            {weekDays.map((d) => {
              const n = (data.checkins[d] ?? []).length
              const level = d > today ? -1 : cellLevel(d)
              return (
                <View className="heat-w-row" key={d}>
                  <Text className="w-day">
                    {['日', '一', '二', '三', '四', '五', '六'][new Date(d + 'T00:00:00').getDay()]}{' '}
                    {d.slice(5)}
                  </Text>
                  <View className="w-bar">
                    {level >= 0 ? (
                      <View
                        className={`w-fill hm-l${level}`}
                        style={{ width: `${(n / Math.max(1, itemCount)) * 100}%` }}
                      />
                    ) : null}
                  </View>
                  <Text className="w-n">{d > today ? '·' : n}</Text>
                </View>
              )
            })}
          </View>
        )}

        {/* 月：日历排版，打卡日盖圆形印章，点击可看当天明细 */}
        {heatRange === 'month' && (
          <>
            <View className="heatmap-weekdays month-grid-weekdays">
              <Text>一</Text>
              <Text>二</Text>
              <Text>三</Text>
              <Text>四</Text>
              <Text>五</Text>
              <Text>六</Text>
              <Text>日</Text>
            </View>
            <View className="heatmap month-full">
              {Array.from({ length: monthCells.offset + monthCells.daysInMonth }, (_, i) => {
                const day = i - monthCells.offset + 1
                if (day < 1) return <View key={i} className="hm-cell blank" />
                const ds = dateStr(new Date(monthCells.y, monthCells.m, day))
                const n = (data.checkins[ds] ?? []).length
                const future = ds > today
                return (
                  <View
                    key={i}
                    className={`hm-cell ${future ? 'future' : n > 0 ? 'hit' : ''} ${ds === today ? 'today' : ''}`}
                    onClick={() => {
                      if (!future) setDetailDate(ds)
                    }}
                  >
                    {n > 0 && !future ? (
                      <Text className={`day-stamp s${Math.min(4, n)}`}>{day}</Text>
                    ) : (
                      <Text>{day}</Text>
                    )}
                  </View>
                )
              })}
            </View>
          </>
        )}

        {/* 年：12 个月各打卡天数 */}
        {heatRange === 'year' && (
          <View className="heat-year">
            {yearMonths.map((m) => (
              <View key={m.label} className="heat-y-cell">
                <View className={`y-block hm-l${m.level}`}>{m.days}</View>
                <Text className="y-label">{m.label}</Text>
              </View>
            ))}
          </View>
        )}

        <View className="row-between" style={{ marginTop: 10 }}>
          <Text className="sub">连续全勤 {allStreak} 天 · 最佳 {bestStreak} 天</Text>
          {heatRange === 'week' && (
            <View className="row hm-legend">
              <Text className="sub">少</Text>
              {[0, 1, 2, 3, 4].map((l) => (
                <View key={l} className={`hm-cell hm-l${l}`} />
              ))}
              <Text className="sub">多</Text>
            </View>
          )}
          {heatRange === 'year' && (
            <Text className="sub legend-month">数字 = 当月打卡天数</Text>
          )}
        </View>
      </View>

      {/* 心情记录 */}
      <View className="card">
        <View className="card-title">
          <Text>😊 今日心情</Text>
        </View>
        <View className="mood-picker">
          {MOODS.map((emoji, i) => (
            <View
              key={emoji}
              className={`mood-btn${mood?.mood === i + 1 ? ' selected' : ''}`}
              onClick={() => setMood(i + 1)}
            >
              <Text className="mood-emoji">{emoji}</Text>
              <Text className="mood-label">{MOOD_LABELS[i]}</Text>
            </View>
          ))}
        </View>
        <View className="form-row" style={{ marginTop: 10 }}>
          <View className="field" style={{ flex: 1, marginBottom: 0 }}>
            <Input
              placeholder="一句话记录今天（可选）"
              value={moodNote}
              onInput={(e) => setMoodNote(e.detail.value)}
              onConfirm={submitMoodNote}
            />
          </View>
          <View className="btn small" onClick={submitMoodNote}>
            记下
          </View>
        </View>
        <View className="divider" />
        <View className="mood-history">
          {Array.from({ length: 14 }, (_, i) => addDays(today, i - 13)).map((d) => {
            const m = data.moods[d]
            return (
              <View className="day" key={d}>
                <Text className="emoji">{m ? MOODS[m.mood - 1] : '·'}</Text>
                <Text>{d.slice(5)}</Text>
              </View>
            )
          })}
        </View>
        <View
          className="btn ghost small"
          style={{ marginTop: 10, width: '100%' }}
          onClick={() => Taro.navigateTo({ url: '/pages/mood-history/index' })}
        >
          查看心情记录 ›
        </View>
      </View>

      {/* 奖励机制：奖池由看板端（朋友）定义，这里只读展示进度 */}
      <View className="card">
        <View className="card-title">
          <Text>🎁 奖励机制</Text>
          <Text className="sub">连续全勤 {allStreak} 天 · 最佳 {bestStreak} 天</Text>
        </View>
        {visibleTasks.length > 0 && (
          <ScrollView scrollY className="reward-scroll">
            {visibleTasks.map((r) => {
              const reached = r.claimed || allStreak >= r.targetDays
              const pct = Math.min(100, Math.round((allStreak / r.targetDays) * 100))
              return (
                <View className="list-item reward-item" key={r.id}>
                  <Text className="r-emoji">{r.emoji}</Text>
                  <View className="grow">
                    <View className="row-between">
                      <Text className="name">{r.title}</Text>
                      {reached ? (
                        <Text className="chip success">已达成</Text>
                      ) : (
                        <Text className="sub">还差 {r.targetDays - allStreak} 天</Text>
                      )}
                    </View>
                    {!reached && (
                      <View className="progress" style={{ margin: '4px 0 2px' }}>
                        <View className="progress-fill" style={{ width: `${pct}%` }} />
                      </View>
                    )}
                    <Text className="sub" style={{ fontSize: 11 }}>
                      连续 {r.targetDays} 天解锁{r.mode === 'code' ? ' · 贵重券' : ''}
                    </Text>
                  </View>
                </View>
              )
            })}
          </ScrollView>
        )}
        {hiddenLeft > 0 && (
          <View className="hidden-teaser">
            <Text className="teaser-emoji">🎁</Text>
            <Text>悄悄说：还有 {hiddenLeft} 个隐藏任务，达成条件才揭晓</Text>
          </View>
        )}
        {visibleTasks.length === 0 && hiddenLeft === 0 && (
          <Text className="empty">奖励由好友在看板端设置后自动出现在这里</Text>
        )}
      </View>

      {/* 奖券袋 */}
      <View className="card">
        <View className="card-title">
          <Text>🎟 奖券袋</Text>
          <Text className="sub">{bag.length} 张</Text>
        </View>
        {bag.length === 0 && <Text className="empty">还没有券，达成奖励后自动入袋</Text>}
        {bag.map((c) => (
          <View
            key={c.id}
            className={`coupon-card ${c.used ? 'coupon-used' : ''}`}
            onClick={() => useCoupon(c)}
          >
            <Text className="c-emoji">{c.emoji}</Text>
            <View className="grow">
              <Text className="c-title">{c.title}</Text>
              {c.desc ? <Text className="sub">{c.desc}</Text> : null}
              {c.mode === 'code' && c.code && !c.used && (
                <Text className="coupon-code">兑换码 {c.code}</Text>
              )}
            </View>
            <Text className={`chip ${c.used ? '' : c.mode === 'code' ? 'warn' : 'success'}`}>
              {c.used ? '已使用' : c.mode === 'code' ? '待兑换' : '可用'}
            </Text>
          </View>
        ))}
        {bag.length > 0 && (
          <Text className="sub" style={{ fontSize: 11, marginTop: 6 }}>
            点击券可标记核销（找好友兑现 😉）
          </Text>
        )}
      </View>

      {/* 月视图 · 某天打卡明细 */}
      {detailDate && (
        <View className="modal-mask" catchMove onClick={() => setDetailDate(null)}>
          <View className="modal" onClick={(e) => e.stopPropagation()}>
            <View className="card-title" style={{ marginBottom: 10 }}>
              <Text>
                📅 {Number(detailDate.slice(5, 7))} 月 {Number(detailDate.slice(8))} 日
              </Text>
              <Text className="sub">
                打卡 {(data.checkins[detailDate] ?? []).length}/{itemCount}
              </Text>
            </View>
            {data.checkinItems.map((item) => {
              const ok = (data.checkins[detailDate] ?? []).includes(item.id)
              return (
                <View className={`list-item ${ok ? 'done' : ''}`} key={item.id}>
                  <Text className="grow name">
                    {ok ? '✅' : '⬜'} {item.emoji} {item.name}
                  </Text>
                </View>
              )
            })}
            {data.checkinItems.length === 0 && <Text className="empty">还没有打卡项</Text>}
            <View
              className="btn ghost small"
              style={{ marginTop: 10, width: '100%' }}
              onClick={() => setDetailDate(null)}
            >
              关闭
            </View>
          </View>
        </View>
      )}

      {/* 盲盒庆祝弹窗：达成后开盒领券 */}
      {curBox && (
        <View className="box-overlay" catchMove>
          <View className="box-gift-wrap">
            <View className={`box-gift ${boxOpened ? 'box-open' : ''}`}>
              <View className="box-lid" />
              <View className="box-body" />
              {boxOpened && (
                <>
                  <Text className="box-spark s1">✨</Text>
                  <Text className="box-spark s2">✨</Text>
                  <Text className="box-spark s3">✨</Text>
                  <Text className="box-spark s4">⭐</Text>
                  <Text className="box-spark s5">⭐</Text>
                  <Text className="box-spark s6">🌟</Text>
                </>
              )}
            </View>
            {boxOpened && (
              <View className="box-coupon">
                <Text className="bc-emoji">{curBox.emoji}</Text>
                <Text className="bc-title">{curBox.title}</Text>
                {curBox.desc ? <Text className="bc-desc">{curBox.desc}</Text> : null}
                {curBox.mode === 'code' && curBox.code && (
                  <Text className="coupon-code">兑换码 {curBox.code}</Text>
                )}
              </View>
            )}
          </View>
          {!boxOpened ? (
            <View className="btn box-btn" onClick={() => setBoxOpened(true)}>
              开盒
            </View>
          ) : (
            <View className="btn box-accept" onClick={closeBox}>
              {boxQueue.length > 1 ? `开心收下 🎉（还有 ${boxQueue.length - 1} 个）` : '开心收下 🎉'}
            </View>
          )}
        </View>
      )}

      {/* 情绪安慰彩蛋 */}
      {comfortOpen && (
        <View className="comfort-overlay" catchMove>
          <View className="comfort-box">
            <Text className="comfort-emoji">🫂</Text>
            <Text className="comfort-text">
              {comfortText ? comfortText.slice(0, typed) : '正在组织语言安慰你…'}
            </Text>
            {comfortText && typed < comfortText.length && <Text className="type-caret" />}
            {comfortText && typed >= comfortText.length ? (
              <View className="btn" onClick={() => setComfortOpen(false)}>
                有被安慰到 🤗
              </View>
            ) : (
              <View style={{ height: 40 }} />
            )}
          </View>
        </View>
      )}
    </View>
  )
}
