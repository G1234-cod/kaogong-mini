// 记账分类常量（原样迁移自 PWA store.tsx）
// 注意：分类运行时数据在 AppData.ledgerCats 域（用户可增改删），本文件提供默认值与图标库

import type { LedgerCategory } from '../types'

export const EXPENSE_CATEGORIES: { name: string; emoji: string }[] = [
  { name: '餐饮', emoji: '🍜' },
  { name: '交通', emoji: '🚌' },
  { name: '日用', emoji: '🧻' },
  { name: '学习', emoji: '📚' },
  { name: '娱乐', emoji: '🎮' },
  { name: '通讯', emoji: '📱' },
  { name: '医疗', emoji: '💊' },
  { name: '其他', emoji: '📦' },
]

export const INCOME_CATEGORIES: { name: string; emoji: string }[] = [
  { name: '生活费', emoji: '🏠' },
  { name: '退款', emoji: '↩️' },
  { name: '兼职', emoji: '💼' },
  { name: '奖学金', emoji: '🎓' },
  { name: '红包', emoji: '🧧' },
  { name: '理财收益', emoji: '📈' },
  { name: '二手转卖', emoji: '🛍️' },
  { name: '其他', emoji: '💰' },
]

/** 分类图标库（分类管理页选择器用） */
export const EMOJI_LIBRARY: string[] = [
  '🍜', '🍲', '🍚', '🍣', '🥗', '🍔', '🍕', '🧋', '☕', '🍰',
  '🍎', '🥚', '🥛', '🍺', '🧁', '🍫',
  '🚌', '🚇', '🚲', '🚗', '🛵', '⛽', '🅿️', '🚄',
  '🧻', '🧴', '🧹', '🧺', '💡', '🔑', '🔌', '🔋', '🛠️',
  '📚', '✏️', '📝', '🎓', '🖨️', '🧮',
  '🎮', '🎬', '🎵', '🎤', '🏀', '⚽', '🏃', '🎣',
  '🏠', '🎁', '🧧', '📈', '🛍️', '↩️', '💼', '💊', '🏥', '❤️',
  '🐱', '🐶', '🌟', '📦', '💰', '🐱‍💻',
]

/** ledgerCats 域默认值：builtin=内置（不可删，可改名改图标）；locked=「其他」（不可删不可改名，删除归并目标） */
export const DEFAULT_LEDGER_CATS: { expense: LedgerCategory[]; income: LedgerCategory[] } = {
  expense: EXPENSE_CATEGORIES.map((c) => ({ ...c, builtin: true, locked: c.name === '其他' })),
  income: INCOME_CATEGORIES.map((c) => ({ ...c, builtin: true, locked: c.name === '其他' })),
}
