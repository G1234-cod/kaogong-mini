import type { UserConfigExport } from '@tarojs/cli'

export default {
  mini: {},
  h5: {
    /**
     * Web 端预留（本轮不构建 H5）：所有外部服务代理需指向自建后端，
     * 上线前在微信小程序后台配置 request 合法域名 https://app.gyx-a.cn
     */
  }
} satisfies UserConfigExport<'webpack5'>
