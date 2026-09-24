// 生活：7 宫格导航入口（待办/周期任务角标）→ 各工具页
// 自 PWA pages/Life.tsx 迁移：open(key) → Taro.navigateTo
import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useData } from '../../store'
import { daysBetween, todayStr } from '../../utils/date'

const ENTRIES: { key: string; icon: string; title: string; desc: string; url: string }[] = [
  { key: 'food', icon: '🍽', title: '吃什么', desc: '选择困难终结者', url: '/pages/food/index' },
  { key: 'ledger', icon: '💰', title: '记账本', desc: '花销与预算', url: '/pages/ledger/index' },
  { key: 'todos', icon: '🛒', title: '待办清单', desc: '要办的事、要买的东西', url: '/pages/todos/index' },
  { key: 'periodic', icon: '🔁', title: '周期提醒', desc: '洗衣、打电话等定期事', url: '/pages/periodic/index' },
  { key: 'dates', icon: '📌', title: '重要日期', desc: '生日、纪念日、截止日', url: '/pages/dates/index' },
  { key: 'notes', icon: '📰', title: '时政收集', desc: '素材金句随手记', url: '/pages/notes/index' },
  { key: 'pomodoro', icon: '🌸', title: '种花番茄钟', desc: '专注一朵花', url: '/pages/pomodoro/index' },
]

export default function Life() {
  const { data, ready } = useData()
  const today = todayStr()
  const badge: Record<string, number> = {
    todos: ready ? data.todos.filter((t) => !t.done).length : 0,
    periodic: ready
      ? data.periodic.filter((p) => daysBetween(p.lastDone, today) >= p.everyDays).length
      : 0,
  }

  return (
    <View className="page">
      <View className="page-title">
        <Text>🌈 生活助手</Text>
      </View>
      <View className="grid-menu">
        {ENTRIES.map((e) => (
          <View
            className="grid-card"
            key={e.key}
            onClick={() => Taro.navigateTo({ url: e.url })}
          >
            <Text className="grid-icon">{e.icon}</Text>
            <View className="grid-title">
              <Text>{e.title}</Text>
              {badge[e.key] ? <Text className="grid-badge">{badge[e.key]}</Text> : null}
            </View>
            <Text className="grid-desc">{e.desc}</Text>
          </View>
        ))}
      </View>
      <View className="card" style={{ marginTop: 14 }}>
        <Text className="sub">
          💡 三餐时间、喝水、睡眠提醒在「今日」页；提醒时间可在「设置 → 作息与提醒」中调整。
        </Text>
      </View>
    </View>
  )
}
