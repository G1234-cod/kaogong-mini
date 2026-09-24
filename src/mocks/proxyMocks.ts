// 外部服务本地 stub（Phase 1-3 使用；签名与后端代理 /proxy/* 完全一致，Phase 4 秒切）
// 天气：按 lat/lon 生成确定性合理数据；一言/城市搜索：确定性返回；问答：离线朋友语录兜底
import type { ChatMessage, GeoCandidate, Weather } from '../types'
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
  if (!q.trim()) return []
  return QUICK_CITIES.filter((c) => c.name.includes(q.trim())).map((c) => ({
    name: c.name,
    province: c.province,
    lat: c.lat,
    lon: c.lon,
  }))
}

// ---------- 一言 ----------

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
  // 情绪关键词命中 → 安慰语录；否则通用陪伴回复
  if (/累|烦|焦虑|难过|压力|崩/.test(text)) {
    const day = Math.floor(Date.now() / 86400000)
    return COMFORT_QUOTES[day % COMFORT_QUOTES.length]
  }
  return '收到！当前为离线演示模式，联网后由专属助手为你完整解答。眼下最要紧的事：喝口水，继续刷题，岸就在前方。'
}
