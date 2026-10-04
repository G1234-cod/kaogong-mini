// ==== 开发期临时组件：演示账号面板（上线前整体删除本文件） ====
// 账号密码登录「预置全量演示数据」的账号（openid dev-acct-* 与微信身份隔离，数据真实落服务器），
// 供开发期查看运行效果；附带重置演示数据 / 退出演示账号。入口挂设置-账号与数据页底部。
import { useState } from 'react'
import { Input, Text, View } from '@tarojs/components'
import { appConfirm } from './ConfirmDialog'
import { showToast } from '../utils/platform'
import { buildGuestData } from '../mocks/fixtures'
import { fetchSnapshot, op, writeKeys } from '../services/api/data'
import type { DataKey } from '../services/request'
import { initTransport } from '../services/httpTransport'
import { devLogin, devLogout, isDevAccount } from '../services/api/devLogin'

/** 演示数据写入单元（全量域，settings 冠以演示昵称便于辨识） */
function seedOps() {
  const fixtures = buildGuestData()
  const seeded = { ...fixtures, settings: { ...fixtures.settings, nickname: '演示账号' } }
  return (Object.keys(seeded) as DataKey[]).map((k) => op(k, seeded[k]))
}

export default function DevAccountPanel({ onDone }: { onDone: () => Promise<void> | void }) {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const dev = isDevAccount()

  // 登录：换演示账号身份 → 账号无数据则灌入演示数据（时序：写入必须在 rebootstrap 之前）
  const doLogin = async () => {
    const acc = account.trim()
    if (!acc || !password) {
      showToast('请输入账号和密码')
      return
    }
    setBusy(true)
    try {
      const ok = await initTransport()
      if (!ok) throw new Error('server unreachable')
      await devLogin(acc, password)
      const snap = await fetchSnapshot()
      // 空库判断对齐 store 的 bare 语义（业务三件套任一存在即视为有数据），有数据不覆盖
      const bare = !snap || (!snap.checkins && !snap.notes && !snap.exams)
      if (bare) await writeKeys(seedOps())
      showToast('已登录演示账号')
      await onDone()
    } catch {
      showToast('登录失败：账号或密码错误，或服务器不可达')
    } finally {
      setBusy(false)
    }
  }

  // 重置：无条件覆盖回初始演示数据（仅演示账号可用，防止误覆盖真实账号数据）
  const doReset = async () => {
    const ok = await appConfirm('重置演示数据？', '当前演示账号的数据将恢复为初始演示状态。', {
      danger: true,
      confirmText: '重置',
    })
    if (!ok) return
    setBusy(true)
    try {
      await writeKeys(seedOps())
      showToast('演示数据已重置')
      await onDone()
    } finally {
      setBusy(false)
    }
  }

  // 退出：清演示身份，重新引导回微信真实账号
  const doLogout = async () => {
    const ok = await appConfirm('退出演示账号？', '将回到你的微信真实账号（演示数据保留在服务器）。', {
      confirmText: '退出',
    })
    if (!ok) return
    devLogout()
    showToast('已退出演示账号')
    await onDone()
  }

  return (
    <View className="card">
      <View className="card-title">
        <Text>演示账号（开发）</Text>
      </View>
      <Text className="sub">
        开发期临时功能：账号密码登录预置全量演示数据的账号，查看运行效果（与微信身份隔离，上线前移除）
      </Text>
      <View className="field">
        <Text className="sub">账号</Text>
        <Input
          value={account}
          placeholder="demo"
          onInput={(e) => setAccount(e.detail.value)}
        />
      </View>
      <View className="field">
        <Text className="sub">密码</Text>
        <Input
          password
          value={password}
          placeholder="请输入密码"
          onInput={(e) => setPassword(e.detail.value)}
        />
      </View>
      <View className={`btn ${busy ? 'is-disabled' : ''}`} onClick={() => void (busy ? 0 : doLogin())}>
        <Text>{busy ? '处理中…' : '登录演示账号'}</Text>
      </View>
      {dev && (
        <View className="btn" onClick={() => void (busy ? 0 : doReset())}>
          <Text>重置演示数据</Text>
        </View>
      )}
      {dev && (
        <View className="btn danger" onClick={() => void (busy ? 0 : doLogout())}>
          <Text>退出演示账号</Text>
        </View>
      )}
    </View>
  )
}
