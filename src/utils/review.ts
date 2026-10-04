// 复习逻辑（FSRS 简化版：4 档评分 + 记忆稳定性排期）
import { dateStr, daysBetween } from './date'
import type { ReviewState } from '../types'

/** 4 档评分：忘记😵 / 困难😐 / 一般🙂 / 轻松😄 */
export type Rating = 'again' | 'hard' | 'good' | 'easy'

/** 每日复习上限：卡片多时只取优先级最高的 N 张，其余顺延（解决卡片量大的问题） */
export const REVIEW_DAILY_LIMIT = 20

/** 已掌握阈值（天）：记忆稳定性 S ≥ 21 视为长期记住，不再排期 */
const MASTER_S = 21

/** 旧档位间隔（天）：reviewStep ↔ 稳定性 S 的迁移映射 */
const LEGACY_INTERVALS = [1, 2, 4, 7, 15]

/** 新笔记进复习池 / 手动加入时的首次复习时间（明天） */
export function firstReviewDate(): number {
  return Date.now() + 86400000
}

/** 取笔记的记忆状态（旧数据无 review 字段时由 reviewStep 推导） */
export function noteReviewState(note: {
  review?: ReviewState
  reviewStep?: number
}): ReviewState {
  if (note.review) return note.review
  const step = Math.max(0, Math.min(5, note.reviewStep || 0))
  return {
    stability: step >= 5 ? MASTER_S : LEGACY_INTERVALS[step],
    difficulty: 5,
    reps: step,
    lapses: 0,
  }
}

/** reviewStep 由稳定性派生（与旧 5 档口径对齐，B 端掌握率统计沿用 reviewStep >= 5） */
function stepFromStability(s: number): number {
  if (s >= MASTER_S) return 5
  if (s >= 15) return 4
  if (s >= 7) return 3
  if (s >= 4) return 2
  if (s >= 2) return 1
  return 0
}

/**
 * 复习评分后的下一状态（FSRS 简化版）：
 * - again 忘记😵：稳定性归 1 天重来，难度 +1，记 1 次遗忘
 * - hard 困难😐：S ×1.2，难度 +0.5
 * - good 一般🙂：S ×2
 * - easy 轻松😄：S ×3，难度 -0.5
 * 复习间隔 ≈ S 天；S ≥ 21 视为已掌握（reviewStep 5，nextReviewDate null 不再排期）
 */
export function nextReviewState(
  state: ReviewState,
  rating: Rating
): { review: ReviewState; reviewStep: number; nextReviewDate: number | null } {
  const cur = state
  let s = cur.stability
  let d = cur.difficulty
  let lapses = cur.lapses
  switch (rating) {
    case 'again':
      s = 1
      d = Math.min(10, d + 1)
      lapses += 1
      break
    case 'hard':
      s = s * 1.2
      d = Math.min(10, d + 0.5)
      break
    case 'good':
      s = s * 2
      break
    case 'easy':
      s = s * 3
      d = Math.max(1, d - 0.5)
      break
  }
  s = Math.round(s * 10) / 10
  const review: ReviewState = {
    stability: s,
    difficulty: d,
    reps: cur.reps + 1,
    lapses,
  }
  const reviewStep = stepFromStability(s)
  const nextReviewDate =
    reviewStep >= 5 ? null : Date.now() + Math.max(1, Math.round(s)) * 86400000
  return { review, reviewStep, nextReviewDate }
}

/** 笔记是否今日待复习（按日粒度比较：排期日 <= 今天即到期） */
export function isNoteDue(note: { nextReviewDate: number | null }, today: string): boolean {
  return note.nextReviewDate !== null && dateStr(new Date(note.nextReviewDate)) <= today
}

/**
 * 复习优先级：逾期天数 × 难度（越大越先复习）。
 * 用于每日上限 REVIEW_DAILY_LIMIT 内的排序，剩下的顺延明天。
 */
export function reviewPriority(note: { nextReviewDate: number | null; review?: ReviewState; reviewStep?: number }, today: string): number {
  if (note.nextReviewDate === null) return -1
  const overdue = Math.max(0, daysBetween(dateStr(new Date(note.nextReviewDate)), today))
  const d = noteReviewState(note).difficulty
  return overdue * d + 1
}
