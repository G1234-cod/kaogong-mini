// 记账分类常量（原样迁移自 PWA store.tsx）

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
  { name: '其他', emoji: '💰' },
]
