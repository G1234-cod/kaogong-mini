// 吃什么：餐次切换 + 口味筛选（想吃/不吃）+ 老虎机随机（收藏3倍权重）+ AI 对话入口（智能帮我想）
// 自 PWA pages/Food.tsx 迁移：GLM 直连（Key 在端侧）→ proxy.chatAI（Key 上云，端侧仅 settings.intel 开关），
// window.open → 引导提示 / 复制，对话自动滚动 → ScrollView scrollIntoView，文案合规（AI→智能）
// 智能帮我挑对话模式已迁移至 pages/ai-chat（候选卡/口味画像联动在那边），本页导出画像与上下文构建函数供其复用
import { useEffect, useMemo, useRef, useState } from 'react'
import Taro from '@tarojs/taro'
import { Image, Input, ScrollView, Text, View } from '@tarojs/components'
import { useData } from '../../store'
import Icon from '../../components/Icon'
import SwipeRow from '../../components/SwipeRow'
import { appConfirm } from '../../components/ConfirmDialog'
import animalEmpty from '../../assets/images/汤圆.png'
import type { FoodItem, MealSlot, PoiItem, TasteTag } from '../../types'
import { MEAL_SLOT_LABELS } from '../../constants/foods'
import { searchNearbyPois } from '../../services/api/proxy'
import { openDelivery } from '../../services/meituan'
import { copyText, showToast } from '../../utils/platform'
import { todayStr, uid } from '../../utils/date'

const SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'supper']
const TASTES: TasteTag[] = ['清淡', '辣', '快餐', '饱腹']

