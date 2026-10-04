// 数据规范化：DEFAULTS + mergeWithDefaults（迁移自 PWA store.tsx）
// 职责：远端快照/本地沙盒数据 → 结构完备的 AppData（旧格式迁移 + 字段兜底）
import Taro from '@tarojs/taro'
import type { AppData, CheckinChild, CheckinFreq, CheckinItem, CondType, FoodItem, LedgerCategory, LedgerEntry, MealSlot, Note, NoteTag, QuizBook, Reward, Settings, TasteTag } from '../types'
import { DEFAULT_SETTINGS } from '../types'
import { DEFAULT_FOODS } from '../constants/foods'
import { DEFAULT_LEDGER_CATS } from '../constants/categories'
import { DEFAULT_NOTE_TAGS } from '../constants/notes'
import { PRESET_REWARDS } from '../utils/rewards'
import { noteReviewState } from '../utils/review'
import { uid } from '../utils/date'

export const DEFAULTS: AppData = {
  settings: DEFAULT_SETTINGS,
  foods: DEFAULT_FOODS.map((f) => ({ ...f })),
  budget: 0,
  foodLog: {},
  exams: [],
  courses: [],
  checkinItems: [
    { id: 'item-ke', name: '听录播课', emoji: '🎧', category: '行测', level: 'core', freq: 'daily' },
    { id: 'item-ti', name: '刷题练笔', emoji: '✍️', category: '行测', level: 'core', freq: 'daily' },
    { id: 'item-du', name: '晨读积累', emoji: '📖', category: '申论', level: 'normal', freq: 'daily' },
  ],
  checkins: {},
  moods: {},
  rewards: PRESET_REWARDS.map((r) => ({ ...r })),
  todos: [],
  ledger: [],
  periodic: [],
  dates: [],
  notes: [],
  noteTags: DEFAULT_NOTE_TAGS.map((t) => ({ ...t })),
  threeThings: {},
  dayLogs: {},
  pomodoroLogs: [],
  quizBook: { stats: { answered: 0, wrong: 0 }, wrongs: [] },
  ledgerCats: {
    expense: DEFAULT_LEDGER_CATS.expense.map((c) => ({ ...c })),
    income: DEFAULT_LEDGER_CATS.income.map((c) => ({ ...c })),
  },
}

/**
 * 奖励条件字段迁移：旧版 targetDays → condType:'streak'/condParam；
 * 4 个隐藏预设旧 id（targetDays=0 时代无条件字段）按已知条件映射；
 * 非任务型（如 grant-* 发券）保持无条件字段。
 */
function condOf(r: Reward): { condType?: CondType; condParam?: number } {
  const legacy = r as Reward & { targetDays?: number }
  const valid: CondType[] = ['streak', 'total_full', 'weekend_full', 'mood3', 'pomo_day']
  if (r.condType && valid.includes(r.condType)) {
    return { condType: r.condType, condParam: typeof r.condParam === 'number' ? r.condParam : 0 }
  }
  const preset: Record<string, { condType: CondType; condParam: number }> = {
    'rw-hidden-weekend': { condType: 'weekend_full', condParam: 0 },
    'rw-hidden-mood': { condType: 'mood3', condParam: 3 },
    'rw-hidden-pomo': { condType: 'pomo_day', condParam: 3 },
    'rw-hidden-30': { condType: 'total_full', condParam: 30 },
  }
  if (preset[r.id]) return preset[r.id]
  if (typeof legacy.targetDays === 'number') {
    return { condType: 'streak', condParam: legacy.targetDays }
  }
  return { condType: undefined, condParam: undefined }
}

/**
 * 合并默认值与已存储数据（兼容 PWA 历史数据格式迁移）。
 * 与后端契约关系：GET /data/snapshot 的分域 JSON 直接传入即可。
 *
 * 快照来源不可控（本地存储 / 服务端 / 旧 PWA 导入 / admin_import 裸写），
 * 域值可能是 null、错型或夹带脏条目。本函数是系统边界：任何脏数据都必须
 * 清洗回退，绝不抛异常——一旦抛出会走 store bootstrap 的 catch 兜底，
 * 整包数据被替换为 DEFAULTS；而 null 穿透更会让对应页面渲染期崩溃白屏。
 */
const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

/** 数组域清洗：只保留对象条目（null/原始值等脏条目丢弃） */
const objs = <T>(v: unknown): T[] => (Array.isArray(v) ? (v.filter(isObj) as T[]) : [])

/** 映射域清洗：只保留值为对象的键 */
function objMap(v: unknown): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  if (isObj(v)) for (const [k, x] of Object.entries(v)) if (isObj(x)) out[k] = x
  return out
}

