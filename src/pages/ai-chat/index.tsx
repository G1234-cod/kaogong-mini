// AI 对话页：通用考公助手（自然语言）+「吃什么」候选收敛（ctx=food）
// 由 pages/food 的「智能帮我挑/帮我想」对话模式迁移而来（口味画像/上下文函数仍在 food 页导出复用）
// 流式输出：服务端 SSE 直出 → enableChunked 逐段上屏（general 攒批刷、food 首行/候选行增量上屏），首字秒出
// 键盘：Input adjustPosition=false + onKeyboardHeightChange 只抬升输入条，对话区加底部留白滚到底，避免整页跳动
// food 协议：候选池 P6（首行引导语 + 「+ 名 | 理由」行），解析失败本地池子随机兜底，用户可见失败归零
import { useEffect, useRef, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { Image, Input, ScrollView, Text, View } from '@tarojs/components'
import { useData } from '../../store'
import Icon from '../../components/Icon'
import type { ChatMessage, MealSlot } from '../../types'
import { DEFAULT_FOODS, MEAL_SLOT_LABELS } from '../../constants/foods'
import { chatAIStream } from '../../services/api/proxy'
import { openDelivery } from '../../services/meituan'
import { todayStr, uid } from '../../utils/date'
import { buildFoodChatCtx, nextTasteProfile } from '../../utils/taste'
import animalHello from '../../assets/images/招手.png'

const SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'supper']

/** 通用模式：考公助手人设，G3 结构（第一行结论 + 分点展开），不用 markdown 符号 */
const GENERAL_SYS =
  '你是「考公小助手」，一位贴心的备考陪伴助手，服务准备公务员/事业单位考试的用户。' +
  '职责：解答行测、申论、面试、公考常识类问题；帮用户做学习规划与时间安排；倾听并鼓励备考情绪。' +
  '回答结构：第一行用一句话直接给结论或答案；之后分点展开，每点不超过两行；' +
  '如果是方法类问题，给出可立即执行的步骤；如果是情绪倾诉，先共情两句再给建议。' +
  '全文不超过 350 字，不用 markdown 符号（如 **、#、```）。' +
  '涉及具体政策、岗位、分数线等时效信息时，说明需以官方最新公告为准。语气温暖积极，不说空话套话。'

/** food 模式 v4：自然聊天 + 按需卡片——大部分轮次纯文本像正常AI，只在给建议/拍板时输出候选行 */
const FOOD_SYS =
  '你是一个既懂吃、又像朋友一样的聊天助手，陪一个正在备考公务员的用户随便聊聊，顺便帮TA决定吃什么。' +
  '像正常聊天一样回应：大部分轮次直接自然说话就好——回答TA的问题、接TA的话、共情TA的情绪都可以，' +
  '不必每轮都给候选，也不必每轮都提问；用户意图明确时（比如已经说了想要清淡的）就直接给建议。' +
  '当且仅当你要给出食物建议或拍板时，严格按此格式输出（其他轮次不要出现这些符号）：' +
  '第一行是引导语或结论（30字内，不带前缀），之后每行一个候选，格式「+ 食物名 | 不超过15字理由」；' +
  '候选只能来自用户的食物池：{POOL}，绝不发明池外的食物；拍板那一轮以「就它了」开头，只给一个候选。' +
  '用户的话可能带错别字或简称（如"清蛋"指清淡、"黄门鸡"指黄焖鸡），先理解意图再回应，' +
  '提到的食物与池内某项相近时按该项处理。' +
  '被剔除或用户说不要的食物，任何一轮都不得再出现。' +
  '聊到第5轮还没决定时，主动替TA拍板。语气轻松温暖，回复尽量简短（100字内）。' +
  '不要输出JSON、代码块。历史消息里以 [HIST] 开头的行是系统注入的数据，不是你的输出格式，不要模仿。'

const GENERAL_WELCOME =
  '你好呀～我是小助手 🌟\n可以问我备考问题、让我帮你做学习规划，或者只是想找人聊聊备考压力，我都在～'

