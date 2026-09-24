// 美团外卖唤起：彻底废弃 PWA 的 URL Scheme / Intent / 通用链接方案，
// 统一走 Taro.navigateToMiniProgram 直跳美团外卖微信小程序（跨端行为一致）。
// 注意：目标 appId 提审前查证填入（不猜测硬编码），无效 appId 会走 fail 兜底 toast。
import Taro from '@tarojs/taro'

/** 美团外卖小程序 appId：TODO(Phase 3) 微信搜索「美团外卖」→ 右上角···→ 账号信息 查证后替换 */
const MEITUAN_WAIMAI_APPID = 'TODO_MEITUAN_APPID'

/** 唤起美团外卖小程序（失败时 toast 引导手动搜索） */
export async function openMeituanWaimai(): Promise<void> {
  try {
    await Taro.navigateToMiniProgram({
      appId: MEITUAN_WAIMAI_APPID,
      fail: async () => {
        await Taro.showToast({ title: '打开失败，请在微信内搜索「美团外卖」小程序', icon: 'none' })
      },
    })
  } catch {
    Taro.showToast({ title: '打开失败，请稍后再试', icon: 'none' })
  }
}
