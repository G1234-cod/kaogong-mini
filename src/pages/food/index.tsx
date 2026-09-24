// 吃什么：餐次切换 + 口味筛选（想吃/不吃）+ 老虎机随机（收藏3倍权重）+ 智能帮挑（对话模式）
// 自 PWA pages/Food.tsx 迁移：GLM 直连（Key 在端侧）→ proxy.chatAI（Key 上云，端侧仅 settings.intel 开关），
// window.open → 引导提示 / 复制，对话自动滚动 → ScrollView scrollIntoView，文案合规（AI→智能）
import { useEffect, useMemo, useRef, useState } from 'react'
import Taro from '@tarojs/taro'
import { Input, ScrollView, Text, View } from '@tarojs/components'
import { useData } from '../../store'
import type { FoodItem, MealSlot, TasteTag } from '../../types'
import { MEAL_SLOT_LABELS } from '../../constants/foods'
import { chatAI } from '../../services/api/proxy'
import { openMeituanWaimai } from '../../services/meituan'
import { copyText, showToast } from '../../utils/platform'
import { todayStr, uid } from '../../utils/date'

const SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'supper']
const TASTES: TasteTag[] = ['清淡', '辣', '快餐', '饱腹']

const CHAT_SYS =
  '你是贴心的吃饭顾问，帮一个正在备考的朋友决定今天吃什么。规则：最多对话 5 轮；' +
  '先问 1-2 个二选一的问题（如：想吃辣还是清淡？米饭还是面食？点外卖还是家里吃？），根据用户的回答收敛；' +
  '然后给出 1-2 个明确的推荐并附简短理由；当用户说"就这个/行/好"等表示同意时结束对话。' +
  '给出推荐时，必须在消息最后单独一行输出：【推荐】食物名。语气亲切轻松，每次回复 60 字以内。'

