// 页面级左右滑动切 tab：5 个 tab 页根节点挂 onTouchStart/onTouchEnd，页面任意位置横滑触发 switchTab（无切换动画）。
// 手势排除：横向手势专属组件（SwipeRow 左滑删除、横滚条等）在自身 touchstart 里调用 blockTabSwipe，
// 该轮手势不再切页；touchstart 冒泡顺序为内层先于页面根节点，故根节点读到的已是置脏后的值。
// setTimeout(0) 清脏：即使冒泡被 catch 打断也能自愈，不误伤下一轮手势。
import { useCallback, useEffect, useRef } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'

/** 与 app.config tabBar.list 顺序一致 */
const TAB_PATHS = [
  'pages/today/index',
  'pages/courses/index',
  'pages/checkin/index',
  'pages/life/index',
  'pages/settings/index',
]

let blocked = false

/* ---------------- tab 序号广播（页面自报 + tabBar 订阅） ----------------
   自定义 tabBar 是组件，mount 瞬间页面栈/route 内省常指向上一页（选中态落后一格的根因），
   且延迟重试也不收敛。改为：tab 页在 mount/useDidShow 时主动广播自身 tab 序号，
   tabBar 订阅对齐——页面自身最清楚自己是谁，不依赖任何 route 时序。
   走 Taro.eventCenter（运行时全局单例），避免模块级状态在 chunk 拆分下不同实例。 */

const TAB_IDX_EVENT = 'tabbar:tab-idx'
let lastTabIdx = -1

/** 页面广播自身 tab 序号（mount/useDidShow 调用） */
export function broadcastTabIdx(idx: number): void {
  lastTabIdx = idx
  Taro.eventCenter.trigger(TAB_IDX_EVENT, idx)
}

/** tabBar 订阅 tab 序号广播；若已有广播记录则立即对齐（覆盖订阅晚于页面广播的时序），
 *  返回取消订阅函数 */
export function subscribeTabIdx(fn: (idx: number) => void): () => void {
  Taro.eventCenter.on(TAB_IDX_EVENT, fn)
  if (lastTabIdx >= 0) fn(lastTabIdx)
  return () => {
    Taro.eventCenter.off(TAB_IDX_EVENT, fn)
  }
}

/** 横向手势组件在自身 touchstart 调用：本轮手势禁止页面级滑动切 tab */
export const blockTabSwipe = (): void => {
  blocked = true
  setTimeout(() => {
    blocked = false
  }, 0)
}

interface TouchPoint {
  clientX: number
  clientY: number
}

/** 挂在 tab 页根节点：横滑超过阈值且横向占优时切相邻 tab（左滑下一个、右滑上一个）。
 *  tabIdx 为本页在 tabBar.list 中的序号：mount/useDidShow 时广播给 tabBar 对齐选中态，
 *  滑动切页也以它为基准（不再内省 route） */
export function useTabSwipe(tabIdx: number): {
  onTouchStart: (e: any) => void
  onTouchEnd: (e: any) => void
} {
  const startRef = useRef<TouchPoint | null>(null)
  const busyRef = useRef(false)

  // 自报家门：tabBar 订阅后对齐选中态（页面显示必经之路，天然覆盖切换/返回）
  useEffect(() => {
    broadcastTabIdx(tabIdx)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useDidShow(() => {
    broadcastTabIdx(tabIdx)
  })

  const onTouchStart = useCallback((e: any) => {
    // 内层横向手势组件已置脏：本轮不记录起点
    if (blocked) {
      startRef.current = null
      return
    }
    const t = (e.touches as TouchPoint[] | undefined)?.[0]
    startRef.current = t ? { clientX: t.clientX, clientY: t.clientY } : null
  }, [])

  const onTouchEnd = useCallback((e: any) => {
    const s = startRef.current
    startRef.current = null
    if (!s || busyRef.current) return
    const t = (e.changedTouches as TouchPoint[] | undefined)?.[0]
    if (!t) return
    const dx = t.clientX - s.clientX
    const dy = t.clientY - s.clientY
    if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy) * 1.3) return
    const next = tabIdx + (dx < 0 ? 1 : -1)
    if (next < 0 || next >= TAB_PATHS.length) return
    busyRef.current = true
    Taro.switchTab({
      url: `/${TAB_PATHS[next]}`,
      complete: () => {
        setTimeout(() => {
          busyRef.current = false
        }, 300)
      },
    })
  }, [tabIdx])

  return { onTouchStart, onTouchEnd }
}
