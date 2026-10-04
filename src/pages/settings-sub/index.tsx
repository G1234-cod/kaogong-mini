// 设置子页（?type= 参数页）：reminders / city / intel / notify / account / about
// 自 PWA pages/Settings.tsx 各 Sub 组件迁移：
// - input type=time → Picker mode=time（原生时间选择器，样式统一无缩放问题）
// - AI Key 填写 → 智能推荐开关（Key 已上云，端侧只留开关与口味偏好，硬约束合规）
// - 导出/导入备份 → 清空本地缓存（文件读写无小程序对应物，数据主体后续在服务器）
import { useEffect, useState } from 'react'
import { Button, Canvas, Image, Input, Picker, Text, View } from '@tarojs/components'
import Icon from '../../components/Icon'
import Taro, { useLoad } from '@tarojs/taro'
import { useData } from '../../store'
import { appConfirm } from '../../components/ConfirmDialog'
import DevAccountPanel from '../../components/DevAccountPanel'
import { DEV_LOGIN_ENABLED, isDevAccount } from '../../services/api/devLogin'
import { showToast } from '../../utils/platform'
import { fetchSubscribeStatus, searchCities, subscribeRemind } from '../../services/api/proxy'
import { HENAN_CITIES, OTHER_CITIES, cityLabel, type City } from '../../constants/cities'
import type { GeoCandidate, TasteTag } from '../../types'

const TASTE_TAGS: TasteTag[] = ['清淡', '辣', '快餐', '饱腹']

const TITLES: Record<string, string> = {
  reminders: '作息与提醒',
  city: '天气城市',
  intel: '智能推荐偏好',
  notify: '服务通知',
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
      citySource: 'manual',
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
        <View className="row-between" style={{ marginBottom: 8 }}>
          <Text className="sub">
            定位方式：{s.citySource === 'manual' ? '手动指定（自动定位已暂停）' : '自动定位'}
          </Text>
          {s.citySource === 'manual' && (
            <View
              className="btn ghost small"
              onClick={() => {
                set('settings', { ...s, citySource: 'auto' })
                setMsg('已恢复自动定位，回到「今日」页即可生效')
              }}
            >
              <Icon name="refresh" size={12} gap={4} />恢复自动定位
            </View>
          )}
        </View>
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
          <View className={`ms-check${intel.enabled ? ' on' : ''}`}>{intel.enabled ? <Icon name="check" size={12} /> : null}</View>
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

const AVATAR_SIZE = 128

/** 头像压缩：微信 chooseAvatar 临时路径 → Canvas 居中裁剪 128×128 → JPEG base64 dataURL */
async function compressAvatar(tempPath: string): Promise<string> {
  const canvas: any = await new Promise((resolve, reject) => {
    Taro.createSelectorQuery()
      .select('#avatarCanvas')
      .fields({ node: true, size: true })
      .exec((res: any[]) => {
        const node = res && res[0] && res[0].node
        if (node) resolve(node)
        else reject(new Error('canvas 节点未就绪'))
      })
  })
  const info = await Taro.getImageInfo({ src: tempPath })
  canvas.width = AVATAR_SIZE
  canvas.height = AVATAR_SIZE
  const ctx = canvas.getContext('2d')
  const img = canvas.createImage()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = tempPath
  })
  // 居中裁剪成正方形后画满 128×128
  const side = Math.min(info.width, info.height)
  ctx.drawImage(
    img,
    (info.width - side) / 2,
    (info.height - side) / 2,
    side,
    side,
    0,
    0,
    AVATAR_SIZE,
    AVATAR_SIZE
  )
  // Canvas 2d 节点无 toDataURL，走 canvasToTempFilePath 出 JPEG 再读 base64
  const tmp = await Taro.canvasToTempFilePath({
    canvas,
    canvasId: 'avatarCanvas',
    x: 0,
    y: 0,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    destWidth: AVATAR_SIZE,
    destHeight: AVATAR_SIZE,
    fileType: 'jpg',
    quality: 0.82,
  } as Parameters<typeof Taro.canvasToTempFilePath>[0])
  const base64 = Taro.getFileSystemManager().readFileSync(tmp.tempFilePath, 'base64')
  return 'data:image/jpeg;base64,' + base64
}

