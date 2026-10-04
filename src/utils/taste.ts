// 口味画像与 AI 上下文构建（food 页与 ai-chat 页共用）
// 注：Taro 页面模块只保留 default 导出，跨页复用的纯函数须放 utils
import type { FoodItem, Settings } from '../types'

/** 口味画像正/负向累加 + 常选记录（liked/disliked 按菜名 tags 计数，无 tags 时用菜名本身） */
export function nextTasteProfile(
  foods: FoodItem[],
  cur: Settings['tasteProfile'],
  name: string,
  dir: 'liked' | 'disliked',
  picked = false
): NonNullable<Settings['tasteProfile']> {
  const food = foods.find((x) => x.name === name)
  const keys = food && food.tags.length > 0 ? food.tags : [name]
  const base = cur ?? { liked: {}, disliked: {}, picked: [] }
  const next = {
    liked: { ...base.liked },
    disliked: { ...base.disliked },
    picked: picked ? [...base.picked.filter((x) => x !== name), name].slice(-10) : [...base.picked],
  }
  for (const k of keys) next[dir][k] = (next[dir][k] ?? 0) + 1
  return next
}

/** AI 上下文构建：口味画像 Top 标签 + 今日已吃 + 已剔除项（越用越懂你） */
export function buildFoodChatCtx(
  prof: Settings['tasteProfile'],
  eatenToday: string[],
  exclude: string[]
): string[] {
  const top = (rec: Record<string, number> | undefined) =>
    rec ? Object.entries(rec).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k) : []
  const liked = top(prof?.liked)
  const disliked = top(prof?.disliked)
  const ctx: string[] = []
  if (liked.length || disliked.length || prof?.picked?.length) {
    ctx.push(
      `用户口味画像：${liked.length ? '喜欢 ' + liked.join('、') + '；' : ''}` +
        `${disliked.length ? '不喜欢 ' + disliked.join('、') + '；' : ''}` +
        `${prof?.picked?.length ? '最近常选 ' + prof.picked.slice(-5).join('、') : ''}`
    )
  }
  if (eatenToday.length) ctx.push(`今天已吃：${eatenToday.join('、')}，避免重复`)
  if (exclude.length) ctx.push(`用户已剔除/明确不要：${exclude.join('、')}，绝对不要再推荐`)
  return ctx
}
