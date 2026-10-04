// 确认/输入弹窗：promise 风格，命令式 API
// 小程序端 app.tsx 里挂载的 UI 不渲染在页面视图层（弹窗宿主永远不显示 → 点删除毫无反应），
// 因此改用 Taro.showModal 原生弹窗，任意页面调用都可靠弹出；danger/confirmText 仅保留语义
import Taro from '@tarojs/taro'

/** 确认框：点确定 resolve(true)，点取消/关闭 resolve(false)；cancelText 可自定义取消按钮文案（二选一弹窗） */
export function appConfirm(
  title: string,
  message?: string,
  opts?: { confirmText?: string; cancelText?: string; danger?: boolean }
): Promise<boolean> {
  return new Promise((resolve) => {
    Taro.showModal({
      title,
      content: message ?? '',
      confirmText: opts?.confirmText ?? '确定',
      cancelText: opts?.cancelText ?? '取消',
      confirmColor: opts?.danger ? '#c0392b' : '#be5016',
    })
      .then((res) => resolve(!!res.confirm))
      .catch(() => resolve(false))
  })
}

/** 输入框：确定返回输入值，取消返回 null（type 仅作语义，原生输入框不限制键盘）
 *  editable/placeholderText 是微信基础库 2.17.1+ 能力，Taro 4.2.1 类型未收录，此处局部扩展 */
export function appPrompt(
  title: string,
  value: string,
  _type: 'text' | 'number' | 'tel' = 'text'
): Promise<string | null> {
  return new Promise((resolve) => {
    Taro.showModal({
      title,
      editable: true,
      content: value,
      placeholderText: '请输入',
    } as Taro.showModal.Option & { editable?: boolean; placeholderText?: string })
      .then((res) => resolve(res.confirm ? ((res as { content?: string }).content ?? '') : null))
      .catch(() => resolve(null))
  })
}
