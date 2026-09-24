// httpProxy：外部服务代理的真实 HTTP 客户端（走自建后端 /proxy/*，Key 全部服务端持有）
import type { ChatMessage, GeoCandidate, Weather } from '../types'
import { httpGetQ, httpPost } from './httpTransport'

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

export async function httpChatAI(messages: ChatMessage[]): Promise<string> {
  const res = await httpPost<{ text: string }>('/proxy/ai/chat', { messages })
  return res.text
}
