// 打卡共享逻辑：频率文案、下次打卡计算、统一排序、自动图标、叶子展开、勾选语义（勾选只记叶子 id）
// 完成判定：有子项时叶子全勾才算完成（递归展开到最深叶子；注意后端 _item_done 只查直接子级，多层嵌套时口径不同）
import type { CheckinChild, CheckinItem } from '../types'
import { addDays, dateStr, daysBetween, startOfWeek } from './date'

/** 星期标签（下标即 freqDays 取值：0=周日 … 6=周六） */
export const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六']

/** 频率文案：六模式摘要；daily 为默认不显示 */
export function freqText(item: CheckinItem): string {
  const count = item.freqCount ?? 0
  switch (item.freq) {
    case 'weekly': {
      const days = [...new Set(item.freqDays ?? [])].sort((a, b) => a - b).filter((d) => d >= 0 && d <= 6)
      return days.length > 0 ? `每周 ${days.map((d) => WEEKDAY_LABELS[d]).join('')}` : '每周自定义'
    }
    case 'weeklyN':
      return `每周 ${count} 次`
    case 'monthlyN':
      return `每月 ${count} 次`
    case 'monthlyDays': {
      const dates = [...new Set(item.freqDays ?? [])].sort((a, b) => a - b).filter((d) => d >= 1 && d <= 31)
      return dates.length > 0 ? `每月 ${dates.join('、')} 号` : '每月自定义'
    }
    case 'dailyN':
      return `每天 ${count} 次`
    default:
      return ''
  }
}

/** 展开为叶子 id（无子项记自身 id；有子项记叶子 id） */
export function leafIds(item: CheckinChild | CheckinItem): string[] {
  const kids = item.children ?? []
  if (kids.length === 0) return [item.id]
  return kids.flatMap(leafIds)
}

/** 叶子节点平铺（含层级深度，抽屉渲染用） */
export function flattenLeaves(
  item: CheckinChild | CheckinItem
): { id: string; name: string; emoji?: string; depth: number }[] {
  const kids = item.children ?? []
  if (kids.length === 0) return [{ id: item.id, name: item.name, emoji: item.emoji, depth: 0 }]
  return kids.flatMap((c) => flattenLeaves(c).map((x) => ({ ...x, depth: x.depth + 1 })))
}

/** 全部子节点平铺（含分组父层，详情弹窗渲染用）：isLeaf=false 的层只展示/可删不可勾 */
export function flattenNodes(
  item: CheckinChild | CheckinItem
): { id: string; name: string; emoji?: string; depth: number; isLeaf: boolean }[] {
  return (item.children ?? []).flatMap((c) => {
    const self = { id: c.id, name: c.name, emoji: c.emoji, depth: 0, isLeaf: (c.children ?? []).length === 0 }
    return [self, ...flattenNodes(c).map((x) => ({ ...x, depth: x.depth + 1 }))]
  })
}

/** 递归删除子节点（删到哪层都行），返回新的 children */
export function removeChildNode(children: CheckinChild[], id: string): CheckinChild[] {
  return children
    .filter((c) => c.id !== id)
    .map((c) => ({ ...c, children: c.children ? removeChildNode(c.children, id) : undefined }))
}

/** 递归改名子节点（改到哪层都行），返回新的 children */
export function renameChildNode(children: CheckinChild[], id: string, name: string): CheckinChild[] {
  return children.map((c) =>
    c.id === id
      ? { ...c, name }
      : { ...c, children: c.children ? renameChildNode(c.children, id, name) : undefined }
  )
}

/** 某项是否完成：叶子全勾 */
export function isItemDone(item: CheckinChild | CheckinItem, ids: string[]): boolean {
  return leafIds(item).every((id) => ids.includes(id))
}

/** 项的叶子进度 */
export function leafProgress(item: CheckinChild | CheckinItem, ids: string[]): { done: number; total: number } {
  const leaves = leafIds(item)
  return { done: leaves.filter((id) => ids.includes(id)).length, total: leaves.length }
}

/** 勾选整项：未完成→补全全部叶子；已完成→取消全部叶子 */
export function toggleItemIds(item: CheckinChild | CheckinItem, ids: string[]): string[] {
  const leaves = leafIds(item)
  return isItemDone(item, ids)
    ? ids.filter((x) => !leaves.includes(x))
    : [...ids, ...leaves.filter((id) => !ids.includes(id))]
}

/** 单叶子勾选切换 */
export function toggleLeafId(ids: string[], leafId: string): string[] {
  return ids.includes(leafId) ? ids.filter((x) => x !== leafId) : [...ids, leafId]
}

/* ---------- 下次打卡计算与统一排序（打卡页 / 今日页共用） ---------- */

/** 区间内 [from, to] 有打卡痕迹的天数（任一叶子被勾即算该天，weeklyN/monthlyN 进度用） */
function markedDays(
  checkins: Record<string, string[]>,
  item: CheckinItem,
  from: string,
  to: string
): number {
  const leaves = leafIds(item)
  let n = 0
  for (let d = from; d <= to; d = addDays(d, 1)) {
    const ids = checkins[d] ?? []
    if (leaves.some((id) => ids.includes(id))) n++
  }
  return n
}

