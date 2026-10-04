// 外部服务本地 stub（Phase 1-3 使用；签名与后端代理 /proxy/* 完全一致，Phase 4 秒切）
// 天气：按 lat/lon 生成确定性合理数据；一言/城市搜索：确定性返回；问答：离线朋友语录兜底
import type { ChatMessage, GeoCandidate, PoiItem, Weather } from '../types'
import { QUICK_CITIES } from '../constants/cities'
import { COMFORT_QUOTES } from '../constants/copy'

// ---------- 天气 ----------

const WEATHER_POOL: { code: number; desc: string }[] = [
  { code: 0, desc: '晴' },
  { code: 1, desc: '多云' },
  { code: 2, desc: '阴' },
  { code: 61, desc: '小雨' },
]

/** 坐标 → 确定性索引（同一城市每次数据稳定，避免刷新闪变） */
function hashIndex(a: number, b: number, mod: number): number {
  const s = Math.abs(Math.round(a * 100)) + Math.abs(Math.round(b * 100)) * 131
  return s % mod
}

export async function mockFetchWeather(lat: number, lon: number): Promise<Weather> {
  await new Promise((r) => setTimeout(r, 120))
  const w = WEATHER_POOL[hashIndex(lat, lon, WEATHER_POOL.length)]
  const base = 12 + hashIndex(lat, lon, 14)
  return {
    temp: base,
    feels: base - 1,
    humidity: 55 + hashIndex(lat, lon, 30),
    code: w.code,
    desc: w.desc,
    tMax: base + 4,
    tMin: base - 5,
    rainProb: w.code >= 61 ? 70 : 10,
    fetchedAt: Date.now(),
  }
}

// ---------- 城市搜索 ----------

export async function mockSearchCities(q: string): Promise<GeoCandidate[]> {
  await new Promise((r) => setTimeout(r, 100))
  const raw = q.trim()
  if (!raw) return []
  // 宽松拆词匹配：按行政区划后缀切词，任一词条双向包含即命中（"洛阳市龙区" → 洛阳）
  const tokens = raw.split(/[省市区县州旗盟\s]+/).filter((t) => t.length >= 2)
  return QUICK_CITIES.filter(
    (c) =>
      c.name.includes(raw) ||
      tokens.some((t) => c.name.includes(t) || t.includes(c.name)),
  ).map((c) => ({
    name: c.name,
    province: c.province,
    city: c.city,
    lat: c.lat,
    lon: c.lon,
  }))
}

// ---------- 坐标反查地名（stub：返回坐标本身 + 最近内置城市名） ----------

export async function mockReverseGeocode(lat: number, lon: number): Promise<GeoCandidate> {
  await new Promise((r) => setTimeout(r, 100))
  let best = QUICK_CITIES[0]
  let bestD = Infinity
  for (const c of QUICK_CITIES) {
    const d = (c.lat - lat) ** 2 + (c.lon - lon) ** 2
    if (d < bestD) {
      bestD = d
      best = c
    }
  }
  return { name: best.name, province: best.province, lat, lon }
}

// ---------- 附近 POI（stub：确定性生成周边餐馆） ----------

export async function mockSearchPois(
  lat: number,
  lon: number,
  keyword: string
): Promise<PoiItem[]> {
  await new Promise((r) => setTimeout(r, 150))
  const suffixes = ['家常菜馆', '面馆', '小吃店', '快餐店', '烧烤店']
  return suffixes.map((s, i) => ({
    id: `mock-poi-${i}`,
    name: `${keyword || '附近'}${s}`,
    address: `（离线演示）${cityNearbyName(lat, lon)}某处 · 步行约 ${5 + i * 3} 分钟`,
    lat: lat + (i - 2) * 0.001,
    lon: lon + (i - 2) * 0.001,
    distance: 300 + i * 200,
    tel: '',
  }))
}

