// 今日：考试倒计时 / 天气（定位+城市搜索） / 吃饭+喝水一行双卡 / 艾宾浩斯复习闪卡 /
// 今日事项+今日打卡两行卡片（统一 TaskRow 行：原地展开子任务 / 完成弹撤销 / 左滑删除） / 睡眠督促
// 每日一句：前端隐藏（后端保留，随时可恢复）
// 自 PWA pages/Today.tsx 迁移：DOM API → Taro（getLocation / navigateTo / switchTab / 自绘勾选框），
// 外部服务（天气/城市/一言）→ services/api/proxy stub，美团 → navigateToMiniProgram
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { Image, Input, ScrollView, Text, View } from '@tarojs/components'
import { useData } from '../../store'
import type {
  CheckinItem,
  DayLog,
  GeoCandidate,
  ImportantDate,
  MealSlot,
  Milestone,
  PeriodicTask,
  Todo,
  Weather,
} from '../../types'
import { cityLabel } from '../../constants/cities'
import { pickWaterQuiz, quizById, type WaterQuiz } from '../../constants/water-quiz'
import { fmtDateShort } from '../../components/DatePicker'
import Modal from '../../components/Modal'
import Icon from '../../components/Icon'
import TaskRow from '../../components/TaskRow'
import ChildRow from '../../components/ChildRow'
import UndoTip, { type UndoTipData } from '../../components/UndoTip'
import { appConfirm } from '../../components/ConfirmDialog'
import {
  autoEmoji,
  flattenLeaves,
  freqText,
  isItemDone,
  leafProgress,
  nextCheckinDate,
  removeChildNode,
  renameChildNode,
  sortCheckinItemsForDisplay,
  toggleItemIds,
  toggleLeafId,
} from '../../utils/checkin'
import { useListCapHeight } from '../../utils/listCap'
import { blockTabSwipe, useTabSwipe } from '../../utils/tabSwipe'
import { fetchWeather, reverseGeocode, searchCities, subscribeRemind } from '../../services/api/proxy'
import animalEat from '../../assets/images/奶龙.png'
import animalEmpty from '../../assets/images/小兔.png'
import animalHappy from '../../assets/images/开心.png'
import animalSleep from '../../assets/images/睡觉.png'
import animalWater from '../../assets/images/猫.png'
import weatherRain from '../../assets/images/小狗有伞.png'
import weatherSun from '../../assets/images/太阳蛋.png'
import { addDays, dateStr, daysBetween, fmtHM, hmToMin, nowMin, pad2, todayStr } from '../../utils/date'
import {
  firstReviewDate,
  isNoteDue,
  nextReviewState,
  noteReviewState,
  reviewPriority,
  REVIEW_DAILY_LIMIT,
  type Rating,
} from '../../utils/review'
import { showToast } from '../../utils/platform'

function useNow(intervalMs = 30000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])
  return now
}

const WEEKDAY_CN = ['日', '一', '二', '三', '四', '五', '六']

/** 考试日期中文显示：2027年3月14日 · 周日 */
function examDateCN(date: string): string {
  const d = new Date(date + 'T00:00:00')
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 · 周${WEEKDAY_CN[d.getDay()]}`
}

/** 秒数 → 倒计时：1:23:45（不足 1 小时显示 23:45） */
function fmtHMS(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}:${pad2(m)}:${pad2(s % 60)}` : `${m}:${pad2(s % 60)}`
}

/** 待办优先级文案（prio-pill 用；旧数据无字段视为 2=中） */
const PRIO_LABEL: Record<1 | 2 | 3, string> = { 1: '高', 2: '中', 3: '低' }

/** 重要日期下一次出现日（沿用 dates 页 nextOccurrence 口径）：
 *  一次性日期原样返回；每年重复拼到今年/明年（2/29 等组合平年不存在时取该月最后一天兜底） */
