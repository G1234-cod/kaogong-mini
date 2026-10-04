// 游客（Guest）样板数据：面试官/演示模式的完整体验闭环
// 演示重点：省考 30 天倒计时、打卡 6 项覆盖多种频率模式（晨读连 5 天/行测今日 2/4）、
// 待办 8 条（逾期红标/今日到期/子任务进度）、周期提醒 3 档倒计时、重要日期含今日 ack 沉底
// 设计原则：确定性字面量（基于当天日期偏移，无随机），保证演示数据稳定不闪变
import type { AppData } from '../types'
import { DEFAULT_SETTINGS } from '../types'
import { DEFAULT_LEDGER_CATS } from '../constants/categories'
import { DEFAULT_NOTE_TAGS } from '../constants/notes'
import { addDays, daysBetween, startOfWeek, todayStr } from '../utils/date'
import { PRESET_REWARDS } from '../utils/rewards'

export function buildGuestData(): AppData {
  const today = todayStr()
  const examDate = addDays(today, 30)

  // ---------- 打卡：6 项覆盖多种频率模式（新 UI 用 autoEmoji 自动配图标，不再造 category/level，emoji 留空） ----------
  const checkinItems: AppData['checkinItems'] = [
    // 每天 · 带子项：今天已完成
    { id: 'ck-read', name: '申论晨读', emoji: '', freq: 'daily', children: [
      { id: 'ck-read-1', name: '读范文' },
      { id: 'ck-read-2', name: '摘抄金句' },
    ] },
    // 每天 · 带子项：今天打了 2/4（部分完成）
    { id: 'ck-xc', name: '行测刷题', emoji: '', freq: 'daily', children: [
      { id: 'ck-xc-1', name: '言语' },
      { id: 'ck-xc-2', name: '判断' },
      { id: 'ck-xc-3', name: '数量' },
      { id: 'ck-xc-4', name: '资料' },
    ] },
    // 每天 · 无子项：今天未打
    { id: 'ck-water', name: '喝水 8 杯', emoji: '', freq: 'daily' },
    // 每周一三五（freqDays：0=周日 … 6=周六）：今天命中则该打未打，否则由页面逻辑算下次对应日
    { id: 'ck-run', name: '跑步', emoji: '', freq: 'weekly', freqDays: [1, 3, 5] },
    // 每周 3 次（不限日）：本周已打 1 次
    { id: 'ck-news', name: '时政积累', emoji: '', freq: 'weeklyN', freqCount: 3 },
    // 每月 1 号
    { id: 'ck-review', name: '复盘总结', emoji: '', freq: 'monthlyDays', freqDays: [1] },
  ]

  // 打卡记录：勾选只记叶子 id（无子项记自身 id，有子项记子项 id），按天累积
  const checkins: Record<string, string[]> = {}
  const mark = (day: string, ids: string[]) => {
    checkins[day] = [...(checkins[day] ?? []), ...ids]
  }
  // 申论晨读：连续 5 天全勤（含今天）
  for (let i = 0; i < 5; i++) mark(addDays(today, -i), ['ck-read-1', 'ck-read-2'])
  // 行测刷题：前 4 天全量完成，今天只勾 2 个叶子（2/4）
  for (let i = 1; i <= 4; i++) mark(addDays(today, -i), ['ck-xc-1', 'ck-xc-2', 'ck-xc-3', 'ck-xc-4'])
  mark(today, ['ck-xc-1', 'ck-xc-2'])
  // 喝水 8 杯：近两天已打，今天未打
  mark(addDays(today, -1), ['ck-water'])
  mark(addDays(today, -2), ['ck-water'])
  // 跑步：近 14 天内已过去的一三五都打过（今天若是打卡日则保持未打，演示「今天该打」）
  for (let i = 1; i <= 13; i++) {
    const d = addDays(today, -i)
    const wd = new Date(d + 'T00:00:00').getDay() // 0=周日 … 6=周六
    if (wd === 1 || wd === 3 || wd === 5) mark(d, ['ck-run'])
  }
  // 时政积累：本周已打 1 次（放在本周早些时候；今天恰是周一则算今天打的，进度同为 1/3）
  const newsDay = daysBetween(startOfWeek(today), today) >= 1 ? addDays(today, -1) : today
  mark(newsDay, ['ck-news'])
  // 复盘总结：本月 1 号已打（今天正是 1 号则不打，演示当天该打）
  if (Number(today.slice(8)) > 1) mark(today.slice(0, 8) + '01', ['ck-review'])

  // ---------- 闪卡：3 张今日待复习 + 1 张已掌握 + 1 张未到期（复习页各状态可见） ----------
  const dayMs = 86400000
  const notes = [
    { id: 'note-1', text: '新质生产力：由技术革命性突破、生产要素创新性配置、产业深度转型升级而催生，特点是创新，关键在质优，本质是先进生产力。', tags: ['时政'], createdAt: Date.now() - 6 * dayMs, nextReviewDate: Date.now() - dayMs, reviewStep: 2, review: { stability: 4, difficulty: 6, reps: 2, lapses: 1 } },
    { id: 'note-2', text: '中央经济工作会议定调：坚持稳中求进工作总基调，完整准确全面贯彻新发展理念，加快构建新发展格局。', tags: ['时政'], createdAt: Date.now() - 3 * dayMs, nextReviewDate: Date.now() - 2 * 3600000, reviewStep: 1, review: { stability: 2, difficulty: 5, reps: 1, lapses: 0 } },
    { id: 'note-3', text: '「千万工程」经验：从千村示范、万村整治起步，久久为功推进乡村全面振兴。', tags: ['时政'], createdAt: Date.now() - 12 * dayMs, nextReviewDate: Date.now() - dayMs / 2, reviewStep: 3, review: { stability: 7, difficulty: 4, reps: 3, lapses: 0 } },
    { id: 'note-4', text: '高质量发展是全面建设社会主义现代化国家的首要任务。', tags: ['时政'], createdAt: Date.now() - 20 * dayMs, nextReviewDate: Date.now() + 10 * dayMs, reviewStep: 5, review: { stability: 21, difficulty: 2, reps: 6, lapses: 0 } },
    { id: 'note-5', text: '资料分析速算：特征数字法、错位加减法、有效数字法要形成条件反射。', tags: ['行测'], createdAt: Date.now() - 2 * dayMs, nextReviewDate: Date.now() + 5 * dayMs, reviewStep: 1, review: { stability: 3, difficulty: 5, reps: 1, lapses: 0 } },
  ]

  // ---------- 三件事：今日 2/3 进度 + 近 5 天历史（统计/回顾可看） ----------
  const threeThings: AppData['threeThings'] = {
    [today]: {
      items: [
        { text: '晨读申论范文一篇', done: true },
        { text: '行测资料分析限时练', done: true },
        { text: '整理本周错题本', done: false },
      ],
    },
  }
  const pastThree: Array<Array<[string, boolean]>> = [
    [['晨读申论范文一篇', true], ['行测言语刷题 30 题', true], ['整理错题本', true]],
    [['申论大作文提纲', true], ['资料分析限时练', true], ['跑步 3 公里', false]],
    [['听时政课 1 节', true], ['数量关系专项', true], ['复盘本周计划', true]],
    [['背诵金句 10 条', true], ['判断推理刷题', false], ['早睡打卡', true]],
    [['抄写申论范文', true], ['常识判断刷题', true], ['给家里打电话', true]],
  ]
  pastThree.forEach((items, i) => {
    threeThings[addDays(today, -(i + 1))] = { items: items.map(([text, done]) => ({ text, done })) }
  })

  // ---------- 智能推荐午餐记录（近 6 天）+ 每日饮水（近 7 天） ----------
  const foodLog: AppData['foodLog'] = { [today]: { lunch: '黄焖鸡米饭' } }
  const lunchSeq = ['麻辣香锅', '兰州拉面', '煲仔饭', '轻食沙拉', '沙县小吃']
  lunchSeq.forEach((lunch, i) => {
    foodLog[addDays(today, -(i + 1))] = { lunch }
  })
  const dayLogs: AppData['dayLogs'] = {}
  for (let i = 0; i < 7; i++) {
    const cups = 4 + ((i * 3) % 4) // 4~7 杯，确定性分布
    dayLogs[addDays(today, -i)] = {
      water: Array.from({ length: cups }, (_, k) => Date.now() - i * dayMs - (k + 2) * 3600000),
      stand: [],
      meals: { breakfast: i % 3 !== 2, lunch: true },
    }
  }

  // ---------- 氛围数据：近 14 天心情 ----------
  const moods: Record<string, { mood: number; note?: string }> = {}
  const moodSeq = [4, 3, 4, 5, 4, 4, 5, 3, 4, 4, 5, 4, 4, 5]
  moodSeq.forEach((m, i) => {
    moods[addDays(today, -(13 - i))] = { mood: m }
  })

  // 奖励：15 天全勤 + 心情连好 已满足的均标记领取（避免演示首进打卡页连环弹盲盒），
  // 留 rw-blind(20天)/rw-hidden-pomo(3番茄)/rw-hidden-30(30天) 展示进度与隐藏任务悬念
  const claimedIds: Record<string, { code?: string; used?: boolean }> = {
    'rw-milk-tea': { used: true },
    'rw-cart': {},
    'rw-movie': {},
    'rw-sleep': {},
    'rw-massage': {},
    'rw-hidden-weekend': { code: 'KG-DEMO' },
    'rw-hidden-mood': { code: 'KG-HAPPY' },
  }
  const rewards = PRESET_REWARDS.map((r, i) => {
    const hit = claimedIds[r.id]
    if (!hit) return r
    return {
      ...r,
      claimed: true,
      granted: true,
      used: !!hit.used,
      code: hit.code,
      achievedAt: Date.now() - (5 - (i % 5)) * dayMs,
    }
  })

  return {
    settings: { ...DEFAULT_SETTINGS, intel: { enabled: true, tastes: ['饱腹'] } },
    foods: [], // 由 normalize 兜底 DEFAULT_FOODS
    budget: 1500,
    foodLog,
    exams: [
      {
        id: 'exam-prov',
        name: '2027 河南省考',
        date: examDate,
        templateType: 'civil',
        milestones: [
          { id: 'ms-1', label: '公告发布', date: addDays(examDate, -120), done: true },
          { id: 'ms-2', label: '网上报名', date: addDays(examDate, -45), done: true },
          { id: 'ms-3', label: '报名缴费', date: addDays(examDate, -35), done: true },
          { id: 'ms-4', label: '打印准考证', date: addDays(examDate, -7), done: false },
          { id: 'ms-5', label: '笔试', date: examDate, done: false },
        ],
      },
    ],
    courses: [
      { id: 'course-1', name: '申论系统班', total: 120, done: 68, targetDate: addDays(today, 25), createdAt: addDays(today, -60) },
      { id: 'course-2', name: '行测 5000 题', total: 5000, done: 3260, targetDate: addDays(today, 28), createdAt: addDays(today, -90) },
    ],
    checkinItems,
    checkins,
    moods,
    rewards,
    // 待办 8 条：超一屏演示卡内滚动；priority 1高(红)/2中(橙)/3低(蓝)
    todos: [
      // 逾期 1 天的高优红标
      { id: 'todo-1', text: '国考报名信息确认与缴费', done: false, createdAt: Date.now() - 2 * dayMs, priority: 1, dueDate: addDays(today, -1) },
      // 今天到期 · 子任务勾一半（2/4 进度）
      { id: 'todo-2', text: '整理错题本', done: false, createdAt: Date.now() - 3 * dayMs, priority: 2, dueDate: today, children: [
        { id: 'todo-2-1', text: '资料分析错题', done: true },
        { id: 'todo-2-2', text: '言语理解错题', done: true },
        { id: 'todo-2-3', text: '判断推理错题', done: false },
        { id: 'todo-2-4', text: '数量关系错题', done: false },
      ] },
      // 今天到期
      { id: 'todo-3', text: '刷完资料分析第 3 章', done: false, createdAt: Date.now() - dayMs, priority: 1, dueDate: today },
      // 明天到期 · 带子任务全未勾
      { id: 'todo-4', text: '申论大作文练 1 篇', done: false, createdAt: Date.now() - dayMs, priority: 2, dueDate: addDays(today, 1), children: [
        { id: 'todo-4-1', text: '列提纲', done: false },
        { id: 'todo-4-2', text: '写正文', done: false },
        { id: 'todo-4-3', text: '对照范文修改', done: false },
      ] },
      // 3 天后到期
      { id: 'todo-5', text: '打印准考证', done: false, createdAt: Date.now() - 4 * dayMs, priority: 3, dueDate: addDays(today, 3) },
      // 更远 2 条
      { id: 'todo-6', text: '买考前文具（涂卡笔、橡皮、手表）', done: false, createdAt: Date.now() - 5 * dayMs, priority: 3, dueDate: addDays(today, 10) },
      { id: 'todo-7', text: '预约线下全真模考', done: false, createdAt: Date.now() - 6 * dayMs, priority: 2, dueDate: addDays(today, 20) },
      // 今天已完成（doneAt=现在，演示完成沉底）
      { id: 'todo-8', text: '晨读时政要点 20 分钟', done: true, doneAt: Date.now(), createdAt: Date.now() - dayMs, priority: 2, dueDate: today },
    ],
    ledger: [
      { id: 'led-1', date: addDays(today, -1), amount: 16.5, category: '餐饮', note: '黄焖鸡米饭', type: 'expense' },
      { id: 'led-2', date: addDays(today, -2), amount: 45, category: '交通', note: '回家高铁票', type: 'expense' },
      { id: 'led-3', date: addDays(today, -3), amount: 1500, category: '生活费', note: '十月生活费', type: 'income' },
      { id: 'led-4', date: addDays(today, -4), amount: 32, category: '学习', note: '申论真题卷', type: 'expense' },
      { id: 'led-5', date: addDays(today, -5), amount: 12, category: '餐饮', note: '早餐包子豆浆', type: 'expense' },
      { id: 'led-6', date: addDays(today, -7), amount: 28, category: '娱乐', note: '电影票', type: 'expense' },
      { id: 'led-7', date: addDays(today, -9), amount: 15, category: '餐饮', note: '食堂午饭', type: 'expense' },
      { id: 'led-8', date: addDays(today, -11), amount: 19, category: '餐饮', note: '奶茶', type: 'expense' },
      { id: 'led-9', date: addDays(today, -13), amount: 25, category: '日用', note: '洗衣液', type: 'expense' },
      { id: 'led-10', date: addDays(today, -15), amount: 68, category: '学习', note: '行测 5000 题', type: 'expense' },
      { id: 'led-11', date: addDays(today, -18), amount: 240, category: '学习', note: '申论批改课', type: 'expense' },
      { id: 'led-12', date: addDays(today, -21), amount: 300, category: '生活费', note: '兼职工资', type: 'income' },
    ],
    // 周期提醒 3 档倒计时：今天到期 / 剩 1 天 / 剩 8 天
    periodic: [
      // 每两周一换：上次 14 天前 → 今天到期
      { id: 'per-1', name: '换床单', everyDays: 14, lastDone: addDays(today, -14) },
      // 每 3 天一浇：上次 2 天前 → 剩 1 天
      { id: 'per-2', name: '浇花', everyDays: 3, lastDone: addDays(today, -2) },
      // 每 30 天一剪：上次 22 天前 → 剩 8 天
      { id: 'per-3', name: '剪指甲', everyDays: 30, lastDone: addDays(today, -22) },
    ],
    // 重要日期 3 条：今天截止（已 ack 沉底）/ 5 天后模考（提前 3 天提醒）/ 每年重复的生日
    dates: [
      // 今天命中但已点「知道了」：今日页沉底、不再当未完成展示
      { id: 'date-1', name: '国考报名截止', date: today, yearly: false, lastAck: today },
      { id: 'date-2', name: '全真模考', date: addDays(today, 5), yearly: false, remindDays: [3] },
      { id: 'date-3', name: '生日', date: addDays(today, 12), yearly: true },
    ],
    notes,
    noteTags: JSON.parse(JSON.stringify(DEFAULT_NOTE_TAGS)),
    quizBook: { stats: { answered: 0, wrong: 0 }, wrongs: [] },
    ledgerCats: JSON.parse(JSON.stringify(DEFAULT_LEDGER_CATS)),
    threeThings,
    dayLogs,
    pomodoroLogs: [
      { date: today, minutes: 25, endedAt: Date.now() - 4 * 3600000, task: '资料分析限时练' },
      { date: today, minutes: 25, endedAt: Date.now() - 2 * 3600000, task: '申论范文精读' },
      { date: addDays(today, -1), minutes: 35, endedAt: Date.now() - dayMs - 3 * 3600000, task: '行测刷题' },
      { date: addDays(today, -2), minutes: 25, endedAt: Date.now() - 2 * dayMs - 4 * 3600000, task: '时政积累' },
      { date: addDays(today, -3), minutes: 50, endedAt: Date.now() - 3 * dayMs - 2 * 3600000, task: '申论大作文' },
      { date: addDays(today, -4), minutes: 25, endedAt: Date.now() - 4 * dayMs - 5 * 3600000, task: '资料分析限时练' },
      { date: addDays(today, -6), minutes: 45, endedAt: Date.now() - 6 * dayMs - 3 * 3600000, task: '判断推理专项' },
    ],
  }
}
