// 打卡：全部打卡统一任务行（色板分行 + 胶囊元信息 + 箭头展开子任务 + 点行编辑 + 左滑删除 + 完成撤销）
// / 热力图周月年三档 / 奖励判定与盲盒庆祝 / 心情记录（含情绪安慰彩蛋）/ 奖券袋
// 列表与今日页同口径排序（sortCheckinItemsForDisplay）：今天未完成 → 未来 → 今天已完成沉底
// 自 PWA pages/Checkin.tsx 迁移：限高滚动区 → ScrollView（weapp view 不支持 CSS 滚动），
// localStorage → Taro storage，chatGLM → proxy.chatAI（Key 已上云，端侧仅 settings.intel 开关）
import { useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { Image, Input, ScrollView, Text, View } from '@tarojs/components'
import { useData } from '../../store'
import type { CheckinItem, Reward } from '../../types'
import { appConfirm } from '../../components/ConfirmDialog'
import CheckinItemForm from '../../components/CheckinItemForm'
import ChildRow from '../../components/ChildRow'
import FocusScroll from '../../components/FocusScroll'
import Icon from '../../components/Icon'
import Modal from '../../components/Modal'
import TaskRow from '../../components/TaskRow'
import UndoTip, { type UndoTipData } from '../../components/UndoTip'
import {
  autoEmoji,
  dueLabel,
  flattenLeaves,
  flattenNodes,
  freqText,
  isDueToday,
  isItemDone,
  leafIds,
  leafProgress,
  nextCheckinDate,
  removeChildNode,
  renameChildNode,
  sortCheckinItemsForDisplay,
  toggleItemIds,
  toggleLeafId,
  WEEKDAY_LABELS,
} from '../../utils/checkin'
import { addDays, dateStr, daysBetween, todayStr, uid } from '../../utils/date'
import { useListCapHeight } from '../../utils/listCap'
import { useTabSwipe } from '../../utils/tabSwipe'
import { genRedeemCode, MOOD_LABELS } from '../../utils/rewards'
import { COMFORT_QUOTES_LOW, COMFORT_QUOTES_SAD, COMFORT_THOUGHT_REPLIES } from '../../constants/copy'
import { chatAI } from '../../services/api/proxy'
import { showToast } from '../../utils/platform'
import animalEmpty from '../../assets/images/小兔.png'
import animalShout from '../../assets/images/噜噜呐喊.png'

const MOODS = ['😫', '😞', '😐', '🙂', '😄']

type HeatRange = 'week' | 'month' | 'year'

/** 达成条件上下文（按任务 condType 判定） */
interface RewardCtx {
  allStreak: number
  totalFullDays: number
  moodStreak: number
  weekendFull: boolean
  pomoToday: number
}

function checkAchieve(r: Reward, ctx: RewardCtx): boolean {
  const n = r.condParam ?? 0
  switch (r.condType) {
    case 'streak':
      return n > 0 && ctx.allStreak >= n
    case 'total_full':
      return n > 0 && ctx.totalFullDays >= n
    case 'weekend_full':
      return ctx.weekendFull
    case 'mood3':
      return ctx.moodStreak >= (n || 3)
    case 'pomo_day':
      return ctx.pomoToday >= (n || 3)
    default:
      return false
  }
}

/** 任务条件进度（奖励卡进度条）；weekend_full 无量化进度返回 null */
function condProgress(r: Reward, ctx: RewardCtx): { cur: number; target: number; unit: string } | null {
  const n = r.condParam ?? 0
  switch (r.condType) {
    case 'streak':
      return { cur: ctx.allStreak, target: n, unit: '天' }
    case 'total_full':
      return { cur: ctx.totalFullDays, target: n, unit: '天' }
    case 'mood3':
      return { cur: ctx.moodStreak, target: n || 3, unit: '天' }
    case 'pomo_day':
      return { cur: ctx.pomoToday, target: n || 3, unit: '个' }
    default:
      return null
  }
}

/** 解锁条件中文文案 */
function condText(r: Reward): string {
  const n = r.condParam ?? 0
  switch (r.condType) {
    case 'streak':
      return `连续 ${n} 天全勤解锁`
    case 'total_full':
      return `累计 ${n} 天全勤解锁`
    case 'mood3':
      return `连续 ${n || 3} 天好心情解锁`
    case 'pomo_day':
      return `单日专注 ${n || 3} 个番茄解锁`
    case 'weekend_full':
      return '周末双满勤解锁'
    default:
      return '达成条件解锁'
  }
}

/** 某项在某天是否有打卡痕迹（任一叶子被勾即算，用于连续天数） */
function hasItemMark(item: CheckinItem, ids: string[]): boolean {
  return leafIds(item).some((id) => ids.includes(id))
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
  const tabSwipe = useTabSwipe(2)
  const today = todayStr()
  // 新增打卡项弹层：表单走 CheckinItemForm 受控草稿（不含分类/优先级/手选 emoji，频率默认每天）；子项暂存（随创建一次性写入）
  const [addOpen, setAddOpen] = useState(false)
  const [draft, setDraft] = useState<CheckinItem>({ id: '', name: '', emoji: '', freq: 'daily' })
  const [newChildren, setNewChildren] = useState<string[]>([])
  const [newChildText, setNewChildText] = useState('')
  const [moodNote, setMoodNote] = useState('')

  // 展开的任务行 id（点箭头原地展开/收起，一次只展开一行）
  const [expandedId, setExpandedId] = useState<string | null>(null)
  // 完成撤销提示（勾选圈完成一项后 3 秒内可撤销，自动消失）
  const [undoTip, setUndoTip] = useState<UndoTipData | null>(null)
  // 编辑详情弹窗：editId 指向库里的项（子项增删实时反映）；editDraft 只管表单字段（名称/频率/说明）
  const [editId, setEditId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<CheckinItem | null>(null)
  const [editChildText, setEditChildText] = useState('')

  const todayChecked = data.checkins[today] ?? []
  const itemCount = data.checkinItems.length
  const editItem = data.checkinItems.find((it) => it.id === editId) ?? null
  // 顶部副标题 n/m：今天该打 = 现在仍欠卡 或 今天已完成（已完成项不掉出分母，n/m 才能打满）
  const dueItems = data.checkinItems.filter(
    (it) => isDueToday(it, data.checkins, today) || isItemDone(it, todayChecked)
  )
  const dueDone = dueItems.filter((it) => isItemDone(it, todayChecked)).length
  // 顶部副标题日期：如「9月30日 周三」
  const dateLabel = `${Number(today.slice(5, 7))}月${Number(today.slice(8))}日 周${
    WEEKDAY_LABELS[new Date(today + 'T00:00:00').getDay()]
  }`
  const allStreak = fullStreakItems(data.checkins, data.checkinItems)
  const bestStreak = bestFullStreakItems(data.checkins, data.checkinItems)

  // 列表：与今日页同口径排序（今天未完成 → 未来 → 今天已完成沉底）
  const sortedItems = useMemo(
    () => sortCheckinItemsForDisplay(data.checkinItems, data.checkins, today),
    [data.checkinItems, data.checkins, today]
  )
  // 限高：超过 5 条时量前 5 条主行高定容器高度，卡内滑动（展开子任务不撑高卡片）
  const listH = useListCapHeight('.ck-task-list', '.ck-task-list .task-row-main', sortedItems.length, 5)

  /** 单叶子勾选切换（展开区精细勾选） */
  const toggleLeaf = (leafId: string) =>
    set('checkins', (prev) => ({ ...prev, [today]: toggleLeafId(prev[today] ?? [], leafId) }))

  /** 勾选整项：一键补全/取消全部叶子（勾选只记叶子 id，写库后排序自动沉底）；完成时弹 3 秒撤销提示 */
  const toggleItem = (item: CheckinItem) => {
    const wasDone = isItemDone(item, data.checkins[today] ?? [])
    set('checkins', (prev) => ({ ...prev, [today]: toggleItemIds(item, prev[today] ?? []) }))
    if (!wasDone) {
      setUndoTip({
        id: Date.now(),
        label: `已完成「${item.name}」`,
        undo: () =>
          set('checkins', (prev) => ({ ...prev, [today]: toggleItemIds(item, prev[today] ?? []) })),
      })
    }
  }

  /** 详情弹窗内添加子项（立即写库） */
  const addChild = (parent: CheckinItem, name: string) => {
    set('checkinItems', (prev) =>
      prev.map((it) =>
        it.id === parent.id
          ? { ...it, children: [...(it.children ?? []), { id: uid(), name }] }
          : it
      )
    )
    showToast('子项已添加 ✓')
  }

  /** 详情弹窗内删除子项（立即写库，递归支持删任意层） */
  const removeChild = (parent: CheckinItem, childId: string) => {
    set('checkinItems', (prev) =>
      prev.map((it) =>
        it.id === parent.id ? { ...it, children: removeChildNode(it.children ?? [], childId) } : it
      )
    )
  }

  /** 子项原地改名（立即写库，递归支持任意层；铅笔 → 本行输入框 → ✓ 保存） */
  const renameChild = (parent: CheckinItem, childId: string, name: string) => {
    set('checkinItems', (prev) =>
      prev.map((it) =>
        it.id === parent.id ? { ...it, children: renameChildNode(it.children ?? [], childId, name) } : it
      )
    )
  }

  /** 编辑弹窗「保存」父项字段（子项以库里为准，不被草稿快照覆盖） */
  const updateItem = (item: CheckinItem) => {
    set('checkinItems', (prev) => prev.map((it) => (it.id === item.id ? { ...it, ...item, children: it.children } : it)))
    showToast('已保存 ✓')
  }

  /** 删除整项：连同所有日期里该项的打卡记录（叶子 id）一并清除 */
  const deleteItem = (item: CheckinItem) => {
    const ids = leafIds(item)
    set('checkinItems', (prev) => prev.filter((x) => x.id !== item.id))
    set('checkins', (prev) => {
      const next: Record<string, string[]> = {}
      for (const [d, arr] of Object.entries(prev)) next[d] = arr.filter((id) => !ids.includes(id))
      return next
    })
  }

  /** 打开编辑详情弹窗（点行主体）：草稿从当前项拷贝一份 */
  const openEdit = (item: CheckinItem) => {
    setEditId(item.id)
    setEditDraft({ ...item })
    setEditChildText('')
  }

  /** 关闭编辑详情弹窗（✕ / 遮罩 / 保存后） */
  const closeEdit = () => {
    setEditId(null)
    setEditDraft(null)
    setEditChildText('')
  }

  /** 编辑弹窗「保存」：校验后合并写库并关闭 */
  const saveEdit = () => {
    if (!editDraft) return
    if (!editDraft.name.trim()) {
      showToast('请输入打卡项目名称')
      return
    }
    if (editDraft.freq === 'weekly' && (editDraft.freqDays ?? []).length === 0) {
      showToast('请至少选择一个打卡日')
      return
    }
    if (editDraft.freq === 'monthlyDays' && (editDraft.freqDays ?? []).length === 0) {
      showToast('请至少选择一个日期')
      return
    }
    updateItem(editDraft)
    closeEdit()
  }

  /** 编辑弹窗子项「添加」：立即写库并清空输入 */
  const addEditChild = () => {
    if (!editItem) return
    const v = editChildText.trim()
    if (!v) {
      showToast('请输入子项名称')
      return
    }
    addChild(editItem, v)
    setEditChildText('')
  }

  /** 删除整项（二次确认，行左滑 / 编辑弹窗共用）：删项 + 清打卡记录 + 收起相关状态 */
  const confirmDelete = (item: CheckinItem) => {
    void appConfirm(`删除「${item.name}」？`, '该项及其全部打卡记录将一起删除', {
      confirmText: '删除',
    }).then((ok) => {
      if (!ok) return
      deleteItem(item)
      if (expandedId === item.id) setExpandedId(null)
      if (editId === item.id) closeEdit()
    })
  }

  const mood = data.moods[today]
  const hour = new Date().getHours()

  // ---- 达成条件上下文 ----
  const rewardCtx = useMemo<RewardCtx>(() => {
    const full = (ds: string) => isDayFull(data.checkins, data.checkinItems, ds)
    // 累计全勤天数
    const totalFullDays = Object.keys(data.checkins).filter(full).length
    // 连续心情 ≥4 的天数（今天没记则从昨天起算；上限 60 天，支持 B 端自定义目标）
    let moodStreak = 0
    for (let i = 0; i < 60; i++) {
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
    return { allStreak, totalFullDays, moodStreak, weekendFull, pomoToday }
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
      openComfort(val)
    }
  }

  /** 话语提交：显式点按钮才写入 */
  const submitMoodNote = () => {
    if (!moodNote.trim()) {
      showToast('请输入话语内容')
      return
    }
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

  // ---- 情绪安慰彩蛋（心情 1/2 档触发，同日仅一次）：分级文案 → 轻互动写想法 → AI 回应 → 收尾定格 ----
  const [comfortOpen, setComfortOpen] = useState(false)
  // typing=主文案打字中 → ready=可写想法/收下 → replying=AI 回应打字中 → final=收尾定格
  const [comfortPhase, setComfortPhase] = useState<'typing' | 'ready' | 'replying' | 'final'>('typing')
  const [comfortText, setComfortText] = useState('')
  const [typed, setTyped] = useState(0)
  const [thoughtDraft, setThoughtDraft] = useState('')
  const [replyText, setReplyText] = useState('')
  const [replyTyped, setReplyTyped] = useState(0)

  const openComfort = (moodVal: number) => {
    Taro.setStorageSync('last_comfort_date', today)
    setComfortOpen(true)
    setComfortPhase('typing')
    setComfortText('')
    setTyped(0)
    setThoughtDraft('')
    setReplyText('')
    setReplyTyped(0)
    const run = async () => {
      let text: string | null = null
      if (data.settings.intel?.enabled) {
        try {
          text = await chatAI([
            {
              role: 'user',
              content:
                moodVal <= 1
                  ? '你朋友备考期间很难过，像好哥们/好闺蜜那样先接住情绪、陪TA缓一缓，50个字以内。不要暧昧（禁止抱抱、摸头、亲爱的这类亲密称呼和表达）、不要说教、不要急着讲道理'
                  : '你朋友备考心情有点低落，用幽默温暖的朋友口吻安慰TA，50个字以内。不要暧昧（禁止亲密称呼和表达）、不要说教',
            },
          ])
        } catch {
          text = null
        }
      }
      const pool = moodVal <= 1 ? COMFORT_QUOTES_SAD : COMFORT_QUOTES_LOW
      setComfortText(text ?? pool[Math.floor(Math.random() * pool.length)])
    }
    void run()
  }

  // 打字机效果（主文案）
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

  // 主文案打完 → 进入轻互动阶段
  useEffect(() => {
    if (comfortPhase === 'typing' && comfortText && typed >= comfortText.length) {
      setComfortPhase('ready')
    }
  }, [comfortPhase, comfortText, typed])

  /** 轻互动：把此刻的想法发给 AI，收一句温暖回应（离线兜底语录池） */
  const sendThought = () => {
    const thought = thoughtDraft.trim()
    if (!thought) {
      showToast('写一句再发送哦')
      return
    }
    setComfortPhase('replying')
    setReplyText('')
    setReplyTyped(0)
    const run = async () => {
      let text: string | null = null
      if (data.settings.intel?.enabled) {
        try {
          text = await chatAI([
            {
              role: 'user',
              content: `朋友刚写下此刻的想法：「${thought}」。像好哥们/好闺蜜那样回应TA40字左右，先接住情绪再轻轻鼓励。不要暧昧（禁止亲密称呼和表达）、不要说教`,
            },
          ])
        } catch {
          text = null
        }
      }
      setReplyText(text ?? COMFORT_THOUGHT_REPLIES[Math.floor(Math.random() * COMFORT_THOUGHT_REPLIES.length)])
    }
    void run()
  }

  // 打字机效果（AI 回应）
  useEffect(() => {
    if (!replyText) return
    setReplyTyped(0)
    let n = 0
    const t = setInterval(() => {
      n++
      setReplyTyped(n)
      if (n >= replyText.length) clearInterval(t)
    }, 45)
    return () => clearInterval(t)
  }, [replyText])

  // 回应打完 → 收尾定格
  useEffect(() => {
    if (comfortPhase === 'replying' && replyText && replyTyped >= replyText.length) {
      setComfortPhase('final')
    }
  }, [comfortPhase, replyText, replyTyped])

  // ---- 奖券袋 ----
  const bag = data.rewards.filter((r) => r.granted)
  // 任务列表只留「还能获取奖励」的：已达成/已入袋的不再显示
  const allTasks = data.rewards.filter((r) => !r.hidden && r.condType)
  const visibleTasks = allTasks.filter((r) => !r.claimed && !checkAchieve(r, rewardCtx))
  const hiddenLeft = data.rewards.filter((r) => r.hidden && !r.claimed).length

  // ---- 列表限高：奖励/奖券一次展示 4 条，其余上下滑动（按前 4 条实测高度定容器高） ----
  const [rewardListH, setRewardListH] = useState<number | undefined>()
  const [couponListH, setCouponListH] = useState<number | undefined>()

  useEffect(() => {
    const cap4 = (sel: string, count: number, gap: number, setH: (n?: number) => void) => {
      if (count <= 4) return setH(undefined)
      Taro.createSelectorQuery()
        .selectAll(sel)
        .fields({ size: true })
        .exec((res) => {
          const rects = (res?.[0] || []) as { height: number }[]
          const top = rects.slice(0, 4)
          if (top.length < 4) return
          setH(Math.ceil(top.reduce((s, r) => s + r.height, 0) + gap * 3))
        })
    }
    cap4('.reward-scroll .reward-item', visibleTasks.length, 0, setRewardListH)
    cap4('.coupon-scroll .coupon-card', bag.length, 8, setCouponListH)
  }, [visibleTasks.length, bag.length, ready])

  const useCoupon = (r: Reward) => {
    if (r.used) return
    void appConfirm(`核销「${r.title}」？`, '确认后不可恢复', { confirmText: '核销' }).then((ok) => {
      if (!ok) return
      set('rewards', (prev) => prev.map((x) => (x.id === r.id ? { ...x, used: true } : x)))
      showToast(`「${r.title}」已核销 💝`)
    })
  }

  const curBox = boxQueue[0] ?? null
  // 热力图翻页：不能翻到未来（本周/本月/本年为上限）
  const forwardBlocked =
    heatRange === 'week' ? weekOffset >= 0 : heatRange === 'month' ? monthOffset >= 0 : yearOffset >= 0

  // 新增打卡项：频率/分类/优先级/图标等表单逻辑已抽入 CheckinItemForm，这里只做校验与写库
  /** 重置新增弹窗草稿（图标留空，展示时按名称 autoEmoji 兜底） */
  const resetAddDraft = () => {
    setDraft({ id: '', name: '', emoji: '', freq: 'daily' })
    setNewChildren([])
    setNewChildText('')
  }

  /** ✕ / 关闭新增弹窗：放弃草稿 */
  const closeAdd = () => {
    resetAddDraft()
    setAddOpen(false)
  }

  /** 子项暂存区「添加」：先存草稿列表，随创建一次性写入 */
  const addStagedChild = () => {
    const v = newChildText.trim()
    if (!v) {
      showToast('请输入子项名称')
      return
    }
    setNewChildren((prev) => [...prev, v])
    setNewChildText('')
  }

  const addCheckinItem = () => {
    if (!draft.name.trim()) {
      showToast('请输入打卡项目名称')
      return
    }
    if (draft.freq === 'weekly' && (draft.freqDays ?? []).length === 0) {
      showToast('请至少选择一个打卡日')
      return
    }
    if (draft.freq === 'monthlyDays' && (draft.freqDays ?? []).length === 0) {
      showToast('请至少选择一个日期')
      return
    }
    const item: CheckinItem = {
      ...draft,
      id: uid(),
      name: draft.name.trim(),
      note: draft.note?.trim() || undefined,
      children: newChildren.map((n) => ({ id: uid(), name: n })),
    }
    set('checkinItems', (prev) => [...prev, item])
    resetAddDraft()
    setAddOpen(false)
    showToast('打卡项已添加 ✓')
  }

  /** 渲染一条任务行：色板 tone 按索引循环 0-4 + 胶囊元信息 + 箭头展开子任务（叶子可勾）+ 左滑删除 */
  const renderRow = (item: CheckinItem, idx: number) => {
    const done = isItemDone(item, todayChecked)
    const hasChildren = (item.children ?? []).length > 0
    const prog = leafProgress(item, todayChecked)
    const streak = streakForItem(data.checkins, item)
    const freq = freqText(item)
    const next = nextCheckinDate(item, data.checkins, today)
    return (
      <TaskRow
        key={item.id}
        tone={idx % 5}
        done={done}
        icon={item.emoji || autoEmoji(item.name)}
        name={item.name}
        expandable={hasChildren}
        expanded={expandedId === item.id}
        onToggleCheck={() => toggleItem(item)}
        onRowClick={() => openEdit(item)}
        onArrowClick={() => setExpandedId((cur) => (cur === item.id ? null : item.id))}
        onDelete={() => confirmDelete(item)}
        meta={
          <>
            {/* 子项比例（有子项才显示） */}
            {hasChildren && (
              <Text className="tpill prog">
                {prog.done}/{prog.total}
              </Text>
            )}
            {/* 连续打卡天数 */}
            {streak > 0 && <Text className="tpill streak">🔥{streak}天</Text>}
            {/* 频率文案（每天为默认不显示） */}
            {freq && <Text className="tpill freq">{freq}</Text>}
            {/* 下次打卡（今天实底高亮） */}
            <Text className={`tpill next${next === today ? ' today' : ''}`}>{dueLabel(next, today)}</Text>
          </>
        }
      >
        {/* 展开区：叶子子任务逐条可勾（勾选写今天的 checkins），更深层叶子缩进；
            嵌套子项可铅笔原地改名 / 删除（左滑），叶子即项本身时不给编辑入口 */}
        {flattenLeaves(item).map((leaf) => {
          const nested = leaf.id !== item.id
          return (
            <ChildRow
              key={leaf.id}
              name={leaf.name}
              emoji={leaf.emoji}
              done={todayChecked.includes(leaf.id)}
              depth={leaf.depth}
              onToggle={() => toggleLeaf(leaf.id)}
              onRename={nested ? (n) => renameChild(item, leaf.id, n) : undefined}
              onDelete={nested ? () => removeChild(item, leaf.id) : undefined}
            />
          )
        })}
      </TaskRow>
    )
  }

  if (!ready) {
    return (
      <View className="page">
        <View className="skeleton sk-card" />
        <View className="skeleton sk-card" />
        <View className="skeleton sk-card" />
        <View className="skeleton sk-card" />
      </View>
    )
  }

  return (
    <View className="page tab-page" {...tabSwipe}>
      <View className="page-title">
        <Icon name="check-square" size={16} gap={4} />
        <Text>打卡</Text>
      </View>

      {/* 晚间心情提示条：21 点后当天还没记心情 */}
      {hour >= 21 && !mood && <View className="mood-hint">今天过得怎么样？记一笔心情吧 🌙</View>}

      {/* 全部打卡：统一任务行列表（与今日页同口径排序：今天未完成 → 未来 → 今天已完成沉底） */}
      <View className="card">
        <View className="tb-head">
          <Text className="tb-title">全部打卡</Text>
          <Text className="tb-count">
            {dateLabel} · 已完成 {dueDone}/{dueItems.length}
          </Text>
        </View>
        {sortedItems.length === 0 && (
          <View className="tb-empty">
            <Image className="tb-empty-img" src={animalShout} mode="aspectFit" />
            <Text className="tb-empty-text">还没有打卡项，加一个开始吧</Text>
          </View>
        )}
        {sortedItems.length > 5 ? (
          // 超过 5 条：按前 5 条主行高定容器高度，卡内滑动（展开子任务不撑高卡片）
          <ScrollView
            scroll-y
            className="task-list ck-task-list"
            style={listH ? { height: listH } : undefined}
          >
            {sortedItems.map(renderRow)}
          </ScrollView>
        ) : (
          sortedItems.length > 0 && (
            <View className="task-list ck-task-list">{sortedItems.map(renderRow)}</View>
          )
        )}
        {/* 新增打卡项：弹层表单（名称 / 频率六模式 / 说明 + 子项暂存） */}
        <View
          className="btn ghost small"
          style={{ marginTop: 10, width: '100%' }}
          onClick={() => setAddOpen(true)}
        >
          ＋ 新增打卡项
        </View>
      </View>

      {/* 打卡热力图：三档切换 + 前后翻日期 */}
      <View className="card">
        <View className="card-title">
          <>
            <Icon name="calendar" size={16} gap={4} />
            <Text>打卡热力图</Text>
          </>
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
            className={`heat-nav-btn${forwardBlocked ? ' is-disabled' : ''}`}
            onClick={() => {
              if (forwardBlocked) return
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

        <View className="row-between heat-foot">
          <Text className="heat-foot-text">连续全勤 {allStreak} 天 · 最佳 {bestStreak} 天</Text>
          {heatRange === 'week' && (
            <View className="row hm-legend">
              <Text className="heat-foot-text">少</Text>
              {[0, 1, 2, 3, 4].map((l) => (
                <View key={l} className={`hm-cell hm-l${l}`} />
              ))}
              <Text className="heat-foot-text">多</Text>
            </View>
          )}
          {heatRange === 'year' && (
            <Text className="heat-foot-text">数字 = 打卡天数</Text>
          )}
        </View>
      </View>

      {/* 心情记录 */}
      <View className="card">
        <View className="card-title">
          <View className="emoji-badge sm">
            <Text className="emoji">😊</Text>
          </View>
          <Text>今日心情</Text>
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
          {Array.from({ length: 7 }, (_, i) => addDays(today, i - 6)).map((d) => {
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
          <>
            <Icon name="gift" size={16} gap={4} />
            <Text>奖励机制</Text>
          </>
          <Text className="sub">连续全勤 {allStreak} 天 · 最佳 {bestStreak} 天</Text>
        </View>
        {visibleTasks.length > 0 && (
          <FocusScroll
            className="reward-scroll"
            measureKey={visibleTasks.length}
            style={rewardListH ? { height: rewardListH } : undefined}
          >
            {visibleTasks.map((r) => {
              const prog = condProgress(r, rewardCtx)
              const hasTarget = !!prog && prog.target > 0
              const pct = hasTarget
                ? Math.min(100, Math.round((Math.min(prog!.cur, prog!.target) / prog!.target) * 100))
                : 0
              return (
                <View className="list-item reward-item" key={r.id}>
                  <Text className="r-emoji">{r.emoji}</Text>
                  <View className="grow">
                    <View className="row-between">
                      <Text className="name">{r.title}</Text>
                      {hasTarget ? (
                        <Text className="sub">
                          还差 {Math.max(0, prog!.target - prog!.cur)} {prog!.unit}
                        </Text>
                      ) : (
                        <Text className="sub">待解锁</Text>
                      )}
                    </View>
                    {hasTarget && (
                      <View className="progress" style={{ margin: '4px 0 2px' }}>
                        <View className="progress-fill" style={{ width: `${pct}%` }} />
                      </View>
                    )}
                    <Text className="r-cond">
                      {condText(r)}
                      {r.mode === 'code' ? ' · 贵重券' : ''}
                    </Text>
                  </View>
                </View>
              )
            })}
          </FocusScroll>
        )}
        {hiddenLeft > 0 && (
          <View className="hidden-teaser">
            <Text className="teaser-emoji">🎁</Text>
            <Text>悄悄说：还有 {hiddenLeft} 个隐藏任务，达成条件才揭晓</Text>
          </View>
        )}
        {visibleTasks.length === 0 && hiddenLeft === 0 && (
          <Text className="empty">
            {allTasks.length > 0
              ? '任务都达成啦，奖励都进奖券袋了 🎉'
              : '奖励由好友在看板端设置后自动出现在这里'}
          </Text>
        )}
      </View>

      {/* 奖券袋 */}
      <View className="card">
        <View className="card-title">
          <>
            <Icon name="ticket" size={16} gap={4} />
            <Text>奖券袋</Text>
          </>
          <Text className="sub">{bag.length} 张</Text>
        </View>
        {bag.length === 0 && <Text className="empty">还没有券，达成奖励后自动入袋</Text>}
        {bag.length > 0 && (
          <ScrollView
            scroll-y
            className="coupon-scroll"
            style={couponListH ? { height: couponListH } : undefined}
          >
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
          </ScrollView>
        )}
        {bag.length > 0 && (
          <Text className="sub note-sub" style={{ marginTop: 6 }}>
            点击券可标记核销（找好友兑现 😉）
          </Text>
        )}
      </View>

      {/* 新增打卡项弹层：居中弹窗（名称 / 频率六模式 / 说明 + 子项暂存，图标按名称自动配） */}
      {addOpen && (
        <Modal variant="center" className="ck-form" onClose={closeAdd} closeOnMask={false}>
          <View className="ck-form-h">
            <Text>新增打卡项</Text>
            <View className="icon-btn" onClick={closeAdd}>
              <Icon name="x" size={16} color="#7a6a5b" />
            </View>
          </View>
          {/* 表单区：catchMove 弹层内普通 View 无法滚动，改用 ScrollView 内滚（一次展示有限，其余上下滑动） */}
          <ScrollView scroll-y style={{ maxHeight: '52vh' }}>
          <CheckinItemForm
            value={draft}
            onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
          />
          {/* 图标实时预览：新建不手选 emoji，按名称自动配 */}
          <View className="ck-freq-summary">
            <Text>{autoEmoji(draft.name)}</Text>
            <Text>图标按名称自动匹配，无需手选</Text>
          </View>
          {/* 子项暂存区：与详情弹窗一致的「输入 + 可见添加按钮」，创建时一次性写入；
              每行可铅笔原地改名 / 左滑删除（暂存草稿，删除不二次确认） */}
          <Text className="ck-form-label">子项（可选）</Text>
          {newChildren.map((n, i) => (
            <ChildRow
              key={`${n}-${i}`}
              name={n}
              depth={1}
              onRename={(v) => setNewChildren((prev) => prev.map((x, idx) => (idx === i ? v : x)))}
              onDelete={() => setNewChildren((prev) => prev.filter((_, x) => x !== i))}
            />
          ))}
          <View className="ck-sheet-add">
            <View className="ck-name-row">
              <Input
                className="field ck-name-field"
                value={newChildText}
                placeholder="+ 子项名称"
                maxlength={20}
                onInput={(e) => setNewChildText(e.detail.value)}
                onConfirm={addStagedChild}
              />
              <View className="btn small ck-name-add" onClick={addStagedChild}>
                添加
              </View>
            </View>
          </View>
          </ScrollView>
          {/* 底部按钮条：全部填完后在最下方「取消 / 添加」（不再挤在名称后面） */}
          <View className="row" style={{ marginTop: 12, gap: 8 }}>
            <View className="btn ghost" style={{ flex: 1 }} onClick={closeAdd}>
              取消
            </View>
            <View className="btn" style={{ flex: 1 }} onClick={addCheckinItem}>
              添加
            </View>
          </View>
        </Modal>
      )}

      {/* 编辑详情弹窗：点行主体打开（可改名/频率/说明，可管子项，可删除整项） */}
      {editId && editItem && editDraft && (
        <Modal variant="center" className="ck-form" onClose={closeEdit} closeOnMask={false}>
          <View className="ck-form-h">
            <Text>编辑打卡项</Text>
            <View className="icon-btn" onClick={closeEdit}>
              <Icon name="x" size={16} color="#7a6a5b" />
            </View>
          </View>
          {/* 表单区：ScrollView 内滚（一次展示有限，其余上下滑动） */}
          <ScrollView scroll-y style={{ maxHeight: '52vh' }}>
            <CheckinItemForm
              value={editDraft}
              onChange={(patch) => setEditDraft((d) => (d ? { ...d, ...patch } : d))}
            />
            {/* 子项管理：平铺全部子节点（含分组父层），按层次缩进体现从属；
                每行铅笔原地改名（立即写库）+ 左滑删除，输入即时添加写库 */}
            <Text className="ck-form-label">子项</Text>
            {flattenNodes(editItem).map((node) => (
              <ChildRow
                key={node.id}
                name={node.name}
                depth={node.depth}
                onRename={(n) => renameChild(editItem, node.id, n)}
                onDelete={() => removeChild(editItem, node.id)}
              />
            ))}
            {flattenNodes(editItem).length === 0 && (
              <Text className="ck-sheet-empty">暂无子项（可选）</Text>
            )}
            <View className="ck-sheet-add">
              <View className="ck-name-row">
                <Input
                  className="field ck-name-field"
                  value={editChildText}
                  placeholder="+ 子项名称"
                  maxlength={20}
                  onInput={(e) => setEditChildText(e.detail.value)}
                  onConfirm={addEditChild}
                />
                <View className="btn small ck-name-add" onClick={addEditChild}>
                  添加
                </View>
              </View>
            </View>
          </ScrollView>
          {/* 底部按钮条：取消 / 保存在上，删除整项淡红垫底（二次确认，连同打卡记录一起清） */}
          <View className="row" style={{ marginTop: 12, gap: 8 }}>
            <View className="btn ghost" style={{ flex: 1 }} onClick={closeEdit}>
              取消
            </View>
            <View className="btn" style={{ flex: 1 }} onClick={saveEdit}>
              保存
            </View>
          </View>
          <View
            className="btn danger"
            style={{ marginTop: 8, width: '100%' }}
            onClick={() => confirmDelete(editItem)}
          >
            删除这项
          </View>
        </Modal>
      )}

      {/* 月视图 · 某天打卡明细 */}
      {detailDate && (
        <Modal variant="sheet" onClose={() => setDetailDate(null)}>
          <View className="card-title" style={{ marginBottom: 10 }}>
            <>
              <Icon name="calendar" size={16} gap={4} />
              <Text>
                {Number(detailDate.slice(5, 7))} 月 {Number(detailDate.slice(8))} 日
              </Text>
            </>
            <Text className="sub">
              打卡 {data.checkinItems.filter((it) => isItemDone(it, data.checkins[detailDate] ?? [])).length}/
              {data.checkinItems.length}
            </Text>
          </View>
          {data.checkinItems.map((item) => {
            const ok = isItemDone(item, data.checkins[detailDate] ?? [])
            return (
              <View className={`list-item ${ok ? 'done' : ''}`} key={item.id}>
                {ok ? <Icon name="check-square" size={14} /> : <Icon name="square" size={14} />}
                <Text className="grow name">
                  {item.emoji} {item.name}
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
        </Modal>
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

      {/* 情绪安慰彩蛋：分级文案 → 打字机 → 写一句想法 → AI 回应 → 收尾定格 */}
      {comfortOpen && (
        <View className="comfort-overlay" catchMove>
          <View className="comfort-box">
            {comfortPhase === 'final' ? (
              <>
                <Image className="comfort-animal" src={animalEmpty} mode="aspectFit" />
                <Text className="comfort-final-text">今天已记下，小动物陪你</Text>
                <View className="btn" onClick={() => setComfortOpen(false)}>
                  嗯，明天见
                </View>
              </>
            ) : (
              <>
                <Text className="comfort-emoji">🧸</Text>
                <Text className="comfort-text">
                  {comfortPhase === 'replying'
                    ? replyText
                      ? replyText.slice(0, replyTyped)
                      : '正在想想怎么回你…'
                    : comfortText
                      ? comfortText.slice(0, typed)
                      : '正在组织语言安慰你…'}
                </Text>
                {((comfortPhase === 'typing' && comfortText && typed < comfortText.length) ||
                  (comfortPhase === 'replying' && replyText && replyTyped < replyText.length)) && (
                  <Text className="type-caret" />
                )}
                {comfortPhase === 'typing' && <View style={{ height: 40 }} />}
                {comfortPhase === 'ready' && (
                  <>
                    <View className="comfort-input-wrap">
                      <Input
                        className="comfort-input"
                        placeholder="写一句此刻的想法（可选）"
                        value={thoughtDraft}
                        onInput={(e) => setThoughtDraft(e.detail.value)}
                        onConfirm={sendThought}
                        maxlength={50}
                      />
                      <View className="btn" onClick={sendThought}>
                        说出来
                      </View>
                    </View>
                    <View className="btn comfort-ghost-btn" onClick={() => setComfortPhase('final')}>
                      有被安慰到
                    </View>
                  </>
                )}
              </>
            )}
          </View>
        </View>
      )}
    </View>
  )
}
