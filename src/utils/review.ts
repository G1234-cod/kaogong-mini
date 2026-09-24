// 艾宾浩斯复习逻辑（时政闪卡，自原 PWA utils.ts 原样迁移）
import { dateStr } from './date'

/** 复习间隔（天），索引 = reviewStep：step0→1天、1→2天、2→4天、3→7天、4→15天 */
export const REVIEW_INTERVALS = [1, 2, 4, 7, 15]

/** 新笔记进复习池 / 手动加入时的首次复习时间（明天） */
export function firstReviewDate(): number {
  return Date.now() + REVIEW_INTERVALS[0] * 86400000
}

/**
 * 计算复习后的下一步状态。
 * 认识：step+1，并按新档位间隔排下次复习；到 5 视为已掌握（不再排期）。
 * 忘记：归 0 档，明天再见。
 */
export function nextReviewState(
  curStep: number,
  known: boolean
): { reviewStep: number; nextReviewDate: number | null } {
  if (known) {
    const step = curStep + 1
    return step >= 5
      ? { reviewStep: 5, nextReviewDate: null }
      : { reviewStep: step, nextReviewDate: Date.now() + REVIEW_INTERVALS[step] * 86400000 }
  }
  return { reviewStep: 0, nextReviewDate: firstReviewDate() }
}

/** 笔记是否今日待复习（按日粒度比较：排期日 <= 今天即到期） */
export function isNoteDue(note: { nextReviewDate: number | null }, today: string): boolean {
  return note.nextReviewDate !== null && dateStr(new Date(note.nextReviewDate)) <= today
}