/** 智能推荐（走后端代理，一次成型） */
async function aiRecommend(
  slot: string,
  exclude: string
): Promise<{ name: string; reason: string } | null> {
  try {
    const text = await chatAI([
      {
        role: 'user',
        content:
          `我是河南的备考学生，请推荐一个适合当${slot}吃的食物。要求：只返回 JSON，格式 {"name":"食物名(10字内)","reason":"推荐理由(20字内)"}。` +
          (exclude ? `不要推荐这些（今天已吃）：${exclude}。` : '') +
          '倾向推荐常见、实惠、中国大陆随处能买到或点到的，可以是河南特色。',
      },
    ])
    if (!text) return null
    const m = text.match(/\{[\s\S]*\}/)
    if (!m) return null
    const parsed = JSON.parse(m[0])
    if (parsed.name) return { name: parsed.name, reason: parsed.reason ?? '' }
    return null
  } catch {
    return null
  }
}

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
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState<{ name: string; reason: string } | null>(null)
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
    setAiResult(null)
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

  const recordEaten = (name: string) => {
    set('foodLog', (prev) => ({
      ...prev,
      [today]: { ...prev[today], [slot]: name },
    }))
    showToast(`已记录：今天${MEAL_SLOT_LABELS[slot]}吃「${name}」`)
  }

  const addFood = () => {
    if (!newName.trim()) return
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

  const runAI = async () => {
    if (!intelOn || aiLoading) return
    setAiLoading(true)
    setAiResult(null)
    const r = await aiRecommend(MEAL_SLOT_LABELS[slot], eatenToday.join('、'))
    setAiResult(r)
    setAiLoading(false)
  }

  const eatenLabel = (s: MealSlot) => todayFoodLog[s]

  // ---- 智能帮我挑：全屏对话模式（退出即清历史） ----
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMsgs, setChatMsgs] = useState<{ role: 'ai' | 'user'; text: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatBusy, setChatBusy] = useState(false)
  const chatTurns = useRef(0)

  const callAI = async (
    history: { role: 'ai' | 'user'; text: string }[],
    forceFinal = false
  ): Promise<string> => {
    const r = await chatAI([
      {
        role: 'system',
        content:
          CHAT_SYS + (forceFinal ? '\n（对话轮次快到上限了，请直接给出最终推荐）' : ''),
      },
      ...history.map((m) => ({
        role: (m.role === 'ai' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: m.text,
      })),
    ])
    return r ?? '（网络开小差了，稍后再试 🙏）'
  }

  const startChat = () => {
    setChatOpen(true)
    setChatMsgs([])
    setChatInput('')
    chatTurns.current = 0
    void (async () => {
      setChatBusy(true)
      const r = await callAI([{ role: 'user', text: `帮我挑今天的${MEAL_SLOT_LABELS[slot]}吧` }])
      setChatMsgs([{ role: 'ai', text: r }])
      setChatBusy(false)
    })()
  }

  const sendChat = () => {
    const text = chatInput.trim()
    if (!text || chatBusy) return
    const history = [...chatMsgs, { role: 'user' as const, text }]
    setChatMsgs(history)
    setChatInput('')
    chatTurns.current++
    void (async () => {
      setChatBusy(true)
      const r = await callAI(history, chatTurns.current >= 4)
      setChatMsgs((prev) => [...prev, { role: 'ai', text: r }])
      setChatBusy(false)
    })()
  }

  const closeChat = () => {
    setChatOpen(false)
    setChatMsgs([])
    setChatInput('')
  }

  /** 从消息中解析「【推荐】食物名」 */
  const recOf = (text: string): string | null => {
    const m = text.match(/【推荐】\s*(.+)/)
    return m ? m[1].trim() : null
  }

  const pickRec = (name: string) => {
    recordEaten(name)
    closeChat()
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
      {/* 今日已吃 */}
      {eatenToday.length > 0 && (
        <View className="card" style={{ padding: '10px 14px' }}>
          <Text className="sub">
            📝 今天已吃：
            {SLOTS.filter((s) => todayFoodLog[s])
              .map((s) => `${MEAL_SLOT_LABELS[s]}·${todayFoodLog[s]}`)
              .join('　')}
          </Text>
        </View>
      )}

      {/* 餐次切换 */}
      <View className="slot-tabs">
        {SLOTS.map((s) => (
          <View
            key={s}
            className={`slot-btn ${slot === s ? 'active' : ''}`}
            onClick={() => {
              setSlot(s)
              setResult(null)
              setAiResult(null)
            }}
          >
            <Text>
              {MEAL_SLOT_LABELS[s]}
              {eatenLabel(s) ? ' ✓' : ''}
            </Text>
          </View>
        ))}
      </View>

      {/* 智能帮我挑（对话模式） */}
      <View className="row" style={{ margin: '10px 0', gap: 8 }}>
        <View
          className={`btn ghost${intelOn ? '' : ' is-disabled'}`}
          style={{ flex: 1 }}
          onClick={() => {
            if (intelOn) startChat()
          }}
        >
          <Text>🤖 智能帮我挑</Text>
        </View>
      </View>
      {!intelOn && (
        <Text className="sub" style={{ margin: '-4px 2px 10px', fontSize: 12 }}>
          未开启智能推荐，去「设置 → 智能助手」开启
        </Text>
      )}

      {/* 口味筛选：想吃的 + 不吃的 */}
      <View className="taste-filter">
        <View className="row" style={{ flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <Text className="sub" style={{ fontSize: 12, fontWeight: 600 }}>
            想吃
          </Text>
          {TASTES.map((t) => (
            <Text
              key={t}
              className={`tag ${wantTastes.includes(t) ? 'selected' : ''}`}
              style={{ border: 'none', padding: '5px 13px', fontSize: 13 }}
              onClick={() => toggleTaste(t, 'want')}
            >
              {t}
            </Text>
          ))}
        </View>
        <View className="row" style={{ flexWrap: 'wrap', gap: 6, alignItems: 'center', marginTop: 6 }}>
          <Text className="sub" style={{ fontSize: 12, fontWeight: 600 }}>
            不吃
          </Text>
          {TASTES.map((t) => (
            <Text
              key={t}
              className={`tag ${avoidTastes.includes(t) ? 'avoid' : ''}`}
              style={{ border: 'none', padding: '5px 13px', fontSize: 13 }}
              onClick={() => toggleTaste(t, 'avoid')}
            >
              {t}
            </Text>
          ))}
        </View>
        <Text className="sub" style={{ marginTop: 6, fontSize: 12 }}>
          {wantTastes.length === 0 && avoidTastes.length === 0
            ? `全部 ${filtered.length} 个候选（不含今天吃过的）`
            : `${wantTastes.map((t) => t).join('+') || '不限'}${avoidTastes.length ? '，不吃' + avoidTastes.join('/') : ''} · 剩 ${filtered.length} 个候选`}
        </Text>
      </View>

      {/* 结果区 */}
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
              <View style={{ marginBottom: 6 }}>
                {result.tags.map((t) => (
                  <Text
                    className="tag"
                    key={t}
                    style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}
                  >
                    {t}
                  </Text>
                ))}
              </View>
            )}
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
            <View className="divider" />
            <View className="row" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
              <View className="btn" onClick={() => void openMeituanWaimai()}>
                <Text>美团</Text>
              </View>
              <View
                className="btn"
                onClick={() => showToast('请在微信内搜索「饿了么」小程序下单')}
              >
                <Text>饿了么</Text>
              </View>
              <View
                className="btn plain"
                onClick={async () => {
                  await copyText(result.name)
                  showToast('已复制，可打开地图 App 搜索附近')
                }}
              >
                <Text>搜附近</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <Text className="food-emoji">🍽</Text>
            <Text className="sub" style={{ margin: '6px 0 14px' }}>
              选择困难症？让命运决定今天的{MEAL_SLOT_LABELS[slot]}
            </Text>
            <View
              className={`btn big-btn${filtered.length === 0 ? ' is-disabled' : ''}`}
              onClick={() => {
                if (filtered.length > 0) startRoll()
              }}
            >
              <Text>帮我选</Text>
            </View>
            {filtered.length === 0 && (
              <Text className="sub" style={{ marginTop: 10, color: '#fecaca' }}>
                筛选条件下没有候选了，放宽条件或去下面添加
              </Text>
            )}
          </>
        )}
      </View>

      {/* 智能帮我想（一次成型推荐） */}
      {intelOn && (
        <View className="card">
          <View className="card-title">
            <Text>🤖 智能帮我想</Text>
            <View
              className={`btn ghost small${aiLoading ? ' is-disabled' : ''}`}
              onClick={() => {
                if (!aiLoading) void runAI()
              }}
            >
              <Text>{aiLoading ? '思考中…' : '问问小助手'}</Text>
            </View>
          </View>
          {aiLoading && <Text className="sub">正在生成今日{MEAL_SLOT_LABELS[slot]}推荐…</Text>}
          {aiResult && (
            <View>
              <Text style={{ fontSize: 17, fontWeight: 700 }}>{aiResult.name}</Text>
              <Text className="sub" style={{ margin: '4px 0 8px', display: 'block' }}>
                {aiResult.reason}
              </Text>
              <View className="row" style={{ gap: 8 }}>
                <View
                  className="btn small"
                  onClick={() => {
                    recordEaten(aiResult.name)
                    setAiResult(null)
                  }}
                >
                  <Text>就吃它</Text>
                </View>
                <View
                  className="btn ghost small"
                  onClick={() => {
                    set('foods', (prev) =>
                      prev.some((x) => x.name === aiResult.name)
                        ? prev
                        : [...prev, { id: uid(), name: aiResult.name, emoji: '✨', slots: [slot], tags: [] }]
                    )
                    setAiResult(null)
                  }}
                >
                  <Text>加入候选池</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      {/* 候选池管理 */}
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
          <View className="food-chips">
            {filtered.slice(0, 24).map((x) => (
              <Text
                className={`food-chip ${x.fav ? 'fav' : ''}`}
                key={x.id}
                onClick={() => toggleFav(x.id)}
              >
                {x.emoji} {x.name} {x.fav ? '⭐' : ''}
              </Text>
            ))}
            {filtered.length > 24 && (
              <Text className="sub">…共 {filtered.length} 个</Text>
            )}
            {filtered.length === 0 && (
              <Text className="empty">筛选后没有候选</Text>
            )}
          </View>
        )}
        {managing && (
          <>
            <Text className="sub" style={{ marginBottom: 8 }}>
              点击 ⭐ 切换收藏（随机时更容易抽中）；点 ✕ 删除
            </Text>
            <View className="food-chips">
              {slotFoods.map((x) => (
                <Text
                  className={`food-chip ${x.fav ? 'fav' : ''} ${
                    avoidTastes.some((t) => x.tags.includes(t)) ? 'muted' : ''
                  }`}
                  key={x.id}
                >
                  <Text onClick={() => toggleFav(x.id)}>
                    {x.emoji} {x.name} {x.fav ? '⭐' : ''}
                  </Text>
                  <Text
                    style={{ marginLeft: 4, color: 'var(--danger)' }}
                    onClick={() => set('foods', (prev) => prev.filter((p) => p.id !== x.id))}
                  >
                    ✕
                  </Text>
                </Text>
              ))}
            </View>
            <View className="divider" />
            <View className="field">
              <Input
                placeholder={`添加到${MEAL_SLOT_LABELS[slot]}池的食物`}
                value={newName}
                onInput={(e) => setNewName(e.detail.value)}
              />
            </View>
            <View className="row" style={{ flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {TASTES.map((t) => (
                <Text
                  key={t}
                  className={`tag ${newTastes.includes(t) ? 'selected' : ''}`}
                  style={{ border: 'none', padding: '4px 12px', fontSize: 13 }}
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

      {/* 智能帮我挑：全屏对话视图 */}
      {chatOpen && (
        <View className="chat-overlay">
          <View className="chat-head">
            <Text className="grow">🤖 智能帮我挑 · {MEAL_SLOT_LABELS[slot]}</Text>
            <View className="chat-close" onClick={closeChat}>
              <Text>✕ 退出</Text>
            </View>
          </View>
          <ScrollView
            scrollY
            className="chat-body"
            scrollIntoView={`chat-msg-${chatMsgs.length - 1}`}
            scrollWithAnimation
          >
            {chatMsgs.map((m, i) => {
              const rec = m.role === 'ai' ? recOf(m.text) : null
              return (
                <View key={i} id={`chat-msg-${i}`} className={`chat-msg ${m.role}`}>
                  <Text className="bubble">{m.text}</Text>
                  {rec && (
                    <View className="btn small chat-pick" onClick={() => pickRec(rec)}>
                      <Text>就吃这个！</Text>
                    </View>
                  )}
                </View>
              )
            })}
            {chatBusy && (
              <View className="chat-msg ai">
                <Text className="bubble">思考中…</Text>
              </View>
            )}
          </ScrollView>
          <View className="chat-input">
            <Input
              placeholder={chatTurns.current >= 4 ? '再说一句，小助手就要拍板了…' : '如：清淡一点 / 米饭 / 行'}
              value={chatInput}
              onInput={(e) => setChatInput(e.detail.value)}
              onConfirm={sendChat}
              confirmType="send"
            />
            <View
              className={`btn${!chatInput.trim() || chatBusy ? ' is-disabled' : ''}`}
              onClick={sendChat}
            >
              <Text>发送</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
