// 外部服务代理 API：天气 / 城市搜索 / 一言 / 智能问答
// 微信小程序 request 合法域名必须 HTTPS + ICP 备案，Open-Meteo / BigDataCloud / 一言均不满足，
// 因此全部外部请求规划走自建后端（app.gyx-a.cn 已备案）：
//   GET  /proxy/weather?lat=&lon=   GET /proxy/geocode?q=   GET /proxy/hitokoto
//   POST /proxy/ai/chat
// 当前阶段（Phase 1-3）接 mocks/proxyMocks 本地 stub，接口签名与真实代理完全一致。
import type { ChatMessage, GeoCandidate, Weather } from '../../types'
import { mockChat, mockFetchHitokoto, mockFetchWeather, mockSearchCities } from '../../mocks/proxyMocks'

export async function fetchWeather(lat: number, lon: number): Promise<Weather | null> {
  // TODO(Phase 4): return httpProxy.fetchWeather(lat, lon)
  return mockFetchWeather(lat, lon)
}

export async function searchCities(q: string): Promise<GeoCandidate[]> {
  // TODO(Phase 4): return httpProxy.searchCities(q)
  return mockSearchCities(q)
}

export async function fetchHitokoto(): Promise<string | null> {
  // TODO(Phase 4): return httpProxy.fetchHitokoto()
  return mockFetchHitokoto()
}

/** 智能问答（GLM-4 由后端代理转发，API Key 绝不落端） */
export async function chatAI(messages: ChatMessage[]): Promise<string> {
  // TODO(Phase 4): return httpProxy.chatAI(messages)
  return mockChat(messages)
}
