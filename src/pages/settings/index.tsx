// 设置（Phase 1 验证页）：身份显示 + 身份预览切换 + 5 个子页导航
import { Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { useData } from '../../store'
import { switchRolePreview } from '../../services/api/auth'

const MENUS: { type: string; label: string; emoji: string }[] = [
  { type: 'reminders', label: '作息与提醒', emoji: '⏰' },
  { type: 'city', label: '天气城市', emoji: '🌤' },
  { type: 'intel', label: '智能推荐偏好', emoji: '✨' },
  { type: 'account', label: '账号与数据', emoji: '🔐' },
  { type: 'about', label: '关于', emoji: 'ℹ️' },
]

export default function Settings() {
  const { auth, ready, rebootstrap } = useData()
  const [switching, setSwitching] = useState(false)

  useDidShow(() => {
    // 从子页返回时无需处理（Phase 1 子页为占位）
  })

  const toggleRole = async () => {
    if (switching || !auth) return
    setSwitching(true)
    const next = auth.role === 'user' ? 'guest' : 'user'
    await switchRolePreview(next)
    await rebootstrap()
    Taro.showToast({ title: next === 'guest' ? '已切换为演示模式' : '已恢复正式模式', icon: 'none' })
    setSwitching(false)
  }

  return (
    <View className="page">
      <View className="card">
        <View className="card-title">
          <Text>账号</Text>
          {auth && <Text className={`badge ${auth.role === 'guest' ? 'lag' : 'ok'}`}>{auth.role === 'guest' ? '演示模式' : '正式用户'}</Text>}
        </View>
        <Text className="sub">
          {ready
            ? auth
              ? `OpenID：${auth.openid.slice(0, 12)}…（微信静默登录，免密码）`
              : '登录中…'
            : '初始化中…'}
        </Text>
        <View
          className={`btn ghost small${switching ? ' is-disabled' : ''}`}
          style={{ marginTop: 10 }}
          onClick={toggleRole}
        >
          {switching ? '切换中…' : '身份预览切换（正式 ↔ 演示）'}
        </View>
        <Text className="sub" style={{ marginTop: 6 }}>
          演示模式注入样板数据，不写入真实数据；正式模式数据实时同步服务器（后端接入后生效）。
        </Text>
      </View>

      <Text className="section-label">通用</Text>
      <View className="card">
        {MENUS.map((m) => (
          <View
            key={m.type}
            className="list-item"
            onClick={() => Taro.navigateTo({ url: `/pages/settings-sub/index?type=${m.type}` })}
          >
            <Text>{m.emoji}</Text>
            <Text className="grow name">{m.label}</Text>
            <Text className="sub">›</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
