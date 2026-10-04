// 错题本数据域（quizBook）共享逻辑：作答结算（错题本卡片自评 / 练习页刷题共用，两处口径必须一致）
import type { QuizBook, QuizWrong } from '../types'
import { nextReviewState, noteReviewState } from './review'

/**
 * 作答该题后是否会毕业：连续做对 3 次自动标记掌握（移出复习队列）。
 * 需在 set 前用当前快照调用（set 更新器在渲染期才执行，拿不到返回值）。
 */
export function willGraduate(cur: QuizWrong | undefined, correct: boolean): boolean {
  return correct && (cur?.correctStreak || 0) + 1 >= 3
}

/**
 * 结算单题作答，返回 quizBook 新值：
 * 对 → FSRS 评分后排期后移 + 连对 +1（连对 3 次毕业）；错 → 重排 + 错次 +1 + 连对清零。
 */
export function settleQuizWrong(prev: QuizBook, quizId: number, correct: boolean): QuizBook {
  const cur = prev.wrongs.find((w) => w.quizId === quizId)
  if (!cur) return prev
  const streak = correct ? (cur.correctStreak || 0) + 1 : 0
  const graduated = correct && streak >= 3
  return {
    ...prev,
    stats: {
      answered: prev.stats.answered + 1,
      wrong: prev.stats.wrong + (correct ? 0 : 1),
    },
    wrongs: prev.wrongs.map((w) => {
      if (w.quizId !== quizId) return w
      if (graduated) return { ...w, correctStreak: streak, nextReviewDate: null }
      const rated = nextReviewState(
        noteReviewState(w),
        correct ? (streak >= 2 ? 'easy' : 'good') : 'again'
      )
      return {
        ...w,
        correctStreak: streak,
        wrongCount: correct ? w.wrongCount : w.wrongCount + 1,
        lastWrongAt: correct ? w.lastWrongAt : Date.now(),
        review: rated.review,
        nextReviewDate: rated.nextReviewDate,
      }
    }),
  }
}
