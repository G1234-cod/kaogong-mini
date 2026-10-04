// 奖励机制（预设奖池 / 兑换码 / 心情标签 / 任务定义与发券合并）
// 迁移自 PWA utils.ts；注：源文件 rw-hidden-mood 的 emoji 字节已损坏，按语义修复为 🌈
import type { GrantItem, Reward, TaskDef } from '../types'

/** 生成贵重券兑换码：'KG-' + 4 位随机大写字母数字 */
export function genRedeemCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return 'KG-' + s
}

export const MOOD_LABELS = ['糟糕', '低落', '一般', '还行', '开心']

/** 预设奖励池：普通 6 张（达成自动入袋）+ 隐藏任务 4 个（达成生成兑换码）
 *  条件定义与后端 TASK_SEED 一致（id/condType/condParam 对齐） */
export const PRESET_REWARDS: Reward[] = [
  { id: 'rw-milk-tea', title: '奶茶自由券', desc: '任意品牌任意杯型，加料全糖随你', emoji: '🧋', condType: 'streak', condParam: 3, hidden: false, claimed: false, granted: false, mode: 'auto' },
  { id: 'rw-cart', title: '购物车清空券', desc: '购物车里挑一件，我来买单', emoji: '🛒', condType: 'streak', condParam: 5, hidden: false, claimed: false, granted: false, mode: 'auto' },
  { id: 'rw-movie', title: '电影之夜券', desc: '选你想看的，爆米花我负责', emoji: '🎬', condType: 'streak', condParam: 7, hidden: false, claimed: false, granted: false, mode: 'auto' },
  { id: 'rw-sleep', title: '懒觉保护券', desc: '不用早起的早晨，帮你挡掉所有打扰', emoji: '😴', condType: 'streak', condParam: 10, hidden: false, claimed: false, granted: false, mode: 'auto' },
  { id: 'rw-massage', title: '肩颈按摩券', desc: '备考肩颈僵硬救急：一次专业按摩，费用我包', emoji: '💆', condType: 'streak', condParam: 15, hidden: false, claimed: false, granted: false, mode: 'auto' },
  { id: 'rw-blind', title: '惊喜盲盒券', desc: '保持神秘，到时你就知道了', emoji: '🎁', condType: 'streak', condParam: 20, hidden: false, claimed: false, granted: false, mode: 'auto' },
  { id: 'rw-hidden-weekend', title: '零食大礼包', desc: '周末双满勤的隐藏彩蛋', emoji: '🍫', condType: 'weekend_full', condParam: 0, hidden: true, claimed: false, granted: false, mode: 'code' },
  { id: 'rw-hidden-mood', title: '心情晴天惊喜', desc: '连续 3 天心情很好解锁', emoji: '🌈', condType: 'mood3', condParam: 3, hidden: true, claimed: false, granted: false, mode: 'code' },
  { id: 'rw-hidden-pomo', title: '甜品补给', desc: '单日专注满 3 个番茄解锁', emoji: '🍰', condType: 'pomo_day', condParam: 3, hidden: true, claimed: false, granted: false, mode: 'code' },
  { id: 'rw-hidden-30', title: '大额心愿券', desc: '累计 30 天全勤解锁', emoji: '💎', condType: 'total_full', condParam: 30, hidden: true, claimed: false, granted: false, mode: 'code' },
]

/** 服务端任务/发券合并结果 */
export interface RewardMergeResult {
  rewards: Reward[]
  /** 定义或列表有变化（需要持久化） */
  changed: boolean
  /** 本次新入袋的发券（用于 toast 提醒） */
  newGrants: GrantItem[]
}

/**
 * 服务端任务定义 + 发券 合并进本地奖励域（bootstrap 每次启动调用）：
 * - 任务按 id upsert 定义字段（title/emoji/desc/condType/condParam/mode/hidden），
 *   保留本地状态（claimed/granted/used/code/achievedAt）；本地独有项（grant-* 券等）保留
 * - 未见过的 grant 转 'grant-' 前缀 Reward 追加（claimed/granted 直接入袋）
 */
export function mergeServerRewards(rewards: Reward[], tasks: TaskDef[], grants: GrantItem[]): RewardMergeResult {
  const byId = new Map(rewards.map((r) => [r.id, r]))
  let changed = false
  for (const t of tasks) {
    const local = byId.get(t.id)
    const def = {
      title: t.title,
      emoji: t.emoji,
      desc: t.desc,
      condType: t.condType,
      condParam: t.condParam,
      mode: t.mode,
      hidden: t.hidden,
    }
    if (!local) {
      byId.set(t.id, { id: t.id, ...def, claimed: false, granted: false })
      changed = true
      continue
    }
    const next: Reward = { ...local, ...def }
    if (JSON.stringify(next) !== JSON.stringify(local)) {
      byId.set(t.id, next)
      changed = true
    }
  }
  const newGrants = grants.filter((g) => !byId.has('grant-' + g.id))
  for (const g of newGrants) {
    byId.set('grant-' + g.id, {
      id: 'grant-' + g.id,
      title: g.title,
      emoji: g.emoji,
      desc: g.desc,
      hidden: false,
      claimed: true,
      granted: true,
      mode: 'auto',
      achievedAt: g.grantedAt,
    })
    changed = true
  }
  return { rewards: [...byId.values()], changed, newGrants }
}
