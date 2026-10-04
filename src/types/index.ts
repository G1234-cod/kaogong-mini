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
  /** 城市来源：auto=启动自动定位（默认）；manual=用户手选，自动定位不覆盖 */
  citySource?: 'auto' | 'manual'
  pomoMinutes?: number // 番茄钟自定义时长（分钟），空 = 用预设 25
  /** 昵称（用户自填，B 端管理列表展示用；与后端 users.nickname 备注区分） */
  nickname?: string
  /** 头像：微信 chooseAvatar 选图 → Canvas 压缩 128×128 JPEG base64 dataURL */
  avatarUrl?: string
  /** 手机号（用户手动填写；个人主体无 getPhoneNumber 权限，企业主体后可升级） */
  phone?: string
  /** 游客数据模式：true=演示数据（默认）/ false=空白模式；仅游客账号使用 */
  guestDemo?: boolean
  /** 智能推荐偏好（替代原 aiKey：模型 Key 已上云，端侧只留开关与口味偏好） */
  intel?: { enabled: boolean; tastes: TasteTag[] }
  /** 口味画像：AI 对话越用越懂你（标签正/负向计数 + 已选菜品，注入 prompt） */
  tasteProfile?: {
    liked: Record<string, number>
    disliked: Record<string, number>
    picked: string[]
  }
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
/** 优先级（三档，由旧 level+severity 合并）：决定列表排序权重（核心置顶），不挂奖励 */
export type CheckinLevel = 'core' | 'normal' | 'flex'
/** 旧严重程度（三档）：内部兼容字段，UI 不再读写；仅旧数据迁移推断 level 时使用 */
export type CheckinSeverity = 'high' | 'medium' | 'low'
/** 打卡频率六模式：daily=每天（默认）；weekly=每周指定星期几（见 freqDays）；weeklyN=每周 N 次（见 freqCount，不限星期）；monthlyN=每月 N 次；monthlyDays=每月指定几号（见 freqDays，1-31）；dailyN=每天 N 次 */
export type CheckinFreq = 'daily' | 'weekly' | 'weeklyN' | 'monthlyN' | 'monthlyDays' | 'dailyN'

export interface CheckinChild {
  id: string
  name: string
  emoji?: string
  /** 可覆盖父级严重程度，仅影响视觉 */
  severity?: CheckinSeverity
  /** 子项可递归，UI 建议不超过 2 层 */
  children?: CheckinChild[]
}
export interface CheckinItem {
  id: string
  name: string
  emoji: string
  /** 等级分类（学习/健康/生活…预设 chip），用于展示 */
  category?: string
  /** 优先级（旧 level+severity 合并后的单一字段），缺省 normal；旧数据无 level 时按 severity 推断（见 normalize） */
  level?: CheckinLevel
  /** @deprecated 旧严重程度：兼容字段，写入不再落此字段 */
  severity?: CheckinSeverity
  /** 频率，缺省 daily（每天）；weekly = 每周指定星期几；weeklyN/monthlyN/dailyN = 每周/每月/每天 N 次；monthlyDays = 每月指定几号 */
  freq?: CheckinFreq
  /** freq=weekly 时打卡日（0=周日 … 6=周六，升序去重，如 [1,3,5] 一/三/五）；freq=monthlyDays 时打卡日期（1-31，升序去重，如 [1,15]） */
  freqDays?: number[]
  /** freq=weeklyN/monthlyN/dailyN 时的次数（每周/每月/每天 N 次） */
  freqCount?: number
  /** @deprecated 旧每周次数：兼容字段，UI 不再读写；仅旧数据迁移推算 freqDays 时使用 */
  freqTimes?: number
  children?: CheckinChild[] // 子打卡项（如 高数 → 听课/做题）；有子项时勾选记录叶子 id
  /** 父项说明（详情弹窗里可看可改），空 = 未填写 */
  note?: string
}

// ---- 奖励 ----
/** 任务达成条件类型（B 端任务定义，与后端 tasks.cond_type 对齐） */
export type CondType = 'streak' | 'total_full' | 'weekend_full' | 'mood3' | 'pomo_day'

