// 全局业务数据模型 —— 与后端 API 契约的数据模型一致（后端 MySQL user_data 按域存 JSON）
// 由原 PWA store.tsx 迁移：删除 aiKey / sync / quotes 三个域，其余 18 个域结构不变

// ---- 角色与鉴权（角色由后端判定：白名单→user；陌生 OpenID→guest 不落库） ----
export type Role = 'user' | 'guest'

// ---- 吃什么 ----
export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'supper'
export type TasteTag = '清淡' | '辣' | '快餐' | '饱腹'

export interface FoodItem {
  id: string
  name: string
  emoji: string
  slots: MealSlot[]
  tags: TasteTag[]
  fav?: boolean
}

// ---- 设置 ----
export interface Settings {
  wake: string
  sleep: string
  meals: { breakfast: string; lunch: string; dinner: string }
  water: { intervalMin: number; targetCups: number }
  city: { name: string; province?: string; city?: string; lat: number; lon: number } | null
  pomoMinutes?: number // 番茄钟自定义时长（分钟），空 = 用预设 25
  /** 智能推荐偏好（替代原 aiKey：模型 Key 已上云，端侧只留开关与口味偏好） */
  intel?: { enabled: boolean; tastes: TasteTag[] }
}

export const DEFAULT_SETTINGS: Settings = {
  wake: '07:00',
  sleep: '23:30',
  meals: { breakfast: '08:00', lunch: '12:00', dinner: '18:30' },
  water: { intervalMin: 90, targetCups: 8 },
  city: { name: '许昌', province: '河南', lat: 34.035, lon: 113.853 },
  intel: { enabled: true, tastes: [] }
}

// ---- 考试与课程 ----
export interface Milestone {
  id: string
  label: string
  date: string
  done: boolean
}
export interface Exam {
  id: string
  name: string
  date: string
  milestones: Milestone[]
  templateType?: string // 使用的节点模板类型（国考/四六级/期末…），空 = 手动添加
}
export interface Course {
  id: string
  name: string
  total: number
  done: number
  targetDate: string
  createdAt: string
}

// ---- 打卡 ----
export interface CheckinChild {
  id: string
  name: string
  emoji?: string
}
export interface CheckinItem {
  id: string
  name: string
  emoji: string
  children?: CheckinChild[] // 子打卡项（如 高数 → 听课/做题）；有子项时勾选记录子项 id
}

// ---- 奖励 ----
export interface Reward {
  id: string
  title: string
  desc: string
  emoji: string
  targetDays: number // >0 = 连续全勤目标；0 = 隐藏任务（特殊条件）或直接发放的券
  hidden: boolean // 隐藏任务：记录端不显示详情
  claimed: boolean // 任务已达成
  granted: boolean // 券已入袋（达成自动入袋 / B 端直接发放）
  mode: 'auto' | 'code' // auto = 普通券；code = 贵重券，达成生成兑换码
  code?: string // 兑换码（mode=code 达成时生成）
  used?: boolean // 已使用/已核销
  achievedAt?: number // 达成时间戳（时间线用）
}

// ---- 待办 ----
export interface TodoChild {
  id: string
  text: string
  done: boolean
}
export interface Todo {
  id: string
  text: string
  done: boolean
  createdAt: number
  priority?: 1 | 2 | 3 // 1高(红) 2中(橙,默认) 3低(蓝)；旧数据无此字段视为 2
  children?: TodoChild[] // 子任务；全部勾完父任务自动完成
}

// ---- 记账 ----
export interface LedgerEntry {
  id: string
  date: string
  amount: number
  category: string
  note: string
  type?: 'expense' | 'income' // 旧数据无此字段，视为 expense
}

// ---- 周期任务 / 重要日期 ----
export interface PeriodicTask {
  id: string
  name: string
  everyDays: number
  lastDone: string
}
export interface ImportantDate {
  id: string
  name: string
  date: string
  yearly: boolean
}

// ---- 笔记（时政闪卡，艾宾浩斯复习池） ----
export interface Note {
  id: string
  text: string
  tags: string[]
  createdAt: number
  nextReviewDate: number | null // 下次复习时间戳；null = 不参与复习
  reviewStep: number // 艾宾浩斯复习阶段 0~5，5 = 已掌握
}

// ---- 番茄钟 / 心情 / 今日三件事 / 每日记录 ----
export interface PomodoroLog {
  date: string // YYYY-MM-DD
  minutes: number // 时长（分钟）
  endedAt: number // 完成时间戳
  task?: string // 这次专注做什么（可选）
}
export interface MoodEntry {
  mood: number // 1~5
  note?: string
}
export interface ThreeThings {
  items: { text: string; done: boolean }[]
}
export interface DayLog {
  water: number[] // 每杯的时间戳
  stand: number[] // 久坐已下线：旧数据保留兼容，停止读写
  meals: Record<string, boolean>
}

/** 今日已吃记录：日期 → 餐次 → 吃了什么 */
export type FoodLog = Record<string, Partial<Record<MealSlot, string>>>

// ---- 全量业务数据（= 后端 GET /data/snapshot 的响应体） ----
export interface AppData {
  settings: Settings
  foods: FoodItem[]
  budget: number // 月度记账预算（元），0 = 未设置
  foodLog: FoodLog
  exams: Exam[]
  courses: Course[]
  checkinItems: CheckinItem[]
  checkins: Record<string, string[]>
  moods: Record<string, MoodEntry>
  rewards: Reward[]
  todos: Todo[]
  ledger: LedgerEntry[]
  periodic: PeriodicTask[]
  dates: ImportantDate[]
  notes: Note[]
  threeThings: Record<string, ThreeThings>
  dayLogs: Record<string, DayLog>
  pomodoroLogs: PomodoroLog[]
}

// ---- 外部服务（全部经自建后端代理，见 services/api/proxy.ts） ----
export interface Weather {
  temp: number
  feels: number
  humidity: number
  code: number
  desc: string
  tMax: number
  tMin: number
  rainProb: number
  fetchedAt: number
}

export interface GeoCandidate {
  name: string
  province: string
  city?: string // 地级市名（如"洛阳市"），区县级结果才有
  lat: number
  lon: number
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// ---- 奖励发放流（B 端发放 → C 端增量拉取） ----
export interface GrantItem {
  id: string
  title: string
  emoji: string
  desc: string
  grantedAt: number
}
