// 连续打卡统计（自原 PWA utils.ts 原样迁移）
import { dateStr, daysBetween } from './date'

/** 从今天（或昨天）往回数连续打卡天数 */
export function streakFor(
  checkins: Record<string, string[]>,
  itemId: string
): number {
  let streak = 0
  const d = new Date()
  if (!(checkins[dateStr(d)] ?? []).includes(itemId)) d.setDate(d.getDate() - 1)
  while ((checkins[dateStr(d)] ?? []).includes(itemId)) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

/** 连续「全部完成」的天数（用于奖励机制） */
export function fullStreak(checkins: Record<string, string[]>, itemCount: number): number {
  if (itemCount === 0) return 0
  let streak = 0
  const d = new Date()
  if ((checkins[dateStr(d)] ?? []).length < itemCount) d.setDate(d.getDate() - 1)
  while ((checkins[dateStr(d)] ?? []).length >= itemCount) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

/** 历史上最长「全部完成」连续天数 */
export function bestFullStreak(checkins: Record<string, string[]>, itemCount: number): number {
  if (itemCount === 0) return 0
  const days = Object.keys(checkins).sort()
  let best = 0
  let cur = 0
  let prev: string | null = null
  for (const day of days) {
    if ((checkins[day] ?? []).length < itemCount) {
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
