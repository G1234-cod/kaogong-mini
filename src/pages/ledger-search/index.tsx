// 记账高级搜索：只读多条件检索（关键词 / 日期区间 / 类型 / 分类多选 / 金额区间），
// 结果按日期倒序、按日分组展示；编辑能力在记账主页，本页行不可点击
import { useMemo, useState } from 'react'
import { Image, Input, Text, View } from '@tarojs/components'
import { useData } from '../../store'
import Icon from '../../components/Icon'
import DatePicker from '../../components/DatePicker'
import { showToast } from '../../utils/platform'
import type { LedgerCategory, LedgerEntry } from '../../types'
import animalEmpty from '../../assets/images/小狗一蹶不振.png'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

const isExpense = (l: LedgerEntry) => l.type !== 'income'

export default function LedgerSearch() {
  const { data, ready } = useData()
  const [q, setQ] = useState('')
  const [dateFrom, setDateFrom] = useState('') // YYYY-MM-DD，空 = 不限
  const [dateTo, setDateTo] = useState('')
  const [type, setType] = useState<'all' | 'expense' | 'income'>('all')
  const [cats, setCats] = useState<string[]>([])
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState<LedgerEntry[]>([])

  // 合并支出/收入分类表按 name 去重（两边各有一个同名「其他」），既做宫格也做 emoji 查表
  const allCats = useMemo(() => {
    const map = new Map<string, LedgerCategory>()
    for (const c of [...data.ledgerCats.expense, ...data.ledgerCats.income]) {
      if (!map.has(c.name)) map.set(c.name, c)
    }
    return [...map.values()]
  }, [data.ledgerCats.expense, data.ledgerCats.income])

  const catEmoji = (name: string) => allCats.find((c) => c.name === name)?.emoji ?? '📦'

  const runSearch = () => {
    if (dateFrom && dateTo && dateFrom > dateTo) {
      showToast('起始日期不能晚于结束日期')
      return
    }
    const kw = q.trim().toLowerCase()
    const list = data.ledger.filter((l) => {
      if (kw && !(l.note.toLowerCase().includes(kw) || l.category.includes(kw))) return false
      if (dateFrom && l.date < dateFrom) return false
      if (dateTo && l.date > dateTo) return false
      if (type === 'expense' && !isExpense(l)) return false
      if (type === 'income' && isExpense(l)) return false
      if (cats.length > 0 && !cats.includes(l.category)) return false
      if (min !== '' && l.amount < Number(min)) return false
      if (max !== '' && l.amount > Number(max)) return false
      return true
    })
    setResults([...list].sort((a, b) => b.date.localeCompare(a.date)))
    setSearched(true)
  }

  const clearAll = () => {
    setQ('')
    setDateFrom('')
    setDateTo('')
    setType('all')
    setCats([])
    setMin('')
    setMax('')
    setSearched(false)
    setResults([])
  }

  const expenseSum = results.filter(isExpense).reduce((s, l) => s + l.amount, 0)
  const incomeSum = results.filter((l) => !isExpense(l)).reduce((s, l) => s + l.amount, 0)

  const byDay = useMemo(() => {
    const map = new Map<string, LedgerEntry[]>()
    for (const l of results) {
      if (!map.has(l.date)) map.set(l.date, [])
      map.get(l.date)!.push(l)
    }
    return [...map.entries()]
  }, [results])

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
        <Icon name="search" size={16} gap={4} />
        <Text>高级搜索</Text>
      </View>

      {/* 搜索条件：关键词 / 日期区间 / 类型 */}
      <View className="card">
        <View className="card-title">
          <Text>搜索条件</Text>
        </View>
        <View className="field">
          <Text className="sub">关键词</Text>
          <Input placeholder="搜备注 / 分类" value={q} onInput={(e) => setQ(e.detail.value)} />
        </View>
        <View className="form-row">
          <View className="field" style={{ flex: 1, marginBottom: 0 }}>
            <Text className="sub">起</Text>
            <DatePicker value={dateFrom} onChange={setDateFrom} placeholder="不限" compact />
          </View>
          <View className="field" style={{ flex: 1, marginBottom: 0 }}>
            <Text className="sub">至</Text>
            <DatePicker value={dateTo} onChange={setDateTo} placeholder="不限" compact />
          </View>
        </View>
        <View className="type-toggle" style={{ marginTop: 12, marginBottom: 0 }}>
          {([['all', '全部'], ['expense', '支出'], ['income', '收入']] as const).map(([t, label]) => (
            <View
              key={t}
              className={`type-btn ${type === t ? 'active' : ''}`}
              onClick={() => setType(t)}
            >
              <Text>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 分类多选 + 金额区间 + 操作 */}
      <View className="card">
        <View className="card-title">
          <Text>分类与金额</Text>
          {cats.length > 0 && <Text className="sub">已选 {cats.length} 个</Text>}
        </View>
        <View className="cat-grid">
          {allCats.map((c) => (
            <View
              key={c.name}
              className={`cat-item ${cats.includes(c.name) ? 'active' : ''}`}
              onClick={() =>
                setCats((prev) =>
                  prev.includes(c.name) ? prev.filter((n) => n !== c.name) : [...prev, c.name]
                )
              }
            >
              <Text className="cat-emoji">{c.emoji}</Text>
              <Text>{c.name}</Text>
            </View>
          ))}
        </View>
        <View className="form-row" style={{ marginTop: 12 }}>
          <View className="field" style={{ flex: 1, marginBottom: 0 }}>
            <Text className="sub">最低</Text>
            <Input
              type="digit"
              placeholder="不限"
              value={min}
              onInput={(e) => setMin(e.detail.value)}
            />
          </View>
          <View className="field" style={{ flex: 1, marginBottom: 0 }}>
            <Text className="sub">最高</Text>
            <Input
              type="digit"
              placeholder="不限"
              value={max}
              onInput={(e) => setMax(e.detail.value)}
            />
          </View>
        </View>
        <View className="row" style={{ marginTop: 14 }}>
          <View
            className="btn small"
            style={{ flex: 1, textAlign: 'center' }}
            onClick={runSearch}
          >
            <Icon name="search" size={16} gap={4} />
            <Text>搜索</Text>
          </View>
          <View
            className="btn plain small"
            style={{ flex: 1, textAlign: 'center' }}
            onClick={clearAll}
          >
            <Text>清空</Text>
          </View>
        </View>
      </View>

      {/* 搜索结果（点「搜索」后显示；只读，行不可编辑） */}
      {searched && (
        <View className="card">
          <View className="card-title" style={{ marginBottom: 0 }}>
            <Text>搜索结果</Text>
            <Text className="sub">
              {results.length} 笔 · 支出 ¥{expenseSum.toFixed(2)} · 收入 ¥{incomeSum.toFixed(2)}
            </Text>
          </View>
        </View>
      )}
      {searched && results.length === 0 && (
        <View className="empty">
          <Image className="empty-animal" src={animalEmpty} mode="aspectFit" />
          <Text>没有符合条件的记录</Text>
        </View>
      )}
      {searched &&
        byDay.map(([day, items]) => {
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
                  {dayExpense > 0 && <Text className="sub">支出 ¥{dayExpense.toFixed(2)}</Text>}
                  {dayIncome > 0 && (
                    <Text className="sub" style={{ color: 'var(--success)' }}>
                      收入 ¥{dayIncome.toFixed(2)}
                    </Text>
                  )}
                </View>
              </View>
              {items.map((l) => (
                <View className="list-item" key={l.id}>
                  <Text style={{ fontSize: 22 }}>{catEmoji(l.category)}</Text>
                  <View className="grow">
                    <Text className="name">{l.note || l.category}</Text>
                    <Text className="sub" style={{ fontSize: 16 }}>
                      {l.category} · {l.date}
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