export default function Food() {
  const { data, ready, set } = useData()
  const [slot, setSlot] = useState<MealSlot>(() => {
    const h = new Date().getHours()
    if (h < 10) return 'breakfast'
    if (h < 14) return 'lunch'
    if (h < 21) return 'dinner'
    return 'supper'
  })
  const [wantTastes, setWantTastes] = useState<TasteTag[]>([]) // 想吃的（正向，多选）
  const [avoidTastes, setAvoidTastes] = useState<TasteTag[]>([]) // 不吃的（负向）
  const [result, setResult] = useState<FoodItem | null>(null)
  const [rolling, setRolling] = useState(false)
  const [rollName, setRollName] = useState('')
  const [copied, setCopied] = useState(false)
  const [newName, setNewName] = useState('')
  const [newTastes, setNewTastes] = useState<TasteTag[]>([])
  const [managing, setManaging] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false) // 口味筛选折叠（默认收起一行）
  const rollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // 卸载时清掉滚动计时器
  useEffect(() => () => { if (rollTimer.current) clearTimeout(rollTimer.current) }, [])

  const today = todayStr()
  const todayFoodLog = data.foodLog[today] ?? {}
  const eatenToday = Object.values(todayFoodLog).filter(Boolean) as string[]
  const intelOn = ready && !!data.settings.intel?.enabled

  // 筛选：餐次 → 排除负向 → 满足全部正向
  const filtered = useMemo(() => {
    return data.foods.filter(
      (x) =>
        x.slots.includes(slot) &&
        avoidTastes.every((t) => !x.tags.includes(t)) &&
        wantTastes.every((t) => x.tags.includes(t)) &&
        !eatenToday.includes(x.name)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.foods, slot, wantTastes, avoidTastes, eatenToday.join(',')])

  const slotFoods = useMemo(
    () => data.foods.filter((x) => x.slots.includes(slot)),
    [data.foods, slot]
  )

  // 收藏 3 倍权重的加权随机
  const pickWeighted = (pool: FoodItem[]): FoodItem => {
    const weighted: FoodItem[] = []
    for (const x of pool) {
      weighted.push(x)
      if (x.fav) weighted.push(x, x) // 收藏再 +2
    }
    return weighted[Math.floor(Math.random() * weighted.length)]
  }

  const startRoll = () => {
    if (filtered.length === 0 || rolling) return
    setRolling(true)
    setResult(null)
    setCopied(false)
    let count = 0
    const tick = () => {
      setRollName(filtered[Math.floor(Math.random() * filtered.length)].name)
      count++
      if (count < 18) {
        rollTimer.current = setTimeout(tick, 60 + count * 8) // 逐渐变慢
      } else {
        setRolling(false)
        const final = pickWeighted(filtered)
        setResult(final)
      }
    }
    tick()
  }

  const toggleFav = (id: string) => {
    set('foods', (prev) => prev.map((x) => (x.id === id ? { ...x, fav: !x.fav } : x)))
  }

  /** 左滑删除候选（SwipeRow 触发）：先 appConfirm 确认再删 */
  const removeFood = (x: FoodItem) => {
    void appConfirm(`删除候选「${x.name}」？`, undefined, { danger: true, confirmText: '删除' }).then((ok) => {
      if (ok) set('foods', (prev) => prev.filter((p) => p.id !== x.id))
    })
  }

  const recordEaten = (name: string) => {
    set('foodLog', (prev) => ({
      ...prev,
      [today]: { ...prev[today], [slot]: name },
    }))
    showToast(`已记录：今天${MEAL_SLOT_LABELS[slot]}吃「${name}」`)
  }

  const addFood = () => {
    if (!newName.trim()) {
      showToast('请输入食物名称')
      return
    }
    set('foods', (prev) => [
      ...prev,
      { id: uid(), name: newName.trim(), emoji: '🍽', slots: [slot], tags: newTastes },
    ])
    setNewName('')
    setNewTastes([])
  }

  const toggleTaste = (t: TasteTag, mode: 'want' | 'avoid') => {
    if (mode === 'want') {
      setWantTastes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
      setAvoidTastes((prev) => prev.filter((x) => x !== t))
    } else {
      setAvoidTastes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
      setWantTastes((prev) => prev.filter((x) => x !== t))
    }
    setResult(null)
  }

  const eatenLabel = (s: MealSlot) => todayFoodLog[s]

  // ---- 搜附近美食（腾讯位置服务 POI，走后端代理） ----
  const [poiOpen, setPoiOpen] = useState(false)
  const [pois, setPois] = useState<PoiItem[]>([])
  const [poiLoading, setPoiLoading] = useState(false)

  const openNearby = async () => {
    if (!result) return
    setPoiOpen(true)
    setPoiLoading(true)
    setPois([])
    let lat = data.settings.city?.lat
    let lon = data.settings.city?.lon
    try {
      // 优先实时定位，拒绝授权则退回已保存城市的坐标
      const pos = await Taro.getFuzzyLocation({ type: 'gcj02' })
      lat = pos.latitude
      lon = pos.longitude
    } catch {
      // 用户拒绝定位权限 → 用已保存城市
    }
    if (lat == null || lon == null) {
      showToast('还没有可用位置，请先在「今日」页设置城市')
      setPoiLoading(false)
      return
    }
    try {
      const list = await searchNearbyPois(lat, lon, result.name)
      setPois(list)
      if (list.length === 0) showToast('附近没搜到相关店铺，换个候选试试')
    } catch {
      showToast('搜索失败，请检查网络')
    } finally {
      setPoiLoading(false)
    }
  }

  /** 点击 POI → 地图查看位置与路线 */
  const openPoi = (p: PoiItem) => {
    void Taro.openLocation({
      latitude: p.lat,
      longitude: p.lon,
      name: p.name,
      address: p.address,
    })
  }

  // ---- AI 对话页入口（对话逻辑已迁移至 pages/ai-chat） ----
  const openAIChat = () => {
    Taro.navigateTo({ url: `/pages/ai-chat/index?ctx=food&slot=${slot}` })
  }

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
      {/* 餐次切换（置顶） */}
      <View className="slot-tabs">
        {SLOTS.map((s) => (
          <View
            key={s}
            className={`slot-btn ${slot === s ? 'active' : ''}`}
            onClick={() => {
              setSlot(s)
              setResult(null)
            }}
          >
            <Text>{MEAL_SLOT_LABELS[s]}</Text>
            {eatenLabel(s) ? <Icon name="check" size={12} gap={2} /> : null}
          </View>
        ))}
      </View>

      {/* 今日已吃 */}
      {eatenToday.length > 0 && (
        <View className="card food-eaten">
          <Text className="sub">
            📝 今天已吃：
            {SLOTS.filter((s) => todayFoodLog[s])
              .map((s) => `${MEAL_SLOT_LABELS[s]}·${todayFoodLog[s]}`)
              .join('　')}
          </Text>
        </View>
      )}

      {/* 智能未开启提示：可点跳智能助手设置 */}
      {!intelOn && (
        <Text
          className="sub food-intel-tip"
          onClick={() => Taro.navigateTo({ url: '/pages/settings-sub/index?type=intel' })}
        >
          未开启智能助手，点这里去「设置 → 智能助手」开启后可用「AI 对话」
        </Text>
      )}

      {/* 老虎机结果 hero 大卡（先看到结果） */}
      <View className="food-result">
        {rolling ? (
          <>
            <Text className="food-emoji">🎰</Text>
            <Text className="food-name roll-name">{rollName}</Text>
          </>
        ) : result ? (
          <>
            <Text className="food-emoji">{result.emoji}</Text>
            <Text className="food-name">{result.name}</Text>
            {result.tags.length > 0 && (
              <View className="food-result-tags">
                {result.tags.map((t) => (
                  <Text className="tag" key={t}>
                    {t}
                  </Text>
                ))}
              </View>
            )}
            {/* 外卖跳转：降为结果卡内次要按钮 */}
            <View className="divider" />
            <View className="row" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
              <View className="btn plain" onClick={() => void openDelivery('meituan', result.name)}>
                <Text>美团</Text>
              </View>
              <View className="btn plain" onClick={() => void openDelivery('eleme', result.name)}>
                <Text>饿了么</Text>
              </View>
              <View className="btn plain" onClick={() => void openNearby()}>
                <Text>搜附近</Text>
              </View>
            </View>
            <Text className="sub food-tip">
              美团/饿了么会复制「{result.name}」后跳转小程序，粘贴即可搜索
            </Text>
          </>
        ) : (
          <>
            <Text className="food-emoji">🍽</Text>
            <Text className="sub food-result-hint">
              选择困难症？让命运决定今天的{MEAL_SLOT_LABELS[slot]}
            </Text>
          </>
        )}
      </View>

      {/* 主 CTA：帮我选 / 就吃它 */}
      {!result ? (
        <View className="food-cta">
          <View
            className={`btn big-btn${filtered.length === 0 || rolling ? ' is-disabled' : ''}`}
            onClick={() => {
              if (filtered.length > 0) startRoll()
            }}
          >
            <Text>帮我选</Text>
          </View>
          {filtered.length === 0 && (
            <Text className="sub food-empty-tip">筛选条件下没有候选了，放宽条件或去下面添加</Text>
          )}
        </View>
      ) : (
        !rolling && (
          <View className="food-cta">
            <View className="row" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
              <View className="btn" onClick={() => recordEaten(result.name)}>
                <Text>就吃它 🍽</Text>
              </View>
              <View className="btn plain" onClick={startRoll}>
                <Text>换一个</Text>
              </View>
              <View
                className="btn plain"
                onClick={() => {
                  void copyText(result.name)
                  setCopied(true)
                }}
              >
                <Text>{copied ? '已复制 ✓' : '复制'}</Text>
              </View>
            </View>
          </View>
        )
      )}

      {/* 口味筛选：默认折叠一行，可展开 */}
      <View className="taste-filter">
        <View className="row-between food-filter-row" onClick={() => setFilterOpen((v) => !v)}>
          <Text className="sub">
            口味：
            {wantTastes.length === 0 && avoidTastes.length === 0
              ? '不限'
              : `${wantTastes.join('+') || '不限'}${avoidTastes.length ? '，不吃' + avoidTastes.join('/') : ''}`}
          </Text>
          <Icon name={filterOpen ? 'arrow-down' : 'arrow-up'} size={14} gap={2} />
        </View>
        {filterOpen && (
          <>
            <View className="row taste-row">
              <Text className="taste-label">想吃</Text>
              {TASTES.map((t) => (
                <Text
                  key={t}
                  className={`tag ${wantTastes.includes(t) ? 'selected' : ''}`}
                  onClick={() => toggleTaste(t, 'want')}
                >
                  {t}
                </Text>
              ))}
            </View>
            <View className="row taste-row">
              <Text className="taste-label">不吃</Text>
              {TASTES.map((t) => (
                <Text
                  key={t}
                  className={`tag ${avoidTastes.includes(t) ? 'avoid' : ''}`}
                  onClick={() => toggleTaste(t, 'avoid')}
                >
                  {t}
                </Text>
              ))}
            </View>
          </>
        )}
        <Text className="sub food-filter-count">
          {wantTastes.length === 0 && avoidTastes.length === 0
            ? `全部 ${filtered.length} 个候选（不含今天吃过的）`
            : `${wantTastes.map((t) => t).join('+') || '不限'}${avoidTastes.length ? '，不吃' + avoidTastes.join('/') : ''} · 剩 ${filtered.length} 个候选`}
        </Text>
      </View>

      {/* 智能帮我想 → AI 对话入口 */}
      {intelOn && (
        <View className="card">
          <View className="card-title">
            <View className="row" style={{ gap: 8, alignItems: 'center' }}>
              <View className="emoji-badge sm">
                <Text className="emoji">🤖</Text>
              </View>
              <Text>智能帮我想</Text>
            </View>
            <View className="btn ghost small" onClick={openAIChat}>
              <Icon name="chat" size={12} gap={4} />
              <Text>AI 对话</Text>
            </View>
          </View>
          <Text className="sub" style={{ display: 'block', marginTop: 2 }}>
            和小助手聊两句，帮你想出今天{MEAL_SLOT_LABELS[slot]}吃什么，聊完直接拍板记录
          </Text>
        </View>
      )}

      {/* 候选池：默认收起为二级入口，展开进入管理态 */}
      <View className="card">
        <View className="card-title">
          <Text>
            {MEAL_SLOT_LABELS[slot]}候选（{filtered.length}/{slotFoods.length}）
          </Text>
          <View className="btn ghost small" onClick={() => setManaging((v) => !v)}>
            <Text>{managing ? '收起' : '管理'}</Text>
          </View>
        </View>
        {!managing && (
          <Text className="sub">共 {slotFoods.length} 个候选，点「管理」可添加、调收藏或删除</Text>
        )}
        {managing && (
          <>
            <Text className="sub food-manage-tip">点条目切换收藏（随机时更容易抽中）；左滑删除</Text>
            {slotFoods.map((x) => (
              <SwipeRow key={x.id} onDelete={() => removeFood(x)}>
                <View
                  className={`food-chip-row ${avoidTastes.some((t) => x.tags.includes(t)) ? 'muted' : ''}`}
                  onClick={() => toggleFav(x.id)}
                >
                  <Text className={`food-chip ${x.fav ? 'fav' : ''}`}>
                    {x.emoji} {x.name} {x.fav ? '⭐' : ''}
                  </Text>
                </View>
              </SwipeRow>
            ))}
            {slotFoods.length === 0 && (
              <View className="empty">
                <Image className="empty-animal" src={animalEmpty} mode="aspectFit" />
                <Text>还没有候选，先在下面添加</Text>
              </View>
            )}
            <View className="divider" />
            <View className="field">
              <Input
                placeholder={`添加到${MEAL_SLOT_LABELS[slot]}池的食物`}
                value={newName}
                onInput={(e) => setNewName(e.detail.value)}
              />
            </View>
            <View className="row taste-row" style={{ marginBottom: 10 }}>
              {TASTES.map((t) => (
                <Text
                  key={t}
                  className={`tag ${newTastes.includes(t) ? 'selected' : ''}`}
                  onClick={() =>
                    setNewTastes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
                  }
                >
                  {t}
                </Text>
              ))}
            </View>
            <View className="btn small" onClick={addFood}>
              <Text>添加</Text>
            </View>
          </>
        )}
      </View>

      {/* 搜附近美食：POI 结果浮层 */}
      {poiOpen && (
        <View className="chat-overlay">
          <View className="chat-head">
            <Icon name="pin" size={16} gap={4} />
            <Text className="grow">附近「{result?.name ?? ''}」</Text>
            <View className="chat-close" onClick={() => setPoiOpen(false)}>
              <Icon name="x" size={12} gap={4} />
              <Text>关闭</Text>
            </View>
          </View>
          <ScrollView scrollY className="chat-body">
            {poiLoading && (
              <View className="chat-msg ai">
                <Text className="bubble">正在搜索附近的店…</Text>
              </View>
            )}
            {!poiLoading && pois.length === 0 && (
              <View className="chat-msg ai">
                <Text className="bubble">附近没搜到相关店铺，换个候选再试试～</Text>
              </View>
            )}
            {pois.map((p) => (
              <View
                key={p.id}
                className="card poi-card"
                style={{ margin: 0 }}
                onClick={() => openPoi(p)}
              >
                <View className="row" style={{ justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, fontWeight: 700, flex: 1 }}>{p.name}</Text>
                  <Text className="sub" style={{ fontSize: 14, flexShrink: 0 }}>
                    {p.distance >= 1000 ? `${(p.distance / 1000).toFixed(1)} km` : `${p.distance} m`}
                  </Text>
                </View>
                <Text className="sub" style={{ fontSize: 14, display: 'block', marginTop: 4 }}>
                  {p.address}
                </Text>
                {p.tel && (
                  <View style={{ marginTop: 2, display: 'flex', alignItems: 'center' }}>
                    <Icon name="phone" size={14} gap={4} />
                    <Text className="sub" style={{ fontSize: 14 }}>{p.tel}</Text>
                  </View>
                )}
                <Text className="sub" style={{ fontSize: 14, display: 'block', marginTop: 6, color: 'var(--primary)' }}>
                  点击查看位置与路线 →
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )
}