function nextDateOccurrence(d: string, isYearly: boolean, today: string): string {
  if (!isYearly) return d
  // 日期存 YYYY-MM-DD（与 reminders 页 nextOccurrence 同口径），按 5-7 / 8-10 位取月日
  const mm = Number(d.slice(5, 7))
  const dd = Number(d.slice(8, 10))
  const pick = (y: number) => {
    const day = Math.min(dd, new Date(y, mm, 0).getDate())
    return `${y}-${String(mm).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }
  const thisYear = pick(Number(today.slice(0, 4)))
  return thisYear >= today ? thisYear : pick(Number(today.slice(0, 4)) + 1)
}

/** 周期提醒下次触发日（沿用旧 periodic 页 nextOccurrence 口径：lastDone + everyDays） */
function nextOccurrence(p: PeriodicTask): string {
  return addDays(p.lastDone, p.everyDays)
}

/** 周期提醒今天是否触发：今天 ≥ 下次触发日（与旧 periodic 页「该做了」同口径） */
function isPeriodicDue(p: PeriodicTask, today: string): boolean {
  return daysBetween(nextOccurrence(p), today) >= 0
}

/** 待办是否今天完成：done 且 doneAt 落在今天（旧数据无 doneAt 视为非今天完成） */
function isTodoDoneToday(t: Todo, today: string): boolean {
  return !!t.done && !!t.doneAt && dateStr(new Date(t.doneAt)) === today
}

/** 打卡项今天是否轮到（isDueToday 口径，但忽略今天的完成状态）：
 *  完成后仍留在今日卡里沉底展示，方便撤销；下周几/每周 N 次等口径与 nextCheckinDate 一致 */
function isDueTodayIgnoreDone(
  item: CheckinItem,
  checkins: Record<string, string[]>,
  today: string
): boolean {
  return nextCheckinDate(item, { ...checkins, [today]: [] }, today) === today
}

/** 过期只保留催 3 天：今日事项里所有过期项（节点/日期/待办/周期）统一口径，过了 3 天不再显示 */
const OVERDUE_KEEP_DAYS = 3

/** 今日事项卡统一行（组序：考试节点 → 重要日期 → 待办 → 周期提醒） */
type Matter =
  | { kind: 'node'; m: Milestone; examId: string; examName: string; left: number }
  | { kind: 'date'; d: ImportantDate; left: number; acked: boolean }
  | { kind: 'todo'; t: Todo }
  | { kind: 'periodic'; p: PeriodicTask }

/** 三选弹窗选项：待办 → 待办页；周期提醒 / 重要日期 → 新的提醒合并页（pages/reminders） */
const CHOICE_OPTS: { emoji: string; title: string; desc: string; url: string }[] = [
  { emoji: '📝', title: '待办', desc: '记一件今天要办的事', url: '/pages/todos/index' },
  { emoji: '🔁', title: '周期提醒', desc: '每隔几天提醒做一次的事', url: '/pages/reminders/index' },
  { emoji: '📌', title: '重要日期', desc: '生日、纪念日、截止日', url: '/pages/reminders/index' },
]

/** 吃饭卡倒计时：精确到秒。独立 1s 心跳自更新，避免今日页整页秒级重渲染 */
function MealCountdown({ label, target, due }: { label: string; target: number; due: boolean }) {
  const leftSec = () => Math.max(0, Math.round((target - Date.now()) / 1000))
  const [left, setLeft] = useState(leftSec)
  useEffect(() => {
    const t = setInterval(() => setLeft(leftSec()), 1000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])
  if (due || left <= 0) return <Text className="meal-big">该吃{label}啦</Text>
  return (
    <>
      <Text className="meal-small">距{label}还有</Text>
      <Text className="meal-big">{fmtHMS(left)}</Text>
    </>
  )
}

export default function Today() {
  const { data, ready, auth, set } = useData()
  const now = useNow()
  const tabSwipe = useTabSwipe(0)
  const today = todayStr()
  const minute = nowMin()

  // ---- 考试倒计时：最近一场 + 其余一行小字 ----
  const upcomingExams = useMemo(
    () =>
      data.exams
        .filter((e) => daysBetween(today, e.date) >= 0)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [data.exams, today]
  )
  const nextExam = upcomingExams[0] ?? null
  const otherExams = upcomingExams.slice(1, 4)

  // ---- 天气 ----
  const [weather, setWeather] = useState<Weather | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const loadWeather = useCallback(() => {
    const city = data.settings.city
    if (!city) {
      setWeather(null)
      return
    }
    setWeatherLoading(true)
    fetchWeather(city.lat, city.lon)
      .then(setWeather)
      .catch(() => setWeather(null))
      .finally(() => setWeatherLoading(false))
  }, [data.settings.city])
  useEffect(() => {
    loadWeather()
  }, [loadWeather])

  // ---- 位置设置弹窗（天气卡定位按钮）：自动检测 + 手动搜索（支持区县） ----
  const [locOpen, setLocOpen] = useState(false)
  const [locQuery, setLocQuery] = useState('')
  const [locCands, setLocCands] = useState<GeoCandidate[]>([])
  const [locSearching, setLocSearching] = useState(false)
  const [locDetecting, setLocDetecting] = useState(false)

  const applyCity = (
    c: { name: string; province?: string; city?: string; lat: number; lon: number },
    source: 'auto' | 'manual' = 'manual'
  ) => {
    set('settings', (prev) => ({ ...prev, city: c, citySource: source }))
    setLocOpen(false)
    setLocCands([])
    setLocQuery('')
    showToast(`📍 已切换到 ${cityLabel(c)}`)
  }

  const searchLoc = async () => {
    const q = locQuery.trim()
    if (!q) return
    setLocSearching(true)
    try {
      const list = await searchCities(q)
      setLocCands(list)
      if (list.length === 0) showToast('没有找到这个地名，换个写法试试')
    } catch {
      showToast('搜索失败，请检查网络')
    } finally {
      setLocSearching(false)
    }
  }

  // 自动检测：模糊定位取坐标 → 反查省市区名；反查失败也照常用坐标取天气。
  // 个人主体 getLocation 权限申请不下来，统一走 getFuzzyLocation（scope.userFuzzyLocation）。
  // 授权状态机：已授权/首次 → 直接定位（首次会触发微信授权弹窗）；拒绝过 → 弹窗引导去设置页开启后重试
  const detectLocation = async () => {
    if (locDetecting) return
    setLocDetecting(true)
    try {
      const setting = await Taro.getSetting()
      // Taro 类型 AuthSetting 未含 scope.userFuzzyLocation（模糊定位），断言取值
      const granted = (setting.authSetting as Record<string, boolean | undefined>)['scope.userFuzzyLocation']
      if (granted === false) {
        const { confirm } = await Taro.showModal({
          title: '需要定位权限',
          content: '定位权限曾被拒绝，请在设置页开启「位置信息」后重试',
          confirmText: '去设置'
        })
        if (!confirm) return
        const after = await Taro.openSetting()
        if (!(after.authSetting as Record<string, boolean | undefined>)['scope.userFuzzyLocation']) {
          showToast('未开启位置权限，可手动搜索城市')
          return
        }
      }
      let pos: { latitude: number; longitude: number }
      try {
        pos = await Taro.getFuzzyLocation({ type: 'gcj02' })
      } catch {
        showToast('定位失败，请允许定位权限后重试')
        return
      }
      try {
        const r = await reverseGeocode(pos.latitude, pos.longitude)
        applyCity({ name: r.name, province: r.province, city: r.city, lat: r.lat, lon: r.lon }, 'auto')
      } catch {
        applyCity({ name: '当前位置', province: '', lat: pos.latitude, lon: pos.longitude }, 'auto')
      }
    } catch {
      showToast('定位失败，请手动搜索城市')
    } finally {
      setLocDetecting(false)
    }
  }

  // 启动自动定位：citySource=auto 时每次启动静默刷新城市（每天首个 useDidShow 执行一次）。
  // 授权状态机：granted → 静默定位；从未问过 → 首调触发一次微信授权弹窗；拒绝过 → 静默跳过（交给手动入口引导）
  const autoLocate = async () => {
    if (!ready || data.settings.citySource === 'manual') return
    const flag = `kg_locate_${today}`
    if (Taro.getStorageSync(flag)) return
    try {
      const setting = await Taro.getSetting()
      const granted = (setting.authSetting as Record<string, boolean | undefined>)['scope.userFuzzyLocation']
      if (granted === false) return
      const pos = await Taro.getFuzzyLocation({ type: 'gcj02' })
      Taro.setStorageSync(flag, '1')
      let next: { name: string; province?: string; city?: string; lat: number; lon: number }
      try {
        const r = await reverseGeocode(pos.latitude, pos.longitude)
        next = { name: r.name, province: r.province, city: r.city, lat: r.lat, lon: r.lon }
      } catch {
        next = { name: '当前位置', province: '', lat: pos.latitude, lon: pos.longitude }
      }
      const cur = data.settings.city
      const same = cur && Math.abs(cur.lat - next.lat) < 0.01 && Math.abs(cur.lon - next.lon) < 0.01
      if (!same) {
        set('settings', (prev) => ({ ...prev, city: next, citySource: 'auto' }))
      }
    } catch {
      // 定位失败（含用户拒绝授权弹窗）：静默，不打扰
    }
  }
  useDidShow(() => {
    autoLocate()
  })

  // ---- 每日一句：前端隐藏（后端保留）；恢复时把下方逻辑与 JSX 一并放开即可 ----
  // const [quoteOffset, setQuoteOffset] = useState(0)
  // const [webQuote, setWebQuote] = useState<string | null>(null)
  // const [showWebQuote, setShowWebQuote] = useState(false)

  // ---- 今日事项 / 今日打卡 两行卡片（TaskRow 统一行渲染） ----
  // 今日事项卡：考试节点（到期置顶）→ 重要日期（提醒窗口内）→ 待办（逾期在前）→ 周期提醒（今天触发），
  // 组间固定顺序；所有过期项只保留催 OVERDUE_KEEP_DAYS 天，过了不再显示
  const matters = useMemo<Matter[]>(() => {
    // ① 考试节点：到了日期（当天/已过 3 天内）且未完成的置顶展示，勾选=标记节点完成
    const nodeRows: Matter[] = data.exams
      .flatMap((e) =>
        e.milestones
          .filter((m) => !m.done)
          .map((m) => ({ m, examId: e.id, examName: e.name, left: daysBetween(today, m.date) }))
      )
      .filter((x) => x.left <= 0 && x.left >= -OVERDUE_KEEP_DAYS)
      .sort((a, b) => a.left - b.left)
      .map((x) => ({ kind: 'node' as const, ...x }))
    // ② 重要日期：命中当天或提前提醒窗口内（今天距目标日 ≤ remindDays，沿用 dates 页口径）；
    //    已过目标日的只再催 3 天；已点「知道了」（lastAck=今天）的沉到本组末尾
    const dateRows: Matter[] = data.dates
      .map((d) => {
        const left = daysBetween(today, nextDateOccurrence(d.date, d.yearly, today))
        return {
          kind: 'date' as const,
          d,
          left,
          acked: d.lastAck === today,
          hit:
            (d.remindDays ?? []).some((r) => left >= 0 && left <= r) ||
            (left < 0 && left >= -OVERDUE_KEEP_DAYS),
        }
      })
      .filter((x) => x.hit)
      .sort((a, b) => Number(a.acked) - Number(b.acked) || a.left - b.left)
    // ③ 待办：截止 ≤ 今天且过期 3 天内（未完成 或 今天完成）；逾期红标排最前，今天完成的沉底
    const todoRows: Matter[] = data.todos
      .filter(
        (t) =>
          !!t.dueDate &&
          t.dueDate <= today &&
          daysBetween(t.dueDate, today) <= OVERDUE_KEEP_DAYS &&
          (!t.done || isTodoDoneToday(t, today))
      )
      .sort(
        (a, b) =>
          Number(isTodoDoneToday(a, today)) - Number(isTodoDoneToday(b, today)) ||
          Number(b.dueDate! < today) - Number(a.dueDate! < today) ||
          a.dueDate!.localeCompare(b.dueDate!) ||
          (a.priority ?? 2) - (b.priority ?? 2)
      )
      .map((t) => ({ kind: 'todo' as const, t }))
    // ④ 周期提醒：今天触发的（旧 periodic 页 nextOccurrence 口径），逾期 3 天内，越逾期越靠前
    const periodicRows: Matter[] = data.periodic
      .filter(
        (p) => isPeriodicDue(p, today) && daysBetween(nextOccurrence(p), today) <= OVERDUE_KEEP_DAYS
      )
      .sort((a, b) => nextOccurrence(a).localeCompare(nextOccurrence(b)))
      .map((p) => ({ kind: 'periodic' as const, p }))
    return [...nodeRows, ...dateRows, ...todoRows, ...periodicRows]
  }, [data.exams, data.dates, data.todos, data.periodic, today])
  // 头部计数：剩余未完成数（已「知道了」/ 今天已完成的除外）
  const mattersLeft = matters.filter((m) =>
    m.kind === 'date' ? !m.acked : m.kind === 'todo' ? !isTodoDoneToday(m.t, today) : true
  ).length

  // 今日打卡卡：今天轮到的项（完成后仍留卡内沉底，便于撤销），与打卡页 sortCheckinItemsForDisplay 同口径
  const todayChecked = data.checkins[today] ?? []
  const ckDue = useMemo(
    () =>
      sortCheckinItemsForDisplay(
        data.checkinItems.filter((it) => isDueTodayIgnoreDone(it, data.checkins, today)),
        data.checkins,
        today
      ),
    [data.checkinItems, data.checkins, today]
  )

  // 每卡最多展示 5 条：超出的量前 5 条主行高度固定容器，卡内滑动（不足 5 条自然高度）
  const mattersH = useListCapHeight('.tb-matters', '.tb-matters .task-row-main', matters.length, 5)
  const ckListH = useListCapHeight('.tb-checkins', '.tb-checkins .task-row-main', ckDue.length, 5)

  // 原地展开子任务（今日页特有：点行主体 / 右侧箭头均为同一展开收起入口）
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const toggleExpand = (key: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  // 完成撤销：勾选圈完成操作后底部浮出 3 秒「撤销」小条（label=名称，undo=反向写库恢复）
  const [undoTip, setUndoTip] = useState<UndoTipData | null>(null)
  const undoSeq = useRef(0)
  const showUndo = (label: string, undo: () => void) => {
    undoSeq.current += 1
    setUndoTip({ id: undoSeq.current, label, undo })
  }

  // 勾选待办（与待办页同口径，另记/清 doneAt）：有子任务且全勾时再点 = 父子一起取消
  const toggleTodo = (t: Todo) => {
    const kids = t.children ?? []
    const allDone = kids.length > 0 && kids.every((c) => c.done)
    const nextDone = !allDone && !t.done
    const next: Todo = allDone
      ? { ...t, done: false, doneAt: undefined, children: kids.map((c) => ({ ...c, done: false })) }
      : { ...t, done: nextDone, doneAt: nextDone ? Date.now() : undefined }
    set('todos', (prev) => prev.map((x) => (x.id === t.id ? next : x)))
    if (nextDone) {
      showUndo(`已完成「${t.text}」`, () =>
        set('todos', (prev) => prev.map((x) => (x.id === t.id ? t : x)))
      )
    }
  }

  // 勾选待办子任务（展开区内）：全勾时父任务自动完成（记 doneAt）；取消子任务不拉回父状态
  const toggleTodoChild = (t: Todo, cid: string) => {
    const kids = (t.children ?? []).map((c) => (c.id === cid ? { ...c, done: !c.done } : c))
    const all = kids.length > 0 && kids.every((c) => c.done)
    const next: Todo = {
      ...t,
      children: kids,
      done: all || t.done,
      doneAt: all && !t.done ? Date.now() : t.doneAt,
    }
    set('todos', (prev) => prev.map((x) => (x.id === t.id ? next : x)))
    if (all && !t.done) {
      showUndo(`已完成「${t.text}」`, () =>
        set('todos', (prev) => prev.map((x) => (x.id === t.id ? t : x)))
      )
    }
  }

  // 勾选打卡项：一键补全/取消全部叶子（勾选只记叶子 id）；完成弹撤销
  const toggleCheckinItem = (it: CheckinItem) => {
    const prevIds = data.checkins[today] ?? []
    const nextIds = toggleItemIds(it, prevIds)
    set('checkins', (prev) => ({ ...prev, [today]: nextIds }))
    if (isItemDone(it, nextIds)) {
      showUndo(`已完成「${it.name}」`, () =>
        set('checkins', (prev) => ({ ...prev, [today]: prevIds }))
      )
    }
  }

  // 勾选打卡叶子（展开区精细勾选）：叶子全勾整项完成时弹撤销
  const toggleCheckinLeaf = (it: CheckinItem, leafId: string) => {
    const prevIds = data.checkins[today] ?? []
    const nextIds = toggleLeafId(prevIds, leafId)
    set('checkins', (prev) => ({ ...prev, [today]: nextIds }))
    if (isItemDone(it, nextIds)) {
      showUndo(`已完成「${it.name}」`, () =>
        set('checkins', (prev) => ({ ...prev, [today]: prevIds }))
      )
    }
  }

  // 勾选重要日期 =「知道了」：记 lastAck=今天（本组沉底显示完成态）；再点取消
  const toggleDateAck = (d: ImportantDate) => {
    const prevAck = d.lastAck
    const acked = d.lastAck === today
    set('dates', (prev) =>
      prev.map((x) => (x.id === d.id ? { ...x, lastAck: acked ? undefined : today } : x))
    )
    if (!acked) {
      showUndo(`已记住「${d.name}」`, () =>
        set('dates', (prev) => prev.map((x) => (x.id === d.id ? { ...x, lastAck: prevAck } : x)))
      )
    }
  }

  // 勾选周期提醒 = 今天做完了：lastDone=今天重置周期（移出今日列表），弹撤销可恢复
  const completePeriodic = (p: PeriodicTask) => {
    const prevDone = p.lastDone
    set('periodic', (prev) => prev.map((x) => (x.id === p.id ? { ...x, lastDone: today } : x)))
    showUndo(`已完成「${p.name}」`, () =>
      set('periodic', (prev) => prev.map((x) => (x.id === p.id ? { ...x, lastDone: prevDone } : x)))
    )
  }

  // 勾选考试节点 = 标记节点完成（写 exams.milestones.done，移出今日列表）；完成弹撤销
  const toggleMilestone = (examId: string, m: Milestone) => {
    const prevDone = m.done
    set('exams', (prev) =>
      prev.map((e) =>
        e.id === examId
          ? { ...e, milestones: e.milestones.map((x) => (x.id === m.id ? { ...x, done: !x.done } : x)) }
          : e
      )
    )
    if (!prevDone) {
      showUndo(`已完成节点「${m.label}」`, () =>
        set('exams', (prev) =>
          prev.map((e) =>
            e.id === examId
              ? { ...e, milestones: e.milestones.map((x) => (x.id === m.id ? { ...x, done: prevDone } : x)) }
              : e
          )
        )
      )
    }
  }

  // 子项原地改名 / 删除（展开区 ChildRow）：待办子任务按 id 改 text；打卡子项递归定位改 name
  const renameTodoChild = (t: Todo, cid: string, name: string) =>
    set('todos', (prev) =>
      prev.map((x) =>
        x.id === t.id
          ? { ...x, children: (x.children ?? []).map((c) => (c.id === cid ? { ...c, text: name } : c)) }
          : x
      )
    )
  const removeTodoChild = (t: Todo, cid: string) =>
    set('todos', (prev) =>
      prev.map((x) =>
        x.id === t.id ? { ...x, children: (x.children ?? []).filter((c) => c.id !== cid) } : x
      )
    )
  const renameCheckinLeaf = (it: CheckinItem, leafId: string, name: string) =>
    set('checkinItems', (prev) =>
      prev.map((x) =>
        x.id === it.id ? { ...x, children: renameChildNode(x.children ?? [], leafId, name) } : x
      )
    )
  const removeCheckinLeaf = (it: CheckinItem, leafId: string) =>
    set('checkinItems', (prev) =>
      prev.map((x) =>
        x.id === it.id ? { ...x, children: removeChildNode(x.children ?? [], leafId) } : x
      )
    )

  // 左滑删除（TaskRow onDelete 触发）：二次确认文案注明来源，确认后写库
  const removeMatter = (confirmText: string, fn: () => void) => {
    void appConfirm(confirmText, undefined, { danger: true, confirmText: '删除' }).then((ok) => {
      if (ok) fn()
    })
  }

  // 三选弹窗（今日事项空态点加号弹出）：选类型跳对应管理页
  const [choiceOpen, setChoiceOpen] = useState(false)

  // ---- 日志（喝水/三餐） ----
  const dayLog: DayLog = data.dayLogs[today] ?? { water: [], stand: [], meals: {} }
  const updateLog = (patch: Partial<DayLog>) =>
    set('dayLogs', (prev) => ({
      ...prev,
      [today]: { ...{ water: [], stand: [], meals: {} }, ...prev[today], ...patch },
    }))

  const lastWater = dayLog.water.length ? Math.max(...dayLog.water) : null
  const waterDue =
    lastWater === null
      ? minute >= hmToMin(data.settings.wake) + data.settings.water.intervalMin
      : minute - lastWater >= data.settings.water.intervalMin

  const meals = [
    { key: 'breakfast', label: '早餐', emoji: '🌅', time: data.settings.meals.breakfast },
    { key: 'lunch', label: '午餐', emoji: '🍱', time: data.settings.meals.lunch },
    { key: 'dinner', label: '晚餐', emoji: '🌙', time: data.settings.meals.dinner },
  ]

  const sleepMin = hmToMin(data.settings.sleep)
  const sleepDue = minute >= sleepMin - 30
  // 睡眠督促仅 19:30 后显示
  const showSleep = minute >= 19 * 60 + 30

  // ---- 临近一餐卡：当前时间落在某餐前 2h 窗口内显示那一餐，冲突取最近 ----
  const nearMeal = useMemo(() => {
    const cands = meals
      .map((m) => ({ ...m, diff: minute - hmToMin(m.time) }))
      .filter((m) => m.diff >= -120 && m.diff <= 120)
      .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff))
    return cands[0] ?? null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minute, data.settings.meals])

  // ---- 下一餐预告：不在任何一餐窗口内时常驻显示 ----
  const nextMeal = useMemo(() => {
    const cands = meals
      .map((m) => ({ ...m, diff: hmToMin(m.time) - minute }))
      .filter((m) => m.diff > 0)
      .sort((a, b) => a.diff - b.diff)
    if (cands[0]) return cands[0]
    // 今天三餐都已过点 → 明天早餐
    const breakfast = meals[0]
    return { ...breakfast, diff: 24 * 60 - minute + hmToMin(breakfast.time) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minute, data.settings.meals])

  // ---- 吃饭卡中心内容：有临近未吃的餐 → 聚焦它；否则显示距下一餐倒计时 ----
  const mealFocus = nearMeal && !dayLog.meals[nearMeal.key] ? nearMeal : nextMeal
  const mealDueNow = mealFocus === nearMeal && mealFocus.diff >= 0
  // 目标时刻（毫秒时间戳，秒级精确）：今日 HH:MM:00；三餐全过点时 nextMeal 指向明天早餐，补一天
  const dayBase = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  let mealTargetMs = dayBase + hmToMin(mealFocus.time) * 60000
  if (mealTargetMs <= now.getTime()) mealTargetMs += 24 * 3600 * 1000

  const hour = now.getHours()
  const greeting =
    hour < 5 ? '夜深了，早点休息'
    : hour < 11 ? '早上好，今天也要加油'
    : hour < 14 ? '中午好，别忘了吃饭'
    : hour < 18 ? '下午好，保持节奏'
    : hour < 23 ? '晚上好，再坚持一会儿'
    : '夜深了，早点休息'

  // ---- 今日复习（笔记闪卡 + 喝水错题混合队列，FSRS 简化版 4 档评分） ----
  // 到期卡片（笔记 + 错题）统一按优先级（逾期天数 × 难度）排序，每日上限 REVIEW_DAILY_LIMIT 张，其余顺延
  type ReviewCard =
    | { kind: 'note'; note: (typeof data.notes)[number] }
    | { kind: 'quiz'; wrong: (typeof data.quizBook.wrongs)[number] }
  const dueNotes = useMemo(() => data.notes.filter((n) => isNoteDue(n, today)), [data.notes, today])
  const dueWrongs = useMemo(
    () => data.quizBook.wrongs.filter((w) => isNoteDue(w, today) && quizById(w.quizId)),
    [data.quizBook.wrongs, today]
  )
  const reviewQueue = useMemo(() => {
    const all: ReviewCard[] = [
      ...dueNotes.map((n) => ({ kind: 'note' as const, note: n })),
      ...dueWrongs.map((w) => ({ kind: 'quiz' as const, wrong: w })),
    ]
    const pri = (c: ReviewCard) => reviewPriority(c.kind === 'note' ? c.note : c.wrong, today)
    all.sort((a, b) => pri(b) - pri(a))
    return all.slice(0, REVIEW_DAILY_LIMIT)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dueNotes, dueWrongs, today])
  const reviewPool = useMemo(
    () =>
      data.notes.filter((n) => n.nextReviewDate !== null && n.reviewStep < 5).length +
      data.quizBook.wrongs.filter((w) => w.nextReviewDate !== null).length,
    [data.notes, data.quizBook.wrongs]
  )
  const reviewOverflow = dueNotes.length + dueWrongs.length - reviewQueue.length
  const [reviewDone, setReviewDone] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const reviewTotal = reviewQueue.length + reviewDone
  const curCard = reviewQueue[0] ?? null
  const curNote = curCard?.kind === 'note' ? curCard.note : null
  const curWrong = curCard?.kind === 'quiz' ? curCard.wrong : null
  const curQuiz = curWrong ? quizById(curWrong.quizId) : null

  const answerReview = (rating: Rating) => {
    if (!curCard) return
    subscribeRemind() // 顺带请求一次性订阅授权（须在用户点击回调内同步发起，拒绝静默；每日最多弹一次）
    const state = noteReviewState(curCard.kind === 'note' ? curCard.note : curCard.wrong)
    const next = nextReviewState(state, rating)
    const { review, nextReviewDate } = next
    if (curCard.kind === 'note') {
      set('notes', (prev) => prev.map((x) => (x.id === curCard.note.id ? { ...x, ...next } : x)))
    } else {
      // 错题评分写回：只更新记忆状态与排期（wrongCount/lastWrongAt 保留历史）
      set('quizBook', (prev) => ({
        ...prev,
        wrongs: prev.wrongs.map((w) =>
          w.quizId === curCard.wrong.quizId ? { ...w, review, nextReviewDate } : w
        ),
      }))
    }
    if (next.reviewStep >= 5) showToast('🎉 这张卡已掌握！')
    setFlipped(false)
    setReviewDone((n) => n + 1)
  }

  // 4 档评分按钮（笔记 / 错题卡背面共用；stopPropagation 避免触发翻面）
  const ratingBtns = (
    <View className="flash-btns">
      <View
        className="btn small ghost"
        onClick={(e) => {
          e.stopPropagation()
          answerReview('again')
        }}
      >
        忘记 😵
      </View>
      <View
        className="btn small ghost"
        onClick={(e) => {
          e.stopPropagation()
          answerReview('hard')
        }}
      >
        困难 😐
      </View>
      <View
        className="btn small"
        onClick={(e) => {
          e.stopPropagation()
          answerReview('good')
        }}
      >
        一般 🙂
      </View>
      <View
        className="btn small"
        onClick={(e) => {
          e.stopPropagation()
          answerReview('easy')
        }}
      >
        轻松 😄
      </View>
    </View>
  )

  // ---- 常识判断喝水题：先选中后提交，✕ 关闭不打卡 ----
  const [waterQuiz, setWaterQuiz] = useState<WaterQuiz | null>(null)
  const [quizPicked, setQuizPicked] = useState<number | null>(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizRevealed, setQuizRevealed] = useState(false)

  const openWaterQuiz = () => {
    setWaterQuiz(pickWaterQuiz())
    setQuizPicked(null)
    setQuizSubmitted(false)
    setQuizRevealed(false)
  }

  /**
   * 喝水题结算（提交答案 / 直接看答案时调用）：
   * - stats.answered：提交 +1（看答案不计作答）
   * - 答对：不入池，不动已排期
   * - 答错 / 直接看答案：stats.wrong +1，按 FSRS「忘记」语义入池（新题首排明天；
   *   池中老题 wrongCount+1 并按 again 重排，已掌握的题重新入池）
   */
  const settleQuiz = (picked: number | null, revealed: boolean) => {
    if (!waterQuiz) return
    const missed = revealed || (picked !== null && picked !== waterQuiz.answer)
    set('quizBook', (prev) => {
      const stats = {
        ...prev.stats,
        answered: prev.stats.answered + (picked !== null ? 1 : 0),
        wrong: prev.stats.wrong + (missed ? 1 : 0),
      }
      if (!missed) return { ...prev, stats }
      const idx = prev.wrongs.findIndex((w) => w.quizId === waterQuiz.id)
      let wrongs: (typeof prev.wrongs) = prev.wrongs
      if (idx === -1) {
        wrongs = [
          ...prev.wrongs,
          {
            quizId: waterQuiz.id,
            wrongCount: 1,
            lastWrongAt: Date.now(),
            nextReviewDate: firstReviewDate(),
            review: { stability: 1, difficulty: 5, reps: 0, lapses: 0 },
          },
        ]
      } else {
        const { review, nextReviewDate } = nextReviewState(noteReviewState(prev.wrongs[idx]), 'again')
        wrongs = prev.wrongs.map((w, i) =>
          i === idx
            ? { ...w, wrongCount: w.wrongCount + 1, lastWrongAt: Date.now(), review, nextReviewDate }
            : w
        )
      }
      return { ...prev, stats, wrongs }
    })
  }

  const recordWater = () => {
    updateLog({ water: [...dayLog.water, minute] })
    setWaterQuiz(null)
  }

  if (!ready) {
    // 页面同构骨架屏：hero 大卡 / 天气卡 / 一行双卡 / 闪卡 / 今日事项+今日打卡两卡
    return (
      <View className="page">
        <View className="skeleton sk-hero" />
        <View className="skeleton sk-card" />
        <View className="pair-row">
          <View className="skeleton sk-pair" />
          <View className="skeleton sk-pair" />
        </View>
        <View className="skeleton sk-card" />
        <View className="skeleton sk-card" />
        <View className="skeleton sk-card" />
      </View>
    )
  }

  return (
    <View className="page tab-page" {...tabSwipe}>
      {auth?.role === 'guest' && (
        <View className="demo-banner">
          <Text className="chip warn">演示模式 · 样板数据</Text>
        </View>
      )}

      <View className="page-title">
        <Text>
          {now.getMonth() + 1}月{now.getDate()}日 · {greeting}
        </Text>
      </View>

      {/* 考试倒计时 hero 大卡：最近一场大天数 + 其余横向可滑 chip 行 */}
      {nextExam ? (
        <View className="countdown-compact">
          <View className="cd-main">
            <Text className="cd-days">
              {daysBetween(today, nextExam.date)}
              <Text className="cd-unit">天</Text>
            </Text>
            <View className="cd-info">
              <Text className="cd-name">{nextExam.name}</Text>
              <Text className="cd-date">{examDateCN(nextExam.date)}</Text>
            </View>
          </View>
          {otherExams.length > 0 && (
            <ScrollView scrollX className="cd-others-scroll" onTouchStart={blockTabSwipe}>
              {otherExams.map((e) => (
                <Text key={e.id} className="cd-chip">
                  {e.name} {daysBetween(today, e.date)} 天
                </Text>
              ))}
            </ScrollView>
          )}
        </View>
      ) : (
        <View className="countdown-compact cd-empty">
          <View className="cd-main">
            <Image className="cd-animal" src={animalEmpty} mode="aspectFit" />
            <View className="cd-info">
              <Text className="cd-name">还没有设置目标考试</Text>
              <View
                className="btn ghost small cd-go"
                onClick={() => Taro.switchTab({ url: '/pages/courses/index' })}
              >
                <Icon name="plus" size={12} gap={4} />去「课程」页添加
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 天气：直接展示（橘色系专属卡） */}
      <View className="card weather-card">
        {data.settings.city ? (
          weather ? (
            <>
              <View className="card-title">
                <Icon name="pin" size={16} gap={4} />
                <Text>{cityLabel(data.settings.city)}</Text>
                <View className="row">
                  <View
                    className="icon-btn"
                    onClick={() => setLocOpen(true)}
                  >
                    <Icon name="compass" size={16} />
                  </View>
                  <View
                    className="icon-btn"
                    style={{ opacity: weatherLoading ? 0.5 : 1 }}
                    onClick={() => {
                      if (!weatherLoading) loadWeather()
                    }}
                  >
                    {weatherLoading ? <Text>…</Text> : <Icon name="refresh" size={16} />}
                  </View>
                </View>
              </View>
              <View className="weather-line">
                <Text className="temp">{weather.temp}°C</Text>
                <Text className="sub">
                  {weather.desc} · {weather.tMin}~{weather.tMax}°C
                </Text>
              </View>
              <Text className="sub" style={{ marginTop: 2 }}>
                体感 {weather.feels}°C · 湿度 {weather.humidity}%
              </Text>
              {(weather.rainProb >= 40 || weather.tMin <= 10) && (
                <View className="weather-tips">
                  {weather.rainProb >= 40 && (
                    <View className="chip">
                      <Icon name="cloud" size={14} gap={4} />
                      <Text>记得带伞</Text>
                    </View>
                  )}
                  {weather.tMin <= 10 && (
                    <View className="chip">
                      <Icon name="flame" size={14} gap={4} />
                      <Text>注意保暖</Text>
                    </View>
                  )}
                </View>
              )}
              {/* 天气陪伴卡通：雨天打伞小狗，其余太阳蛋 */}
              <Image
                className="weather-animal"
                src={weather.rainProb >= 40 ? weatherRain : weatherSun}
                mode="aspectFit"
              />
            </>
          ) : (
            <Text className="sub">{weatherLoading ? '天气加载中…' : '天气获取失败，点右上角重试'}</Text>
          )
        ) : (
          <View className="row-between">
            <Text className="sub">开启定位后自动显示当地天气</Text>
            <View className="row">
              <View className="btn ghost small" onClick={detectLocation}>
                <Icon name="pin" size={12} gap={4} />开启定位
              </View>
              <View className="btn ghost small" onClick={() => setLocOpen(true)}>
                手动选择
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 吃饭 + 喝水：一行双卡 */}
      <View className="pair-row">
        {/* 吃饭卡：左上三餐说明 + 空白处距下一餐倒计时 + 右下小动物；点击去「吃什么」 */}
        <View
          className="pair-card meal-card"
          onClick={() => Taro.navigateTo({ url: '/pages/food/index' })}
        >
          <View className="meal-lines">
            {meals.map((m) => (
              <Text key={m.key} className={`meal-line${dayLog.meals[m.key] ? ' on' : ''}`}>
                {m.emoji} {m.label} {m.time}
                {dayLog.meals[m.key] ? ' ✓' : ''}
              </Text>
            ))}
          </View>
          <View className="meal-count">
            <MealCountdown label={mealFocus.label} target={mealTargetMs} due={mealDueNow} />
            {data.foodLog[today]?.[mealFocus.key as MealSlot] && (
              <Text className="meal-small">
                今天吃「{data.foodLog[today]?.[mealFocus.key as MealSlot]}」
              </Text>
            )}
          </View>
          <Image className="meal-animal" src={animalEat} mode="aspectFit" />
        </View>

        {/* 喝水卡：整卡可点唤起小考弹窗（空水杯 + 每喝一杯水位上涨） */}
        <View
          className={`pair-card water-card${waterDue ? ' due' : ''}`}
          onClick={openWaterQuiz}
        >
          <Text className="water-title">喝水</Text>
          <View className="cup-wrap">
            <View className="cup">
              <View
                className={`cup-fill${dayLog.water.length ? ' has-water' : ''}`}
                style={{
                  height: `${Math.min(100, (dayLog.water.length / data.settings.water.targetCups) * 100)}%`,
                }}
              />
            </View>
            <View className="water-meta">
              <Text className="water-count">
                {dayLog.water.length}/{data.settings.water.targetCups} 杯
              </Text>
              <Text className={`water-status${waterDue ? ' warn' : ''}`}>
                {waterDue ? '该喝水啦' : '记得多喝水'}
              </Text>
            </View>
          </View>
          <View className="water-guide">
            <Text>点击卡片答题</Text>
            <Icon name="arrow-up" size={12} className="water-guide-arrow" />
          </View>
          <Image className="water-animal" src={animalWater} mode="aspectFit" />
        </View>
      </View>

      {/* 今日复习闪卡：笔记 + 💧 喝水错题混合队列 */}
      {curCard ? (
        <View className="card">
          <View className="card-title">
            {curCard.kind === 'quiz' ? (
              <>
                <Icon name="book" size={16} gap={4} />
                <Text>错题复习</Text>
              </>
            ) : (
              <>
                <Icon name="brain" size={16} gap={4} />
                <Text>今日复习</Text>
              </>
            )}
            <Text className="sub">
              {Math.min(reviewDone + 1, reviewTotal)}/{reviewTotal} · 第{' '}
              {noteReviewState(curCard.kind === 'note' ? curCard.note : curCard.wrong).reps + 1}{' '}
              次复习
            </Text>
          </View>
          <View
            className="flashcard"
            key={curCard.kind === 'note' ? curCard.note.id : `quiz-${curCard.wrong.quizId}`}
            onClick={() => setFlipped((v) => !v)}
          >
            <View className={`flash-inner ${flipped ? 'flipped' : ''}`}>
              {curCard.kind === 'note' ? (
                <>
                  <View className="flash-face flash-front">
                    <Text className="flash-text">{curCard.note.text}</Text>
                    <Text className="flash-hint">尽力回忆要点，点击翻面</Text>
                  </View>
                  <View className="flash-face flash-back">
                    <View className="sub" style={{ marginBottom: 4, textAlign: 'center' }}>
                      {curCard.note.tags.map((t) => (
                        <Text className="tag" key={t}>
                          {t}
                        </Text>
                      ))}
                      记录于 {new Date(curCard.note.createdAt).toLocaleDateString('zh-CN')}
                    </View>
                    {ratingBtns}
                  </View>
                </>
              ) : curQuiz ? (
                <>
                  <View className="flash-face flash-front">
                    <Text className="flash-text">{curQuiz.q}</Text>
                    <Text className="flash-hint">曾答错 {curCard.wrong.wrongCount} 次 · 点击翻面对答案</Text>
                  </View>
                  <View className="flash-face flash-back">
                    <View className="sub" style={{ marginBottom: 6, textAlign: 'center' }}>
                      <View className="chip success">
                        <Icon name="check" size={12} gap={4} />
                        <Text>{curQuiz.options[curQuiz.answer]}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 16, marginBottom: 10 }}>{curQuiz.explain}</Text>
                    {ratingBtns}
                  </View>
                </>
              ) : null}
            </View>
          </View>
          {reviewOverflow > 0 && (
            <Text className="note-sub" style={{ marginTop: 6 }}>
              今日上限 {REVIEW_DAILY_LIMIT} 张，另有 {reviewOverflow} 张顺延至明天
            </Text>
          )}
        </View>
      ) : reviewDone > 0 ? (
        <View className="card state-card">
          <View className="emoji-badge">
            <Text className="emoji">🎉</Text>
          </View>
          <Text className="empty">今日复习完成，明天见！</Text>
          {reviewOverflow > 0 && (
            <Text className="note-sub">另有 {reviewOverflow} 张到期卡片顺延至明天</Text>
          )}
        </View>
      ) : reviewPool > 0 ? (
        <View className="card state-card">
          <View className="emoji-badge">
            <Text className="emoji">🧠</Text>
          </View>
          <Text className="empty">今日无待复习卡片（池中共 {reviewPool} 张）</Text>
          <Image className="state-animal" src={animalEmpty} mode="aspectFit" />
        </View>
      ) : null}

      {/* 今日事项卡（上）：考试节点（到期置顶）→ 重要日期（提醒窗口内）→ 待办（逾期在前）→ 周期提醒（该做了）。
          超过 5 条固定高度卡内滑动；行点开原地展开子任务，勾选圈完成弹撤销，左滑删除 */}
      <View className="card">
        <View className="tb-head">
          <Icon name="pushpin" size={16} gap={4} />
          <Text className="tb-title">今日事项</Text>
          <Text className="tb-count">{mattersLeft} 项</Text>
          {/* 卡头常驻加号：随时弹三选弹窗添加（不再只有空态才有入口） */}
          <View className="tb-head-add" onClick={() => setChoiceOpen(true)}>
            <Icon name="plus" size={16} color="#be5016" />
          </View>
        </View>
        {matters.length === 0 ? (
          // 空态三件套：卡通 + 一句话 + 圆加号；点加号 / 点卡弹「三选弹窗」选类型去添加
          <View className="tb-empty" onClick={() => setChoiceOpen(true)}>
            <Image className="tb-empty-img" src={animalEmpty} mode="aspectFit" />
            <Text className="tb-empty-text">今天没有安排，加一个？</Text>
            <View
              className="tb-add-btn"
              onClick={(e) => {
                e.stopPropagation()
                setChoiceOpen(true)
              }}
            >
              <Text>+</Text>
            </View>
          </View>
        ) : (
          <ScrollView
            scrollY
            className="task-list tb-matters"
            style={mattersH ? { height: mattersH } : undefined}
          >
            {matters.map((m, i) => {
              const tone = i % 5
              // 考试节点行（置顶组）：勾选圈=标记节点完成，meta=来源考试 + 今天/逾期 N 天
              if (m.kind === 'node') {
                return (
                  <TaskRow
                    key={`node-${m.examId}-${m.m.id}`}
                    tone={tone}
                    icon="🎯"
                    name={m.m.label}
                    meta={
                      <>
                        <Text className="tpill">{m.examName}</Text>
                        <Text className={`tpill next${m.left === 0 ? ' today' : ' warn'}`}>
                          {m.left === 0 ? '节点·今天' : `节点·逾期 ${-m.left} 天`}
                        </Text>
                      </>
                    }
                    onToggleCheck={() => toggleMilestone(m.examId, m.m)}
                  />
                )
              }
              // 重要日期行：勾选圈=「知道了」（当天沉底显示完成态），meta=倒计时 / 当天 / 已过 N 天胶囊
              if (m.kind === 'date') {
                return (
                  <TaskRow
                    key={`date-${m.d.id}`}
                    tone={tone}
                    done={m.acked}
                    icon="📌"
                    name={m.d.name}
                    meta={
                      <Text
                        className={`tpill next${m.left === 0 ? ' today' : m.left < 0 ? ' warn' : ''}`}
                      >
                        {m.left === 0 ? '就是今天' : m.left > 0 ? `还剩 ${m.left} 天` : `已过 ${-m.left} 天`}
                      </Text>
                    }
                    onToggleCheck={() => toggleDateAck(m.d)}
                    onDelete={() =>
                      removeMatter('删除该重要日期？', () =>
                        set('dates', (prev) => prev.filter((x) => x.id !== m.d.id))
                      )
                    }
                  />
                )
              }
              // 待办行：优先级胶囊 + 日期胶囊（逾期红标 / 今天高亮）；子任务原地展开可勾
              if (m.kind === 'todo') {
                const t = m.t
                const kids = t.children ?? []
                const over = !!t.dueDate && t.dueDate < today
                const expanded = expandedIds.has(`todo-${t.id}`)
                return (
                  <TaskRow
                    key={`todo-${t.id}`}
                    tone={tone}
                    done={isTodoDoneToday(t, today)}
                    name={t.text}
                    meta={
                      <>
                        <Text className={`prio-pill p${t.priority ?? 2}`}>
                          {PRIO_LABEL[t.priority ?? 2]}
                        </Text>
                        {over ? (
                          <Text className="tpill warn">逾期 {fmtDateShort(t.dueDate!)}</Text>
                        ) : (
                          <Text className="tpill next today">今天</Text>
                        )}
                      </>
                    }
                    expandable={kids.length > 0}
                    expanded={expanded}
                    onRowClick={() => toggleExpand(`todo-${t.id}`)}
                    onArrowClick={() => toggleExpand(`todo-${t.id}`)}
                    onToggleCheck={() => toggleTodo(t)}
                    onDelete={() =>
                      removeMatter('删除该待办？', () =>
                        set('todos', (prev) => prev.filter((x) => x.id !== t.id))
                      )
                    }
                  >
                    {kids.map((c) => (
                      <ChildRow
                        key={c.id}
                        name={c.text}
                        done={c.done}
                        depth={1}
                        onToggle={() => toggleTodoChild(t, c.id)}
                        onRename={(n) => renameTodoChild(t, c.id, n)}
                        onDelete={() => removeMatter('删除该子任务？', () => removeTodoChild(t, c.id))}
                      />
                    ))}
                  </TaskRow>
                )
              }
              // 周期提醒行：勾选圈=今天做完（重置周期），meta=「该做了！」
              return (
                <TaskRow
                  key={`periodic-${m.p.id}`}
                  tone={tone}
                  icon="🔁"
                  name={m.p.name}
                  meta={<Text className="tpill next today">该做了！</Text>}
                  onToggleCheck={() => completePeriodic(m.p)}
                  onDelete={() =>
                    removeMatter('删除该周期提醒？', () =>
                      set('periodic', (prev) => prev.filter((x) => x.id !== m.p.id))
                    )
                  }
                />
              )
            })}
          </ScrollView>
        )}
      </View>

      {/* 今日打卡卡（下）：今天轮到的打卡项（完成后沉底），与打卡页统一排序；
          空态点卡片去打卡页（打卡项是 tab 页，switchTab 跳转） */}
      <View className="card">
        <View className="tb-head">
          <Icon name="check-square" size={16} gap={4} />
          <Text className="tb-title">今日打卡</Text>
          <Text className="tb-count">
            {ckDue.filter((it) => isItemDone(it, todayChecked)).length}/{ckDue.length}
          </Text>
        </View>
        {ckDue.length === 0 ? (
          data.checkinItems.length === 0 ? (
            // 一个打卡项都没有：卡通空态，点卡片去打卡页添加
            <View
              className="tb-empty"
              onClick={() => Taro.switchTab({ url: '/pages/checkin/index' })}
            >
              <Image className="tb-empty-img" src={animalEmpty} mode="aspectFit" />
              <Text className="tb-empty-text">今天没有要打卡的</Text>
            </View>
          ) : (
            // 有打卡项但今天不轮到：小空态，点「打卡页」跳过去看看
            <View className="tb-empty-mini">
              <Text>今天没有要打卡的，去</Text>
              <Text className="link" onClick={() => Taro.switchTab({ url: '/pages/checkin/index' })}>
                打卡页
              </Text>
              <Text>看看</Text>
            </View>
          )
        ) : (
          <ScrollView
            scrollY
            className="task-list tb-checkins"
            style={ckListH ? { height: ckListH } : undefined}
          >
            {ckDue.map((it, i) => {
              const done = isItemDone(it, todayChecked)
              const hasKids = (it.children ?? []).length > 0
              const prog = hasKids ? leafProgress(it, todayChecked) : null
              const ft = freqText(it)
              const expanded = expandedIds.has(`ck-${it.id}`)
              return (
                <TaskRow
                  key={it.id}
                  tone={i % 5}
                  done={done}
                  icon={it.emoji || autoEmoji(it.name)}
                  name={it.name}
                  meta={
                    <>
                      {prog ? (
                        <Text className="tpill prog">
                          {prog.done}/{prog.total}
                        </Text>
                      ) : null}
                      {ft ? <Text className="tpill freq">{ft}</Text> : null}
                    </>
                  }
                  expandable={hasKids}
                  expanded={expanded}
                  onRowClick={() => toggleExpand(`ck-${it.id}`)}
                  onArrowClick={() => toggleExpand(`ck-${it.id}`)}
                  onToggleCheck={() => toggleCheckinItem(it)}
                  onDelete={() =>
                    removeMatter('删除该打卡项？', () =>
                      set('checkinItems', (prev) => prev.filter((x) => x.id !== it.id))
                    )
                  }
                >
                  {flattenLeaves(it).map((leaf) => {
                    // 叶子即项本身（无子项）时不给改名/删除入口；嵌套子项可原地改名、删除
                    const nested = leaf.id !== it.id
                    return (
                      <ChildRow
                        key={leaf.id}
                        name={leaf.name}
                        emoji={leaf.emoji}
                        done={todayChecked.includes(leaf.id)}
                        depth={1 + leaf.depth}
                        onToggle={() => toggleCheckinLeaf(it, leaf.id)}
                        onRename={nested ? (n) => renameCheckinLeaf(it, leaf.id, n) : undefined}
                        onDelete={
                          nested
                            ? () =>
                                removeMatter('删除该子打卡项？', () => removeCheckinLeaf(it, leaf.id))
                            : undefined
                        }
                      />
                    )
                  })}
                </TaskRow>
              )
            })}
          </ScrollView>
        )}
      </View>

      {/* 睡眠督促：仅 19:30 后显示（固定区尾部） */}
      {showSleep && (
        <View className={`card sleep-card${sleepDue ? ' due' : ''}`}>
          <View className="hero-tip">
            <View style={{ flex: 1 }}>
              <View className="row-between">
                <Text>睡眠督促</Text>
                <Text className={sleepDue ? 'chip warn' : 'sub'}>
                  {sleepDue ? '该睡觉了，别刷手机！' : '距睡觉还有 ' + fmtHM(Math.max(0, sleepMin - minute))}
                </Text>
              </View>
              <Text className="sub" style={{ marginTop: 4 }}>
                目标：{data.settings.wake} 起床 · {data.settings.sleep} 睡觉
              </Text>
            </View>
          </View>
          <Image className="sleep-animal" src={animalSleep} mode="aspectFit" />
        </View>
      )}

      {/* 位置设置弹窗：自动检测定位 + 手动搜索（支持区县） */}
      {locOpen && (
        <Modal variant="center" closeOnMask={false} onClose={() => setLocOpen(false)}>
          <View className="card-title">
            <Icon name="pin" size={16} gap={4} />
            <Text>所在位置</Text>
            <View className="quiz-close" onClick={() => setLocOpen(false)}>
              <Icon name="x" size={16} />
            </View>
          </View>
          {data.settings.city && (
            <Text className="sub loc-cur">
              当前：{cityLabel(data.settings.city)}
            </Text>
          )}
          <View
            className={`btn${locDetecting ? ' is-disabled' : ''}`}
            style={{ width: '100%' }}
            onClick={() => void detectLocation()}
          >
            <Icon name="signal" size={12} gap={4} />
            {locDetecting ? '定位中…' : '自动检测当前位置'}
          </View>
          <Text className="sub loc-divider">
            或手动搜索（支持区县级，如 洛龙区）
          </Text>
          <View className="form-row">
            <View className="field" style={{ flex: 1, marginBottom: 0 }}>
              <Input
                placeholder="城市 / 区县名"
                value={locQuery}
                onInput={(e) => setLocQuery(e.detail.value)}
                onConfirm={() => void searchLoc()}
              />
            </View>
            <View
              className={`btn small${locSearching ? ' is-disabled' : ''}`}
              onClick={() => {
                if (!locSearching) void searchLoc()
              }}
            >
              {locSearching ? '搜索中…' : '搜索'}
            </View>
          </View>
          {locCands.length > 0 && (
            <View className="loc-cands">
              {locCands.map((c, i) => (
                <View className="list-item" key={i} onClick={() => applyCity(c)}>
                  <Text className="grow">
                    {cityLabel(c)} <Text className="sub">{c.province}</Text>
                  </Text>
                  <Text className="sub">›</Text>
                </View>
              ))}
            </View>
          )}
        </Modal>
      )}

      {/* 常识判断喝水题弹窗：先选中后提交，✕ 关闭不打卡（关闭时提示不计入） */}
      {waterQuiz && (
        <Modal variant="center" className="quiz-modal" closeOnMask={false} onClose={() => setWaterQuiz(null)}>
          <View className="card-title">
            <Icon name="droplet" size={16} gap={4} />
            <Text>喝水小考 · 常识判断</Text>
            <View
              className="quiz-close"
              onClick={() => {
                setWaterQuiz(null)
                showToast('已关闭，本次未计入喝水打卡')
              }}
            >
              <Icon name="x" size={16} />
            </View>
          </View>
          <View className="quiz-q">{waterQuiz.q}</View>
          <View className="quiz-opts">
            {waterQuiz.options.map((opt, i) => {
              const answered = quizSubmitted || quizRevealed
              const state = quizPicked === i && !answered
                ? 'sel'
                : !answered
                  ? ''
                  : i === waterQuiz.answer
                    ? 'correct'
                    : quizPicked === i
                      ? 'wrong'
                      : ''
              return (
                <View
                  key={i}
                  className={`quiz-opt ${state}`}
                  onClick={() => {
                    if (!answered) setQuizPicked(i)
                  }}
                >
                  <Text className="grow">{opt}</Text>
                  {answered && i === waterQuiz.answer && (
                    <Icon name="check" size={14} color="#2f9e6e" className="opt-mark" />
                  )}
                  {answered && quizPicked === i && i !== waterQuiz.answer && (
                    <Icon name="x" size={14} color="#c0392b" className="opt-mark" />
                  )}
                  {!answered && quizPicked === i && (
                    <Icon name="check" size={14} color="#be5016" className="opt-mark pick" />
                  )}
                </View>
              )
            })}
          </View>
          {!quizSubmitted && !quizRevealed && (
            <View className="row" style={{ marginTop: 12, gap: 8 }}>
              <View
                className={`btn${quizPicked === null ? ' is-disabled' : ''}`}
                style={{ flex: 1 }}
                onClick={() => {
                  if (quizPicked !== null) {
                    setQuizSubmitted(true)
                    settleQuiz(quizPicked, false)
                  }
                }}
              >
                提交答案
              </View>
              <View
                className="btn ghost"
                style={{ flex: 1 }}
                onClick={() => {
                  setQuizRevealed(true)
                  settleQuiz(null, true)
                }}
              >
                直接看答案
              </View>
            </View>
          )}
          {(quizSubmitted || quizRevealed) && (
            <View className="quiz-explain">
              <View style={{ fontWeight: 700, marginBottom: 4 }}>
                {quizSubmitted ? (
                  quizPicked === waterQuiz.answer ? (
                    <>
                      <Icon name="check-square" size={16} color="#2f9e6e" gap={4} />
                      <Text>答对了！</Text>
                    </>
                  ) : (
                    <>
                      <Icon name="x-circle" size={16} color="#c0392b" gap={4} />
                      <Text>答错了，正确答案已标绿</Text>
                    </>
                  )
                ) : (
                  <>
                    <Icon name="pushpin" size={16} gap={4} />
                    <Text>正确答案已标绿</Text>
                  </>
                )}
              </View>
              <Text className="sub">{waterQuiz.explain}</Text>
              {(quizRevealed || (quizSubmitted && quizPicked !== waterQuiz.answer)) && (
                <View className="quiz-note">
                  <Icon name="book" size={12} gap={4} />
                  <Text className="note-sub">已记入错题本，将按记忆曲线安排复习</Text>
                </View>
              )}
              <View
                className="btn small"
                style={{ marginTop: 10, width: '100%' }}
                onClick={recordWater}
              >
                <Icon name="droplet" size={12} gap={4} />记录喝水
              </View>
            </View>
          )}
        </Modal>
      )}

      {/* 三选弹窗（居中）：今日事项卡头加号 / 空态点击弹出，选类型跳对应管理页添加 */}
      {choiceOpen && (
        <Modal variant="center" onClose={() => setChoiceOpen(false)}>
          <Image className="choice-sheet-img" src={animalHappy} mode="aspectFit" />
          <Text className="choice-sheet-title">要记点什么？</Text>
          {CHOICE_OPTS.map((o) => (
            <View
              key={o.title}
              className="choice-opt"
              onClick={() => {
                setChoiceOpen(false)
                Taro.navigateTo({ url: o.url })
              }}
            >
              <View className="choice-emoji">
                <Text>{o.emoji}</Text>
              </View>
              <View className="choice-info">
                <Text className="choice-opt-title">{o.title}</Text>
                <Text className="choice-opt-desc">{o.desc}</Text>
              </View>
              <Icon name="arrow-right" size={16} color="#b0a697" className="choice-arrow" />
            </View>
          ))}
          <View
            className="btn ghost"
            style={{ marginTop: 12, width: '100%' }}
            onClick={() => setChoiceOpen(false)}
          >
            取消
          </View>
        </Modal>
      )}
    </View>
  )
}
