// 课程（Phase 1 骨架）：考试与课程只读列表（完整增删改查 Phase 2 迁移）
import { Text, View } from '@tarojs/components'
import { useData } from '../../store'
import { daysBetween, todayStr } from '../../utils/date'

export default function Courses() {
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
      <Text className="section-label">考试倒计时</Text>
      {data.exams.length === 0 && (
        <View className="card">
          <Text className="sub">暂无考试，Phase 2 开放添加</Text>
        </View>
      )}
      {data.exams.map((exam) => (
        <View className="card" key={exam.id}>
          <View className="card-title">
            <Text>{exam.name}</Text>
            <Text className="chip">{daysBetween(todayStr(), exam.date)} 天</Text>
          </View>
          <Text className="sub">{exam.date}</Text>
        </View>
      ))}

      <Text className="section-label">课程进度</Text>
      {data.courses.length === 0 && (
        <View className="card">
          <Text className="sub">暂无课程，Phase 2 开放添加</Text>
        </View>
      )}
      {data.courses.map((c) => (
        <View className="card" key={c.id}>
          <View className="card-title">
            <Text>{c.name}</Text>
            <Text className="sub">
              {c.done}/{c.total}
            </Text>
          </View>
          <View className="progress">
            <View className="progress-fill" style={{ width: `${Math.min(100, (c.done / c.total) * 100)}%` }} />
          </View>
        </View>
      ))}
    </View>
  )
}
