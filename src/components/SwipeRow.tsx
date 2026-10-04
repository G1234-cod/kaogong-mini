// 左滑删除行（P1 新增）：touch 位移右滑露出 80px 删除按钮，位移 >40px 吸附否则回弹；
// 删除触发 onDelete（调用方自行 appConfirm 确认）；一次只打开一行（模块级记录当前打开行）
import { useRef, useState } from 'react'
import { View, type ITouchEvent } from '@tarojs/components'
import { blockTabSwipe } from '../utils/tabSwipe'

type TouchEv = ITouchEvent

const THRESHOLD = 40
const ACTION_WIDTH = 80

let openClose: (() => void) | null = null

export default function SwipeRow({
  children,
  onDelete,
  deleteText = '删除',
}: {
  children: React.ReactNode
  /** 删除回调；不传则不出删除按钮（如批量管理模式下禁用单删） */
  onDelete?: () => void
  deleteText?: string
}) {
  const [offset, setOffset] = useState(0)
  const startX = useRef(0)
  const startY = useRef(0)
  const base = useRef(0)
  const dragging = useRef(false)
  const moved = useRef(false)
  // 滑动结束后浏览器会补发一次 click：盖 350ms 透明盾吞掉，避免误触行内按钮（误弹详情/误勾选）
  const [shield, setShield] = useState(false)

  const close = () => {
    base.current = 0
    setOffset(0)
    if (openClose === close) openClose = null
  }

  const open = () => {
    if (openClose && openClose !== close) openClose()
    base.current = -ACTION_WIDTH
    setOffset(-ACTION_WIDTH)
    openClose = close
  }

  const onTouchStart = (e: any) => {
    // 左滑删除与页面级横滑切 tab 冲突：置脏本轮手势，禁止切页
    blockTabSwipe()
    if (!onDelete) return // 无删除按钮时不做左滑
    const t = (e as TouchEv).touches[0]
    startX.current = t.clientX
    startY.current = t.clientY
    dragging.current = true
    moved.current = false
  }

  const onTouchMove = (e: any) => {
    if (!dragging.current) return
    const t = (e as TouchEv).touches[0]
    const dx = t.clientX - startX.current
    const dy = t.clientY - startY.current
    if (!moved.current) {
      if (Math.abs(dy) > Math.abs(dx)) {
        dragging.current = false
        return
      }
      if (Math.abs(dx) < 5) return
      moved.current = true
    }
    const next = Math.min(0, Math.max(-ACTION_WIDTH, base.current + dx))
    setOffset(next)
  }

  const onTouchEnd = (e: any) => {
    if (!dragging.current) return
    dragging.current = false
    if (!moved.current) return
    setShield(true)
    setTimeout(() => setShield(false), 350)
    const t = (e as TouchEv).changedTouches[0]
    const dx = t.clientX - startX.current
    const total = base.current + dx
    if (total <= -THRESHOLD) open()
    else close()
  }

  return (
    <View className='swipe-row'>
      {onDelete && (
        <View
          className='swipe-row-action'
          onClick={() => {
            close()
            onDelete()
          }}
        >
          {deleteText}
        </View>
      )}
      <View
        className='swipe-row-inner'
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {children}
        {shield && <View className='swipe-row-shield' onClick={(e: any) => e.stopPropagation()} />}
      </View>
    </View>
  )
}
