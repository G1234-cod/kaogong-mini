// 今日（Phase 1 验证页）：考试倒计时 + 数据链路自检
// 验收观测点：login→hydrate→writeKey 全链路（写入测试按钮触发乐观更新 + 异步持久化）
import { Text, View } from '@tarojs/components'
import { useData } from '../../store'
import { daysBetween, todayStr } from '../../utils/date'
import { QUOTES } from '../../constants/quotes'

export default function Today() {
  const { data, ready, auth, set } = useData()
  const exam = data.exams[0]
  const days = exam ? daysBetween(todayStr(), exam.date) : null
  const quote = QUOTES[new Date().getDate() % QUOTES.length]

  if (!ready) {
    return (
      <View className="page">
        <View className="card">
          <Text className="sub">正在登录与同步数据…</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="page">
      {auth?.role === 'guest' && (
        <View className="row" style={{ justifyContent: 'center', marginBottom: 10 }}>
          <Text className="chip warn">演示模式 · 样板数据</Text>
        </View>
      )}

      {exam && days !== null ? (
        <View className="countdown-compact">
          <View className="cd-main">
            <Text className="cd-days">
              {days}
              <Text className="cd-days-small">天</Text>
            </Text>
            <View className="cd-info">
              <Text className="cd-name">{exam.name}</Text>
              <Text className="cd-date">{exam.date} 笔试</Text>
            </View>
          </View>
          {exam.milestones.length > 0 && (
            <Text className="cd-others">
              下一节点：{exam.milestones.find((m) => !m.done)?.label ?? '全部完成'}
            </Text>
          )}
        </View>
      ) : (
        <View className="card">
          <View className="card-title">
            <Text>暂无考试安排</Text>
          </View>
          <Text className="sub">到「课程」页添加考试与节点计划</Text>
        </View>
      )}

      <View className="card">
        <View className="card-title">
          <Text>每日一句</Text>
        </View>
        <Text className="sub">{quote}</Text>
      </View>

      {/* 数据链路自检：乐观更新 → 异步持久化（storageTransport 模拟网络延迟） */}
      <View className="card">
        <View className="card-title">
          <Text>数据链路自检</Text>
          <Text className="sub">月度预算：{data.budget} 元</Text>
        </View>
        <View
          className="btn ghost small"
          onClick={() => set('budget', (b) => (b === 0 ? 300 : Math.round(b * 1.1)))}
        >
          写入测试（budget ×1.1）
        </View>
        <Text className="sub" style={{ marginTop: 6 }}>
          点击后数值即时变化（乐观更新），持久化异步完成；杀掉小程序重开数值保留。
        </Text>
      </View>
    </View>
  )
}
