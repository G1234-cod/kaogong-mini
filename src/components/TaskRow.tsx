// 统一任务行（今日页 / 打卡页 / 待办页共用）：
// 勾选圈 = 完成；行主体 = 展开子任务（今日页）或弹详情弹窗（管理页）；右侧箭头 = 展开/收起子任务
// 三个热区互相独立（stopPropagation），相邻行靠 tone 色板区分；展开后的子区与父行同色系，视觉上像父行里长出一张小卡片
import type { ReactNode } from 'react'
import { Text, View } from '@tarojs/components'
import Icon from './Icon'
import SwipeRow from './SwipeRow'

export interface TaskRowProps {
  /** 色板下标 0-4（相邻行不同色：调用方一般传 index % 5） */
  tone?: number
  /** 完成态：红勾 + 划线 + 变暗（配合调用方排序沉底） */
  done?: boolean
  /** 行首 emoji 图标（打卡项 / 来源图标），不传则不渲染 */
  icon?: string
  /** 主名称 */
  name: ReactNode
  /** 元信息胶囊区（放 .tpill 系列：子项进度 / 连续天数 / 频率 / 下次 / 截止 / 优先级等） */
  meta?: ReactNode
  /** meta 与标题同一行（标题一行 + 标签跟在后方；不传则标签另起一行） */
  inlineMeta?: boolean
  /** 是否有子项可展开 */
  expandable?: boolean
  expanded?: boolean
  /** 点勾选圈：完成 / 取消完成 */
  onToggleCheck?: () => void
  /** 点行主体：今日页 = 展开子任务；管理页 = 弹详情弹窗 */
  onRowClick?: () => void
  /** 点右侧箭头：展开 / 收起子任务 */
  onArrowClick?: () => void
  /** 展开后渲染的子任务区内容 */
  children?: ReactNode
  /** 左滑删除回调（传了才支持左滑）；二次确认由调用方处理 */
  onDelete?: () => void
  deleteText?: string
}

export default function TaskRow({
  tone = 0,
  done = false,
  icon,
  name,
  meta,
  inlineMeta = false,
  expandable = false,
  expanded = false,
  onToggleCheck,
  onRowClick,
  onArrowClick,
  children,
  onDelete,
  deleteText,
}: TaskRowProps) {
  return (
    <SwipeRow onDelete={onDelete} deleteText={deleteText}>
      <View className={`task-row tone-${((tone % 5) + 5) % 5}${done ? ' done' : ''}`}>
        <View className="task-row-main" onClick={onRowClick}>
          {/* 勾选圈只在可勾选时渲染：没有 onToggleCheck 的行（如提醒·日期页）不出假灰圆点 */}
          {onToggleCheck ? (
            <View
              className={`ms-check${done ? ' on' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                onToggleCheck?.()
              }}
            >
              {done ? <Icon name="check" size={12} color="#fff" /> : null}
            </View>
          ) : null}
          {icon ? <Text className="task-row-icon">{icon}</Text> : null}
          <View className={`task-row-info${inlineMeta ? ' inline' : ''}`}>
            <Text className="task-row-name">{name}</Text>
            {meta ? <View className="task-row-meta">{meta}</View> : null}
          </View>
          {expandable ? (
            <View
              className={`task-row-arrow${expanded ? ' open' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                onArrowClick?.()
              }}
            >
              <Icon name="arrow-down" size={14} />
            </View>
          ) : null}
        </View>
        {expandable && expanded ? <View className="task-row-children">{children}</View> : null}
      </View>
    </SwipeRow>
  )
}
