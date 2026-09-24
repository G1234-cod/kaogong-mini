// 数据规范化：DEFAULTS + mergeWithDefaults（迁移自 PWA store.tsx）
// 职责：远端快照/本地沙盒数据 → 结构完备的 AppData（旧格式迁移 + 字段兜底）
import Taro from '@tarojs/taro'
import type { AppData, FoodItem, LedgerEntry, MealSlot, Note, Reward, Settings, TasteTag } from '../types'
import { DEFAULT_SETTINGS } from '../types'
import { DEFAULT_FOODS } from '../constants/foods'
import { PRESET_REWARDS } from '../utils/rewards'

export const DEFAULTS: AppData = {
  settings: DEFAULT_SETTINGS,
  foods: DEFAULT_FOODS.map((f) => ({ ...f })),
  budget: 0,
  foodLog: {},
  exams: [],
  courses: [],
  checkinItems: [
    { id: 'item-ke', name: '听录播课', emoji: '🎧' },
    { id: 'item-ti', name: '刷题练笔', emoji: '✍️' },
    { id: 'item-du', name: '晨读积累', emoji: '📖' },
  ],
  checkins: {},
  moods: {},
  rewards: PRESET_REWARDS.map((r) => ({ ...r })),
  todos: [],
  ledger: [],
  periodic: [],
  dates: [],
  notes: [],
  threeThings: {},
  dayLogs: {},
  pomodoroLogs: [],
}

/**
 * 合并默认值与已存储数据（兼容 PWA 历史数据格式迁移）。
 * 与后端契约关系：GET /data/snapshot 的分域 JSON 直接传入即可。
 */
export function mergeWithDefaults(stored: Record<string, unknown>): AppData {
  const out = { ...DEFAULTS } as Record<string, unknown>
  for (const key of Object.keys(DEFAULTS)) {
    if (stored[key] !== undefined) out[key] = stored[key]
  }
  // 旧版 foods 是 string[]，迁移为按餐次建模的 FoodItem[]
  if (Array.isArray(out.foods) && out.foods.length > 0 && typeof (out.foods as unknown[])[0] === 'string') {
    out.foods = (out.foods as string[]).map((name) => ({
      id: 'food-m-' + name,
      name,
      emoji: '🍽',
      slots: ['lunch', 'dinner'] as MealSlot[],
      tags: [] as TasteTag[],
    }))
  }
  // 旧版 FoodItem 无 emoji，补默认值；空库兜底默认食物库（guest fixtures 依赖此规则）
  if (Array.isArray(out.foods)) {
    out.foods =
      (out.foods as FoodItem[]).length > 0
        ? (out.foods as FoodItem[]).map((x) => ({ ...x, emoji: x.emoji || '🍽' }))
        : DEFAULTS.foods.map((f) => ({ ...f }))
  }
  // 旧版 ledger 无 type，视为 expense
  if (Array.isArray(out.ledger)) {
    out.ledger = (out.ledger as LedgerEntry[]).map((l) => ({ type: 'expense', ...l }))
  }
  // 旧版 notes 无复习字段 → 默认不进复习池（nextReviewDate: null）
  if (Array.isArray(out.notes)) {
    out.notes = (out.notes as Note[]).map((n) => ({
      ...n,
      nextReviewDate: typeof n.nextReviewDate === 'number' ? n.nextReviewDate : null,
      reviewStep: typeof n.reviewStep === 'number' ? n.reviewStep : 0,
    }))
  }
  // 防御 pomodoroLogs 坏数据
  if (!Array.isArray(out.pomodoroLogs)) out.pomodoroLogs = []
  // 奖励池迁移：旧 Reward 补全新字段；空池首次 seed（kg_rewards_seeded 标记，替代原 localStorage）
  if (Array.isArray(out.rewards)) {
    if (out.rewards.length === 0 && !Taro.getStorageSync('kg_rewards_seeded')) {
      out.rewards = PRESET_REWARDS.map((r) => ({ ...r }))
    }
    Taro.setStorageSync('kg_rewards_seeded', '1')
    out.rewards = (out.rewards as Reward[]).map((r) => {
      const legacy = typeof (r as { claimed?: boolean }).claimed === 'boolean' && typeof r.granted === 'undefined'
      return {
        ...r,
        desc: typeof r.desc === 'string' ? r.desc : '',
        emoji: typeof r.emoji === 'string' ? r.emoji : '🎁',
        hidden: typeof r.hidden === 'boolean' ? r.hidden : false,
        granted: typeof r.granted === 'boolean' ? r.granted : !!r.claimed,
        mode: r.mode === 'code' ? 'code' : 'auto',
        used: typeof r.used === 'boolean' ? r.used : legacy ? !!r.claimed : false,
      }
    })
  } else {
    out.rewards = PRESET_REWARDS.map((r) => ({ ...r }))
  }
  // settings 深合并，保证新增字段（含 intel 智能推荐偏好）有默认值
  const s = out.settings as Partial<Settings>
  const mergedSettings: Settings = {
    ...DEFAULT_SETTINGS,
    ...s,
    meals: { ...DEFAULT_SETTINGS.meals, ...(s.meals ?? {}) },
    water: { ...DEFAULT_SETTINGS.water, ...(s.water ?? {}) },
    city: s.city ?? null,
    intel: { ...DEFAULT_SETTINGS.intel!, ...(s.intel ?? {}) },
  }
  delete (mergedSettings as Partial<Settings> & { sedentaryMin?: number }).sedentaryMin // 久坐提醒已移除
  out.settings = mergedSettings
  return out as unknown as AppData
}
