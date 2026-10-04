// 无头渲染排障桩：@tarojs/taro、@tarojs/components、DatePicker/ConfirmDialog、platform、store
import React from 'react'
import { DEFAULTS, mergeWithDefaults } from '../../src/store/normalize'

const mk = (tag) => (p) => React.createElement(tag, p, p && p.children)
export const View = mk('view')
export const Text = mk('text')
export const Input = mk('input')
export const Textarea = mk('textarea')
export const Label = mk('label')
export const Picker = mk('picker')
export const ScrollView = mk('scroll-view')
export const Swiper = mk('swiper')
export const SwiperItem = mk('swiper-item')
export const Canvas = mk('canvas')
export const Image = mk('image')
export const Button = mk('button')

const Taro = new Proxy(
  {
    getStorageSync: () => '',
    setStorageSync: () => {},
    removeStorageSync: () => {},
    showToast: () => {},
    showModal: () => Promise.resolve({ confirm: false }),
    navigateTo: () => {},
    navigateBack: () => {},
    nextTick: (fn) => fn && fn(),
    getSystemInfoSync: () => ({ windowWidth: 375, windowHeight: 667, pixelRatio: 2 }),
    createSelectorQuery: () => ({
      select: () => ({ boundingClientRect: () => ({ exec: () => {} }) }),
      exec: () => {},
    }),
  },
  {
    get: (t, k) => (k in t ? t[k] : () => {}),
  }
)
export default Taro
export const useRouter = () => ({ params: {}, path: '' })
// 页面生命周期钩子桩：SSR 下不执行，仅需存在
export const useLoad = () => {}
export const useDidShow = () => {}
export const useDidHide = () => {}
export const useReady = () => {}
export const useUnload = () => {}
export const usePullDownRefresh = () => {}
export const useReachBottom = () => {}
export const usePageScroll = () => {}
export const useShareAppMessage = () => {}

export const fmtDateShort = (d) => d
export const DatePicker = mk('date-picker')
export const appPrompt = async () => null
export const appConfirm = async () => false
export const showToast = () => {}
export const copyText = () => {}
export const showModal = async () => ({ confirm: false })

let scenario = 'defaults'
export function setScenario(s) {
  scenario = s
}

function rawStored() {
  // 模拟 GET /data/snapshot 的分域 JSON（每域 json.loads 后可能是任意形状）
  const d = JSON.parse(JSON.stringify(DEFAULTS))
  if (scenario === 'full') {
    d.moods = { '2026-09-25': { mood: 3, note: '还行' }, '2026-09-26': { mood: 5 } }
    d.ledger = [
      { id: 'x1', date: '2026-09-27', amount: 12, type: 'expense', category: '餐饮', note: '' },
      { id: 'x2', date: '2026-09-26', amount: 4500, type: 'income', category: '工资', note: '' },
    ]
    d.pomodoroLogs = [{ date: '2026-09-27', minutes: 25, endedAt: Date.now(), task: '刷题' }]
  }
  if (scenario === 'serverish') {
    // 服务端快照常见残缺：settings 缺字段 / ledgerCats 只回一个数组
    d.settings = {}
    d.ledgerCats = { expense: d.ledgerCats.expense }
  }
  if (scenario === 'nulls') {
    // DB 里存了 'null' 的域：json.loads 后就是 null
    d.settings = null
    d.moods = null
    d.ledger = null
    d.pomodoroLogs = null
    d.ledgerCats = null
  }
  if (scenario === 'dirty') {
    // 数组/映射里混入脏条目：null、缺字段对象、错误类型
    d.moods = { '2026-09-25': null, '2026-09-26': { mood: 5 } }
    d.ledger = [null, { id: 'x1', date: '2026-09-27', amount: 12 }, 'junk']
    d.pomodoroLogs = [null, {}, { date: '2026-09-27', minutes: 25, endedAt: Date.now() }]
    d.todos = [null, { id: 't1', title: 'x' }]
    d.foods = [null]
    d.checkins = [null]
    d.mistakes = [null]
    d.wrongNotes = [null]
    d.plans = [null]
    d.tasks = [null]
  }
  return d
}

// 真实链路：stored → mergeWithDefaults → 页面
export function buildData() {
  return mergeWithDefaults(rawStored())
}
// 仅测 mergeWithDefaults 本身
export function buildRaw() {
  return rawStored()
}

export function useData() {
  return {
    data: buildData(),
    ready: true,
    set: () => {},
    auth: null,
    onboarded: true,
    rebootstrap: async () => {},
    chooseRole: async () => {},
  }
}
export function DataProvider({ children }) {
  return children
}