/**
 * 下次该打卡的日期（含今天）：
 * - daily/dailyN：今天没打完 → 今天；打完 → 明天
 * - weekly（每周指定星期几）：今天是打卡日且没打完 → 今天；否则往后找最近的选中星期
 * - weeklyN（每周 N 次，不限日）：本周次数没打满 → 今天；满了 → 下周一
 * - monthlyN：本月次数没打满 → 今天；满了 → 下月 1 号
 * - monthlyDays（每月指定几号）：今天命中且没打完 → 今天；否则往后找最近的选中日期
 */
export function nextCheckinDate(
  item: CheckinItem,
  checkins: Record<string, string[]>,
  today: string
): string {
  const ids = checkins[today] ?? []
  const done = isItemDone(item, ids)
  const freq = item.freq ?? 'daily'
  const weekday = new Date(today + 'T00:00:00').getDay() // 0=周日 … 6=周六
  const dayOfMonth = Number(today.slice(8))
  switch (freq) {
    case 'weekly': {
      const days = (item.freqDays ?? []).filter((d) => d >= 0 && d <= 6)
      if (days.length === 0) return done ? addDays(today, 1) : today
      if (days.includes(weekday) && !done) return today
      for (let i = 1; i <= 7; i++) {
        const ds = addDays(today, i)
        if (days.includes(new Date(ds + 'T00:00:00').getDay())) return ds
      }
      return addDays(today, 1)
    }
    case 'weeklyN': {
      const n = item.freqCount ?? 1
      const monday = startOfWeek(today)
      return markedDays(checkins, item, monday, today) < n ? today : addDays(monday, 7)
    }
    case 'monthlyN': {
      const n = item.freqCount ?? 1
      const monthStart = today.slice(0, 8) + '01'
      if (markedDays(checkins, item, monthStart, today) < n) return today
      const nm = new Date(today + 'T00:00:00')
      nm.setMonth(nm.getMonth() + 1)
      nm.setDate(1)
      return dateStr(nm)
    }
    case 'monthlyDays': {
      const days = (item.freqDays ?? []).filter((d) => d >= 1 && d <= 31)
      if (days.length === 0) return done ? addDays(today, 1) : today
      if (days.includes(dayOfMonth) && !done) return today
      for (let i = 1; i <= 62; i++) {
        const ds = addDays(today, i)
        if (days.includes(Number(ds.slice(8)))) return ds
      }
      return addDays(today, 1)
    }
    default:
      // daily / dailyN 及兜底
      return done ? addDays(today, 1) : today
  }
}

/** 今天是否需要打卡（下次日期 = 今天） */
export function isDueToday(
  item: CheckinItem,
  checkins: Record<string, string[]>,
  today: string
): boolean {
  return nextCheckinDate(item, checkins, today) === today
}

/** 下次打卡的友好文案：今天 / 明天 / 后天 / 10月5日（不带年份） */
export function dueLabel(next: string, today: string): string {
  const diff = daysBetween(today, next)
  if (diff <= 0) return '今天'
  if (diff === 1) return '明天'
  if (diff === 2) return '后天'
  return `${Number(next.slice(5, 7))}月${Number(next.slice(8))}日`
}

/**
 * 打卡列表统一排序（打卡页 / 今日页同一口径）：
 * 今天未完成（按下次日期升序，今天在最上）→ 明天、后天… → 今天已完成的沉到最末尾
 */
export function sortCheckinItemsForDisplay(
  items: CheckinItem[],
  checkins: Record<string, string[]>,
  today: string
): CheckinItem[] {
  const ids = checkins[today] ?? []
  return items
    .map((it, i) => ({
      it,
      i,
      doneToday: isItemDone(it, ids),
      next: nextCheckinDate(it, checkins, today),
    }))
    .sort(
      (a, b) =>
        Number(a.doneToday) - Number(b.doneToday) || a.next.localeCompare(b.next) || a.i - b.i
    )
    .map((x) => x.it)
}

/* ---------- 自动图标：不再让用户手选，按名称关键词配；匹配不到按名称哈希取（同名稳定） ---------- */

const AUTO_EMOJI_RULES: [RegExp, string][] = [
  [/跑|步|运动|健身|锻炼|瑜伽|拉伸/, '🏃'],
  [/申论|范文|读|书|阅|素材|摘抄/, '📖'],
  [/字|写|抄|笔记|日记/, '✍️'],
  [/题|刷|行测|算|数量|资料|言语|判断|常识/, '🧮'],
  [/时政|新闻|报|联播|热点/, '📰'],
  [/水|喝|饮/, '💧'],
  [/药|医|体检|维生素/, '💊'],
  [/睡|早睡|作息|午休/, '😴'],
  [/饭|吃|餐|食|做菜/, '🍚'],
  [/背|记|单词|背诵|积累/, '📝'],
  [/课|听|学|网课|视频/, '🎧'],
  [/琴|画|棋|舞|乐器|书法/, '🎨'],
  [/花|草|植物|浇/, '🌱'],
  [/扫|洗|衣|床单|家务|整理|收纳/, '🧺'],
  [/冥|静|放松|呼吸/, '🧘'],
  [/戒|控|不.{0,2}手机/, '🚭'],
]

const AUTO_EMOJI_POOL = ['🎯', '💪', '🌞', '⭐', '🍀', '🔥', '✨', '🏆', '📌', '🌈']

/** 按名称自动配图标：关键词映射优先，兜底按名称哈希从精选池取（同名结果稳定不闪变） */
export function autoEmoji(name: string): string {
  for (const [re, emoji] of AUTO_EMOJI_RULES) if (re.test(name)) return emoji
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return AUTO_EMOJI_POOL[h % AUTO_EMOJI_POOL.length]
}
