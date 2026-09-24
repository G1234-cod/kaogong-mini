// 饮食推荐（Phase 1 占位页）
import { Text, View } from '@tarojs/components'

export default function Food() {
  return (
    <View className="page">
      <View className="card">
        <View className="card-title">
          <Text>饮食推荐</Text>
        </View>
        <Text className="sub">智能推荐与餐次记录（Phase 2/3 迁移，外部服务经后端代理）</Text>
      </View>
    </View>
  )
}
