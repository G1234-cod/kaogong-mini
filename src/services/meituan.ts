// 外卖小程序唤起：统一走 Taro.navigateToMiniProgram 直跳（跨端行为一致）。
// 美团/饿了么均未公开"带关键词搜索"的跳转 path，折中方案：先把关键词写入剪贴板，
// 再跳转目标小程序，用户进店后粘贴搜索即可。
import Taro from '@tarojs/taro'
import { copyText } from '../utils/platform'

/** 美团外卖小程序 appId */
const MEITUAN_WAIMAI_APPID = 'wxde8ac0a21135c07d'
/** 饿了么小程序 appId */
const ELEME_APPID = 'wxece3a9a4c82f58c9'

export type DeliveryKind = 'meituan' | 'eleme'

const APP_META: Record<DeliveryKind, { appId: string; name: string }> = {
  meituan: { appId: MEITUAN_WAIMAI_APPID, name: '美团外卖' },
  eleme: { appId: ELEME_APPID, name: '饿了么' },
}

/**
 * 唤起外卖小程序并带关键词：关键词复制到剪贴板 → 跳转小程序
 * （目标小程序不支持搜索直达，跳转后粘贴搜索关键词）
 */
export async function openDelivery(kind: DeliveryKind, keyword?: string): Promise<void> {
  const meta = APP_META[kind]
  if (keyword) {
    await copyText(keyword)
    Taro.showToast({ title: `已复制「${keyword}」，去 ${meta.name} 粘贴搜索`, icon: 'none', duration: 2500 })
  }
  try {
    await Taro.navigateToMiniProgram({
      appId: meta.appId,
      fail: async () => {
        await Taro.showToast({
          title: `打开失败，请在微信内搜索「${meta.name}」小程序`,
          icon: 'none',
        })
      },
    })
  } catch {
    Taro.showToast({ title: '打开失败，请稍后再试', icon: 'none' })
  }
}

/** 兼容旧调用：唤起美团外卖（无关键词） */
export async function openMeituanWaimai(): Promise<void> {
  return openDelivery('meituan')
}
