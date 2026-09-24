// 重要日期：生日/纪念日/截止日（支持每年重复），按最近排序倒计时
// 自 PWA pages/Dates.tsx 迁移：checkbox → 自绘 ms-check，DatePicker 用 Taro 化组件
import { useState } from 'react'
import { Input, Text, View } from '@tarojs/components'
import { useData } from '../../store'
import DatePicker from '../../components/DatePicker'
import { daysBetween, todayStr, uid } from '../../utils/date'

export default function Dates() {
  const { data, ready, set } = useData()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [yearly, setYearly] = useState(false)
  const today = todayStr()

  const nextOccurrence = (d: string, isYearly: boolean): string => {
    if (!isYearly) return d
    const thisYear = today.slice(0, 4) + d.slice(4)
    return thisYear >= today
      ? thisYear
      : String(Number(thisYear.slice(0, 4)) + 1) + d.slice(4)
  }

  const add = () => {
    if (!name.trim() || !date) return
    set('dates', (prev) => [...prev, { id: uid(), name: name.trim(), date, yearly }])
    setName('')
    setDate('')
    setYearly(false)
  }

  const sorted = [...data.dates].sort((a, b) =>
    nextOccurrence(a.date, a.yearly).localeCompare(nextOccurrence(b.date, b.yearly))
  )

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
        <Text>📌 重要日期</Text>
      </View>

      <View className="card">
        <View className="form-row">
          <View className="field" style={{ flex: 1, marginBottom: 0 }}>
            <Input
              placeholder="名称，如：妈妈生日"
              value={name}
              onInput={(e) => setName(e.detail.value)}
            />
          </View>
          <View className="field" style={{ marginBottom: 0 }}>
            <DatePicker value={date} onChange={setDate} />
          </View>
          <View className="btn small" onClick={add}>
            <Text>添加</Text>
          </View>
        </View>
        <View
          className="row"
          style={{ marginTop: 8, fontSize: 13, color: 'var(--text-sub)' }}
          onClick={() => setYearly((v) => !v)}
        >
          <View className={`ms-check${yearly ? ' on' : ''}`}>{yearly ? '✓' : ''}</View>
          <Text>每年重复（生日 / 纪念日）</Text>
        </View>
      </View>

      <View className="card">
        {sorted.map((d) => {
          const target = nextOccurrence(d.date, d.yearly)
          const left = daysBetween(today, target)
          return (
            <View className="list-item" key={d.id}>
              <View className="grow">
                <View className="row" style={{ alignItems: 'center' }}>
                  <Text className="name">{d.name}</Text>
                  {d.yearly && <Text className="tag">每年</Text>}
                </View>
                <Text className="sub">{d.date}</Text>
              </View>
              <Text className="chip">
                {left > 0 ? `还剩 ${left} 天` : left === 0 ? '就是今天！' : `已过 ${-left} 天`}
              </Text>
              <View
                className="icon-btn"
                onClick={() => set('dates', (prev) => prev.filter((x) => x.id !== d.id))}
              >
                <Text>✕</Text>
              </View>
            </View>
          )
        })}
        {data.dates.length === 0 && (
          <Text className="empty">生日、纪念日、报名截止日…写下来就不会忘</Text>
        )}
      </View>
    </View>
  )
}