export function mergeWithDefaults(stored: Record<string, unknown>): AppData {
  const src = isObj(stored) ? stored : {}
  const out = { ...DEFAULTS } as Record<string, unknown>
  for (const key of Object.keys(DEFAULTS)) {
    const v = src[key]
    // 缺失 / null / 错型 → 回退默认（null 穿透是页面白屏的直接来源）
    if (v === undefined || v === null) continue
    const d = (DEFAULTS as unknown as Record<string, unknown>)[key]
    if (Array.isArray(d)) {
      if (Array.isArray(v)) out[key] = v
    } else if (isObj(d)) {
      if (isObj(v)) out[key] = v
    } else {
      out[key] = v
    }
  }
  out.budget = Number(out.budget) || 0
  // 映射域清洗：moods/checkins/foodLog/threeThings/dayLogs 值必须是对象
  out.moods = objMap(out.moods)
  out.checkins = objMap(out.checkins)
  out.foodLog = objMap(out.foodLog)
  out.threeThings = objMap(out.threeThings)
  out.dayLogs = objMap(out.dayLogs)
  // 旧版 foods 是 string[]，迁移为按餐次建模的 FoodItem[]
  const foodsArr = Array.isArray(out.foods) ? (out.foods as unknown[]) : []
  if (foodsArr.some((x) => typeof x === 'string')) {
    out.foods = foodsArr
      .filter((x): x is string => typeof x === 'string')
      .map((name) => ({
        id: 'food-m-' + name,
        name,
        emoji: '🍽',
        slots: ['lunch', 'dinner'] as MealSlot[],
        tags: [] as TasteTag[],
      }))
  }
  // 条目清洗 + 旧版 FoodItem 无 emoji 补默认值；空库兜底默认食物库（guest fixtures 依赖此规则）
  const foods = objs<FoodItem>(out.foods)
  out.foods =
    foods.length > 0 ? foods.map((x) => ({ ...x, emoji: x.emoji || '🍽' })) : DEFAULTS.foods.map((f) => ({ ...f }))
  // 旧版 ledger 无 type，视为 expense；条目清洗 + 字段归一（toFixed/字符串键依赖字段类型）
  out.ledger = objs<LedgerEntry>(out.ledger).map((l) => ({
    ...l,
    id: typeof l.id === 'string' && l.id ? l.id : uid(),
    date: typeof l.date === 'string' ? l.date : '',
    amount: Number(l.amount) || 0,
    type: l.type === 'income' ? 'income' : 'expense',
    category: typeof l.category === 'string' && l.category ? l.category : '其他',
    note: typeof l.note === 'string' ? l.note : '',
  }))
  // 打卡项迁移：level 无值时按旧 severity 推断（high→core / low→flex），freq 六模式归一；
  // weekly 落打卡日 freqDays（0=周日…6=周六），monthlyDays 落打卡日期（1-31），N 次模式落 freqCount；
  // 旧「每周 N 次」无打卡日时按次数折算 freqDays；severity/freqTimes 均为 @deprecated 兼容字段，推断完成后统一剥除
  const fillChild = (c: CheckinChild): CheckinChild => ({
    ...c,
    children: objs<CheckinChild>(c.children).map(fillChild),
  })
  // 旧「每周 N 次」→ 打卡日组合：尽量均匀分布在一周（1→一；3→一三五…）
  const LEGACY_TIMES_TO_DAYS: Record<number, number[]> = {
    1: [1],
    2: [1, 4],
    3: [1, 3, 5],
    4: [1, 2, 4, 5],
    5: [1, 2, 3, 4, 5],
    6: [1, 2, 3, 4, 5, 6],
  }
  // 合法频率枚举（未知值兜底 daily）
  const FREQS: CheckinFreq[] = ['daily', 'weekly', 'weeklyN', 'monthlyN', 'monthlyDays', 'dailyN']
  // N 次模式的默认次数兜底
  const DEFAULT_FREQ_COUNT: Record<string, number> = { weeklyN: 3, monthlyN: 10, dailyN: 2 }
  out.checkinItems = objs<CheckinItem>(out.checkinItems).map(({ severity, children, freqTimes, ...it }) => {
    const freq = FREQS.includes(it.freq as CheckinFreq) ? (it.freq as CheckinFreq) : 'daily'
    const uniqSorted = (arr: unknown, min: number, max: number): number[] =>
      Array.isArray(arr)
        ? [...new Set<number>(arr.filter((d): d is number => Number.isInteger(d) && d >= min && d <= max))].sort((a, b) => a - b)
        : []
    const weekDays = uniqSorted(it.freqDays, 0, 6)
    const monthDates = uniqSorted(it.freqDays, 1, 31)
    return {
      ...it,
      level: it.level ?? (severity === 'high' ? 'core' : severity === 'low' ? 'flex' : 'normal'),
      freq,
      freqDays:
        freq === 'weekly'
          ? weekDays.length > 0
            ? weekDays
            : LEGACY_TIMES_TO_DAYS[Math.min(6, Math.max(1, Math.round(freqTimes ?? 3)))]
          : freq === 'monthlyDays'
            ? monthDates.length > 0
              ? monthDates
              : [1]
            : undefined,
      freqCount: DEFAULT_FREQ_COUNT[freq]
        ? Math.min(99, Math.max(1, Math.round(it.freqCount ?? DEFAULT_FREQ_COUNT[freq])))
        : undefined,
      children: objs<CheckinChild>(children).map(fillChild),
    }
  })
  // 旧版 notes 无复习字段 → 默认不进复习池（nextReviewDate: null）；
  // 有 reviewStep 无 review（FSRS 状态）时由 reviewStep 推导迁移
  out.notes = objs<Note>(out.notes).map((n) => {
    const reviewStep = typeof n.reviewStep === 'number' ? n.reviewStep : 0
    return {
      ...n,
      nextReviewDate: typeof n.nextReviewDate === 'number' ? n.nextReviewDate : null,
      reviewStep,
      review: n.review || noteReviewState({ reviewStep }),
    }
  })
  // 笔记标签：stored 缺失/空 → 默认；存在则防御数组与条目（名称必须为非空字符串）
  const noteTags = objs<NoteTag>(out.noteTags).filter((t) => typeof t.name === 'string' && !!t.name)
  out.noteTags = noteTags.length > 0 ? noteTags : DEFAULT_NOTE_TAGS.map((t) => ({ ...t }))
  // 其余记录数组域清洗（防 null 条目让页面 map/filter 崩溃）
  out.exams = objs(out.exams)
  out.courses = objs(out.courses)
  out.todos = objs(out.todos)
  out.periodic = objs(out.periodic)
  out.dates = objs(out.dates)
  // 番茄钟记录：条目清洗 + 字段归一
  out.pomodoroLogs = objs<{ date?: unknown; minutes?: unknown; endedAt?: unknown; task?: unknown }>(
    out.pomodoroLogs
  ).map((l) => ({
    ...l,
    date: typeof l.date === 'string' ? l.date : '',
    minutes: Number(l.minutes) || 0,
    endedAt: Number(l.endedAt) || 0,
    task: typeof l.task === 'string' ? l.task : undefined,
  }))
  // 错题本防御：缺失/畸形 → 默认；存在则补全 stats 与 wrongs 数组
  const qb = isObj(out.quizBook) ? (out.quizBook as Partial<QuizBook>) : undefined
  out.quizBook = {
    stats: {
      answered: Number(qb?.stats?.answered) || 0,
      wrong: Number(qb?.stats?.wrong) || 0,
    },
    wrongs: objs(qb?.wrongs),
  }
  // 记账分类：stored 缺失/空 → 默认（存量用户由此补齐收入 2 行）；存在则防御数组与条目
  const lc = isObj(out.ledgerCats)
    ? (out.ledgerCats as Partial<{ expense: LedgerCategory[]; income: LedgerCategory[] }>)
    : undefined
  const cats = (v: unknown) =>
    objs<LedgerCategory>(v)
      .filter((c) => typeof c.name === 'string' && !!c.name)
      .map((c) => ({ ...c, emoji: typeof c.emoji === 'string' ? c.emoji : '💳' }))
  const expense = cats(lc?.expense)
  const income = cats(lc?.income)
  out.ledgerCats = {
    expense: expense.length > 0 ? expense : DEFAULT_LEDGER_CATS.expense.map((c) => ({ ...c })),
    income: income.length > 0 ? income : DEFAULT_LEDGER_CATS.income.map((c) => ({ ...c })),
  }
  // 奖励池迁移：旧 Reward 补全新字段；空池首次 seed（kg_rewards_seeded 标记，替代原 localStorage）
  const rewards = objs<Reward>(out.rewards)
  if (rewards.length === 0 && !Taro.getStorageSync('kg_rewards_seeded')) {
    rewards.push(...PRESET_REWARDS.map((r) => ({ ...r })))
  }
  Taro.setStorageSync('kg_rewards_seeded', '1')
  out.rewards = rewards.map((r) => {
    const legacy = typeof (r as { claimed?: boolean }).claimed === 'boolean' && typeof r.granted === 'undefined'
    return {
      ...r,
      desc: typeof r.desc === 'string' ? r.desc : '',
      emoji: typeof r.emoji === 'string' ? r.emoji : '🎁',
      hidden: typeof r.hidden === 'boolean' ? r.hidden : false,
      granted: typeof r.granted === 'boolean' ? r.granted : !!r.claimed,
      mode: r.mode === 'code' ? 'code' : 'auto',
      used: typeof r.used === 'boolean' ? r.used : legacy ? !!r.claimed : false,
      ...condOf(r),
    }
  })
  // settings 深合并，保证新增字段（含 intel 智能推荐偏好）有默认值
  const s = (isObj(out.settings) ? out.settings : {}) as Partial<Settings>
  const mergedSettings: Settings = {
    ...DEFAULT_SETTINGS,
    ...s,
    meals: { ...DEFAULT_SETTINGS.meals, ...(isObj(s.meals) ? s.meals : {}) },
    water: { ...DEFAULT_SETTINGS.water, ...(isObj(s.water) ? s.water : {}) },
    city: typeof s.city === 'string' ? s.city : null,
    citySource: s.citySource === 'manual' ? 'manual' : 'auto',
    intel: { ...DEFAULT_SETTINGS.intel!, ...(isObj(s.intel) ? s.intel : {}) },
  }
  delete (mergedSettings as Partial<Settings> & { sedentaryMin?: number }).sedentaryMin // 久坐提醒已移除
  out.settings = mergedSettings
  return out as unknown as AppData
}
