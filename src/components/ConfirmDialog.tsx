// 自研确认/输入弹窗（替代原生 confirm/prompt）：promise 风格，命令式 API
// Taro 迁移：div→View、button→View、input→Input(focus/onConfirm)、遮罩 catchMove 防滚动穿透
import { useEffect, useState } from 'react'
import { Input, View } from '@tarojs/components'

interface ConfirmState {
  title: string
  message?: string
  confirmText?: string
  danger?: boolean
  resolve: (ok: boolean) => void
}

interface PromptState {
  title: string
  value: string
  type: 'text' | 'number' | 'tel'
  resolve: (v: string | null) => void
}

let confirmSetter: ((s: ConfirmState | null) => void) | null = null
let promptSetter: ((s: PromptState | null) => void) | null = null

/** 自研确认框：点确定 resolve(true) */
export function appConfirm(
  title: string,
  message?: string,
  opts?: { confirmText?: string; danger?: boolean }
): Promise<boolean> {
  return new Promise((resolve) => {
    confirmSetter?.({ title, message, confirmText: opts?.confirmText, danger: opts?.danger, resolve })
  })
}

/** 自研输入框：确定返回输入值，取消返回 null */
export function appPrompt(
  title: string,
  value: string,
  type: 'text' | 'number' | 'tel' = 'text'
): Promise<string | null> {
  return new Promise((resolve) => {
    promptSetter?.({ title, value, type, resolve })
  })
}

/** 全局弹窗宿主：在 app.ts 挂载一次 */
export default function ConfirmDialog() {
  const [confirm_, setConfirm_] = useState<ConfirmState | null>(null)
  const [prompt_, setPrompt_] = useState<PromptState | null>(null)
  const [text, setText] = useState('')

  useEffect(() => {
    confirmSetter = setConfirm_
    promptSetter = setPrompt_
    return () => {
      confirmSetter = null
      promptSetter = null
    }
  }, [])

  useEffect(() => {
    if (prompt_) setText(prompt_.value)
  }, [prompt_])

  const settleConfirm = (ok: boolean) => {
    confirm_?.resolve(ok)
    setConfirm_(null)
  }

  const settlePrompt = (v: string | null) => {
    prompt_?.resolve(v)
    setPrompt_(null)
  }

  return (
    <>
      {confirm_ && (
        <View className="modal-mask" catchMove onClick={() => settleConfirm(false)}>
          <View className="modal app-dialog" onClick={(e) => e.stopPropagation()}>
            <View className="ad-title">{confirm_.title}</View>
            {confirm_.message && <View className="ad-msg">{confirm_.message}</View>}
            <View className="ad-btns">
              <View className="btn ghost" onClick={() => settleConfirm(false)}>
                取消
              </View>
              <View
                className={`btn ${confirm_.danger ? 'danger' : ''}`}
                onClick={() => settleConfirm(true)}
              >
                {confirm_.confirmText ?? '确定'}
              </View>
            </View>
          </View>
        </View>
      )}
      {prompt_ && (
        <View className="modal-mask" catchMove onClick={() => settlePrompt(null)}>
          <View className="modal app-dialog" onClick={(e) => e.stopPropagation()}>
            <View className="ad-title">{prompt_.title}</View>
            <View className="field">
              <Input
                focus
                type={prompt_.type === 'number' ? 'digit' : prompt_.type === 'tel' ? 'number' : 'text'}
                value={text}
                onInput={(e) => setText(e.detail.value)}
                onConfirm={() => settlePrompt(text)}
              />
            </View>
            <View className="ad-btns">
              <View className="btn ghost" onClick={() => settlePrompt(null)}>
                取消
              </View>
              <View className="btn" onClick={() => settlePrompt(text)}>
                确定
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  )
}
