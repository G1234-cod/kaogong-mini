/* 统一弹层组件（P1-4）：收编全站 A/B 类弹层
   - variant="sheet"：底部抽屉（圆角只开上两角），变体类（ck-sheet/dp-cal 等）经 className 追加
   - variant="center"：居中弹窗（四角圆角）
   - catchMove 全开（遮罩锁滚动穿透）、遮罩点击默认关闭（误触敏感场景传 closeOnMask={false}）
   - closeOnMask 约定：破坏性弹窗（编辑/删除类，误触遮罩会丢失输入或中断确认）调用方应传 closeOnMask={false}，
     其余弹窗保持默认 true
   - 进出场过渡：遮罩淡入 + 内容上滑（sheet）/缩放（center）200ms；遮罩点击关闭时先播退场动画再回调 onClose，
     内部按钮直接调用 onClose 的路径为立即关闭（不走退场动画） */
import { useState, type ReactNode } from 'react'
import { View, RootPortal } from '@tarojs/components'

interface ModalProps {
  variant?: 'sheet' | 'center'
  onClose: () => void
  /** 点击遮罩是否关闭弹窗；破坏性弹窗（编辑/删除类）调用方应传 false 防误触 */
  closeOnMask?: boolean
  className?: string
  children: ReactNode
}

export default function Modal({
  variant = 'sheet',
  onClose,
  closeOnMask = true,
  className = '',
  children,
}: ModalProps) {
  // 退场中：加 modal-closing 类播 200ms 退场动画，结束后再回调 onClose 卸载
  const [closing, setClosing] = useState(false)

  const handleMaskClick = () => {
    if (!closeOnMask || closing) return
    setClosing(true)
    setTimeout(onClose, 200)
  }

  return (
    /* RootPortal：弹层挂到页面根节点，脱离 SwipeRow transform / ScrollView 等祖先的包含块与裁剪，
       否则 fixed 遮罩会被压缩裁剪进触发行内（日历完全不可见） */
    <RootPortal>
      <View
        className={`modal-mask${variant === 'center' ? ' center' : ''}${closing ? ' modal-closing' : ''}`}
        catchMove
        onClick={handleMaskClick}
      >
        <View
          className={`modal${className ? ` ${className}` : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </View>
      </View>
    </RootPortal>
  )
}
