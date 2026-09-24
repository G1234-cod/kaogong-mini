// 设置主页：微信静默登录身份卡（Phase 1）+ 菜单摘要接真实数据（Phase 3）
import { Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { useData } from '../../store'
import { switchRolePreview } from '../../services/api/auth'
import { cityLabel } from '../../constants/cities'

export default function Settings() {
  const { data, auth, ready, rebootstrap } = useData()
  const [switching, setSwitching] = useState(false)
  const s = data.settings

  useDidShow(() => {
    // 从子页返回时摘要随 store 自动刷新，无需额外处理
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

  const menus: { type: string; emoji: string; label: string; sub: string }[] = [
    {
      type: 'reminders',
      emoji: '⏰',
      label: '作息与提醒',
      sub: `起床 ${s.wake} · 睡觉 ${s.sleep} · 喝水每 ${s.water.intervalMin} 分钟`,
    },
    {
      type: 'city',
      emoji: '📍',
      label: '天气城市',
      sub: ready && s.city ? `当前：${cityLabel(s.city)}` : '未设置',
    },
    {
      type: 'intel',
      emoji: '✨',
      label: '智能推荐偏好',
      sub: s.intel?.enabled ? '已启用 · 吃什么页可问小助手' : '未启用',
    },
    {
      type: 'account',
      emoji: '🔐',
      label: '账号与数据',
      sub: auth?.role === 'guest' ? '演示模式 · 数据不入库' : '登录态 · 清空本地缓存',
    },
    { type: 'about', emoji: 'ℹ️', label: '关于', sub: '使用说明 · 数据与隐私' },
  ]

  return (
    <View className="page">
      <View className="card">
        <View className="card-title">
          <Text>账号</Text>
          {auth && (
            <Text className={`badge ${auth.role === 'guest' ? 'lag' : 'ok'}`}>
              {auth.role === 'guest' ? '演示模式' : '正式用户'}
            </Text>
          )}
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
          <Text>{switching ? '切换中…' : '身份预览切换（正式 ↔ 演示）'}</Text>
        </View>
        <Text className="sub" style={{ marginTop: 6 }}>
          演示模式注入样板数据，不写入真实数据；正式模式数据实时同步服务器（后端接入后生效）。
        </Text>
      </View>

      <Text className="section-label">通用</Text>
      <View className="card" style={{ padding: 0 }}>
        {menus.map((m) => (
          <View
            key={m.type}
            className="menu-item"
            onClick={() => Taro.navigateTo({ url: `/pages/settings-sub/index?type=${m.type}` })}
          >
            <Text className="menu-icon">{m.emoji}</Text>
            <View className="grow" style={{ textAlign: 'left' }}>
              <Text>{m.label}</Text>
              <Text className="sub" style={{ fontSize: 12, display: 'block' }}>
                {m.sub}
              </Text>
            </View>
            <Text className="sub">›</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
