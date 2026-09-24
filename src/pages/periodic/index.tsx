// 周期提醒：定期事项（洗衣/打电话/换床单），到期高亮 + 一键「做完了」重置周期
// 自 PWA pages/Periodic.tsx 迁移：结构简单，纯组件替换
import { useState } from 'react'
import { Input, Text, View } from '@tarojs/components'
import { useData } from '../../store'
import { daysBetween, todayStr, uid } from '../../utils/date'

export default function Periodic() {
  const { data, ready, set } = useData()
  const [name, setName] = useState('')
  const [every, setEvery] = useState('')
  const today = todayStr()

  const add = () => {
    if (!name.trim() || !every) return
    set('periodic', (prev) => [
      ...prev,
      { id: uid(), name: name.trim(), everyDays: Math.max(1, Number(every)), lastDone: today },
    ])
    setName('')
    setEvery('')
  }

  const sorted = [...data.periodic].sort((a, b) => {
    const da = daysBetween(a.lastDone, today) - a.everyDays
    const db = daysBetween(b.lastDone, today) - b.everyDays
    return db - da
  })

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
        <Text>🔁 周期提醒</Text>
      </View>

      <View className="card">
        <View className="form-row">
          <View className="field" style={{ flex: 1, marginBottom: 0 }}>
            <Input
              placeholder="事项名称，如：洗衣服"
              value={name}
              onInput={(e) => setName(e.detail.value)}
            />
          </View>
          <View className="field" style={{ width: 100, marginBottom: 0 }}>
            <Input
              type="number"
              placeholder="每几天"
              value={every}
              onInput={(e) => setEvery(e.detail.value)}
            />
          </View>
          <View className="btn small" onClick={add}>
            <Text>添加</Text>
          </View>
        </View>
        <Text className="sub" style={{ marginTop: 6 }}>
          如：洗衣服（每 3 天）、给家里打电话（每 2 天）、换床单（每 14 天）
        </Text>
      </View>

      <View className="card">
        {sorted.map((p) => {
          const since = daysBetween(p.lastDone, today)
          const due = since >= p.everyDays
          return (
            <View className="list-item" key={p.id}>
              <View className="grow">
                <Text className="name">{p.name}</Text>
                <Text className="sub">
                  每 {p.everyDays} 天 ·{' '}
                  {due ? (
                    <Text style={{ color: 'var(--danger)', fontWeight: 700 }}>
                      该做了！（已隔 {since} 天）
                    </Text>
                  ) : (
                    `还剩 ${p.everyDays - since} 天`
                  )}
                </Text>
              </View>
              {due && (
                <View
                  className="btn small"
                  onClick={() =>
                    set('periodic', (prev) =>
                      prev.map((x) => (x.id === p.id ? { ...x, lastDone: today } : x))
                    )
                  }
                >
                  <Text>做完了</Text>
                </View>
              )}
              <View
                className="icon-btn"
                onClick={() => set('periodic', (prev) => prev.filter((x) => x.id !== p.id))}
              >
                <Text>✕</Text>
              </View>
            </View>
          )
        })}
        {data.periodic.length === 0 && <Text className="empty">添加需要定期做的事项</Text>}
      </View>
    </View>
  )
}