/** 任务定义（GET /tasks 下发，camelCase 与后端 task_json 一致） */
export interface TaskDef {
  id: string
  title: string
  emoji: string
  desc: string
  condType: CondType
  condParam: number
  mode: 'auto' | 'code'
  hidden: boolean
}

export interface Reward {
  id: string
  title: string
  desc: string
  emoji: string
  /** 达成条件类型；无 = 非任务型（如 B 端直接发放的 grant-* 券） */
  condType?: CondType
  /** 条件参数（streak/total_full/mood3/pomo_day 的目标值；weekend_full 为 0） */
  condParam?: number
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
  dueDate?: string // 截止日期 YYYY-MM-DD；≤今天的未完成项自动进「今日事项」
  /** 父项说明（详情弹窗里可看可改），空 = 未填写 */
  note?: string
  /** 完成时间戳（今日页「今天完成 → 沉底」判定用；取消完成时清除，旧数据无此字段视为非今天完成） */
  doneAt?: number
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
/** 记账分类（ledgerCats 域）：builtin=内置不可删；locked=「其他」，不可删不可改名（删除归并目标） */
export interface LedgerCategory {
  name: string
  emoji: string
  builtin?: boolean
  locked?: boolean
}

// ---- 周期任务 / 重要日期 ----
export interface PeriodicTask {
  id: string
  name: string
  everyDays: number
  lastDone: string
  /** 父项说明（编辑弹层里可看可改），空 = 未填写 */
  note?: string
}
export interface ImportantDate {
  id: string
  name: string
  date: string
  yearly: boolean
  remindDays?: number[] // 提前提醒天数：0=当天、1/3/7=提前N天；空/缺省=不提醒
  /** 父项说明（编辑弹层里可看可改），空 = 未填写 */
  note?: string
  /** 最近一次在今日页标记「知道了」的日期（当天沉底、不再当未完成展示）；取消勾选时清除 */
  lastAck?: string
}

// ---- 笔记（时政闪卡，艾宾浩斯复习池） ----
/** 笔记标签（noteTags 域，可自定义）：builtin=内置不可删（可改名）；locked=「时政」不可删不可改名（牵动自动入复习池规则） */
export interface NoteTag {
  name: string
  builtin?: boolean
  locked?: boolean
}

export interface Note {
  id: string
  text: string
  tags: string[]
  createdAt: number
  nextReviewDate: number | null // 下次复习时间戳；null = 不参与复习 / 已掌握
  reviewStep: number // 兼容旧字段：复习阶段 0~5，5 = 已掌握（B 端统计沿用）
  review?: ReviewState // FSRS 简化版记忆状态（旧数据迁移时由 reviewStep 推导）
}

/** FSRS 简化版记忆状态 */
export interface ReviewState {
  stability: number // 记忆稳定性 S（天），复习间隔 ≈ S
  difficulty: number // 难度 D，1~10
  reps: number // 累计复习次数
  lapses: number // 遗忘次数
}

/** 喝水小常识错题（复用 FSRS 复习体系，与 Note 同口径） */
export interface QuizWrong {
  quizId: number
  wrongCount: number
  lastWrongAt: number
  nextReviewDate: number | null // null = 已掌握移出
  review?: ReviewState
  correctStreak?: number // 连续做对次数，达到 3 次自动毕业（已掌握）
  tags?: string[] // 错因标签：粗心/概念不清/计算错误/审题偏差/完全不会
  memo?: string // 我的笔记
}
export interface QuizBook {
  stats: { answered: number; wrong: number }
  wrongs: QuizWrong[]
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
  noteTags: NoteTag[] // 笔记标签（可自定义，见 pages/note-tags）
  threeThings: Record<string, ThreeThings>
  dayLogs: Record<string, DayLog>
  pomodoroLogs: PomodoroLog[]
  quizBook: QuizBook // 喝水小常识错题本
  ledgerCats: { expense: LedgerCategory[]; income: LedgerCategory[] } // 记账分类（可自定义）
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

/** 附近 POI（腾讯位置服务周边搜索） */
export interface PoiItem {
  id: string
  name: string
  address: string
  lat: number
  lon: number
  distance: number // 米
  tel?: string
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
