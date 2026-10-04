// 记账：月度汇总 / 预算 / 趋势图 / 快速记账 / 分类占比 / 流水明细（按日分组）
// 自 PWA pages/Ledger.tsx 迁移：SVG 折线 → flex 柱状图（WXML 无 svg），
// select → Picker mode=selector，input type=number → Input type=digit，small → Text 内联样式
import { useEffect, useMemo, useRef, useState } from 'react'
import Taro from '@tarojs/taro'
import { Canvas, Image, Input, Picker, ScrollView, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import { useData } from '../../store'
import DatePicker from '../../components/DatePicker'
import FocusScroll from '../../components/FocusScroll'
import Modal from '../../components/Modal'
import Icon from '../../components/Icon'
import SwipeRow from '../../components/SwipeRow'
import { appConfirm, appPrompt } from '../../components/ConfirmDialog'
import { showToast } from '../../utils/platform'
import { addDays, startOfWeek, todayStr, uid } from '../../utils/date'
import { EXPENSE_CATEGORIES } from '../../constants/categories'
import animalEmpty from '../../assets/images/钱包.png'
import type { LedgerCategory, LedgerEntry } from '../../types'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function daysInMonth(month: string): number {
  const [y, m] = month.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

const isExpense = (l: LedgerEntry) => l.type !== 'income'

// 分类占比配色（按分类名哈希取色：用户可增删分类，索引会漂移，哈希稳定；饼图/横条/列表圆点一致）
// CSS 用 var(--chart-N) token；Canvas fillStyle 不认 CSS 变量，用同值字面常量表
const PIE_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)', 'var(--chart-7)', 'var(--chart-8)']
const PIE_COLORS_HEX = ['#be5016', '#d97706', '#c97b63', '#4d7c5f', '#e3b448', '#a05a2c', '#8a7b6b', '#d6cec2']
function catColorIndex(name: string): number {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997
  return h % PIE_COLORS.length
}
const catColor = (name: string) => PIE_COLORS[catColorIndex(name)]
const catColorHex = (name: string) => PIE_COLORS_HEX[catColorIndex(name)]

export default function Ledger() {
  const { data, ready, set } = useData()
  const [month, setMonth] = useState(() => todayStr().slice(0, 7))
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].name)
  const [entryType, setEntryType] = useState<'expense' | 'income'>('expense')
  const [note, setNote] = useState('')
  // 页内筛选条：关键词 + 时间 chips（本周/本月/今年/自定义）+ 分类多选；任一激活时列表范围=全量，忽略月份选择器
  const [fKeyword, setFK] = useState('')
  const [fTime, setFTime] = useState<'week' | 'month' | 'year' | 'custom' | null>(null)
  const [fFrom, setFFrom] = useState('')
  const [fTo, setFTo] = useState('')
  const [fCats, setFCats] = useState<string[]>([])
  const [editing, setEditing] = useState<LedgerEntry | null>(null)
  // 趋势图：粒度（日=当月每日 / 月=当年12个月 / 年=历年）× 视角（支出/收入）
  const [chartMode, setChartMode] = useState<'day' | 'month' | 'year'>('day')
  const [chartType, setChartType] = useState<'expense' | 'income'>('expense')
  // 分类占比：独立月份口径（仅受该日期影响）+ 饼图扇区点击联动；收支视角独立于「记一笔」
  const [catMonth, setCatMonth] = useState(() => todayStr().slice(0, 7))
  const [catType, setCatType] = useState<'expense' | 'income'>('expense')
  const [catSelected, setCatSelected] = useState<string | null>(null)
  // 月份日历弹窗：main=页头月份 / cat=分类卡月份，弹窗内按年翻页选月
  const [pickerFor, setPickerFor] = useState<'main' | 'cat' | null>(null)
  const [pickYear, setPickYear] = useState(() => Number(todayStr().slice(0, 4)))

  const monthEntries = useMemo(
    () => data.ledger.filter((l) => l.date.startsWith(month)),
    [data.ledger, month]
  )
  const prevMonthEntries = useMemo(
    () => data.ledger.filter((l) => l.date.startsWith(shiftMonth(month, -1))),
    [data.ledger, month]
  )

  const expenseTotal = monthEntries.filter(isExpense).reduce((s, l) => s + l.amount, 0)
  const incomeTotal = monthEntries.filter((l) => !isExpense(l)).reduce((s, l) => s + l.amount, 0)
  const balance = incomeTotal - expenseTotal // 结余 = 收入 - 支出
  const prevExpenseTotal = prevMonthEntries.filter(isExpense).reduce((s, l) => s + l.amount, 0)
  const todayExpense = monthEntries
    .filter((l) => isExpense(l) && l.date === todayStr())
    .reduce((s, l) => s + l.amount, 0)

  const now = new Date()
  const isCurrentMonth = month === todayStr().slice(0, 7)
  const daysElapsed = isCurrentMonth ? now.getDate() : daysInMonth(month)
  const dayAvg = expenseTotal / Math.max(1, daysElapsed)
  const budgetLeftDays =
    data.budget > 0 && dayAvg > 0 ? Math.floor((data.budget - expenseTotal) / dayAvg) : null
  const momPct =
    prevExpenseTotal > 0 ? Math.round(((expenseTotal - prevExpenseTotal) / prevExpenseTotal) * 100) : null

  // 分类数据源 = ledgerCats 域（用户可增改删，见 pages/ledger-cats）；合并去重（支出/收入各有一个「其他」）
  const allCats = useMemo(() => {
    const map = new Map<string, LedgerCategory>()
    for (const c of [...data.ledgerCats.expense, ...data.ledgerCats.income]) {
      if (!map.has(c.name)) map.set(c.name, c)
    }
    return [...map.values()]
  }, [data.ledgerCats])
  const categories: LedgerCategory[] = entryType === 'expense' ? data.ledgerCats.expense : data.ledgerCats.income
  // 宫格分页：每页 8 项（4 列 × 2 行），不足占位补齐保证高度恒定
  const catPages = useMemo(() => {
    const pages: (LedgerCategory | null)[][] = []
    for (let i = 0; i < categories.length; i += 8) {
      const page: (LedgerCategory | null)[] = categories.slice(i, i + 8)
      while (page.length < 8) page.push(null)
      pages.push(page)
    }
    return pages
  }, [categories])

  // ---- 分类占比：仅受分类卡日期行的月份影响（与页头月份、筛选流水互不联动）----
  const catEntries = useMemo(
    () => data.ledger.filter((l) => l.date.startsWith(catMonth)),
    [data.ledger, catMonth]
  )

  const byCategory = useMemo(() => {
    const cats = data.ledgerCats[catType]
    return cats
      .map((c) => ({
        c,
        sum: catEntries
          .filter((l) => isExpense(l) === (catType === 'expense') && l.category === c.name)
          .reduce((s, l) => s + l.amount, 0),
      }))
      .filter((x) => x.sum > 0)
      .sort((a, b) => b.sum - a.sum)
  }, [catEntries, catType, data.ledgerCats])
  const catTotal = byCategory.reduce((s, x) => s + x.sum, 0)
  // 横条全量展示：有金额的分类都要出现（不合并「其他」），超出高度上下滑动查看
  const barRows = useMemo(
    () =>
      byCategory.map((x) => ({
        key: x.c.name,
        name: x.c.name,
        emoji: x.c.emoji,
        sum: x.sum,
        selectable: true,
      })),
    [byCategory]
  )
  const maxBar = Math.max(1, ...barRows.map((x) => x.sum))

  // 饼图绘制（Canvas 2d）：按占比分扇区上色（环形，中心总额由覆盖层显示），
  // 选中扇区外移高亮、其余淡化；不依赖 conic-gradient，兼容性更稳
  const pieSize = useRef({ w: 0, h: 0 })
  useEffect(() => {
    if (!ready || catTotal <= 0) return
    Taro.nextTick(() => {
      Taro.createSelectorQuery()
        .select('#catPie')
        .fields({ node: true, size: true })
        .exec((res: any[]) => {
          const info = res && res[0]
          if (!info || !info.node || !info.width) return
          const w: number = info.width
          const h: number = info.height
          pieSize.current = { w, h }
          const canvas = info.node as any
          const dpr = Taro.getSystemInfoSync().pixelRatio || 2
          canvas.width = w * dpr
          canvas.height = h * dpr
          const ctx = canvas.getContext('2d')
          ctx.scale(dpr, dpr)
          ctx.clearRect(0, 0, w, h)
          const cx = w / 2
          const cy = h / 2
          const r = Math.min(w, h) / 2 - 12
          const inner = r * 0.55
          // 空数据：画灰色整环 + 中心「暂无记录」，卡片高度不塌陷
          if (catTotal <= 0) {
            ctx.beginPath()
            ctx.arc(cx, cy, r, 0, Math.PI * 2)
            ctx.arc(cx, cy, inner, 0, Math.PI * 2, true)
            ctx.closePath()
            ctx.fillStyle = '#d6cec2' // chart-8 字面（Canvas 不认 CSS 变量）
            ctx.fill()
            return
          }
          let angle = -Math.PI / 2 // 12 点方向起笔，顺时针
          for (const it of byCategory) {
            const sweep = (it.sum / catTotal) * Math.PI * 2
            const selected = catSelected === it.c.name
            const mid = angle + sweep / 2
            const off = selected ? 5 : 0
            const ox = cx + Math.cos(mid) * off
            const oy = cy + Math.sin(mid) * off
            ctx.beginPath()
            ctx.arc(ox, oy, r, angle, angle + sweep)
            ctx.arc(ox, oy, inner, angle + sweep, angle, true)
            ctx.closePath()
            ctx.fillStyle = catColorHex(it.c.name)
            ctx.globalAlpha = catSelected && !selected ? 0.35 : 1
            ctx.fill()
            angle += sweep
          }
          ctx.globalAlpha = 1
        })
    })
  }, [ready, catMonth, catType, catSelected, catTotal, byCategory])

  // 饼图扇区命中：点击坐标换算相对圆心的向量角度，按占比区间命中 → 联动 catSelected
  const onPieTap = (pt: { x: number; y: number }) => {
    const { w, h } = pieSize.current
    if (!w || catTotal <= 0) return
    const dx = pt.x - w / 2
    const dy = pt.y - h / 2
    const r = Math.min(w, h) / 2 - 12
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < r * 0.55 || dist > r + 8) {
      setCatSelected(null) // 点中心圆或圆外：取消联动
      return
    }
    let a = Math.atan2(dy, dx) + Math.PI / 2 // 12 点方向为 0，顺时针
    if (a < 0) a += Math.PI * 2
    let acc = 0
    for (const it of byCategory) {
      acc += (it.sum / catTotal) * Math.PI * 2
      if (a <= acc) {
        setCatSelected((prev) => (prev === it.c.name ? null : it.c.name))
        return
      }
    }
  }

  // 任一筛选激活 → 范围=全量 ledger（忽略月份选择器）；否则按顶部月份
  const filterActive = !!(fKeyword.trim() || fTime || fCats.length)
  const filtered = useMemo(() => {
    let list = filterActive ? data.ledger : monthEntries
    if (fTime) {
      const today = todayStr()
      let from = ''
      let to = ''
      if (fTime === 'week') {
        from = startOfWeek(today)
        to = addDays(from, 6)
      } else if (fTime === 'month') {
        from = `${today.slice(0, 7)}-01`
        to = `${today.slice(0, 7)}-${String(daysInMonth(today.slice(0, 7))).padStart(2, '0')}`
      } else if (fTime === 'year') {
        from = `${today.slice(0, 4)}-01-01`
        to = `${today.slice(0, 4)}-12-31`
      } else {
        from = fFrom
        to = fTo
      }
      list = list.filter((l) => (!from || l.date >= from) && (!to || l.date <= to))
    }
    const q = fKeyword.trim().toLowerCase()
    if (q) list = list.filter((l) => l.note.toLowerCase().includes(q) || l.category.includes(q))
    if (fCats.length) list = list.filter((l) => fCats.includes(l.category))
    return [...list].sort((a, b) => b.date.localeCompare(a.date))
  }, [data.ledger, monthEntries, filterActive, fTime, fFrom, fTo, fKeyword, fCats])

  const byDay = useMemo(() => {
    const map = new Map<string, LedgerEntry[]>()
    for (const l of filtered) {
      if (!map.has(l.date)) map.set(l.date, [])
      map.get(l.date)!.push(l)
    }
    return [...map.entries()]
  }, [filtered])

  const year = month.slice(0, 4)
  const chartData = useMemo(() => {
    // 按视角过滤：支出视角统计非收入记录，收入视角只统计收入记录
    const inChart = (l: LedgerEntry) => isExpense(l) === (chartType === 'expense')
    if (chartMode === 'day') {
      const arr: { label: string; sum: number }[] = []
      for (let d = 1; d <= daysInMonth(month); d++) {
        const ds = `${month}-${String(d).padStart(2, '0')}`
        arr.push({
          label: String(d),
          sum: monthEntries.filter((l) => inChart(l) && l.date === ds).reduce((s, l) => s + l.amount, 0),
        })
      }
      return arr
    }
    if (chartMode === 'month') {
      const arr: { label: string; sum: number }[] = []
      for (let m = 1; m <= 12; m++) {
        const ms = `${year}-${String(m).padStart(2, '0')}`
        arr.push({
          label: `${m}月`,
          sum: data.ledger.filter((l) => inChart(l) && l.date.startsWith(ms)).reduce((s, l) => s + l.amount, 0),
        })
      }
      return arr
    }
    const years = [...new Set(data.ledger.filter(inChart).map((l) => l.date.slice(0, 4)))].sort()
    return years.map((y) => ({
      label: y,
      sum: data.ledger.filter((l) => inChart(l) && l.date.startsWith(y)).reduce((s, l) => s + l.amount, 0),
    }))
  }, [chartMode, chartType, monthEntries, data.ledger, month, year])

  const chartMax = Math.max(1, ...chartData.map((x) => x.sum))
  // 柱状图空态：当前视角一个数据都没有时展示卡通，不留空白
  const chartEmpty = chartData.every((x) => x.sum <= 0)
  const chartTypeName = chartType === 'expense' ? '支出' : '收入'
  const chartTitle =
    chartMode === 'day' ? `每日${chartTypeName}` : chartMode === 'month' ? `${year} 年${chartTypeName}` : `历年${chartTypeName}`
  const chartColor = chartType === 'expense' ? 'var(--primary)' : 'var(--success)'
  const chartUnit = chartMode === 'day' ? '日' : chartMode === 'month' ? '月' : '年'
  // 柱状图参数：柱区高 84（数值区留白），日模式 28-31 柱取细柱
  const BAR_AREA = 84
  const barWidth = chartMode === 'day' ? '58%' : chartMode === 'month' ? '60%' : '50%'

  const clearFilters = () => {
    setFK('')
    setFTime(null)
    setFFrom('')
    setFTo('')
    setFCats([])
  }

  const add = () => {
    const v = Number(amount)
    if (!v || v <= 0) {
      showToast('请输入金额')
      return
    }
    const cat = categories.find((c) => c.name === category) ?? categories[0]
    set('ledger', (prev) => [
      { id: uid(), date: todayStr(), amount: v, category: cat.name, note: note.trim(), type: entryType },
      ...prev,
    ])
    setAmount('')
    setNote('')
    showToast(`已记一笔${entryType === 'expense' ? '支出' : '收入'} ¥${v.toFixed(1)}`)
  }

  const saveEdit = () => {
    if (!editing) return
    set('ledger', (prev) => prev.map((l) => (l.id === editing.id ? editing : l)))
    setEditing(null)
    showToast('已保存修改')
  }

  const removeEntry = (l: LedgerEntry) => {
    void appConfirm('删除这笔记录？', `${l.category} ¥${l.amount.toFixed(1)}`, {
      danger: true,
      confirmText: '删除',
    }).then((ok) => {
      if (!ok) return
      if (editing?.id === l.id) setEditing(null)
      set('ledger', (prev) => prev.filter((x) => x.id !== l.id))
    })
  }

  const overBudget = data.budget > 0 && expenseTotal > data.budget
  const budgetPct = data.budget > 0 ? Math.min(100, Math.round((expenseTotal / data.budget) * 100)) : 0

  // 打开月份日历弹窗：main=页头月份 / cat=分类卡月份，弹窗内按年翻页选月
  const openMonthPicker = (forWhat: 'main' | 'cat') => {
    setPickYear(Number((forWhat === 'main' ? month : catMonth).slice(0, 4)))
    setPickerFor(forWhat)
  }
  // 弹窗内选月：落到对应日期行并关闭（不能选未来月份）
  const pickMonthValue = (y: number, m: number) => {
    const ms = `${y}-${String(m).padStart(2, '0')}`
    if (ms > todayStr().slice(0, 7)) return
    if (pickerFor === 'main') setMonth(ms)
    else setCatMonth(ms)
    setPickerFor(null)
  }

  const catEmoji = (name: string) =>
    allCats.find((c) => c.name === name)?.emoji ?? '📦'

  const xLabelStart = chartMode === 'day' ? `1 ${chartUnit}` : chartMode === 'month' ? `1 ${chartUnit}` : chartData[0]?.label ?? ''
  const xLabelEnd =
    chartMode === 'day' ? `${daysInMonth(month)} ${chartUnit}` : chartMode === 'month' ? `12 ${chartUnit}` : chartData[chartData.length - 1]?.label ?? ''

  if (!ready) {
    return (
      <View className="page">
        <View className="skeleton sk-card" />
        <View className="skeleton sk-card" />
        <View className="skeleton sk-card" />
      </View>
    )
  }

  return (
    <View className="page">
      <View className="page-title">
        <Text>💰 记账本</Text>
      </View>

      {/* 月份 + 汇总 */}
      <View className="card">
        <View className="row-between">
          <View className="heat-nav-btn" onClick={() => setMonth(shiftMonth(month, -1))}>
            <Icon name="arrow-up" size={18} className="arrow-l" />
          </View>
          {/* 月份 + 日历按钮：点日历弹月网格直接选月 */}
          <View className="row" style={{ gap: 6, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 700 }}>{month.replace('-', ' 年 ')} 月</Text>
            <View className="icon-btn" onClick={() => openMonthPicker('main')}>
              <Icon name="calendar" size={16} />
            </View>
          </View>
          <View
            className={`heat-nav-btn ${month >= todayStr().slice(0, 7) ? 'is-disabled' : ''}`}
            onClick={() => {
              if (month < todayStr().slice(0, 7)) setMonth(shiftMonth(month, 1))
            }}
          >
            <Icon name="arrow-up" size={18} className="arrow-r" />
          </View>
        </View>
        {/* 三等分汇总栏：支出 / 收入 / 结余（结余 = 收入 - 支出，正绿负红） */}
        <View style={{ display: 'flex', textAlign: 'center', margin: '12px 0 4px' }}>
          <View style={{ flex: 1 }}>
            <Text className="stat-label">支出</Text>
            <View style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.4 }}>
              <Text style={{ fontSize: 14 }}>¥</Text>
              <Text>{expenseTotal.toFixed(1)}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text className="stat-label">收入</Text>
            <View style={{ fontSize: 22, fontWeight: 800, color: 'var(--success)', lineHeight: 1.4 }}>
              <Text style={{ fontSize: 14 }}>¥</Text>
              <Text>{incomeTotal.toFixed(1)}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text className="stat-label">结余</Text>
            <View
              style={{
                fontSize: 22,
                fontWeight: 800,
                lineHeight: 1.4,
                color: balance >= 0 ? 'var(--success)' : 'var(--danger)',
              }}
            >
              <Text style={{ fontSize: 14 }}>¥</Text>
              <Text>
                {balance >= 0 ? '+' : '-'}{Math.abs(balance).toFixed(1)}
              </Text>
            </View>
          </View>
        </View>
        {data.budget > 0 && (
          <View style={{ marginTop: 8 }}>
            {/* 行2：左「预算与已用」，右「预算还可撑 X 天」 */}
            <View className="row-between" style={{ gap: 8 }}>
              <Text className="sub" style={{ color: overBudget ? 'var(--danger)' : undefined }}>
                预算 ¥{data.budget} · 已用 {budgetPct}%{overBudget ? ' · 超支！' : ''}
              </Text>
              {budgetLeftDays !== null && (
                <View className={`chip ${budgetLeftDays < 5 ? 'warn' : 'plain'}`}>
                  <Text>预算还可撑 {budgetLeftDays} 天</Text>
                </View>
              )}
            </View>
            {/* 行3：预算进度条 */}
            <View className="progress" style={{ marginTop: 6 }}>
              <View
                className="progress-fill"
                style={{
                  width: `${budgetPct}%`,
                  background: overBudget ? 'var(--danger)' : undefined,
                }}
              />
            </View>
          </View>
        )}
        {/* 行4：今日 / 日均 / 环比上月 同一行 */}
        <View className="row" style={{ justifyContent: 'space-between', marginTop: 8, gap: 4 }}>
          <View className="chip plain">
            <Text>今日 ¥{todayExpense.toFixed(1)}</Text>
          </View>
          <View className="chip plain">
            <Text>日均 ¥{dayAvg.toFixed(1)}</Text>
          </View>
          {momPct !== null && (
            <View className={`chip ${momPct > 0 ? 'danger' : 'success'}`}>
              <Text>环比上月 {momPct > 0 ? '↑' : '↓'}{Math.abs(momPct)}%</Text>
            </View>
          )}
        </View>
        <View
          className="icon-btn"
          style={{ fontSize: 16 }}
          onClick={() => {
            void appPrompt(
              data.budget > 0 ? '修改每月预算（元）：' : '设置每月预算（元）：',
              String(data.budget || ''),
              'number'
            ).then((v) => {
              if (v === null) return
              const n = Number(v)
              if (v.trim() !== '' && n > 0) set('budget', Math.round(n))
              if (v.trim() === '') set('budget', 0)
            })
          }}
        >
          <Icon name="pencil" size={16} gap={4} />
          <Text>{data.budget > 0 ? '修改预算' : '设置预算'}</Text>
        </View>
      </View>

      {/* 消费趋势（常驻，柱状图） */}
      <View className="card">
        <View className="card-title chart-title">
          <Text>{chartTitle}</Text>
          <View className="row" style={{ alignItems: 'center', gap: 8 }}>
            <View className="type-toggle mini" style={{ marginBottom: 0 }}>
              {([['expense', '支出'], ['income', '收入']] as const).map(([t, label]) => (
                <View
                  key={t}
                  className={`type-btn ${chartType === t ? 'active' : ''}`}
                  style={{ flex: 'none' }}
                  onClick={() => setChartType(t)}
                >
                  <Text>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View className="type-toggle" style={{ marginBottom: 10 }}>
          {([['day', '日'], ['month', '月'], ['year', '年']] as const).map(([mode, label]) => (
            <View
              key={mode}
              className={`type-btn ${chartMode === mode ? 'active' : ''}`}
              onClick={() => setChartMode(mode)}
            >
              <Text>{label}</Text>
            </View>
          ))}
        </View>
        {/* WXML 无 svg：flex 柱状图替代折线，点柱查看该区间明细；无数据时展示卡通空态 */}
        {chartEmpty ? (
          <View className="chart-empty">
            <Image className="empty-animal" src={animalEmpty} mode="aspectFit" />
            <Text>还没有{chartTypeName}记录，记一笔就有图啦 📊</Text>
          </View>
        ) : (
          <>
            <View style={{ display: 'flex', alignItems: 'flex-end', height: 100, gap: 1 }}>
              {chartData.map((d, i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                  onClick={() => {
                    if (d.sum <= 0) return
                    const scope =
                      chartMode === 'day'
                        ? `${month}-${String(d.label).padStart(2, '0')}`
                        : chartMode === 'month'
                          ? `${year}-${d.label}`
                          : `${d.label} 年`
                    showToast(`${scope}：¥${d.sum.toFixed(1)}`)
                  }}
                >
                  <Text style={{ fontSize: 12, color: 'var(--text-sub)', marginBottom: 2, lineHeight: 1 }}>
                    {d.sum > 0 ? d.sum.toFixed(1) : ''}
                  </Text>
                  <View
                    style={{
                      width: barWidth,
                      height: Math.max(d.sum > 0 ? 3 : 1, Math.round((d.sum / chartMax) * BAR_AREA)),
                      borderRadius: '4px 4px 0 0',
                      background: d.sum > 0 ? chartColor : 'var(--progress-bg)',
                    }}
                  />
                </View>
              ))}
            </View>
            <View className="row-between" style={{ marginTop: 4 }}>
              <Text className="sub" style={{ fontSize: 14 }}>{xLabelStart}</Text>
              <Text className="sub" style={{ fontSize: 14 }}>{xLabelEnd}</Text>
            </View>
          </>
        )}
      </View>

      {/* 快速记一笔 */}
      <View className="card">
        <View className="card-title" style={{ marginBottom: 8 }}>
          <Icon name="pencil" size={16} gap={4} />
          <Text>记一笔</Text>
          <View
            className="btn ghost small"
            onClick={() => Taro.navigateTo({ url: '/pages/ledger-cats/index' })}
          >
            <Icon name="gear" size={16} gap={4} />
            <Text>管理</Text>
          </View>
        </View>
        <View className="type-toggle">
          {/* 仅切换「记一笔」的收支与分类宫格；下方分类卡独立切换，互不联动 */}
          <View
            className={`type-btn ${entryType === 'expense' ? 'active' : ''}`}
            onClick={() => {
              setEntryType('expense')
              setCategory(data.ledgerCats.expense[0]?.name ?? '其他')
            }}
          >
            <Text>支出</Text>
          </View>
          <View
            className={`type-btn ${entryType === 'income' ? 'active' : ''}`}
            onClick={() => {
              setEntryType('income')
              setCategory(data.ledgerCats.income[0]?.name ?? '其他')
            }}
          >
            <Text>收入</Text>
          </View>
        </View>
        {/* 分类宫格：Swiper 横向翻页，每页 4 列 × 2 行 */}
        <Swiper
          className="cat-swiper"
          indicatorDots
          indicatorColor="#d6cec2"
          indicatorActiveColor="#be5016"
        >
          {catPages.map((page, pi) => (
            <SwiperItem key={pi}>
              <View className="cat-grid">
                {page.map((c, ci) =>
                  c ? (
                    <View
                      key={c.name}
                      className={`cat-item ${category === c.name ? 'active' : ''}`}
                      onClick={() => setCategory(c.name)}
                    >
                      <Text className="cat-emoji">{c.emoji}</Text>
                      <Text className="cat-name">{c.name}</Text>
                    </View>
                  ) : (
                    <View key={`ph-${ci}`} className="cat-item" style={{ opacity: 0 }} />
                  )
                )}
              </View>
            </SwiperItem>
          ))}
        </Swiper>
        <View className="form-row" style={{ marginTop: 10 }}>
          <View className="field" style={{ width: 110, marginBottom: 0 }}>
            <Input
              type="digit"
              placeholder="金额"
              value={amount}
              onInput={(e) => setAmount(e.detail.value)}
            />
          </View>
          <View className="field" style={{ flex: 1, marginBottom: 0 }}>
            <Input
              placeholder="备注（可选）"
              value={note}
              onInput={(e) => setNote(e.detail.value)}
              onConfirm={() => add()}
            />
          </View>
          <View className="btn small" onClick={add}>
            <Text>记一笔</Text>
          </View>
        </View>
      </View>

      {/* 分类占比：周/月/年口径，饼图在上、横条在下堆叠展示，扇区点击联动；收支视角独立切换 */}
      <View className="card cat-card">
        <View className="card-title">
          <Icon name="chart-bar" size={16} gap={4} />
          <Text>{catType === 'expense' ? '支出' : '收入'}分类</Text>
          {/* 分类卡自带收支切换：与「记一笔」的收支按钮解绑，互不联动 */}
          <View className="type-toggle mini" style={{ marginBottom: 0, width: 120, marginLeft: 'auto' }}>
            {([['expense', '支出'], ['income', '收入']] as const).map(([t, label]) => (
              <View
                key={t}
                className={`type-btn ${catType === t ? 'active' : ''}`}
                style={{ flex: 'none' }}
                onClick={() => {
                  setCatType(t)
                  setCatSelected(null)
                }}
              >
                <Text>{label}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* 日期行：‹ 2026 年 09 月 📅 ›（与记账本头部同款），数据仅受此日期影响 */}
        <View className="row-between" style={{ marginBottom: 8 }}>
          <View
            className="heat-nav-btn"
            onClick={() => {
              setCatMonth(shiftMonth(catMonth, -1))
              setCatSelected(null)
            }}
          >
            <Icon name="arrow-up" size={18} className="arrow-l" />
          </View>
          <View className="row" style={{ gap: 6, alignItems: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: 700 }}>{catMonth.replace('-', ' 年 ')} 月</Text>
            <View className="icon-btn" onClick={() => openMonthPicker('cat')}>
              <Icon name="calendar" size={16} />
            </View>
          </View>
          <View
            className={`heat-nav-btn ${catMonth >= todayStr().slice(0, 7) ? 'is-disabled' : ''}`}
            onClick={() => {
              if (catMonth < todayStr().slice(0, 7)) {
                setCatMonth(shiftMonth(catMonth, 1))
                setCatSelected(null)
              }
            }}
          >
            <Icon name="arrow-up" size={18} className="arrow-r" />
          </View>
        </View>
        <View className="cat-body">
          {catTotal <= 0 ? (
            /* 空态：卡通图案 + 文案 + 引导（替代原纯文字「暂无记录」） */
            <View className="cat-empty">
              <Image className="empty-animal" src={animalEmpty} mode="aspectFit" />
              <Text className="sub">还没有任何记录哦～</Text>
              <View
                className="btn small"
                onClick={() => Taro.pageScrollTo({ scrollTop: 0, duration: 200 })}
              >
                <Text>＋ 去记一笔</Text>
              </View>
            </View>
          ) : (
            <>
              {/* 图形区：左饼图（环形+圆心总额），右数据图例（色块+名称+金额+占比，点击联动） */}
              <View className="cat-chart">
                <View className="cat-pie-wrap">
                  <Canvas
                    id="catPie"
                    type="2d"
                    className="cat-pie"
                    onClick={(e: any) => onPieTap(e.detail)}
                  />
                  <View className="cat-pie-center">
                    <Text className="sub" style={{ fontSize: 10, lineHeight: 1.3 }}>总计</Text>
                    <Text style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.3 }}>¥{catTotal.toFixed(1)}</Text>
                  </View>
                </View>
                <ScrollView scrollY className="cat-legend-scroll">
                  {byCategory.map((x) => (
                    <View
                      key={x.c.name}
                      className={`cat-legend-row ${catSelected && catSelected !== x.c.name ? 'dim' : ''}`}
                      onClick={() => setCatSelected((p) => (p === x.c.name ? null : x.c.name))}
                    >
                      <View className="cat-legend-dot" style={{ background: catColor(x.c.name) }} />
                      <Text className="cat-legend-name">
                        {x.c.emoji} {x.c.name}
                      </Text>
                      <Text className="sub">¥{x.sum.toFixed(1)}</Text>
                      <Text className="cat-legend-pct">{Math.round((x.sum / catTotal) * 100)}%</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
              {/* 横条全量：有金额的分类都列出（不再合并「其他」），超出高度上下滑动 */}
              <ScrollView scrollY className="cat-bar-scroll">
                {barRows.map((x) => (
                  <View
                    key={x.key}
                    style={{
                      marginBottom: 8,
                      opacity: catSelected && x.selectable && catSelected !== x.name ? 0.35 : 1,
                    }}
                    onClick={() =>
                      x.selectable && setCatSelected((p) => (p === x.name ? null : x.name))
                    }
                  >
                    <View className="row-between">
                      <Text className="sub">
                        {x.emoji} {x.name}
                      </Text>
                      <Text className="sub">
                        ¥{x.sum.toFixed(1)} · {Math.round((x.sum / catTotal) * 100)}%
                      </Text>
                    </View>
                    <View className="progress">
                      <View
                        className="progress-fill"
                        style={{
                          width: `${(x.sum / maxBar) * 100}%`,
                          background:
                            x.selectable && catSelected === x.name ? catColor(x.name) : undefined,
                        }}
                      />
                    </View>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </View>

      {/* 页内筛选条：关键词 + 时间 + 分类；任一激活时列表=全量范围 */}
      <View className="card">
        <View className="card-title" style={{ marginBottom: 8 }}>
          <Icon name="search" size={16} gap={4} />
          <Text>筛选流水</Text>
          {/* 标题行恒一行：只放「高级搜索」；清除入口移到下方已选条件行 */}
          <View className="row" style={{ gap: 8, flexShrink: 0 }}>
            <View
              className="btn ghost small"
              onClick={() => Taro.navigateTo({ url: '/pages/ledger-search/index' })}
            >
              <Icon name="search" size={16} gap={4} />
              <Text>高级搜索</Text>
            </View>
          </View>
        </View>
        {/* 已选条件 chip 行：点 chip 单独移除（×）；「清除全部」常驻行尾，不再挤占标题行 */}
        <View className="filter-row" style={{ marginBottom: 8 }}>
          {filterActive ? (
            <>
              <ScrollView scrollX style={{ whiteSpace: 'nowrap' }} className="filter-row-scroll">
                <View className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
                  {fKeyword.trim() && (
                    <View className="chip solid" style={{ flex: 'none' }} onClick={() => setFK('')}>
                      <Text>关键词：{fKeyword.trim()} ×</Text>
                    </View>
                  )}
                  {fTime && (
                    <View className="chip solid" style={{ flex: 'none' }} onClick={() => setFTime(null)}>
                      <Text>
                        {({ week: '本周', month: '本月', year: '今年', custom: '自定义' } as const)[fTime]} ×
                      </Text>
                    </View>
                  )}
                  {fCats.map((name) => (
                    <View
                      key={`on-${name}`}
                      className="chip solid"
                      style={{ flex: 'none' }}
                      onClick={() => setFCats((p) => p.filter((x) => x !== name))}
                    >
                      <Text>{name} ×</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
              <View className="btn plain small" style={{ flex: 'none' }} onClick={clearFilters}>
                <Icon name="x" size={16} gap={4} />
                <Text>清除全部</Text>
              </View>
            </>
          ) : (
            <Text className="sub" style={{ fontSize: 12 }}>
              点击下方条件筛选流水
            </Text>
          )}
        </View>
        <View className="field" style={{ marginBottom: 8 }}>
          <Input
            placeholder="搜备注 / 分类"
            value={fKeyword}
            onInput={(e) => setFK(e.detail.value)}
          />
        </View>
        {/* 三排筛选胶囊：① 日期 ② 消费 ③ 收入；选中实体，超宽横向滚动 */}
        <View className="filter-row">
          <Text className="filter-row-label">日期</Text>
          <ScrollView scrollX style={{ whiteSpace: 'nowrap' }} className="filter-row-scroll">
            <View className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
              {([['week', '本周'], ['month', '本月'], ['year', '今年'], ['custom', '自定义']] as const).map(
                ([t, label]) => (
                  <View
                    key={t}
                    className={`chip ${fTime === t ? 'solid' : 'plain'}`}
                    style={{ flex: 'none' }}
                    onClick={() => setFTime((p) => (p === t ? null : t))}
                  >
                    <Text>{label}</Text>
                  </View>
                )
              )}
            </View>
          </ScrollView>
        </View>
        {fTime === 'custom' && (
          <View className="row" style={{ gap: 8, marginBottom: 8 }}>
            <View style={{ flex: 1 }}>
              <DatePicker value={fFrom} onChange={setFFrom} placeholder="起始日期" compact />
            </View>
            <View style={{ flex: 1 }}>
              <DatePicker value={fTo} onChange={setFTo} placeholder="结束日期" compact />
            </View>
          </View>
        )}
        <View className="filter-row">
          <Text className="filter-row-label">消费</Text>
          <ScrollView scrollX style={{ whiteSpace: 'nowrap' }} className="filter-row-scroll">
            <View className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
              {data.ledgerCats.expense.map((c) => {
                const on = fCats.includes(c.name)
                return (
                  <View
                    key={`e-${c.name}`}
                    className={`chip ${on ? 'solid' : 'plain'}`}
                    style={{ flex: 'none' }}
                    onClick={() =>
                      setFCats((p) => (on ? p.filter((x) => x !== c.name) : [...p, c.name]))
                    }
                  >
                    <Text>
                      {c.emoji} {c.name}
                    </Text>
                  </View>
                )
              })}
            </View>
          </ScrollView>
        </View>
        <View className="filter-row" style={{ marginBottom: 0 }}>
          <Text className="filter-row-label">收入</Text>
          <ScrollView scrollX style={{ whiteSpace: 'nowrap' }} className="filter-row-scroll">
            <View className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
              {data.ledgerCats.income.map((c) => {
                const on = fCats.includes(c.name)
                return (
                  <View
                    key={`i-${c.name}`}
                    className={`chip ${on ? 'solid' : 'plain'}`}
                    style={{ flex: 'none' }}
                    onClick={() =>
                      setFCats((p) => (on ? p.filter((x) => x !== c.name) : [...p, c.name]))
                    }
                  >
                    <Text>
                      {c.emoji} {c.name}
                    </Text>
                  </View>
                )
              })}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* 编辑弹层 */}
      {editing && (
        <Modal variant="sheet" onClose={() => setEditing(null)}>
          <View className="card-title">
            <Text>编辑记录</Text>
          </View>
          <View className="form-row">
            <View className="field">
              <Text className="sub">金额</Text>
              <Input
                type="digit"
                value={String(editing.amount)}
                onInput={(e) => setEditing({ ...editing, amount: Number(e.detail.value) || 0 })}
              />
            </View>
            <View className="field">
              <Text className="sub">日期</Text>
              <DatePicker
                value={editing.date}
                onChange={(v) => setEditing({ ...editing, date: v })}
              />
            </View>
          </View>
          <View className="form-row">
            <View className="field">
              <Text className="sub">分类</Text>
              <Picker
                mode="selector"
                range={allCats.map((c) => c.name)}
                value={Math.max(
                  0,
                  allCats.findIndex((c) => c.name === editing.category)
                )}
                onChange={(e) => {
                  const name = allCats[Number(e.detail.value)]?.name
                  if (name) setEditing({ ...editing, category: name })
                }}
              >
                <View className="dp-trigger compact">
                  <Text>{editing.category}</Text>
                </View>
              </Picker>
            </View>
            <View className="field">
              <Text className="sub">备注</Text>
              <Input
                value={editing.note}
                onInput={(e) => setEditing({ ...editing, note: e.detail.value })}
              />
            </View>
          </View>
          <View className="row" style={{ justifyContent: 'flex-end' }}>
            <View
              className="btn danger small"
              onClick={() => removeEntry(editing)}
            >
              <Text>删除</Text>
            </View>
            <View className="btn small" onClick={saveEdit}>
              <Text>保存</Text>
            </View>
          </View>
        </Modal>
      )}

      {/* 流水（按日分组，固定高约 6 行内滚，其余滑动查看） */}
      <View className="card">
        <View className="card-title" style={{ marginBottom: 4 }}>
          <Icon name="clipboard" size={16} gap={4} />
          <Text>流水</Text>
          <Text className="sub">
            {filterActive ? `筛选中 · ${filtered.length} 笔` : `共 ${filtered.length} 笔`}
          </Text>
        </View>
        {byDay.length === 0 ? (
          <View className="empty">
            <Image className="empty-animal" src={animalEmpty} mode="aspectFit" />
            <Text>{filterActive ? '没有符合条件的记录' : '本月还没有记录'}</Text>
          </View>
        ) : (
          <FocusScroll className="flow-scroll" measureKey={`${byDay.length}-${filterActive ? 1 : 0}`}>
            {byDay.map(([day, items]) => {
              const d = new Date(day + 'T00:00:00')
              const dayExpense = items.filter(isExpense).reduce((s, l) => s + l.amount, 0)
              const dayIncome = items.filter((l) => !isExpense(l)).reduce((s, l) => s + l.amount, 0)
              return (
                <View key={day}>
                  <View className="row-between" style={{ margin: '6px 0 2px' }}>
                    <Text className="sub">
                      {day.slice(5)} · 周{WEEKDAYS[d.getDay()]}
                    </Text>
                    <View className="row">
                      {dayExpense > 0 && (
                        <Text className="sub">支出 ¥{dayExpense.toFixed(1)}</Text>
                      )}
                      {dayIncome > 0 && (
                        <Text className="sub" style={{ color: 'var(--success)' }}>
                          　收入 ¥{dayIncome.toFixed(1)}
                        </Text>
                      )}
                    </View>
                  </View>
                  {items.map((l) => (
                    <SwipeRow key={l.id} onDelete={() => removeEntry(l)}>
                      <View className="list-item" onClick={() => setEditing(l)}>
                        <Text style={{ fontSize: 22 }}>{catEmoji(l.category)}</Text>
                        <View className="grow">
                          <Text className="name">{l.note || l.category}</Text>
                          <Text className="sub" style={{ fontSize: 16 }}>
                            {l.category}
                            {!isExpense(l) ? ' · 收入' : ''}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontWeight: 700,
                            color: isExpense(l) ? undefined : 'var(--success)',
                          }}
                        >
                          {isExpense(l) ? '-' : '+'}
                          {l.amount.toFixed(1)}
                        </Text>
                      </View>
                    </SwipeRow>
                  ))}
                </View>
              )
            })}
          </FocusScroll>
        )}
      </View>

      {/* 月份日历弹窗：年翻页 + 12 月网格，记账本 / 分类卡两处共用 */}
      {pickerFor && (
        <Modal variant="center" onClose={() => setPickerFor(null)}>
          <View className="card-title">
            <Icon name="calendar" size={16} gap={4} />
            <Text>选择月份</Text>
          </View>
          {/* 年翻页 */}
          <View className="row-between" style={{ margin: '4px 0 10px' }}>
            <View className="heat-nav-btn" onClick={() => setPickYear((y) => y - 1)}>
              <Icon name="arrow-up" size={18} className="arrow-l" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: 700 }}>{pickYear} 年</Text>
            <View
              className={`heat-nav-btn ${pickYear >= Number(todayStr().slice(0, 4)) ? 'is-disabled' : ''}`}
              onClick={() => {
                if (pickYear < Number(todayStr().slice(0, 4))) setPickYear((y) => y + 1)
              }}
            >
              <Icon name="arrow-up" size={18} className="arrow-r" />
            </View>
          </View>
          {/* 12 月网格 */}
          <View className="mp-grid">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
              const ms = `${pickYear}-${String(m).padStart(2, '0')}`
              const cur = pickerFor === 'main' ? month : catMonth
              const disabled = ms > todayStr().slice(0, 7)
              return (
                <View
                  key={m}
                  className={`mp-cell ${ms === cur ? 'active' : ''} ${disabled ? 'is-disabled' : ''}`}
                  onClick={() => {
                    if (!disabled) pickMonthValue(pickYear, m)
                  }}
                >
                  <Text>{m} 月</Text>
                </View>
              )
            })}
          </View>
        </Modal>
      )}
    </View>
  )
}
