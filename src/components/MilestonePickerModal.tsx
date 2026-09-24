// 节点勾选弹窗：列出模板候选节点，用户勾选要哪些
// Taro 迁移：select→Picker(mode=selector)、checkbox→自绘 .ms-check、按钮→View、遮罩 catchMove
import { useState } from 'react'
import { Picker, Text, View } from '@tarojs/components'
import { addDays } from '../utils/date'
import { ALL_EXAM_TEMPLATES, GENERIC_EXAM_TEMPLATE } from '../utils/exam-templates'

export interface PickedNode {
  label: string
  date: string
}

interface Props {
  /** 考试名称（弹窗标题用） */
  examName: string
  /** 考试日期，用于计算各节点日期 */
  examDate: string
  /** 初始选中的模板类型（不传则用通用模板） */
  initialType?: string
  /** 确认：返回勾选的节点（已按考试日期算好日期）与最终模板类型 */
  onConfirm: (nodes: PickedNode[], templateType: string) => void
  onClose: () => void
}

function offsetLabel(offset: number): string {
  if (offset === 0) return '考试日'
  return offset < 0 ? `考前 ${-offset} 天` : `考后 ${offset} 天`
}

export default function MilestonePickerModal({
  examName,
  examDate,
  initialType,
  onConfirm,
  onClose,
}: Props) {
  const [tplType, setTplType] = useState(initialType ?? GENERIC_EXAM_TEMPLATE.type)
  const tpl = ALL_EXAM_TEMPLATES.find((t) => t.type === tplType) ?? GENERIC_EXAM_TEMPLATE
  const [checked, setChecked] = useState<Set<number>>(() => new Set(tpl.nodes.map((_, i) => i)))

  const switchTpl = (type: string) => {
    setTplType(type)
    const t = ALL_EXAM_TEMPLATES.find((x) => x.type === type)
    setChecked(new Set((t ?? GENERIC_EXAM_TEMPLATE).nodes.map((_, i) => i)))
  }

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const confirm = () => {
    const nodes: PickedNode[] = tpl.nodes
      .map((n, i) => ({ ...n, i }))
      .filter((n) => checked.has(n.i))
      .map((n) => ({ label: n.label, date: addDays(examDate, n.offset) }))
    onConfirm(nodes, tpl.type)
  }

  return (
    <View className="modal-mask" catchMove onClick={onClose}>
      <View className="modal" onClick={(e) => e.stopPropagation()}>
        <View className="card-title" style={{ marginBottom: 8 }}>
          <Text style={{ overflow: 'hidden' }}>为「{examName}」选择节点</Text>
          <View className="icon-btn" onClick={onClose}>
            ✕
          </View>
        </View>
        <View className="row" style={{ marginBottom: 10 }}>
          <Text className="sub" style={{ flexShrink: 0 }}>
            节点模板
          </Text>
          <Picker
            mode="selector"
            range={ALL_EXAM_TEMPLATES.map((t) => t.label)}
            onChange={(e) => switchTpl(ALL_EXAM_TEMPLATES[Number(e.detail.value)].type)}
          >
            <View className="picker-shell tpl-select">{tpl.label}</View>
          </Picker>
        </View>
        <View style={{ maxHeight: '40vh', overflowY: 'auto' }}>
          {tpl.nodes.map((n, i) => {
            const on = checked.has(i)
            return (
              <View className={`list-item ${on ? 'done' : ''}`} key={n.label}>
                <View className={`ms-check${on ? ' on' : ''}`} onClick={() => toggle(i)}>
                  {on ? '✓' : ''}
                </View>
                <Text className="grow name">{n.label}</Text>
                <Text className="sub" style={{ textAlign: 'right', lineHeight: 1.4 }}>
                  {addDays(examDate, n.offset)}
                  {'\n'}
                  <Text style={{ fontSize: 10 }}>{offsetLabel(n.offset)}</Text>
                </Text>
              </View>
            )
          })}
        </View>
        <View className="row" style={{ justifyContent: 'center', gap: 10, marginTop: 10 }}>
          <View className="btn plain small" onClick={() => setChecked(new Set(tpl.nodes.map((_, i) => i)))}>
            全选
          </View>
          <View className="btn plain small" onClick={() => setChecked(new Set())}>
            清空
          </View>
        </View>
        <View
          className={`btn${checked.size === 0 ? ' is-disabled' : ''}`}
          style={{ width: '100%', marginTop: 10 }}
          onClick={() => {
            if (checked.size > 0) confirm()
          }}
        >
          按勾选生成 {checked.size} 个节点
        </View>
      </View>
    </View>
  )
}
