// 设置子页（?type= 参数页）：reminders / city / intel / account / about
// Phase 1 为参数路由骨架 + 占位内容；完整功能 Phase 2/3 迁移
import { Text, View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'

const TITLES: Record<string, string> = {
  reminders: '作息与提醒',
  city: '天气城市',
  intel: '智能推荐偏好',
  account: '账号与数据',
  about: '关于',
}

const PLACEHOLDER: Record<string, string> = {
  reminders: '作息时间、三餐提醒与喝水提醒设置（Phase 2 迁移，时间选择用小程序原生 Picker mode=time）',
  city: '天气城市搜索与定位（Phase 3 迁移，外部服务经后端代理）',
  intel: '智能推荐开关与口味偏好（模型服务由云端代理，Phase 3 迁移）',
  account: '登录态信息、数据同步状态与清空数据（Phase 4 接后端后完善）',
  about: '考公小助手 · 微信小程序版\nVue 3 B 端管理台另行部署\n上线后自动无感更新',
}

export default function SettingsSub() {
  const [type, setType] = useState('about')
  useLoad((params) => {
    if (params?.type && TITLES[params.type]) setType(params.type)
  })

  const title = TITLES[type] ?? TITLES.about

  return (
    <View className="page">
      <View className="card">
        <View className="card-title">
          <Text>{title}</Text>
        </View>
        <Text className="sub">{PLACEHOLDER[type] ?? ''}</Text>
      </View>
    </View>
  )
}
