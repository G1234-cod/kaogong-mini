// 设置子页（?type= 参数页）：reminders / city / intel / account / about
// 自 PWA pages/Settings.tsx 各 Sub 组件迁移：
// - input type=time → Picker mode=time（原生时间选择器，样式统一无缩放问题）
// - AI Key 填写 → 智能推荐开关（Key 已上云，端侧只留开关与口味偏好，硬约束合规）
// - 导出/导入备份 → 清空本地缓存（文件读写无小程序对应物，数据主体后续在服务器）
import { useState } from 'react'
import { Input, Picker, Text, View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useData } from '../../store'
import { appConfirm } from '../../components/ConfirmDialog'
import { showToast } from '../../utils/platform'
import { searchCities } from '../../services/api/proxy'
import { HENAN_CITIES, OTHER_CITIES, cityLabel, type City } from '../../constants/cities'
import type { GeoCandidate, TasteTag } from '../../types'

const TASTE_TAGS: TasteTag[] = ['清淡', '辣', '快餐', '饱腹']

const TITLES: Record<string, string> = {
  reminders: '作息与提醒',
  city: '天气城市',
  intel: '智能推荐偏好',
  account: '账号与数据',
  about: '关于',
}

/** 时间字段：原生 Picker mode=time（HH:mm），触发器复用 dp-trigger 样式保持视觉统一 */
function TimeField({
  label,
  value,
  onPick,
}: {
  label: string
  value: string
  onPick: (v: string) => void
}) {
  return (
    <View className="field">
      <Text className="sub">{label}</Text>
      <Picker mode="time" value={value} onChange={(e) => onPick(e.detail.value)}>
        <View className="dp-trigger compact">
          <Text>{value}</Text>
        </View>
      </Picker>
    </View>
  )
}

/** 数字字段：本地草稿避免逐键 clamp 打断输入，失焦时提交并夹取边界 */
function NumField({
  label,
  value,
  min,
  fallback,
  onSubmit,
}: {
  label: string
  value: number
  min: number
  fallback: number
  onSubmit: (v: number) => void
}) {
  const [draft, setDraft] = useState(String(value))
  return (
    <View className="field">
      <Text className="sub">{label}</Text>
      <Input
        type="number"
        value={draft}
        onInput={(e) => setDraft(e.detail.value)}
        onBlur={() => {
          const n = Number(draft)
          const v = draft.trim() === '' || !n ? fallback : Math.max(min, Math.round(n))
          setDraft(String(v))
          onSubmit(v)
        }}
      />
    </View>
  )
}

// ---------- 作息与提醒 ----------
function RemindersSub() {
  const { data, set } = useData()
  const s = data.settings

  return (
    <View className="card">
      <View className="form-row">
        <TimeField
          label="起床时间"
          value={s.wake}
          onPick={(v) => set('settings', { ...s, wake: v })}
        />
        <TimeField
          label="睡觉时间"
          value={s.sleep}
          onPick={(v) => set('settings', { ...s, sleep: v })}
        />
      </View>
      <View className="form-row">
        <TimeField
          label="早餐"
          value={s.meals.breakfast}
          onPick={(v) => set('settings', { ...s, meals: { ...s.meals, breakfast: v } })}
        />
        <TimeField
          label="午餐"
          value={s.meals.lunch}
          onPick={(v) => set('settings', { ...s, meals: { ...s.meals, lunch: v } })}
        />
        <TimeField
          label="晚餐"
          value={s.meals.dinner}
          onPick={(v) => set('settings', { ...s, meals: { ...s.meals, dinner: v } })}
        />
      </View>
      <View className="form-row">
        <NumField
          label="喝水间隔（分钟）"
          value={s.water.intervalMin}
          min={15}
          fallback={90}
          onSubmit={(v) => set('settings', { ...s, water: { ...s.water, intervalMin: v } })}
        />
        <NumField
          label="每日喝水目标（杯）"
          value={s.water.targetCups}
          min={1}
          fallback={8}
          onSubmit={(v) => set('settings', { ...s, water: { ...s.water, targetCups: v } })}
        />
      </View>
    </View>
  )
}

