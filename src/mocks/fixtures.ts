// 游客（Guest）样板数据：面试官/演示模式的完整体验闭环
// 硬性五件套：省考 30 天倒计时、连续 15 天打卡、3 张待复习时政闪卡、今日三件事进度、智能推荐午餐
// 设计原则：确定性字面量（基于当天日期偏移，无随机），保证演示数据稳定不闪变
import type { AppData } from '../types'
import { DEFAULT_SETTINGS } from '../types'
import { addDays, todayStr } from '../utils/date'
import { PRESET_REWARDS } from '../utils/rewards'

export function buildGuestData(): AppData {
  const today = todayStr()
  const examDate = addDays(today, 30)

  // ---------- 打卡：连续 15 天全勤（含今天） ----------
  const checkinItems = [
    { id: 'ck-sl', name: '申论', emoji: '✍️', children: [
      { id: 'ck-sl-1', name: '范文精读' },
      { id: 'ck-sl-2', name: '素材摘抄' },
    ] },
    { id: 'ck-xc', name: '行测', emoji: '🧮', children: [
      { id: 'ck-xc-1', name: '资料分析' },
      { id: 'ck-xc-2', name: '言语刷题' },
    ] },
    { id: 'ck-sz', name: '时政', emoji: '📰' },
    { id: 'ck-yd', name: '运动', emoji: '🏃' },
  ]
  const checkins: Record<string, string[]> = {}
  for (let i = 14; i >= 0; i--) {
    const d = addDays(today, -i)
    checkins[d] = ['ck-sl', 'ck-xc', 'ck-sz', 'ck-yd', 'ck-sl-1', 'ck-sl-2', 'ck-xc-1', 'ck-xc-2']
  }

  // ---------- 闪卡：3 张今日待复习的时政卡（不同复习档位） ----------
  const dayMs = 86400000
  const notes = [
    { id: 'note-1', text: '新质生产力：由技术革命性突破、生产要素创新性配置、产业深度转型升级而催生，特点是创新，关键在质优，本质是先进生产力。', tags: ['时政'], createdAt: Date.now() - 6 * dayMs, nextReviewDate: Date.now() - dayMs, reviewStep: 2 },
    { id: 'note-2', text: '中央经济工作会议定调：坚持稳中求进工作总基调，完整准确全面贯彻新发展理念，加快构建新发展格局。', tags: ['时政'], createdAt: Date.now() - 3 * dayMs, nextReviewDate: Date.now() - 2 * 3600000, reviewStep: 1 },
    { id: 'note-3', text: '「千万工程」经验：从千村示范、万村整治起步，久久为功推进乡村全面振兴。', tags: ['时政'], createdAt: Date.now() - 12 * dayMs, nextReviewDate: Date.now() - dayMs / 2, reviewStep: 3 },
  ]

  // ---------- 今日三件事：2/3 进度 ----------
  const threeThings = {
    [today]: {
      items: [
        { text: '晨读申论范文一篇', done: true },
        { text: '行测资料分析限时练', done: true },
        { text: '整理本周错题本', done: false },
      ],
    },
  }

  // ---------- 智能推荐午餐已吃记录 + 今日饮水 ----------
  const foodLog = { [today]: { lunch: '黄焖鸡米饭' } }
  const dayLogs = {
    [today]: { water: [Date.now() - 3 * 3600000, Date.now() - 2 * 3600000], stand: [], meals: { breakfast: true, lunch: true } },
  }

  // ---------- 氛围数据 ----------
  const moods: Record<string, { mood: number; note?: string }> = {}
  const moodSeq = [4, 5, 4, 4, 5]
  moodSeq.forEach((m, i) => {
    moods[addDays(today, -(4 - i))] = { mood: m }
  })

  const rewards = PRESET_REWARDS.map((r) =>
    r.id === 'rw-milk-tea' ? { ...r, claimed: true, granted: true, achievedAt: Date.now() - 5 * dayMs } : r
  )

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
    todos: [
      { id: 'todo-1', text: '打印准考证提醒设置', done: false, createdAt: Date.now() - dayMs, priority: 2 },
      { id: 'todo-2', text: '预约图书馆自习座位', done: true, createdAt: Date.now() - 2 * dayMs, priority: 1 },
    ],
    ledger: [
      { id: 'led-1', date: addDays(today, -1), amount: 16.5, category: '餐饮', note: '黄焖鸡米饭', type: 'expense' },
      { id: 'led-2', date: addDays(today, -2), amount: 45, category: '交通', note: '回家高铁票', type: 'expense' },
      { id: 'led-3', date: addDays(today, -3), amount: 1500, category: '生活费', note: '十月生活费', type: 'income' },
    ],
    periodic: [
      { id: 'per-1', name: '理发', everyDays: 30, lastDone: addDays(today, -20) },
    ],
    dates: [
      { id: 'date-1', name: '生日', date: addDays(today, 12), yearly: true },
    ],
    notes,
    threeThings,
    dayLogs,
    pomodoroLogs: [
      { date: today, minutes: 25, endedAt: Date.now() - 4 * 3600000, task: '资料分析限时练' },
      { date: today, minutes: 25, endedAt: Date.now() - 2 * 3600000, task: '申论范文精读' },
    ],
  }
}
