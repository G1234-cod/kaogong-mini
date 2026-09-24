import { PropsWithChildren } from 'react'

import { DataProvider } from './store'
import ConfirmDialog from './components/ConfirmDialog'

/**
 * 应用入口：DataProvider 挂载一次，包裹所有页面（Taro 小程序为单一 React 树）。
 * 静默登录与数据 hydrate 在 DataProvider 内部 bootstrap 完成，页面通过 useData().ready 感知。
 * ConfirmDialog 为全局弹窗宿主（appConfirm/appPrompt），挂载一次全局可用。
 */
export default function App({ children }: PropsWithChildren) {
  return (
    <DataProvider>
      {children}
      <ConfirmDialog />
    </DataProvider>
  )
}