function AccountSub() {
  const { auth, rebootstrap, data, set } = useData()
  const s = data.settings
  const [avatarBusy, setAvatarBusy] = useState(false)
  const [nickDraft, setNickDraft] = useState(s.nickname ?? '')
  const [phoneDraft, setPhoneDraft] = useState(s.phone ?? '')

  // 头像：微信选图（open-type=chooseAvatar）→ 压缩 128×128 JPEG base64 存 settings.avatarUrl
  const onChooseAvatar = async (e: { detail: { avatarUrl: string } }) => {
    const temp = e.detail.avatarUrl
    if (!temp) return
    setAvatarBusy(true)
    try {
      const avatarUrl = await compressAvatar(temp)
      set('settings', { ...s, avatarUrl })
      showToast('头像已更新')
    } catch {
      showToast('头像处理失败，请重试')
    } finally {
      setAvatarBusy(false)
    }
  }

  // 昵称：Input type=nickname，键盘上方可一键填入微信昵称；≤16 字
  const saveNickname = () => {
    const name = nickDraft.trim().slice(0, 16)
    if (name === (s.nickname ?? '')) return
    set('settings', { ...s, nickname: name })
    showToast(name ? '昵称已保存' : '已清空昵称')
  }

  // 手机号：个人主体无 getPhoneNumber 授权，手动填写；升级企业主体后可换 open-type="getPhoneNumber"
  const savePhone = () => {
    const phone = phoneDraft.trim().slice(0, 11)
    if (phone === (s.phone ?? '')) return
    if (phone !== '' && !/^\d{11}$/.test(phone)) {
      setPhoneDraft(s.phone ?? '')
      showToast('手机号应为 11 位数字')
      return
    }
    set('settings', { ...s, phone: phone === '' ? undefined : phone })
    showToast(phone ? '手机号已保存' : '已清空手机号')
  }

  const clearTrial = async () => {
    const ok = await appConfirm('清空试玩记录？', '将清除试玩期间的本地记录并恢复为演示数据。', {
      danger: true,
      confirmText: '清空',
    })
    if (!ok) return
    Taro.removeStorageSync('kg-guest-data')
    await rebootstrap()
    showToast('试玩记录已清空')
  }

  const clearCache = async () => {
    const first = await appConfirm('确定清空本地缓存吗？', '服务器数据不受影响，重新拉取即可恢复', { danger: true, confirmText: '继续' })
    if (!first) return
    const second = await appConfirm('再次确认：真的要清空吗？', '将清除本地登录态与缓存数据，页面随后重新初始化。', { danger: true, confirmText: '清空' })
    if (!second) return
    // 清空本地存储（正式数据/试玩沙盒/登录态/预览开关）后重新引导（保留 kg-role-chosen，选择屏只出现一次）
    for (const k of ['kg-auth', 'kg-openid', 'kg-token', 'kg-data', 'kg-guest-data', 'kg-dev-role', 'kg-write-queue']) {
      Taro.removeStorageSync(k)
    }
    await rebootstrap()
    showToast('已清空本地缓存')
  }

  return (
    <View>
      <View className="card">
        <View className="card-title">
          <Text>微信信息</Text>
          {auth && (
            <Text className={`badge ${auth.role === 'guest' ? 'lag' : 'ok'}`}>
              {isDevAccount() ? '演示账号' : auth.role === 'guest' ? '试玩账号' : '正式账号'}
            </Text>
          )}
        </View>
        <View className="row" style={{ gap: 14, alignItems: 'center' }}>
          <Button className="avatar-btn" open-type="chooseAvatar" onChooseAvatar={onChooseAvatar}>
            {s.avatarUrl ? (
              <Image className="account-avatar" src={s.avatarUrl} mode="aspectFill" />
            ) : (
              <View className="account-avatar ph">
                <Icon name="user" size={28} gap={0} />
              </View>
            )}
          </Button>
          <View className="grow" style={{ textAlign: 'left' }}>
            <Text className="sub">{avatarBusy ? '头像处理中…' : '点击头像更换'}</Text>
          </View>
        </View>
        <View className="field">
          <Text className="sub">昵称</Text>
          <Input
            type="nickname"
            value={nickDraft}
            maxlength={16}
            placeholder="点击填写"
            onInput={(e) => setNickDraft(e.detail.value)}
            onBlur={saveNickname}
          />
        </View>
        <View className="field">
          <Text className="sub">手机号</Text>
          <Input
            type="number"
            value={phoneDraft}
            maxlength={11}
            placeholder="选填，11 位手机号"
            onInput={(e) => setPhoneDraft(e.detail.value)}
            onBlur={savePhone}
          />
        </View>
      </View>
      {auth?.role === 'guest' && (
        <View className="card">
          <View className="card-title">
            <Text>试玩记录</Text>
          </View>
          <View className="btn danger" onClick={() => void clearTrial()}>
            <Text>清空试玩记录</Text>
          </View>
        </View>
      )}
      <View className="card">
        <View className="card-title">
          <Text>本地缓存</Text>
        </View>
        <View className="btn danger" onClick={() => void clearCache()}>
          <Text>清空本地缓存</Text>
        </View>
      </View>
      {/* 开发期临时：演示账号面板（上线前连同 components/DevAccountPanel 一并移除） */}
      {DEV_LOGIN_ENABLED && <DevAccountPanel onDone={rebootstrap} />}
      {/* 头像压缩专用 Canvas（离屏，128×128） */}
      <Canvas
        type="2d"
        id="avatarCanvas"
        style={{ position: 'fixed', left: '-9999px', top: 0, width: `${AVATAR_SIZE}px`, height: `${AVATAR_SIZE}px` }}
      />
    </View>
  )
}

