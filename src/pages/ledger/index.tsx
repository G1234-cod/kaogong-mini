// 记账本（Phase 1 占位页）
import { Text, View } from '@tarojs/components'

export default function Ledger() {
  return (
    <View className="page">
      <View className="card">
        <View className="card-title">
          <Text>记账本</Text>
        </View>
        <Text className="sub">收支记录与月度预算（Phase 2 迁移）</Text>
      </View>
    </View>
  )
}
