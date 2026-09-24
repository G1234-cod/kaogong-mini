// 平台能力封装：替代原 PWA 的 DOM 实现（document.execCommand / clipboard 等）
// 小程序端一律走 Taro API，页面代码不直接触碰 wx.*

import Taro from '@tarojs/taro'

/** 轻提示（替代 alert/toast） */
export function showToast(title: string): void {
  Taro.showToast({ title, icon: 'none' })
}

/** 复制文本到剪贴板（Promise 化） */
export async function copyText(text: string): Promise<void> {
  try {
    await Taro.setClipboardData({ data: text })
    showToast('已复制')
  } catch {
    showToast('复制失败')
  }
}

/** 短震动反馈（打卡成功等轻反馈场景，iOS/安卓均支持） */
export function vibrate(short = true): void {
  Taro.vibrateShort({ type: 'light' }).catch(() => {})
  void short
}
