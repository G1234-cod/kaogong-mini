// 自研日期选择器（底部弹层日历，周一起始）
// 保持硬约束：禁用原生日期控件，自定义 DatePicker 确保样式与渲染一致性
// Taro 迁移：button→View、span→Text、遮罩 catchMove
import { useMemo, useState } from 'react'
import { Text, View } from '@tarojs/components'
import { dateStr, todayStr } from '../utils/date'
import Icon from './Icon'
import Modal from './Modal'

const WEEK = ['一', '二', '三', '四', '五', '六', '日']

function ymOf(ds: string) {
  return { y: Number(ds.slice(0, 4)), m: Number(ds.slice(5, 7)) }
}

/** 2026-09-22 → 「9月22日」，非当年带年份「2027年3月14日」 */
export function fmtDateShort(ds: string): string {
  const { y, m } = ymOf(ds)
  const d = Number(ds.slice(8, 10))
  return (y !== new Date().getFullYear() ? `${y}年` : '') + `${m}月${d}日`
}

function fmtFull(ds: string): string {
  const { y, m } = ymOf(ds)
  return `${y}年${m}月${Number(ds.slice(8, 10))}日`
}

export default function DatePicker({
  value,
  onChange,
  placeholder = '选日期',
  compact = false,
  fmt,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  compact?: boolean
  /** 自定义触发器显示文案（如专注记录年档只显示「2026年」）；缺省按 compact 取短/长格式 */
  fmt?: (v: string) => string
}) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => ymOf(value || todayStr()))
  const today = todayStr()

  /** 月视图格子：上月尾巴 + 本月 + 下月补行，每格携带真实日期串 */
  const cells = useMemo(() => {
    const { y, m } = view
    const daysInMonth = new Date(y, m, 0).getDate()
    const offset = (new Date(y, m - 1, 1).getDay() + 6) % 7 // 周一起始
    const prevDays = new Date(y, m - 1, 0).getDate()
    const list: { ds: string; day: number; inMonth: boolean }[] = []
    for (let i = offset; i > 0; i--)
      list.push({ ds: dateStr(new Date(y, m - 2, prevDays - i + 1)), day: prevDays - i + 1, inMonth: false })
    for (let d = 1; d <= daysInMonth; d++)
      list.push({ ds: dateStr(new Date(y, m - 1, d)), day: d, inMonth: true })
    let n = 1
    while (list.length % 7 !== 0) {
      list.push({ ds: dateStr(new Date(y, m, n)), day: n, inMonth: false })
      n++
    }
    return list
  }, [view])

  const pick = (ds: string) => {
    onChange(ds)
    setOpen(false)
  }

  const shift = (delta: number) =>
    setView((v) => {
      const d = new Date(v.y, v.m - 1 + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() + 1 }
    })

  return (
    <>
      <View
        className={`dp-trigger${compact ? ' compact' : ''}`}
        onClick={() => {
          setView(ymOf(value || today))
          setOpen(true)
        }}
      >
        {value ? (
          <Text>{fmt ? fmt(value) : compact ? fmtDateShort(value) : fmtFull(value)}</Text>
        ) : (
          <Text className="dp-ph">{placeholder}</Text>
        )}
        <Icon name="calendar" size={14} className="dp-ico" />
      </View>

      {open && (
        <Modal variant="sheet" className="dp-cal" onClose={() => setOpen(false)}>
          <View className="dp-head">
            <View className="dp-nav" onClick={() => shift(-1)}>
              <Icon name="arrow-up" size={18} className="dp-arrow-l" />
            </View>
            <Text className="dp-title">
              {view.y}年{view.m}月
            </Text>
            <View className="dp-nav" onClick={() => shift(1)}>
              <Icon name="arrow-up" size={18} className="dp-arrow-r" />
            </View>
          </View>
          <View className="dp-grid">
            {WEEK.map((w) => (
              <Text className="wk" key={w}>
                {w}
              </Text>
            ))}
            {cells.map((c) => (
              <View
                key={c.ds}
                className={`dp-day${c.inMonth ? '' : ' adj'}${c.ds === today ? ' today' : ''}${c.ds === value ? ' sel' : ''}`}
                onClick={() => pick(c.ds)}
              >
                {c.day}
              </View>
            ))}
          </View>
          <View className="dp-actions">
            <View
              className="btn ghost small"
              onClick={() => {
                setView(ymOf(today))
                pick(today)
              }}
            >
              今天
            </View>
          </View>
        </Modal>
      )}
    </>
  )
}