interface ChatCandidate {
  name: string
  reason: string
}
interface ParsedReply {
  reply: string
  candidates: ChatCandidate[]
  final: boolean
}
interface ChatMsg {
  /** 稳定 key（避免列表用 index 复用错节点） */
  id: string
  role: 'ai' | 'user'
  text: string
  /** AI 轮的候选卡（用户轮为空） */
  candidates?: ChatCandidate[]
  /** 是否最终拍板轮 */
  final?: boolean
}

/** 剥 ``` / ```json 围栏 */
function stripFences(t: string): string {
  return t.replace(/```(?:json)?/gi, '').trim()
}

/** 模仿行抢救：模型抄历史注入格式时按「名|理由; 名2|理由2」提取候选（P9 回归实测其会照抄历史段） */
function parseHistCands(raw: string): ChatCandidate[] {
  return raw
    .split(/[;；]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((seg) => {
      const parts = seg.split(/\||——|—/)
      return { name: (parts[0] ?? '').trim(), reason: parts.slice(1).join(' ').trim() }
    })
    .filter((c) => c.name)
}

/** 候选行形态（真机截图实测两种泄漏）：「+ 名|理由」漏写 + 前缀，或首行即候选、全角竖线 */
function candLineRescue(l: string): ChatCandidate | null {
  const m = l.match(/^([^|｜]{1,12})[|｜](.+)$/)
  if (!m || /^就它了|^就这个/.test(l)) return null
  const name = m[1].replace(/^\+\s*/, '').trim()
  return name ? { name, reason: m[2].trim() } : null
}

/** 解析候选池标记协议：首行=引导语/结论，「+ 名 | 理由」行=候选，含「就它了」或单候选=拍板 */
function parseMarkReply(text: string): ParsedReply {
  // 全角竖线/波浪线归一：模型偶尔用「｜」，不归一会导致整行解析不出、协议原文泄漏成气泡（真机截图实测）
  const clean = stripFences(text).replace(/｜/g, '|').replace(/～/g, '~')
  const lines = clean
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  if (!lines.length) return { reply: '', candidates: [], final: false }
  const candidates: ChatCandidate[] = []
  const head: string[] = []
  for (const l of lines) {
    const m = l.match(/^\+\s*(.+)$/)
    if (m) {
      const [name, ...rest] = m[1].split('|')
      const c = { name: name.trim(), reason: rest.join('|').trim() }
      if (c.name) candidates.push(c)
    } else {
      // 容忍：模型模仿历史注入格式（[HIST] 行首 或 行内任意处（本轮候选：…））→ 抢救为候选，不当失败
      const h = l.startsWith('[HIST]') ? l.slice(6) : (l.match(/本轮候选[：:](.+?)）/) || [])[1]
      if (h) {
        candidates.push(...parseHistCands(h))
        if (!l.startsWith('[HIST]')) {
          const pre = l.slice(0, Math.max(0, l.indexOf('本轮候选') - 1)).replace(/（$/, '').trim()
          if (pre) head.push(pre)
        }
      } else {
        const r = candLineRescue(l)
        if (r) candidates.push(r)
        else head.push(l.replace(/^[-*\d.\s]+/, ''))
      }
    }
  }
  // 拍板轮漏写「+ 」前缀（如「就它了\n酸辣粉 | 清爽开胃」）：从正文行抢救单候选（P9 复测实测形态）
  if (!candidates.length && head.length > 1) {
    for (let i = 1; i < head.length; i++) {
      const c0 = head[i].split('|')
      const n0 = c0[0].trim()
      if (n0 && n0.length <= 12) {
        candidates.push({ name: n0, reason: c0.slice(1).join('|').trim() })
        head.splice(i, 1)
        break
      }
    }
  }
  const reply = head.join(' ').trim() || candidates[0]?.name || ''
  return {
    reply,
    candidates: candidates.slice(0, 3),
    final: /就它了|就这个|定了/.test(reply) || candidates.length === 1,
  }
}

/** 从模型流式缓冲里增量提取已完整的候选行（未完的尾行不显示，避免半截卡） */
function parseCompleteCandLines(buf: string): ChatCandidate[] {
  const lines = buf.replace(/｜/g, '|').split('\n')
  lines.pop() // 最后一段可能未传输完整
  const out: ChatCandidate[] = []
  for (const l0 of lines) {
    const l = l0.trim()
    const m = l.match(/^\+\s*(.+)$/)
    if (m) {
      const [name, ...rest] = m[1].split('|')
      const c = { name: name.trim(), reason: rest.join('|').trim() }
      if (c.name) out.push(c)
    } else {
      // 与 parseMarkReply 同步：模型模仿历史格式的行也提前出卡（收尾解析为最终口径）
      const h = l.startsWith('[HIST]') ? l.slice(6) : (l.match(/本轮候选[：:](.+?)）/) || [])[1]
      if (h) out.push(...parseHistCands(h))
      else {
        const r = candLineRescue(l)
        if (r) out.push(r)
      }
    }
  }
  return out.slice(0, 3)
}

/** 剥 markdown 标记（prompt 禁令压不住，前端兜底）：去 ** / __ / ` / 行首 # */
function stripMarkdown(t: string): string {
  return t
    .replace(/\*\*|__|`/g, '')
    .replace(/^#{1,6}\s*/gm, '')
    .trim()
}

/** 从用户话里抽「不要 X」，补上按钮之外的隐式剔除台账 */
function harvestExclusions(userText: string, current: string[]): string[] {
  const out = [...current]
  const patterns = [
    /不要\s*([^\s，,。!！?？]+)/g,
    /不吃\s*([^\s，,。!！?？]+)/g,
    /别(?:再)?(?:推荐|给)?\s*([^\s，,。!！?？]+)/g,
  ]
  for (const p of patterns) {
    let m
    while ((m = p.exec(userText)) !== null) {
      const name = m[1].trim().replace(/[了的吧啊呀]/g, '')
      if (name && !out.includes(name)) out.push(name)
    }
  }
  return out
}

/** 解析失败兜底：从本地候选池随机取 2-3 个，必然成功（长对话把池展示完时允许重复，剔除项永远不放开） */
function pickFallbackCands(
  pool: string[],
  excl: string[],
  eaten: string[],
  shown: string[]
): ChatCandidate[] {
  const ok = pool.filter((n) => !excl.includes(n) && !eaten.includes(n) && !shown.includes(n))
  const src = ok.length
    ? ok
    : pool.filter((n) => !excl.includes(n)) // 剔除项永不让步；其余约束（已吃/已展示）可放宽
  return [...src]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((name) => ({ name, reason: '从你的池子里挑的' }))
}

export default function AiChat() {
  const { data, ready, set } = useData()
  const router = useRouter()
  const isFood = router.params.ctx === 'food'
  const slot: MealSlot = (() => {
    const s = router.params.slot as MealSlot | undefined
    if (s && SLOTS.includes(s)) return s
    const h = new Date().getHours()
    return h < 10 ? 'breakfast' : h < 14 ? 'lunch' : h < 21 ? 'dinner' : 'supper'
  })()

  const [msgs, setMsgs] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  // 流式渲染中的空气泡文本（AI 增量上屏；food 首行一到就显示）
  const [streamBuf, setStreamBuf] = useState('')
  // 流式中已到达的完整候选行（food 模式逐行出卡）
  const [streamCands, setStreamCands] = useState<ChatCandidate[]>([])
  // 键盘高度（px）：只抬升输入条 + 对话区底部留白，禁止整页上移
  const [kbH, setKbH] = useState(0)
  // 滚动 tick：递增强制 ScrollView 滚到底（新消息/键盘/流结束时触发，流中节流）
  const [scrollTick, setScrollTick] = useState(0)
  // 本轮对话中被剔除的候选（注入 prompt，避免 AI 再推荐）
  const [excluded, setExcluded] = useState<string[]>([])
  const chatTurns = useRef(0)
  const inited = useRef(false)
  // 代数标记：清空对话后在途回复直接丢弃，防止覆盖欢迎语/串台
  const genRef = useRef(0)
  const lastFlushRef = useRef(0)
  const scrollTickRef = useRef(0)
  // 本场对话已展示过的候选（兜底随机时避开，「换一批」不再重复）
  const shownRef = useRef<string[]>([])

  const today = todayStr()
  const eatenToday = Object.values(data.foodLog[today] ?? {}).filter(Boolean) as string[]
  // 候选池：用户池按当前餐次过滤；不足 6 个时并入默认池同餐次项补足（上限 12）——
  // 小池子撑不起「每轮 2-3 个候选 + 换一批不重复」，几轮就掏空，协议与本地兜底都无货可选（P9 回归补充A）
  const poolNames = (() => {
    const names = [...new Set(data.foods.filter((f) => f.slots.includes(slot)).map((f) => f.name))]
    if (names.length >= 6) return names
    const defaults = DEFAULT_FOODS.filter((f) => f.slots.includes(slot)).map((f) => f.name)
    return [...new Set([...names, ...defaults])].slice(0, 12)
  })()
  const opener = () => `帮我挑今天的${MEAL_SLOT_LABELS[slot]}吧`

  /** 滚到底（tick 单调递增强制触发 scroll，值恒大于内容高度 → 落底） */
  const scrollBottom = () => setScrollTick(++scrollTickRef.current)

  /** 组装 messages：system prompt 按模式拼装（food 注入候选池/口味画像/已吃/剔除项 + 收敛提示） */
  const buildMsgs = (history: ChatMsg[], forceFinal: boolean, excl: string[]): ChatMessage[] => {
    let sys = GENERAL_SYS
    if (isFood) {
      const ctx = buildFoodChatCtx(data.settings.tasteProfile, eatenToday, excl)
      sys =
        FOOD_SYS.replace('{POOL}', poolNames.join('、')) +
        (ctx.length ? '\n（' + ctx.join('；') + '）' : '') +
        (forceFinal ? '\n（对话轮次快到上限了，请直接给出最终推荐，并以「就它了」开头）' : '')
    }
    return [
      { role: 'system', content: sys } as ChatMessage,
      ...history.map((m) => ({
        role: (m.role === 'ai' ? 'assistant' : 'user') as 'assistant' | 'user',
        // 历史轮带回候选名+理由（H2）；[HIST] 标记与自然语言不同形，防模型照抄（P9 回归实测旧（）格式会被模仿）
        content:
          m.text +
          (m.candidates?.length
            ? `\n[HIST]${m.candidates.map((c) => `${c.name}|${c.reason || ''}`).join(';')}`
            : ''),
      })),
    ]
  }

  /** 流式调 AI 并渲染：首行一到即显示引导语气泡，之后每到达一个完整「+ 」行就追加候选卡 */
  const askAI = (history: ChatMsg[], excl: string[] = excluded) => {
    void (async () => {
      const gen = ++genRef.current
      setBusy(true)
      setStreamBuf('')
      setStreamCands([])
      let acc = '' // 累积原文
      const onDelta = (d: string) => {
        if (gen !== genRef.current) return
        acc += d
        const now = Date.now()
        if (now - lastFlushRef.current < 150) return // 攒批 flush，避免逐字重排卡顿
        lastFlushRef.current = now
        // food：首行（首个 \n 前）= 引导语；已完整的 + 行 = 候选卡逐行追加；general 全文增量上屏
        if (isFood) {
          const nl = acc.indexOf('\n')
          const first = (nl >= 0 ? acc.slice(0, nl) : acc).trim()
          // 首行若本身就是候选行（模型没写引导语），不当气泡显示——否则「+ 名 | 理由」原文泄漏成气泡（真机截图实测）
          setStreamBuf(/^\+/.test(first) || candLineRescue(first) ? '' : first)
          setStreamCands(parseCompleteCandLines(acc))
        } else {
          setStreamBuf(stripMarkdown(acc))
        }
        scrollBottom()
      }
      await chatAIStream(buildMsgs(history, chatTurns.current >= 4, excl), onDelta).catch(() => {})
      if (gen !== genRef.current) return // 已清空对话，丢弃在途回复
      // 完成收尾：按标记协议解析；general 剥 markdown
      let p: ParsedReply = parseMarkReply(acc)
      if (!isFood) p = { reply: stripMarkdown(acc.trim()), candidates: [], final: false }
      // 兜底：解析不出候选时本地从池子随机出卡，用户可见失败归零
      // 提问轮例外：协议第一轮本就「先问后选」，只回问句是预期行为——不塞卡，
      // 否则「想吃辣还是清淡？」下面挂着推荐卡自相矛盾，且兜底卡会进历史污染后续轮格式（P9 回归实测）
      if (isFood && p.candidates.length === 0 && !/[？?]\s*$/.test(p.reply)) {
        const fb = pickFallbackCands(poolNames, excl, eatenToday, shownRef.current)
        if (fb.length) {
          p = { reply: p.reply || acc.trim(), candidates: fb, final: false }
        }
      }
      if (!p.reply) p.reply = '（网络开小差了，稍后再试 🙏）'
      // 强化 5 轮收敛：到轮次上限还没拍板时，直接按首个候选拍板
      if (isFood && chatTurns.current >= 4 && !p.final && p.candidates.length > 0) p.final = true
      // 已展示台账：本轮候选并入，后续兜底/换一批不再重复
      if (p.candidates.length) {
        shownRef.current = [...new Set([...shownRef.current, ...p.candidates.map((c) => c.name)])]
      }
      setMsgs((prev) => [
        ...prev,
        isFood
          ? { id: uid(), role: 'ai', text: p.reply, candidates: p.candidates, final: p.final }
          : { id: uid(), role: 'ai', text: p.reply },
      ])
      setStreamBuf('')
      setStreamCands([])
      setBusy(false)
      scrollBottom()
    })()
  }

  const sendText = (raw: string, excl: string[] = excluded) => {
    const text = raw.trim()
    if (!text || busy) return
    // 手打「不要X/不吃X/别再推荐X」并入剔除台账（X2 实测：不入台账 AI 会反复推荐）
    const nextExcl = isFood ? harvestExclusions(text, excl) : excl
    if (nextExcl.length !== excl.length) setExcluded(nextExcl) // 台账落盘，跨轮生效
    // 「换一批/换成别的」：当前轮候选并入已展示名单，本地兜底不再重复
    if (isFood && /换一批|换成别的/.test(text)) {
      const cur = msgs[msgs.length - 1]?.candidates ?? []
      shownRef.current = [...new Set([...shownRef.current, ...cur.map((c) => c.name)])]
    }
    const history: ChatMsg[] = [...msgs, { id: uid(), role: 'user', text }]
    setMsgs(history)
    setInput('')
    chatTurns.current++
    scrollBottom()
    askAI(history, nextExcl)
  }

  const sendChat = () => sendText(input)

  /** 清空对话：重置轮次/剔除/已展示台账并重新开场（gen++ 作废在途回复） */
  const clearChat = () => {
    genRef.current++
    chatTurns.current = 0
    setBusy(false)
    setStreamBuf('')
    setStreamCands([])
    setExcluded([])
    shownRef.current = []
    setInput('')
    if (isFood) {
      const fresh: ChatMsg[] = [{ id: uid(), role: 'user', text: opener() }]
      setMsgs(fresh)
      askAI(fresh, []) // 显式空剔除数组，不吃闭包里的旧 excluded
    } else {
      setMsgs([{ id: uid(), role: 'ai', text: GENERAL_WELCOME }])
    }
    scrollBottom()
  }

  // 首次进入开场：food 自动发「帮我挑今天的XX吧」（显示为用户气泡），通用模式本地欢迎语
  useEffect(() => {
    if (inited.current || !ready) return
    inited.current = true
    if (isFood) {
      setMsgs([{ id: uid(), role: 'user', text: opener() }])
      askAI([{ id: uid(), role: 'user', text: opener() }])
    } else {
      setMsgs([{ id: uid(), role: 'ai', text: GENERAL_WELCOME }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  // 键盘：只抬升输入条（transform）+ 对话区底部留白，禁用系统整页上移，避免跳动/大空白
  useEffect(() => {
    const onKb = (res: { height: number }) => {
      setKbH(res.height)
      scrollBottom()
    }
    Taro.onKeyboardHeightChange(onKb)
    return () => {
      Taro.offKeyboardHeightChange(onKb)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** 口味画像更新（复用 food 页导出函数） */
  const feedTaste = (name: string, dir: 'liked' | 'disliked', picked = false) => {
    set('settings', (prev) => ({
      ...prev,
      tasteProfile: nextTasteProfile(data.foods, prev.tasteProfile, name, dir, picked),
    }))
  }

  /** 选定推荐：正向画像 + 记录今日用餐 + 唤起美团外卖（菜名已复制到剪贴板，进店粘贴即搜） */
  const pickRec = (name: string) => {
    feedTaste(name, 'liked', true)
    set('foodLog', (prev) => ({ ...prev, [today]: { ...prev[today], [slot]: name } }))
    void openDelivery('meituan', name)
  }

  /** 剔除候选：负向画像 + 加入 excluded + 自动追问下一轮 */
  const rejectCand = (name: string) => {
    if (busy) return
    const nextExcluded = excluded.includes(name) ? excluded : [...excluded, name]
    feedTaste(name, 'disliked')
    setExcluded(nextExcluded)
    sendText(`不要 ${name}`, nextExcluded)
  }

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
    <View className="ai-chat-page">
      <View className="chat-head">
        <Icon name="chat" size={16} gap={4} />
        <Text className="grow">{isFood ? `智能帮我想 · ${MEAL_SLOT_LABELS[slot]}` : '小助手'}</Text>
        <View className="chat-close" onClick={clearChat}>
          <Icon name="trash" size={16} gap={4} />
          <Text>清空对话</Text>
        </View>
      </View>
      <ScrollView
        scrollY
        className="chat-body ai-chat-body"
        scrollTop={100000 + scrollTick}
        style={{ paddingBottom: `${14 + kbH}px` }}
      >
        {msgs.length === 1 && msgs[0].role === 'ai' && (
          <Image className="hello-animal" src={animalHello} mode="aspectFit" />
        )}
        {msgs.map((m, i) => {
          const cands = m.candidates ?? []
          // 操作按钮只在最新一条 AI 消息上（历史轮仅展示候选）
          const live = isFood && m.role === 'ai' && !busy && i === msgs.length - 1
          return (
            <View key={m.id} id={`chat-msg-${i}`} className={`chat-msg ${m.role}`}>
              <Text className="bubble">{m.text}</Text>
              {cands.length > 0 && (
                <View className="chat-cands">
                  {cands.map((c) => (
                    <View key={c.name} className={`chat-cand${live ? '' : ' done'}`}>
                      <View className="grow">
                        <Text className="chat-cand-name">{c.name}</Text>
                        {c.reason ? <Text className="chat-cand-reason">{c.reason}</Text> : null}
                      </View>
                      {live && (
                        <View className="chat-cand-btns" style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          <View className="btn small" onClick={() => pickRec(c.name)}>
                            <Text>就吃它 🍽</Text>
                          </View>
                          <View className="btn ghost small" onClick={() => rejectCand(c.name)}>
                            <Icon name="x" size={12} gap={4} />
                            <Text>不要</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
              {live && m.final && cands.length > 0 && (
                <View className="btn hero chat-pick" onClick={() => pickRec(cands[0].name)}>
                  <Text>就吃这个！🍽</Text>
                </View>
              )}
            </View>
          )
        })}
        {busy && (
          <View className="chat-msg ai">
            {streamBuf || streamCands.length > 0 ? (
              // 流式空气泡：引导语首行一到即上屏，完整候选行逐张出卡
              <View>
                {streamBuf ? <Text className="bubble">{streamBuf}</Text> : null}
                {streamCands.length > 0 && (
                  <View className="chat-cands">
                    {streamCands.map((c) => (
                      <View key={c.name} className="chat-cand done">
                        <View className="grow">
                          <Text className="chat-cand-name">{c.name}</Text>
                          {c.reason ? <Text className="chat-cand-reason">{c.reason}</Text> : null}
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ) : (
              // 还没吐字时：打字三点
              <View className="bubble chat-typing">
                <View className="dot" />
                <View className="dot" />
                <View className="dot" />
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <View className="chat-input" style={{ transform: `translateY(-${kbH}px)`, transition: 'transform .2s ease' }}>
        <Input
          placeholder={
            isFood
              ? chatTurns.current >= 4
                ? '再说一句，小助手就要拍板了…'
                : '如：换一批 / 清淡一点 / 米饭 / 行'
              : '随便问点备考、学习、生活的事…'
          }
          value={input}
          adjustPosition={false}
          onInput={(e) => setInput(e.detail.value)}
          onConfirm={sendChat}
          confirmType="send"
        />
        <View className={`btn${!input.trim() || busy ? ' is-disabled' : ''}`} onClick={sendChat}>
          <Text>发送</Text>
        </View>
      </View>
    </View>
  )
}