function cityNearbyName(lat: number, lon: number): string {
  let best = QUICK_CITIES[0]
  let bestD = Infinity
  for (const c of QUICK_CITIES) {
    const d = (c.lat - lat) ** 2 + (c.lon - lon) ** 2
    if (d < bestD) {
      bestD = d
      best = c
    }
  }
  return best.name
}

// ---------- 一言（Hitokoto） ----------

const HITOKOTO_POOL = [
  '凡心所向，素履以往。',
  '道阻且长，行则将至。',
  '星光不问赶路人，时光不负有心人。',
  '每一份坚持，都是未来的伏笔。',
]

export async function mockFetchHitokoto(): Promise<string> {
  await new Promise((r) => setTimeout(r, 80))
  const day = Math.floor(Date.now() / 86400000)
  return HITOKOTO_POOL[day % HITOKOTO_POOL.length]
}

// ---------- 智能问答 ----------

export async function mockChat(messages: ChatMessage[]): Promise<string> {
  await new Promise((r) => setTimeout(r, 400))
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  const text = lastUser?.content ?? ''
  const sys = messages.find((m) => m.role === 'system')?.content ?? ''
  // 智能帮我挑（吃饭顾问）→ 候选卡 JSON 协议，离线也能演示对话
  if (sys.includes('吃饭顾问')) return mockFoodChat(messages)
  // 情绪关键词命中 → 安慰语录；否则通用陪伴回复
  if (/累|烦|焦虑|难过|压力|崩/.test(text)) {
    const day = Math.floor(Date.now() / 86400000)
    return COMFORT_QUOTES[day % COMFORT_QUOTES.length]
  }
  return '收到！当前为离线演示模式，联网后由专属助手为你完整解答。眼下最要紧的事：喝口水，继续刷题，岸就在前方。'
}

// ---------- 智能帮我挑（离线演示） ----------

const MOCK_FOODS = [
  { name: '羊肉烩面', reason: '河南经典，汤浓暖胃' },
  { name: '胡辣汤', reason: '早餐来一碗，提神醒脑' },
  { name: '黄焖鸡米饭', reason: '有肉有菜，饱腹实惠' },
  { name: '麻辣烫', reason: '想吃辣的时候最合适' },
  { name: '肉夹馍', reason: '拿着就走，节省时间' },
  { name: '炸酱面', reason: '面条筋道，咸香管饱' },
  { name: '轻食沙拉', reason: '清淡不犯困，下午刷题清醒' },
  { name: '寿司拼盘', reason: '清淡少油，换换口味' },
]

/** 离线演示：解析「不要 XX」剔除指令，剩余候选里对比推荐（输出候选池标记协议） */
function mockFoodChat(messages: ChatMessage[]): string {
  const userTexts = messages.filter((m) => m.role === 'user').map((m) => m.content)
  const excluded = userTexts.flatMap((t) => {
    const m = t.match(/不要\s*(.+)/)
    return m ? [m[1].trim()] : []
  })
  const pool = MOCK_FOODS.filter((f) => !excluded.some((x) => f.name.includes(x) || x.includes(f.name)))
  const turns = userTexts.length
  const agreed = /行|好|就(这个|吃它|它吧)|可以|定了/.test(userTexts[userTexts.length - 1] ?? '')
  const final = agreed || turns >= 5 || pool.length <= 1
  const cands = (final ? pool.slice(0, 1) : pool.slice(0, Math.min(3, pool.length))).map((f) => ({
    name: f.name,
    reason: f.reason,
  }))
  const reply = final
    ? `就它了：${cands.map((c) => c.name).join('、')}，祝你吃得开心！`
    : pool.length === 0
    ? '候选都被你否掉啦，要不说说想吃点什么方向的？'
    : turns <= 1
    ? '好呀～先看看这几个，想吃辣一点还是清淡一点？'
    : `结合你的要求，剩下这几个更合适，挑一个不要的我再比比？`
  // 标记协议：首行引导语/结论，之后每行「+ 名 | 理由」
  return [reply, ...cands.map((c) => `+ ${c.name} | ${c.reason}`)].join('\n')
}
