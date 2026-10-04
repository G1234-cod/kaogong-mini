import { PropsWithChildren } from 'react'

import { DataProvider } from './store'
// 全局样式唯一入口：必须在此 import，否则 app.scss 不会编译进 app.wxss，页面只剩裸文字
import './app.scss'

/**
 * 应用入口：DataProvider 挂载一次，包裹所有页面（Taro 小程序为单一 React 树）。
 * 静默登录与数据 hydrate 在 DataProvider 内部 bootstrap 完成，页面通过 useData().ready 感知。
 * appConfirm/appPrompt 已改为 Taro.showModal 原生弹窗，无需挂载宿主组件。
 */
export default function App({ children }: PropsWithChildren) {
  return <DataProvider>{children}</DataProvider>
}
