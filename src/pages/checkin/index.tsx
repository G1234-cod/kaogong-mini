// 打卡（Phase 1 骨架）：打卡项只读展示 + 连续天数（完整打卡交互 Phase 2 迁移）
import { Text, View } from '@tarojs/components'
import { useData } from '../../store'
import { streakFor } from '../../utils/streak'
import { todayStr } from '../../utils/date'

export default function Checkin() {
  const { data, ready } = useData()

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
      <View className="card">
        <View className="card-title">
          <Text>今日打卡</Text>
          <Text className="sub">{todayStr()}</Text>
        </View>
        {data.checkinItems.map((item) => {
          const ids = data.checkins[todayStr()] ?? []
          const done = ids.includes(item.id)
          const streak = streakFor(data.checkins, item.id)
          return (
            <View className={`list-item${done ? ' done' : ''}`} key={item.id}>
              <Text>{item.emoji}</Text>
              <Text className="grow name">{item.name}</Text>
              <Text className="sub">连续 {streak} 天</Text>
            </View>
          )
        })}
      </View>
      <View className="card">
        <Text className="sub">完整打卡交互（热力图 / 奖励判定）将在 Phase 2 迁移</Text>
      </View>
    </View>
  )
}
