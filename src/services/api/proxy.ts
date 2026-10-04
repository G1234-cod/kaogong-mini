// 外部服务代理 API：天气 / 城市搜索 / 一言 / 智能问答
// 微信小程序 request 合法域名必须 HTTPS + ICP 备案，Open-Meteo / BigDataCloud / 一言均不满足，
// 因此全部外部请求走自建后端（app.gyx-a.cn 已备案）：
//   GET  /proxy/weather?lat=&lon=   GET /proxy/geocode?q=|lat=&lon=   GET /proxy/hitokoto
//   POST /proxy/ai/chat
// 后端不可达/异常时回退 mocks/proxyMocks 本地 stub（演示与离线兜底，接口签名完全一致）。
import Taro from '@tarojs/taro'
import type { ChatMessage, GeoCandidate, PoiItem, Weather } from '../../types'
import { todayStr } from '../../utils/date'
import {
  mockChat,
  mockFetchHitokoto,
  mockFetchWeather,
  mockReverseGeocode,
  mockSearchCities,
  mockSearchPois,
} from '../../mocks/proxyMocks'
import {
  httpChatAI,
  httpChatAIStream,
  httpFetchHitokoto,
  httpFetchWeather,
  httpReverseGeocode,
  httpSearchCities,
  httpSearchPois,
  httpSubscribeReport,
  httpSubscribeStatus,
} from '../httpProxy'

export async function fetchWeather(lat: number, lon: number): Promise<Weather | null> {
  try {
    return await httpFetchWeather(lat, lon)
  } catch {
    return mockFetchWeather(lat, lon)
  }
}

export async function searchCities(q: string): Promise<GeoCandidate[]> {
  try {
    return await httpSearchCities(q)
  } catch {
    return mockSearchCities(q)
  }
}

export async function fetchHitokoto(): Promise<string | null> {
  try {
    return await httpFetchHitokoto()
  } catch {
    return mockFetchHitokoto()
  }
}

/** 坐标反查地名（定位按钮用：取坐标 → 省市区名 + 原坐标） */
export async function reverseGeocode(lat: number, lon: number): Promise<GeoCandidate> {
  try {
    return await httpReverseGeocode(lat, lon)
  } catch {
    return mockReverseGeocode(lat, lon)
  }
}

/** 智能问答（GLM-4 由后端代理转发，API Key 绝不落端） */
export async function chatAI(messages: ChatMessage[]): Promise<string> {
  try {
    return await httpChatAI(messages)
  } catch {
    return mockChat(messages)
  }
}

/** 流式智能问答：onDelta 逐段上屏；失败/离线回退 mockChat 一次性给全文（已有真实输出则不再叠加） */
export async function chatAIStream(
  messages: ChatMessage[],
  onDelta: (text: string) => void,
): Promise<void> {
  let got = false
  try {
    await httpChatAIStream(messages, (d) => {
      got = true
      onDelta(d)
    })
  } catch {
    if (!got) onDelta(await mockChat(messages))
  }
}

/** 附近 POI 搜索（腾讯位置服务，走后端代理；失败回退离线 stub） */
export async function searchNearbyPois(
  lat: number,
  lon: number,
  keyword: string
): Promise<PoiItem[]> {
  try {
    return await httpSearchPois(lat, lon, keyword)
  } catch {
    return mockSearchPois(lat, lon, keyword)
  }
}

// ---- 一次性订阅消息（个人主体无长期订阅：接受 +1 / 下发 -1，额度累积） ----
/** 订阅消息模板 id：与 server/.env 的 TMPL_TODO / TMPL_REVIEW 保持一致（个人主体共用同一模板，两值相同） */
export const TMPL_TODO = '4GEsu8AAaxickTsv20fGqrAz85hbcR_6F1DZYNmboUg'
export const TMPL_REVIEW = '4GEsu8AAaxickTsv20fGqrAz85hbcR_6F1DZYNmboUg'

let lastSubscribeAskDay = '' // 防打扰：每天最多弹一次授权（两模板同一弹窗）

/**
 * 订阅额度查询：各模板剩余可推送次数（设置-服务通知页展示）。
 * 失败返回 null（页面显示不可用即可，不 mock）。
 */
export async function fetchSubscribeStatus(): Promise<Record<string, number> | null> {
  try {
    const res = await httpSubscribeStatus()
    return res.quota ?? {}
  } catch {
    return null
  }
}

/**
 * 顺带请求一次性订阅授权（点「做完了」/完成复习时调用，须在用户点击回调内发起）：
 * 接受的模板上报 /proxy/subscribe 累积下发额度；拒绝/失败一律静默，不影响业务。
 * @param force 手动授权（服务通知页按钮）：跳过「每天最多弹一次」去重
 */
export async function subscribeRemind(force = false): Promise<void> {
  // 两场景共用同一模板时须去重：重复 tmplIds 会导致请求报错、额度重复上报
  const ids = [...new Set([TMPL_TODO, TMPL_REVIEW].filter(Boolean))]
  if (!ids.length) return // 模板 id 未配置：跳过（代码留空兜底）
  const today = todayStr()
  if (!force && lastSubscribeAskDay === today) return
  lastSubscribeAskDay = today
  try {
    // Taro 类型把 entityIds（支付宝专用）与 tmplIds 并列必填，weapp 只需 tmplIds，此处收窄断言
    const option = { tmplIds: ids } as Parameters<typeof Taro.requestSubscribeMessage>[0]
    const res = (await Taro.requestSubscribeMessage(option)) as unknown as Record<string, string>
    const accepted = ids.filter((id) => res[id] === 'accept')
    if (accepted.length) await httpSubscribeReport(accepted)
  } catch {
    /* 用户拒绝 / 未开放订阅消息能力：静默跳过 */
  }
}
