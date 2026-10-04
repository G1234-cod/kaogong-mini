// 统一子项行（打卡子项 / 待办子步骤 / 弹窗子项共用）：
// 圆点 + 名称 + 铅笔改名（点铅笔本行原地变输入框，预填原名，✓ 保存 ✕ 放弃）+ 垃圾桶删除；整行可左滑删除
import { useState } from 'react'
import { Input, Text, View } from '@tarojs/components'
import Icon from './Icon'
import SwipeRow from './SwipeRow'

export interface ChildRowProps {
  /** 显示名（改名由 onRename 写库） */
  name: string
  /** 名称前的 emoji（打卡叶子用），不传不显示 */
  emoji?: string
  /** 完成态（勾选圈点亮 + 划线） */
  done?: boolean
  /** 分组层：虚线空心圆点，不可勾选 */
  dotted?: boolean
  /** 缩进层次（嵌套子项每层空一格，做出层次感） */
  depth?: number
  /** 点整行 = 勾选该子项（不传则整行不可勾） */
  onToggle?: () => void
  /** 改名写库回调（传了才显示铅笔按钮） */
  onRename?: (name: string) => void
  onDelete?: () => void
  deleteText?: string
}

export default function ChildRow({
  name,
  emoji,
  done = false,
  dotted = false,
  depth = 0,
  onToggle,
  onRename,
  onDelete,
  deleteText,
}: ChildRowProps) {
  // 行内改名：点铅笔本行变输入框（预填原名），✓ 提交写库 / ✕ 放弃还原
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(name)

  const startEdit = () => {
    setDraft(name)
    setEditing(true)
  }
  const commit = () => {
    const v = draft.trim()
    if (v && v !== name) onRename?.(v)
    setEditing(false)
  }

  return (
    <SwipeRow onDelete={onDelete} deleteText={deleteText}>
      <View
        className={`child-row${done ? ' done' : ''}`}
        style={depth > 0 ? { paddingLeft: depth * 14 } : undefined}
        onClick={editing ? undefined : onToggle}
      >
        <View className={`child-dot${dotted ? ' group' : done ? ' on' : ''}`}>
          {done && !dotted ? <Icon name="check" size={11} color="#fff" /> : null}
        </View>
        {editing ? (
          <View className="child-edit">
            <View className="child-edit-input">
              <Input
                value={draft}
                focus
                maxlength={20}
                onInput={(e) => setDraft(e.detail.value)}
                onConfirm={commit}
              />
            </View>
            <View className="icon-btn" onClick={commit}>
              <Icon name="check" size={14} color="#be5016" />
            </View>
            <View
              className="icon-btn"
              onClick={() => {
                setDraft(name)
                setEditing(false)
              }}
            >
              <Icon name="x" size={14} color="#b0a697" />
            </View>
          </View>
        ) : (
          <>
            <Text className="child-name">
              {emoji ? `${emoji} ` : ''}
              {name}
            </Text>
            {onRename && (
              <View
                className="icon-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  startEdit()
                }}
              >
                <Icon name="pencil" size={14} color="#b0a697" />
              </View>
            )}
            {onDelete && (
              <View
                className="icon-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                <Icon name="trash" size={14} color="#b0a697" />
              </View>
            )}
          </>
        )}
      </View>
    </SwipeRow>
  )
}