// ---------- 服务通知 ----------
function NotifySub() {
  const { auth } = useData()
  const [quota, setQuota] = useState<number | null>(null) // null = 查询中/不可用
  const [loading, setLoading] = useState(true)

  // 进入页面查一次剩余额度（多模板取总和；当前个人主体两场景共用同一模板）
  const loadQuota = async () => {
    setLoading(true)
    const res = await fetchSubscribeStatus()
    setQuota(res ? Object.values(res).reduce((s, n) => s + n, 0) : null)
    setLoading(false)
  }
  useEffect(() => {
    void loadQuota()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 手动 +1 额度：弹授权（force 跳过每日去重；须由点击回调直接发起）→ 接受即上报 → 刷新
  const askGrant = async () => {
    await subscribeRemind(true)
    void loadQuota()
  }

  return (
    <View>
      <View className="card">
        <View className="card-title">
          <Icon name="mail" size={16} gap={4} /><Text>推送内容与时间</Text>
        </View>
        <Text className="sub">
          每天早上 7:30 检查一次：有到期的周期待办或待复习的笔记闪卡时，通过微信服务通知推送到你的微信。
        </Text>
      </View>
      <View className="card">
        <View className="card-title">
          <Icon name="ticket" size={16} gap={4} /><Text>剩余额度</Text>
        </View>
        {auth?.role === 'guest' ? (
          <Text className="sub">
            试玩账号不参与服务通知推送。升级为正式账号后，在完成打卡、复习闪卡等操作时顺手授权即可累积推送额度。
          </Text>
        ) : (
          <View>
            <View style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 40, fontWeight: 800, color: 'var(--primary)', lineHeight: 1.2 }}>
                {loading ? '…' : quota ?? '—'}
              </Text>
              <Text className="sub">条</Text>
              <View className="btn small ghost" style={{ marginLeft: 'auto' }} onClick={() => void askGrant()}>
                <Text>+ 增加 1 条</Text>
              </View>
            </View>
            <Text className="sub" style={{ marginTop: 8, display: 'block' }}>
              微信订阅消息为「授权一次、推送一条」：每次点「允许」累积 1 条额度，推送一条扣减一条。完成打卡、复习闪卡时也会顺手请求授权（每天至多提醒一次，不会打扰）。
            </Text>
          </View>
        )}
      </View>
      <View className="card">
        <View className="card-title">
          <Icon name="wrench" size={16} gap={4} /><Text>收不到通知？</Text>
        </View>
        <Text className="sub">
          1. 点上方「增加 1 条」确认额度 &gt; 0；{'\n'}2. 检查微信总开关：本小程序内点右上角「···」→ 设置 → 消息订阅，确认未关闭；{'\n'}3. 若曾选择「总是保持以上选择」并拒绝，需删除小程序重新进入才会再次弹出授权。
        </Text>
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
          <Icon name="mobile" size={16} gap={4} /><Text>关于小程序</Text>
        </View>
        <Text className="sub">
          考公小助手 · 微信小程序版。无需安装，即开即用，版本更新由微信自动完成，无需手动操作。PC 管理端（B 端）另行部署，用于配置奖励与维护数据。
        </Text>
      </View>
      <View className="card">
        <View className="card-title">
          <Icon name="bell" size={16} gap={4} /><Text>关于提醒</Text>
        </View>
        <Text className="sub">
          该做的事以卡片高亮（喝水、三餐、睡眠、考试倒计时等），重要消息用页面弹窗和轻提示展示；到期周期待办、待复习笔记还可开通微信服务通知，每天早上 7:30 推送到微信（详见设置 → 服务通知）。
        </Text>
      </View>
      <View className="card">
        <View className="card-title">
          <Icon name="cloud" size={16} gap={4} /><Text>数据在哪</Text>
        </View>
        <Text className="sub">
          账号通过微信静默登录绑定，正式账号的数据实时同步到自建服务器，不上传任何第三方。天气来自公开气象接口，金句部分来自一言接口；智能推荐由云端统一代理，密钥不落端。试玩账号的数据仅存本地沙盒，升级时可选择带走。
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

  // 导航栏标题与页内 page-title 保持一致（config 静态标题仅为兜底的「设置」）
  useEffect(() => {
    Taro.setNavigationBarTitle({ title })
  }, [title])

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
    <View className="page">
      <View className="page-title">
        <Text>{title}</Text>
      </View>
      {type === 'reminders' && <RemindersSub />}
      {type === 'city' && <CitySub />}
      {type === 'intel' && <IntelSub />}
      {type === 'notify' && <NotifySub />}
      {type === 'account' && <AccountSub />}
      {type === 'about' && <AboutSub />}
    </View>
  )
}
