// 记账：月度汇总 / 预算 / 趋势图 / 快速记账 / 分类占比 / 流水明细（按日分组）
// 自 PWA pages/Ledger.tsx 迁移：SVG 折线 → flex 柱状图（WXML 无 svg），
// select → Picker mode=selector，input type=number → Input type=digit，small → Text 内联样式
import { useMemo, useState } from 'react'
import { Input, Picker, Text, View } from '@tarojs/components'
import { useData } from '../../store'
import DatePicker from '../../components/DatePicker'
import { appPrompt } from '../../components/ConfirmDialog'
import { showToast } from '../../utils/platform'
import { todayStr, uid } from '../../utils/date'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/categories'
import type { LedgerEntry } from '../../types'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
const ALL_CATS = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

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

export default function Ledger() {
  const { data, ready, set } = useData()
  const [month, setMonth] = useState(() => todayStr().slice(0, 7))
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].name)
  const [entryType, setEntryType] = useState<'expense' | 'income'>('expense')
  const [note, setNote] = useState('')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<LedgerEntry | null>(null)
  // 趋势图：粒度（日=当月每日 / 月=当年12个月 / 年=历年）× 视角（支出/收入）
  const [chartMode, setChartMode] = useState<'day' | 'month' | 'year'>('day')
  const [chartType, setChartType] = useState<'expense' | 'income'>('expense')

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

  const categories = entryType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  const byCategory = useMemo(() => {
    const cats = entryType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
    return cats
      .map((c) => ({
        c,
        sum: monthEntries
          .filter((l) => isExpense(l) === (entryType === 'expense') && l.category === c.name)
          .reduce((s, l) => s + l.amount, 0),
      }))
      .filter((x) => x.sum > 0)
  }, [monthEntries, entryType])
  const total = entryType === 'expense' ? expenseTotal : incomeTotal
  const maxCat = Math.max(1, ...byCategory.map((x) => x.sum))

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = q
      ? monthEntries.filter((l) => l.note.toLowerCase().includes(q) || l.category.includes(q))
      : monthEntries
    return [...list].sort((a, b) => b.date.localeCompare(a.date))
  }, [monthEntries, search])

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
  const chartTypeName = chartType === 'expense' ? '支出' : '收入'
  const chartTitle =
    chartMode === 'day' ? `每日${chartTypeName}` : chartMode === 'month' ? `${year} 年每月${chartTypeName}` : `历年${chartTypeName}`
  const chartColor = chartType === 'expense' ? '#6366f1' : '#16a34a'
  const chartUnit = chartMode === 'day' ? '日' : chartMode === 'month' ? '月' : '年'
  // 柱状图参数：柱区高 64（数值区留白），日模式 28-31 柱取细柱
  const BAR_AREA = 64
  const barWidth = chartMode === 'day' ? '58%' : chartMode === 'month' ? '60%' : '50%'

  const add = () => {
    const v = Number(amount)
    if (!v || v <= 0) return
    const cat = categories.find((c) => c.name === category) ?? categories[0]
    set('ledger', (prev) => [
      { id: uid(), date: todayStr(), amount: v, category: cat.name, note: note.trim(), type: entryType },
      ...prev,
    ])
    setAmount('')
    setNote('')
    showToast(`已记一笔${entryType === 'expense' ? '支出' : '收入'} ¥${v.toFixed(2)}`)
  }

  const saveEdit = () => {
    if (!editing) return
    set('ledger', (prev) => prev.map((l) => (l.id === editing.id ? editing : l)))
    setEditing(null)
    showToast('已保存修改')
  }

  const overBudget = data.budget > 0 && expenseTotal > data.budget
  const budgetPct = data.budget > 0 ? Math.min(100, Math.round((expenseTotal / data.budget) * 100)) : 0

  const catEmoji = (name: string) =>
    ALL_CATS.find((c) => c.name === name)?.emoji ?? '📦'

  const xLabelStart = chartMode === 'day' ? `1 ${chartUnit}` : chartMode === 'month' ? `1 ${chartUnit}` : chartData[0]?.label ?? ''
  const xLabelEnd =
    chartMode === 'day' ? `${daysInMonth(month)} ${chartUnit}` : chartMode === 'month' ? `12 ${chartUnit}` : chartData[chartData.length - 1]?.label ?? ''

  if (!ready) {
    return (
      <View className="page">
        <View className="card">
          <Text className="sub">加载中…</Text>
        </View>
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
          <View className="btn plain small" onClick={() => setMonth(shiftMonth(month, -1))}>
            <Text>‹</Text>
          </View>
          <Text style={{ fontSize: 16, fontWeight: 700 }}>{month.replace('-', ' 年 ')} 月</Text>
          <View
            className="btn plain small"
            style={month >= todayStr().slice(0, 7) ? { opacity: 0.35 } : undefined}
            onClick={() => {
              if (month < todayStr().slice(0, 7)) setMonth(shiftMonth(month, 1))
            }}
          >
            <Text>›</Text>
          </View>
        </View>
        {/* 三等分汇总栏：支出 / 收入 / 结余（结余 = 收入 - 支出，正绿负红） */}
        <View style={{ display: 'flex', textAlign: 'center', margin: '12px 0 4px' }}>
          <View style={{ flex: 1 }}>
            <Text className="sub" style={{ fontSize: 12 }}>支出</Text>
            <View style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.4 }}>
              <Text style={{ fontSize: 12 }}>¥</Text>
              <Text>{expenseTotal.toFixed(2)}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text className="sub" style={{ fontSize: 12 }}>收入</Text>
            <View style={{ fontSize: 18, fontWeight: 800, color: 'var(--success)', lineHeight: 1.4 }}>
              <Text style={{ fontSize: 12 }}>¥</Text>
              <Text>{incomeTotal.toFixed(2)}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text className="sub" style={{ fontSize: 12 }}>结余</Text>
            <View
              style={{
                fontSize: 18,
                fontWeight: 800,
                lineHeight: 1.4,
                color: balance >= 0 ? 'var(--success)' : 'var(--danger)',
              }}
            >
              <Text style={{ fontSize: 12 }}>¥</Text>
              <Text>
                {balance >= 0 ? '+' : '-'}{Math.abs(balance).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
        {data.budget > 0 && (
          <View style={{ marginTop: 8 }}>
            <Text className="sub" style={{ color: overBudget ? 'var(--danger)' : undefined }}>
              预算 ¥{data.budget} · 已用 {budgetPct}%{overBudget ? ' · 超支！' : ''}
            </Text>
            <View className="progress">
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
        <View
          className="row"
          style={{ justifyContent: 'space-between', marginTop: 8, flexWrap: 'wrap', gap: 4 }}
        >
          <Text className="sub">今日 ¥{todayExpense.toFixed(2)}</Text>
          <Text className="sub">日均 ¥{dayAvg.toFixed(1)}</Text>
          {budgetLeftDays !== null && (
            <Text className="sub" style={{ color: budgetLeftDays < 5 ? 'var(--warn)' : undefined }}>
              预算还可撑 {budgetLeftDays} 天
            </Text>
          )}
          {momPct !== null && (
            <Text className="sub" style={{ color: momPct > 0 ? 'var(--danger)' : 'var(--success)' }}>
              环比上月 {momPct > 0 ? '↑' : '↓'}{Math.abs(momPct)}%
            </Text>
          )}
        </View>
        <View
          className="icon-btn"
          style={{ fontSize: 12 }}
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
          <Text>✏️ {data.budget > 0 ? '修改预算' : '设置预算'}</Text>
        </View>
      </View>

      {/* 消费趋势（常驻，柱状图） */}
      <View className="card">
        <View className="card-title">
          <Text>📈 {chartTitle}</Text>
          <View className="row" style={{ alignItems: 'center', gap: 8 }}>
            <Text className="sub">
              峰值 ¥{chartMax === 1 && chartData.every((x) => x.sum === 0) ? '0' : chartMax.toFixed(0)}
            </Text>
            <View className="type-toggle" style={{ marginBottom: 0 }}>
              {([['expense', '支出'], ['income', '收入']] as const).map(([t, label]) => (
                <View
                  key={t}
                  className={`type-btn ${chartType === t ? 'active' : ''}`}
                  style={{ flex: 'none', padding: '2px 10px', fontSize: 12 }}
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
        {/* WXML 无 svg：flex 柱状图替代折线，点柱查看该区间明细 */}
        <View style={{ display: 'flex', alignItems: 'flex-end', height: 78, gap: 1 }}>
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
                showToast(`${scope}：¥${d.sum.toFixed(2)}`)
              }}
            >
              <Text style={{ fontSize: 8, color: 'var(--text-sub)', marginBottom: 2, lineHeight: 1 }}>
                {d.sum > 0 ? d.sum.toFixed(0) : ''}
              </Text>
              <View
                style={{
                  width: barWidth,
                  height: Math.max(d.sum > 0 ? 3 : 1, Math.round((d.sum / chartMax) * BAR_AREA)),
                  borderRadius: 2,
                  background: d.sum > 0 ? chartColor : 'var(--progress-bg)',
                }}
              />
            </View>
          ))}
        </View>
        <View className="row-between" style={{ marginTop: 4 }}>
          <Text className="sub" style={{ fontSize: 11 }}>{xLabelStart}</Text>
          <Text className="sub" style={{ fontSize: 11 }}>{xLabelEnd}</Text>
        </View>
      </View>

      {/* 快速记一笔 */}
      <View className="card">
        <View className="type-toggle">
          <View
            className={`type-btn ${entryType === 'expense' ? 'active' : ''}`}
            onClick={() => {
              setEntryType('expense')
              setCategory(EXPENSE_CATEGORIES[0].name)
            }}
          >
            <Text>支出</Text>
          </View>
          <View
            className={`type-btn ${entryType === 'income' ? 'active' : ''}`}
            onClick={() => {
              setEntryType('income')
              setCategory(INCOME_CATEGORIES[0].name)
            }}
          >
            <Text>收入</Text>
          </View>
        </View>
        <View className="cat-grid">
          {categories.map((c) => (
            <View
              key={c.name}
              className={`cat-item ${category === c.name ? 'active' : ''}`}
              onClick={() => setCategory(c.name)}
            >
              <Text className="cat-emoji">{c.emoji}</Text>
              <Text>{c.name}</Text>
            </View>
          ))}
        </View>
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

      {/* 分类占比 */}
      {byCategory.length > 0 && (
        <View className="card">
          <View className="card-title">
            <Text>📊 {entryType === 'expense' ? '支出' : '收入'}分类</Text>
          </View>
          {byCategory.map((x) => (
            <View key={x.c.name} style={{ marginBottom: 8 }}>
              <View className="row-between">
                <Text className="sub">
                  {x.c.emoji} {x.c.name}
                </Text>
                <Text className="sub">
                  ¥{x.sum.toFixed(2)} · {Math.round((x.sum / total) * 100)}%
                </Text>
              </View>
              <View className="progress">
                <View className="progress-fill" style={{ width: `${(x.sum / maxCat) * 100}%` }} />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 搜索 */}
      <View className="card" style={{ padding: '8px 14px' }}>
        <Input
          placeholder="搜索备注或分类…"
          value={search}
          onInput={(e) => setSearch(e.detail.value)}
          style={{ border: 'none', padding: '6px 0', borderRadius: 0 }}
        />
      </View>

      {/* 编辑弹层 */}
      {editing && (
        <View className="modal-mask" onClick={() => setEditing(null)}>
          <View className="modal" onClick={(e) => e.stopPropagation()}>
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
                  range={ALL_CATS.map((c) => c.name)}
                  value={Math.max(
                    0,
                    ALL_CATS.findIndex((c) => c.name === editing.category)
                  )}
                  onChange={(e) => {
                    const name = ALL_CATS[Number(e.detail.value)]?.name
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
                onClick={() => {
                  set('ledger', (prev) => prev.filter((x) => x.id !== editing.id))
                  setEditing(null)
                }}
              >
                <Text>删除</Text>
              </View>
              <View className="btn small" onClick={saveEdit}>
                <Text>保存</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 流水（按日分组） */}
      {byDay.length === 0 && <Text className="empty">本月还没有记录</Text>}
      {byDay.map(([day, items]) => {
        const d = new Date(day + 'T00:00:00')
        const dayExpense = items.filter(isExpense).reduce((s, l) => s + l.amount, 0)
        const dayIncome = items.filter((l) => !isExpense(l)).reduce((s, l) => s + l.amount, 0)
        return (
          <View className="card" key={day}>
            <View className="card-title" style={{ marginBottom: 4 }}>
              <Text className="sub">
                {day.slice(5)} · 周{WEEKDAYS[d.getDay()]}
              </Text>
              <View className="row">
                {dayExpense > 0 && (
                  <Text className="sub">支出 ¥{dayExpense.toFixed(2)}</Text>
                )}
                {dayIncome > 0 && (
                  <Text className="sub" style={{ color: 'var(--success)' }}>
                    　收入 ¥{dayIncome.toFixed(2)}
                  </Text>
                )}
              </View>
            </View>
            {items.map((l) => (
              <View className="list-item" key={l.id} onClick={() => setEditing(l)}>
                <Text style={{ fontSize: 20 }}>{catEmoji(l.category)}</Text>
                <View className="grow">
                  <Text className="name">{l.note || l.category}</Text>
                  <Text className="sub" style={{ fontSize: 11 }}>
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
                  {l.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )
      })}
    </View>
  )
}
