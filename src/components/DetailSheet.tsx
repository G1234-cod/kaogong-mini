import { useState } from 'react'
import { View, Input, ScrollView } from '@tarojs/components'
import Modal from './Modal'
import Icon from './Icon'
import ChildRow from './ChildRow'

/** 详情弹窗里的子项行（勾选口径：togglable=false 的分组父层只展示/可删，不可勾） */
export interface DetailChild {
  id: string
  label: string
  done?: boolean
  togglable?: boolean
  depth?: number
}

interface DetailSheetProps {
  title: string
  /** ① 说明区插槽（父项说明/表单等，可看可改），不传则不渲染该区 */
  info?: React.ReactNode
  /** ② 子项区数据；undefined = 不渲染子项区（周期/日期用），[] = 空提示 */
  items?: DetailChild[]
  addPlaceholder?: string
  onToggleChild?: (id: string) => void
  onAddChild?: (name: string) => void
  onRemoveChild?: (id: string) => void
  /** 子项改名（传了才显示铅笔按钮，点铅笔本行原地变输入框） */
  onRenameChild?: (id: string, name: string) => void
  /** ③ 按钮区：删除（二次确认由调用方处理）/ 取消 / 保存 */
  onDelete?: () => void
  onClose: () => void
  onSave?: () => void
  saveText?: string
  children?: React.ReactNode
}

/** 通用「详情弹窗」三段式：①说明区 ②子项管理区 ③按钮区。
 *  子项勾选/增删 = 立即回调写库；说明区内容由调用方做草稿，「保存」才写库。 */
export default function DetailSheet({
  title, info, items, addPlaceholder = '+ 子项名称',
  onToggleChild, onAddChild, onRemoveChild, onRenameChild,
  onDelete, onClose, onSave, saveText = '保存', children,
}: DetailSheetProps) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const name = draft.trim()
    if (!name) return
    onAddChild?.(name)
    setDraft('')
  }

  return (
    <Modal variant="center" className="ck-sheet" closeOnMask={false} onClose={onClose}>
      <View className="ck-sheet-h">
        <View className="ck-sheet-title">{title}</View>
        <View className="icon-btn" onClick={onClose}><Icon name="x" size={14} /></View>
      </View>

      <ScrollView scroll-y style={{ maxHeight: '52vh' }}>
        {info}
        {items !== undefined && (
          <View>
            {items.length === 0 && (
              <View className="ck-sheet-empty">{onAddChild ? '暂无子项，可在下方添加' : '暂无子项'}</View>
            )}
            {items.map(it => (
              <ChildRow
                key={it.id}
                name={it.label}
                done={it.done}
                dotted={it.togglable === false}
                depth={it.depth}
                onToggle={it.togglable === false ? undefined : () => onToggleChild?.(it.id)}
                onRename={onRenameChild ? (n) => onRenameChild(it.id, n) : undefined}
                onDelete={onRemoveChild ? () => onRemoveChild(it.id) : undefined}
              />
            ))}
            {onAddChild && (
              <View className="ck-sheet-add">
                <View className="ck-name-row">
                  <Input
                    className="field ck-name-field"
                    value={draft}
                    placeholder={addPlaceholder}
                    maxlength={20}
                    onInput={e => setDraft(e.detail.value)}
                    onConfirm={add}
                  />
                  <View className="btn small ck-name-add" onClick={add}>添加</View>
                </View>
              </View>
            )}
          </View>
        )}
        {children}
      </ScrollView>

      <View className="ck-sheet-foot">
        {onDelete && <View className="btn danger small" onClick={onDelete}>删除</View>}
        <View className="btn plain small" onClick={onClose}>取消</View>
        {onSave && <View className="btn small" onClick={onSave}>{saveText}</View>}
      </View>
    </Modal>
  )
}
