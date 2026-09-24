// 生活（Phase 1 验证页）：7 宫格导航 → 各工具页（真实 navigateTo，验证页面栈）
import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'

const ENTRIES: { key: string; label: string; emoji: string; url: string }[] = [
  { key: 'food', label: '吃什么', emoji: '🍜', url: '/pages/food/index' },
  { key: 'ledger', label: '记账本', emoji: '💰', url: '/pages/ledger/index' },
  { key: 'todos', label: '待办', emoji: '✅', url: '/pages/todos/index' },
  { key: 'periodic', label: '周期任务', emoji: '🔁', url: '/pages/periodic/index' },
  { key: 'dates', label: '重要日子', emoji: '🎂', url: '/pages/dates/index' },
  { key: 'notes', label: '时政闪卡', emoji: '🃏', url: '/pages/notes/index' },
  { key: 'pomodoro', label: '番茄钟', emoji: '🍅', url: '/pages/pomodoro/index' },
]

export default function Life() {
  return (
    <View className="page">
      <Text className="section-label">生活工具</Text>
      <View className="card">
        {ENTRIES.map((e) => (
          <View
            key={e.key}
            className="list-item"
            onClick={() => Taro.navigateTo({ url: e.url })}
          >
            <Text>{e.emoji}</Text>
            <Text className="grow name">{e.label}</Text>
            <Text className="sub">›</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