// ---------- 天气城市 ----------
function CitySub() {
  const { data, set } = useData()
  const s = data.settings
  const [query, setQuery] = useState('')
  const [candidates, setCandidates] = useState<GeoCandidate[]>([])
  const [msg, setMsg] = useState('')
  const [searching, setSearching] = useState(false)

  const pick = (c: City | GeoCandidate) => {
    set('settings', {
      ...s,
      city: { name: c.name, province: c.province, city: c.city, lat: c.lat, lon: c.lon },
    })
    setMsg(
      `已切换到 ${c.city ? cityLabel(c) : c.province ? c.province + ' · ' + c.name : c.name}`
    )
    setCandidates([])
    setQuery('')
  }

  const search = async () => {
    if (!query.trim()) return
    setSearching(true)
    setMsg('')
    try {
      const list = await searchCities(query.trim())
      setCandidates(list)
      if (list.length === 0) setMsg('没有找到这个地名，换个写法试试')
    } catch {
      setMsg('搜索失败，请检查网络')
    } finally {
      setSearching(false)
    }
  }

  return (
    <View>
      <View className="card">
        <Text className="sub" style={{ marginBottom: 8, display: 'block' }}>
          当前城市：{s.city ? cityLabel(s.city) : '未设置'}
        </Text>
        <View className="form-row">
          <View className="field" style={{ flex: 1, marginBottom: 0 }}>
            <Input
              placeholder="搜索城市或区县（如 洛龙区，结果请点选）"
              value={query}
              onInput={(e) => setQuery(e.detail.value)}
              onConfirm={() => void search()}
            />
          </View>
          <View
            className={`btn small${searching ? ' is-disabled' : ''}`}
            onClick={() => {
              if (!searching) void search()
            }}
          >
            <Text>{searching ? '搜索中…' : '搜索'}</Text>
          </View>
        </View>
        {msg !== '' && (
          <Text className="sub" style={{ marginTop: 6, display: 'block' }}>
            {msg}
          </Text>
        )}
        {candidates.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text className="sub" style={{ marginBottom: 4, display: 'block' }}>
              搜索结果（点击选择）：
            </Text>
            {candidates.map((c, i) => (
              <View className="list-item" key={i} onClick={() => pick(c)}>
                <Text className="grow">
                  {cityLabel(c)} <Text className="sub">{c.province}</Text>
                </Text>
                <Text className="sub">›</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <Text className="section-label">河南省（点选切换）</Text>
      <View className="card">
        <View className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
          {HENAN_CITIES.map((c) => (
            <Text
              key={c.name}
              className={`tag ${s.city?.name === c.name && s.city?.province === '河南' ? 'selected' : ''}`}
              style={{ border: 'none', padding: '6px 14px', fontSize: 13 }}
              onClick={() => pick(c)}
            >
              {c.name}
            </Text>
          ))}
        </View>
      </View>

      <Text className="section-label">常用城市</Text>
      <View className="card">
        <View className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
          {OTHER_CITIES.map((c) => (
            <Text
              key={c.name}
              className={`tag ${s.city?.name === c.name ? 'selected' : ''}`}
              style={{ border: 'none', padding: '6px 14px', fontSize: 13 }}
              onClick={() => pick(c)}
            >
              {c.name}
            </Text>
          ))}
        </View>
      </View>
    </View>
  )
}

// ---------- 智能推荐偏好 ----------
function IntelSub() {
  const { data, set } = useData()
  const s = data.settings
  const intel = s.intel ?? { enabled: true, tastes: [] as TasteTag[] }

  const toggle = () => {
    set('settings', { ...s, intel: { ...intel, enabled: !intel.enabled } })
    showToast(!intel.enabled ? '已启用智能推荐，去「生活 → 吃什么」体验吧' : '已关闭智能推荐')
  }

  const toggleTaste = (t: TasteTag) => {
    const has = intel.tastes.includes(t)
    set('settings', {
      ...s,
      intel: {
        ...intel,
        tastes: has ? intel.tastes.filter((x) => x !== t) : [...intel.tastes, t],
      },
    })
  }

  return (
    <View>
      <View className="card">
        <Text className="sub" style={{ marginBottom: 10, display: 'block' }}>
          开启后，「吃什么」页可以问专属小助手：它会结合你的口味和今天吃过的东西，给出今天的推荐（含推荐理由），推荐结果可一键加入候选池。
          智能服务由云端统一代理，无需填写任何密钥。
        </Text>
        <View className="row" style={{ justifyContent: 'space-between' }} onClick={toggle}>
          <Text>启用智能推荐</Text>
          <View className={`ms-check${intel.enabled ? ' on' : ''}`}>{intel.enabled ? '✓' : ''}</View>
        </View>
      </View>
      <View className="card">
        <View className="card-title">
          <Text>口味偏好（可多选）</Text>
        </View>
        <View className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
          {TASTE_TAGS.map((t) => (
            <Text
              key={t}
              className={`tag ${intel.tastes.includes(t) ? 'selected' : ''}`}
              style={{ border: 'none', padding: '6px 14px', fontSize: 13 }}
              onClick={() => toggleTaste(t)}
            >
              {t}
            </Text>
          ))}
        </View>
        <Text className="sub" style={{ marginTop: 8, display: 'block' }}>
          选中的口味会作为小助手推荐时的参考偏好。
        </Text>
      </View>
    </View>
  )
}

// ---------- 账号与数据 ----------
function AccountSub() {
  const { auth, ready, rebootstrap } = useData()

  const clearCache = async () => {
    const first = await appConfirm('确定清空本地缓存吗？', '服务器数据不受影响，重新拉取即可恢复', { danger: true, confirmText: '继续' })
    if (!first) return
    const second = await appConfirm('再次确认：真的要清空吗？', '将清除本地登录态与缓存数据，页面随后重新初始化。', { danger: true, confirmText: '清空' })
    if (!second) return
    // 清空本地存储（正式数据/游客沙盒/登录态/预览开关）后重新引导
    for (const k of ['kg-auth', 'kg-openid', 'kg-data', 'kg-guest-data', 'kg-dev-role']) {
      Taro.removeStorageSync(k)
    }
    await rebootstrap()
    showToast('已清空本地缓存')
  }

  return (
    <View>
      <View className="card">
        <View className="card-title">
          <Text>登录态</Text>
          {auth && (
            <Text className={`badge ${auth.role === 'guest' ? 'lag' : 'ok'}`}>
              {auth.role === 'guest' ? '演示模式' : '正式用户'}
            </Text>
          )}
        </View>
        <Text className="sub">
          {ready
            ? auth
              ? `OpenID：${auth.openid.slice(0, 12)}…（微信静默登录，免密码，后续打开免登录）`
              : '登录中…'
            : '初始化中…'}
        </Text>
        <Text className="sub" style={{ marginTop: 6, display: 'block' }}>
          {auth?.role === 'guest'
            ? '当前为演示模式：注入样板数据，所有写入仅存于本地沙盒，不会入库。'
            : '正式用户：数据实时同步服务器（后端接入后生效），换设备登录自动恢复。'}
        </Text>
      </View>
      <View className="card">
        <View className="card-title">
          <Text>本地缓存</Text>
        </View>
        <Text className="sub" style={{ marginBottom: 10, display: 'block' }}>
          网络数据（天气、金句等）与业务数据会缓存在本地以加速打开。遇到数据异常时可清空本地缓存重新拉取。
        </Text>
        <View className="btn danger" onClick={() => void clearCache()}>
          <Text>清空本地缓存</Text>
        </View>
      </View>
    </View>
  )
}

// ---------- 关于 ----------
function AboutSub() {
  return (
    <View>
      <View className="card">
        <View className="card-title">
          <Text>📱 关于小程序</Text>
        </View>
        <Text className="sub">
          考公小助手 · 微信小程序版。无需安装，即开即用，版本更新由微信自动完成，无需手动操作。PC 管理端（B 端）另行部署，用于配置奖励与维护数据。
        </Text>
      </View>
      <View className="card">
        <View className="card-title">
          <Text>🔔 关于提醒</Text>
        </View>
        <Text className="sub">
          所有提醒都在小程序内呈现：该做的事以卡片高亮（喝水、三餐、睡眠、考试倒计时等），重要消息用页面弹窗和轻提示展示，不发送任何系统通知，不打扰。打开小程序即可看到当下该做什么。
        </Text>
      </View>
      <View className="card">
        <View className="card-title">
          <Text>☁️ 数据在哪</Text>
        </View>
        <Text className="sub">
          账号通过微信静默登录绑定，正式用户的数据实时同步到自建服务器，不上传任何第三方。天气来自公开气象接口，金句部分来自一言接口；智能推荐由云端统一代理，密钥不落端。演示模式的数据仅存本地沙盒，不会入库。
        </Text>
      </View>
    </View>
  )
}

export default function SettingsSub() {
  const [type, setType] = useState('about')
  const { ready } = useData()
  useLoad((params) => {
    if (params?.type && TITLES[params.type]) setType(params.type)
  })

  const title = TITLES[type] ?? TITLES.about

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
      <View className="page-title">
        <Text>{title}</Text>
      </View>
      {type === 'reminders' && <RemindersSub />}
      {type === 'city' && <CitySub />}
      {type === 'intel' && <IntelSub />}
      {type === 'account' && <AccountSub />}
      {type === 'about' && <AboutSub />}
    </View>
  )
}
