import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, View } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface FocusScrollProps {
  className?: string
  style?: React.CSSProperties
  /** 列表内容变化时传入（如条数/范围），触发重新量取条目位置 */
  measureKey?: string | number
  /** 条目正对中心时的最大放大倍率（默认 1.06：靠近中心渐大，离开中心回落到原尺寸） */
  maxScale?: number
  children?: React.ReactNode
}

let uidSeq = 0

/**
 * 中心聚焦滚动容器（scrollY）：
 * 上下滚动时，靠近容器视觉中心的条目逐渐放大，离开中心后慢慢缩回原尺寸，
 * 让用户注意力自然落在当前内容上。
 * 原理：一次量取各条目在内容中的偏移，滚动时按「条目中心 → 容器中心」距离算缩放。
 * 注意：缩放范围限定在 [1, maxScale]（只放大不缩小），避免 <1 缩放造成的
 * 亚像素渲染（边框、文字发虚）。
 */
const FocusScroll: React.FC<FocusScrollProps> = ({
  className,
  style,
  measureKey,
  maxScale = 1.06,
  children
}) => {
  const idRef = useRef(`fs-${++uidSeq}`)
  // 量取结果：各条目内容偏移 / 高度、容器中心（视口坐标）、衰减半径
  const topsRef = useRef<number[]>([])
  const heightsRef = useRef<number[]>([])
  const centerRef = useRef(0)
  const halfRef = useRef(1)
  const scrollTopRef = useRef(0)
  const lastTickRef = useRef(0)
  const settleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [scales, setScales] = useState<number[]>([])
  const [trans, setTrans] = useState('transform .25s ease-out')

  const apply = useCallback(
    (st: number, transition: string) => {
      const half = halfRef.current
      const center = centerRef.current
      const next = topsRef.current.map((top, i) => {
        const itemCenter = top + heightsRef.current[i] / 2 - st
        const d = Math.abs(itemCenter - center)
        const t = Math.max(0, 1 - d / half) // 1=正对中心 0=衰减尽头
        // 中心放大、边缘 1:1 原尺寸；量化到 0.01 步长，减少无谓的 setData
        return Math.round((1 + (maxScale - 1) * t) * 100) / 100
      })
      setScales(next)
      setTrans(transition)
    },
    [maxScale]
  )

  const measure = useCallback(() => {
    const id = idRef.current
    const q = Taro.createSelectorQuery()
    q.select(`#${id}`).boundingClientRect()
    q.select(`#${id}`).scrollOffset()
    q.selectAll(`#${id} .fs-item`).boundingClientRect()
    q.exec((res) => {
      const cRect = res[0] as Taro.NodesRef.BoundingClientRectCallbackResult | null
      const sc = res[1] as { scrollTop: number } | null
      const rects = (res[2] || []) as Taro.NodesRef.BoundingClientRectCallbackResult[]
      if (!cRect || typeof cRect.height !== 'number') return
      centerRef.current = cRect.top + cRect.height / 2
      halfRef.current = Math.max(1, cRect.height / 2)
      scrollTopRef.current = sc?.scrollTop ?? 0
      topsRef.current = rects.map((r) => r.top - cRect.top + scrollTopRef.current)
      heightsRef.current = rects.map((r) => r.height)
      apply(scrollTopRef.current, 'transform .25s ease-out')
    })
  }, [apply])

  // 初次渲染 + 内容变化时重新量取
  useEffect(() => {
    measure()
  }, [measure, measureKey])

  const onScroll = useCallback(
    (e: { detail: { scrollTop: number } }) => {
      const st = e.detail.scrollTop
      scrollTopRef.current = st
      // 滚动中用短过渡（0.1s）平滑跟随，停滚后用长过渡（0.25s）缓动收尾对齐
      const now = Date.now()
      if (now - lastTickRef.current >= 50) {
        lastTickRef.current = now
        apply(st, 'transform .1s ease-out')
      }
      if (settleRef.current) clearTimeout(settleRef.current)
      settleRef.current = setTimeout(() => apply(scrollTopRef.current, 'transform .25s ease-out'), 120)
    },
    [apply]
  )

  useEffect(() => {
    return () => {
      if (settleRef.current) clearTimeout(settleRef.current)
    }
  }, [])

  let idx = -1
  const items = React.Children.map(children, (child) => {
    // 空态占位（false/null/纯文本）不参与聚焦
    if (!React.isValidElement(child)) return child
    idx += 1
    const i = idx
    return (
      <View
        className="fs-item"
        key={(child as React.ReactElement<any>).key ?? i}
        style={{
          transform: `scale(${scales[i] ?? 1})`,
          transformOrigin: 'center center',
          transition: trans
        }}
      >
        {child}
      </View>
    )
  })

  return (
    <ScrollView scrollY id={idRef.current} className={className} style={style} onScroll={onScroll}>
      <View>{items}</View>
    </ScrollView>
  )
}

export default FocusScroll
