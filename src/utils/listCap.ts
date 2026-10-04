// 列表限高钩子：条数超过 cap 时，量取前 cap 条主行（.task-row-main，高度不受展开影响）
// 的实际高度 + 间距，得到容器固定高度 → 卡片只露 cap 条，其余卡内上下滑动；
// 展开子任务时容器高度不变（子区在滚动内容里把后面的行往下顶）
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'

/**
 * @param listSel 列表容器选择器（如 '.ck-list'），须是页面内唯一的
 * @param rowSel  主行选择器（如 '.ck-list .task-row-main'）
 * @param count   当前条数（变化时重测）
 * @param cap     一屏最多展示条数
 * @param gap     行间距 px（与 CSS 中 .task-list 的 gap 一致）
 * @returns       超过 cap 条 → 固定高度 px；不足 → undefined（自然高度）
 */
export function useListCapHeight(
  listSel: string,
  rowSel: string,
  count: number,
  cap: number,
  gap = 8
): number | undefined {
  const [h, setH] = useState<number | undefined>()

  useEffect(() => {
    if (count <= cap) {
      setH(undefined)
      return
    }
    const q = Taro.createSelectorQuery()
    q.selectAll(rowSel).fields({ size: true })
    q.exec((res) => {
      const rects = (res?.[0] || []) as { height: number }[]
      const top = rects.slice(0, cap)
      if (top.length < cap) return
      setH(Math.ceil(top.reduce((s, r) => s + r.height, 0) + gap * (cap - 1)))
    })
  }, [count, cap, gap, rowSel, listSel])

  return h
}
