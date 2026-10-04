import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { subscribeTabIdx } from '../utils/tabSwipe'
import './index.scss'

/** 与 app.config tabBar.list 保持一致 */
const TABS = [
  { pagePath: 'pages/today/index', text: '今日' },
  { pagePath: 'pages/courses/index', text: '课程' },
  { pagePath: 'pages/checkin/index', text: '打卡' },
  { pagePath: 'pages/life/index', text: '生活' },
  { pagePath: 'pages/settings/index', text: '设置' }
]
/** pill 距每个槽位左右两侧的内缩 */
const GAP = 8

/** 槽位宽度（px）。windowWidth 为逻辑像素，与样式 px 一致 */
const slotW = (): number => Taro.getSystemInfoSync().windowWidth / TABS.length
const pillW = (): number => slotW() - GAP * 2

interface PillStyle {
  left: string
  width: string
  transform: string
}

/** 指示背景：锚在槽 0（left=GAP、宽=槽宽-2*GAP），位置由 translateX 驱动。
 *  left/width 用运行时 px 直下发，避免编译器 px→rpx 换算与 translateX 产生基准偏差。
 *  按需求不做切换动画，直接落位。 */
const pillAt = (i: number): PillStyle => ({
  left: `${GAP}px`,
  width: `${pillW()}px`,
  transform: `translateX(${i * slotW()}px)`
})

/** route → tab 序号；判定不出返回 -1（仅作为订阅广播到来前的初始兜底） */
const routeToIdx = (route: string): number => TABS.findIndex((t) => route.includes(t.pagePath))

/** 初始兜底：订阅广播前先尽力猜一次（猜错也无妨，页面 mount 广播会立即纠正） */
const guessIdx = (): number => {
  try {
    const pages = Taro.getCurrentPages()
    const route = pages.length ? pages[pages.length - 1].route ?? '' : ''
    return routeToIdx(route)
  } catch {
    return -1
  }
}

interface TouchPoint {
  clientX: number
  clientY: number
}
interface TouchLike {
  touches?: TouchPoint[]
  changedTouches?: TouchPoint[]
}

const CustomTabBar: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(guessIdx)
  const [pill, setPill] = useState<PillStyle>(() => pillAt(Math.max(0, guessIdx())))
  const ownIdxRef = useRef(Math.max(0, guessIdx()))
  const switchingRef = useRef(false)
  const touchRef = useRef<TouchPoint>({ clientX: 0, clientY: 0 })
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // 订阅页面广播的 tab 序号：页面 mount/useDidShow 自报家门，选中态以页面为准，
    // 不再靠 route 内省 + 延迟重试（时序不可靠，曾导致错位一格）
    const unsubscribe = subscribeTabIdx((i) => {
      if (i < 0 || i >= TABS.length) return
      ownIdxRef.current = i
      setActiveIdx(i)
      setPill(pillAt(i))
    })
    return () => {
      unsubscribe()
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    }
  }, [])

  /** 切换主题：点击 tab 或在 tabBar 左右滑动，立即 switchTab（无切换动画） */
  const go = useCallback((j: number) => {
    if (j < 0 || j >= TABS.length) return
    if (j === ownIdxRef.current || switchingRef.current) return
    switchingRef.current = true
    // 乐观更新：点击瞬间先把选中态落到目标 tab，不等页面切换回来再对齐
    ownIdxRef.current = j
    setActiveIdx(j)
    setPill(pillAt(j))
    Taro.switchTab({
      url: `/${TABS[j].pagePath}`,
      complete: () => {
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
        resetTimerRef.current = setTimeout(() => {
          switchingRef.current = false
        }, 300)
      }
    })
  }, [])

  const onTouchStart = useCallback((e: any) => {
    // Taro 事件类型未声明 touches，运行时（weapp 触摸事件）实际携带
    const t = (e as TouchLike).touches?.[0]
    if (t) touchRef.current = { clientX: t.clientX, clientY: t.clientY }
  }, [])

  const onTouchEnd = useCallback(
    (e: any) => {
      const t = (e as TouchLike).changedTouches?.[0]
      if (!t) return
      const dx = t.clientX - touchRef.current.clientX
      const dy = t.clientY - touchRef.current.clientY
      // 横向滑动超过阈值视为滑动切页：左滑下一个、右滑上一个
      if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        go(ownIdxRef.current + (dx < 0 ? 1 : -1))
      }
    },
    [go]
  )

  return (
    <View className="ctb">
      <View className="ctb-bar" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <View className="ctb-pill" style={pill} />
        {TABS.map((t, i) => (
          <View
            key={t.pagePath}
            className={`ctb-item ${i === activeIdx ? 'on' : ''}`}
            hoverClass="none"
            onClick={() => go(i)}
          >
            <View className={`ctb-text ${i === activeIdx ? 'on' : ''}`}>{t.text}</View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default CustomTabBar
