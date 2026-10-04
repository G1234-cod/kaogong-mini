// httpProxy：外部服务代理的真实 HTTP 客户端（走自建后端 /proxy/*，Key 全部服务端持有）
import type { ChatMessage, GeoCandidate, PoiItem, Weather } from '../types'
import { httpGetQ, httpPost, httpStreamPost } from './httpTransport'

export async function httpFetchWeather(lat: number, lon: number): Promise<Weather | null> {
  return httpGetQ<Weather>('/proxy/weather', { lat, lon })
}

export async function httpSearchCities(q: string): Promise<GeoCandidate[]> {
  return httpGetQ<GeoCandidate[]>('/proxy/geocode', { q })
}

export async function httpReverseGeocode(lat: number, lon: number): Promise<GeoCandidate> {
  return httpGetQ<GeoCandidate>('/proxy/geocode', { lat, lon })
}

export async function httpFetchHitokoto(): Promise<string | null> {
  const res = await httpGetQ<{ text: string | null }>('/proxy/hitokoto', {})
  return res.text
}

/** 附近 POI 搜索（腾讯位置服务，Key 服务端持有） */
export async function httpSearchPois(
  lat: number,
  lon: number,
  keyword: string,
  radius = 1000
): Promise<PoiItem[]> {
  return httpGetQ<PoiItem[]>('/proxy/poi', { lat, lon, keyword, radius })
}

export async function httpChatAI(messages: ChatMessage[]): Promise<string> {
  const res = await httpPost<{ text: string }>('/proxy/ai/chat', { messages })
  return res.text
}

/** 流式智能问答：onDelta 逐段收到模型输出文本（服务端 SSE 直出） */
export async function httpChatAIStream(
  messages: ChatMessage[],
  onDelta: (text: string) => void,
): Promise<void> {
  await httpStreamPost('/proxy/ai/chat', { messages, stream: true }, onDelta)
}

/** 一次性订阅额度上报：requestSubscribeMessage 接受的模板 id → 服务端 count +1 */
export async function httpSubscribeReport(tmplIds: string[]): Promise<void> {
  await httpPost<{ ok: boolean }>('/proxy/subscribe', { tmplIds })
}

/** 订阅额度查询：各模板剩余可推送次数（设置-服务通知页） */
export async function httpSubscribeStatus(): Promise<{ quota: Record<string, number> }> {
  return httpGetQ<{ quota: Record<string, number> }>('/proxy/subscribe/status', {})
}
