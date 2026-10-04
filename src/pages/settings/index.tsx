// 设置主页：账号身份卡（头像/昵称/手机号 + 游客转正/演示模式 + 重置数据）+ 菜单摘要接真实数据
// 个人主体小程序：不再提供身份切换（原开发预览切换已移除），正式用户只能重置数据
import { Image, Text, View } from '@tarojs/components'
import Icon from '../../components/Icon'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { useData } from '../../store'
import { upgradeAccount } from '../../services/api/auth'
import { op, writeKeys } from '../../services/api/data'
import type { DataKey } from '../../services/request'
import { appConfirm } from '../../components/ConfirmDialog'
import { isDevAccount } from '../../services/api/devLogin'
import { buildGuestData } from '../../mocks/fixtures'
import { mergeWithDefaults } from '../../store/normalize'
import { useTabSwipe } from '../../utils/tabSwipe'
import { cityLabel } from '../../constants/cities'

export default function Settings() {
  const { data, auth, ready, rebootstrap } = useData()
  const tabSwipe = useTabSwipe(4)
  const [upgrading, setUpgrading] = useState(false)
  const [demoBusy, setDemoBusy] = useState(false)
  const s = data.settings
  const demoOn = s.guestDemo !== false

  // 游客转正：确认 → 二选一（带走试玩数据 / 重新开始）→ upgrade + 上传 → rebootstrap
  const upgrade = async () => {
    if (upgrading) return
    const ok = await appConfirm('升级为正式账号', '升级后数据同步云端，换设备也能继续使用。', {
      confirmText: '去升级',
    })
    if (!ok) return
    const keep = await appConfirm(
      '试玩数据怎么处理？',
      '选「带走试玩数据」会把试玩期间的记录同步到你的正式账号；选「重新开始」则从零开始。',
      { confirmText: '带走试玩数据', cancelText: '重新开始' }
    )
    setUpgrading(true)
    try {
      await upgradeAccount({ keepData: keep })
      await rebootstrap()
      Taro.showToast({ title: keep ? '已升级并带走试玩数据' : '已升级为正式账号', icon: 'none' })
    } catch {
      Taro.showToast({ title: '升级失败，请稍后重试', icon: 'none' })
    } finally {
      setUpgrading(false)
    }
  }

  // 游客数据模式：演示数据（注入 fixtures 全量）↔ 空白模式（清空业务记录，保留设置项）
  const switchDemo = async (demo: boolean) => {
    if (demoBusy) return
    const ok = await appConfirm(
      demo ? '切换为演示数据？' : '切换为空白模式？',
      demo
        ? '将写入预置的演示记录（打卡、闪卡、记账等），当前试玩记录会被覆盖。'
        : '将清空业务记录只保留设置项，从零开始记录。',
      { confirmText: '切换' }
    )
    if (!ok) return
    setDemoBusy(true)
    try {
      const next = demo ? buildGuestData() : mergeWithDefaults({})
      const payload = {
        ...next,
        settings: demo ? { ...next.settings, guestDemo: true } : { ...s, guestDemo: false },
      }
      await writeKeys((Object.keys(payload) as DataKey[]).map((k) => op(k, payload[k])))
      await rebootstrap()
      Taro.showToast({ title: demo ? '已切换为演示数据' : '已切换为空白模式', icon: 'none' })
    } finally {
      setDemoBusy(false)
    }
  }

  // 正式用户重置数据：双重确认 → 清本地登录态与缓存 → 重新引导（原 clearCache 逻辑改名接入）
  const resetData = async () => {
    const first = await appConfirm('确定重置数据吗？', '服务器数据不受影响，重新拉取即可恢复', {
      danger: true,
      confirmText: '继续',
    })
    if (!first) return
    const second = await appConfirm('再次确认：真的要重置吗？', '将清除本地登录态与缓存数据，页面随后重新初始化。', {
      danger: true,
      confirmText: '重置',
    })
    if (!second) return
    // 清空本地存储（正式数据/试玩沙盒/登录态/预览开关）后重新引导（保留 kg-role-chosen，选择屏只出现一次）
    for (const k of ['kg-auth', 'kg-openid', 'kg-token', 'kg-data', 'kg-guest-data', 'kg-dev-role', 'kg-write-queue']) {
      Taro.removeStorageSync(k)
    }
    await rebootstrap()
    Taro.showToast({ title: '已重置本地数据', icon: 'none' })
  }

  const menus: { type: string; emoji: string; tint: string; label: string; sub: string }[] = [
    {
      type: 'reminders',
      emoji: '⏰',
      tint: 'var(--tint-1)',
      label: '作息与提醒',
      sub: `起床 ${s.wake} · 睡觉 ${s.sleep} · 喝水每 ${s.water.intervalMin} 分钟`,
    },
    {
      type: 'notify',
      emoji: '🔔',
      tint: 'var(--tint-2)',
      label: '服务通知',
      sub: '微信推送额度与接收设置',
    },
    {
      type: 'city',
      emoji: '📍',
      tint: 'var(--tint-3)',
      label: '天气城市',
      sub: ready && s.city ? `当前：${cityLabel(s.city)}` : '未设置',
    },
    {
      type: 'intel',
      emoji: '✨',
      tint: 'var(--tint-4)',
      label: '智能推荐偏好',
      sub: s.intel?.enabled ? '已启用 · 吃什么页可问小助手' : '未启用',
    },
    {
      type: 'account',
      emoji: '🔐',
      tint: 'var(--tint-5)',
      label: '账号与数据',
      sub: isDevAccount()
        ? '演示账号 · 开发期临时身份'
        : auth?.role === 'guest'
          ? '试玩账号 · 微信信息与试玩数据'
          : '正式账号 · 微信信息与数据重置',
    },
    { type: 'about', emoji: 'ℹ️', tint: 'var(--tint-6)', label: '关于', sub: '使用说明 · 数据与隐私' },
  ]

  if (!ready) {
    return (
      <View className="page">
        <View className="skeleton sk-card" />
        <View className="skeleton sk-card" />
        <View className="skeleton sk-card" />
      </View>
    )
  }

  return (
    <View className="page tab-page" {...tabSwipe}>
      <View className="card">
        <View className="card-title">
          <Text>账号</Text>
          {auth && (
            <Text className={`badge ${auth.role === 'guest' ? 'lag' : 'ok'}`}>
              {isDevAccount() ? '演示账号' : auth.role === 'guest' ? '试玩账号' : '正式账号'}
            </Text>
          )}
        </View>
        <View
          className="account-hero"
          onClick={() => Taro.navigateTo({ url: '/pages/settings-sub/index?type=account' })}
        >
          {s.avatarUrl ? (
            <Image className="account-avatar" src={s.avatarUrl} mode="aspectFill" />
          ) : (
            <View className="account-avatar ph">
              <Icon name="user" size={28} gap={0} />
            </View>
          )}
          <View className="grow" style={{ textAlign: 'left', minWidth: 0 }}>
            <Text className="account-name">{s.nickname ? s.nickname : '点击完善微信信息'}</Text>
            <Text className="sub" style={{ fontSize: 16, display: 'block', marginTop: 2 }}>
              {s.phone ? `手机 ${s.phone}` : '头像 · 昵称 · 手机号，点此完善'}
            </Text>
          </View>
          <Icon name="arrow-up" size={16} className="arrow-r" />
        </View>
        {auth?.role === 'guest' && (
          <View>
            <View
              className={`btn small${upgrading ? ' is-disabled' : ''}`}
              style={{ marginTop: 10 }}
              onClick={upgrade}
            >
              <Text>{upgrading ? '升级中…' : '升级为正式账号'}</Text>
            </View>
            <View
              className="row"
              style={{ justifyContent: 'space-between', marginTop: 12 }}
              onClick={() => void switchDemo(!demoOn)}
            >
              <Text>演示数据 / 空白模式</Text>
              <View className={`ms-check${demoOn ? ' on' : ''}`}>{demoOn ? <Icon name="check" size={12} /> : null}</View>
            </View>
          </View>
        )}
        {auth?.role === 'user' && (
          <View className="btn danger small" style={{ marginTop: 10 }} onClick={() => void resetData()}>
            <Text>重置数据</Text>
          </View>
        )}
      </View>

      <Text className="section-label">通用</Text>
      <View className="card" style={{ padding: 0 }}>
        {menus.map((m) => (
          <View
            key={m.type}
            className="menu-item"
            onClick={() => Taro.navigateTo({ url: `/pages/settings-sub/index?type=${m.type}` })}
          >
            <Text className="menu-icon" style={{ background: m.tint }}>{m.emoji}</Text>
            <View className="grow" style={{ textAlign: 'left' }}>
              <Text>{m.label}</Text>
              <Text className="sub" style={{ fontSize: 14, display: 'block' }}>
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
