// 奖励机制（预设奖池 / 兑换码 / 心情标签）
// 迁移自 PWA utils.ts；注：源文件 rw-hidden-mood 的 emoji 字节已损坏，按语义修复为 🌈
import type { Reward } from '../types'

/** 生成贵重券兑换码：'KG-' + 4 位随机大写字母数字 */
export function genRedeemCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return 'KG-' + s
}

export const MOOD_LABELS = ['糟糕', '低落', '一般', '还行', '开心']

/** 预设奖励池：普通 6 张（达成自动入袋）+ 隐藏任务 4 个（达成生成兑换码） */
export const PRESET_REWARDS: Reward[] = [
  { id: 'rw-milk-tea', title: '奶茶自由券', desc: '任意品牌任意杯型，加料全糖随你', emoji: '🧋', targetDays: 3, hidden: false, claimed: false, granted: false, mode: 'auto' },
  { id: 'rw-cart', title: '购物车清空券', desc: '购物车里挑一件，我来买单', emoji: '🛒', targetDays: 5, hidden: false, claimed: false, granted: false, mode: 'auto' },
  { id: 'rw-movie', title: '电影之夜券', desc: '选你想看的，爆米花我负责', emoji: '🎬', targetDays: 7, hidden: false, claimed: false, granted: false, mode: 'auto' },
  { id: 'rw-sleep', title: '懒觉保护券', desc: '不用早起的早晨，帮你挡掉所有打扰', emoji: '😴', targetDays: 10, hidden: false, claimed: false, granted: false, mode: 'auto' },
  { id: 'rw-massage', title: '肩颈按摩券', desc: '备考肩颈僵硬救急：一次专业按摩，费用我包', emoji: '💆', targetDays: 15, hidden: false, claimed: false, granted: false, mode: 'auto' },
  { id: 'rw-blind', title: '惊喜盲盒券', desc: '保持神秘，到时你就知道了', emoji: '🎁', targetDays: 20, hidden: false, claimed: false, granted: false, mode: 'auto' },
  { id: 'rw-hidden-weekend', title: '零食大礼包', desc: '周末双满勤的隐藏彩蛋', emoji: '🍫', targetDays: 0, hidden: true, claimed: false, granted: false, mode: 'code' },
  { id: 'rw-hidden-mood', title: '心情晴天惊喜', desc: '连续 3 天心情很好解锁', emoji: '🌈', targetDays: 0, hidden: true, claimed: false, granted: false, mode: 'code' },
  { id: 'rw-hidden-pomo', title: '甜品补给', desc: '单日专注满 3 个番茄解锁', emoji: '🍰', targetDays: 0, hidden: true, claimed: false, granted: false, mode: 'code' },
  { id: 'rw-hidden-30', title: '大额心愿券', desc: '累计 30 天全勤解锁', emoji: '💎', targetDays: 0, hidden: true, claimed: false, granted: false, mode: 'code' },
]
