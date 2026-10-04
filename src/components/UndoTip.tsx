// 完成撤销提示：任务勾选完成沉底后，底部浮出 3 秒「已完成 · 撤销」小条，
// 防止用户找不到刚勾掉的任务（自动沉底的经典坑）；点「撤销」恢复，超时自动消失
import { useEffect } from 'react'
import { Text, View } from '@tarojs/components'

export interface UndoTipData {
  /** 每次触发递增的 id：变化时重置 3 秒倒计时 */
  id: number
  /** 提示文案，如：已完成「洗衣服」 */
  label: string
  /** 点撤销执行的恢复操作 */
  undo: () => void
}

export default function UndoTip({
  tip,
  onExpire,
}: {
  tip: UndoTipData | null
  onExpire: () => void
}) {
  useEffect(() => {
    if (!tip) return
    const t = setTimeout(onExpire, 3000)
    return () => clearTimeout(t)
  }, [tip, onExpire])

  if (!tip) return null
  return (
    <View className="undo-tip" catchMove>
      <Text className="undo-tip-text">{tip.label}</Text>
      <Text
        className="undo-tip-btn"
        onClick={() => {
          tip.undo()
          onExpire()
        }}
      >
        撤销
      </Text>
    </View>
  )
}
