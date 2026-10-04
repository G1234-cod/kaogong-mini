// 节点勾选：模板节点勾选 + 自定义节点添加（「添加考试」居中弹窗 / 「选择节点」弹窗共用内容组件）
// Taro 迁移：select→Picker(mode=selector)、checkbox→自绘 .ms-check、按钮→View、遮罩 catchMove
// 追加语义：已添加节点（按 label 匹配）置灰不可选；全选 = 逐条依次勾选所有「未添加」节点
// 自定义节点：不来自模板，人为定义名称与日期，添加即勾选，可取消勾选不生成
import { useEffect, useRef, useState } from 'react'
import { Input, Picker, ScrollView, Text, View } from '@tarojs/components'
import { addDays } from '../utils/date'
import { ALL_EXAM_TEMPLATES, GENERIC_EXAM_TEMPLATE } from '../utils/exam-templates'
import { showToast } from '../utils/platform'
import DatePicker from './DatePicker'
import Icon from './Icon'
import Modal from './Modal'

export interface PickedNode {
  label: string
  date: string
}

function offsetLabel(offset: number): string {
  if (offset === 0) return '考试日'
  return offset < 0 ? `考前 ${-offset} 天` : `考后 ${offset} 天`
}

interface ContentProps {
  /** 考试日期（各模板节点按偏移基于它推算，可在界面上改） */
  examDate: string
  /** 初始选中的模板类型（不传则用通用模板） */
  initialType?: string
  /** 已添加节点的 label 列表（追加模式下置灰排除，不再重复生成） */
  existingLabels?: string[]
  /** 节点列表区最大高度（默认约 4 行，其余上下滑动查看） */
  listMaxHeight?: string
  /** 选择变化回调：返回当前勾选的节点（模板 + 自定义）、当前模板类型、当前考试日期 */
  onChange: (nodes: PickedNode[], templateType: string, examDate: string) => void
}

/** 节点选择内容区（不带弹窗外壳与底部确认按钮）：添加考试 / 追加节点两处共用 */
export function MilestonePickerContent({
  examDate,
  initialType,
  existingLabels,
  listMaxHeight = '220px',
  onChange,
}: ContentProps) {
  const [tplType, setTplType] = useState(initialType ?? GENERIC_EXAM_TEMPLATE.type)
  const tpl = ALL_EXAM_TEMPLATES.find((t) => t.type === tplType) ?? GENERIC_EXAM_TEMPLATE
  // 考试日期可在生成处修改（改后所有未手动覆盖的节点按偏移重算）
  const [date, setDate] = useState(examDate)
  // 单节点日期覆盖：index → 自定义日期（不用模板偏移时手动改）
  const [dateOverride, setDateOverride] = useState<Record<number, string>>({})
  // 勾选状态：默认全部不勾选（含切换模板后），由用户自行点选或「全选」
  const [checked, setChecked] = useState<Set<number>>(() => new Set())
  // 全选逐条勾选进行中（禁用按钮，防重复触发）
  const [animating, setAnimating] = useState(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  // 自定义节点（人为定义，不来自模板）
  const [customs, setCustoms] = useState<{ label: string; date: string }[]>([])
  const [customOn, setCustomOn] = useState<Set<number>>(new Set())
  const [cLabel, setCLabel] = useState('')
  const [cDate, setCDate] = useState('')
  // onChange 用 ref 存最新引用：调用方内联函数变化不触发本 effect 反复回调
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  // 用户是否手动切换过模板：手动切过后不再跟随 initialType 自动覆盖
  const tplTouchedRef = useRef(false)

  function isAdded(i: number): boolean {
    return existingLabels ? existingLabels.includes(tpl.nodes[i].label) : false
  }

  function clearTimers() {
    timersRef.current.forEach((t) => clearTimeout(t))
    timersRef.current = []
  }

  // 选择任何变化 → 同步给调用方（模板勾选 / 自定义勾选 / 日期 / 模板切换）
  useEffect(() => {
    const nodes: PickedNode[] = [
      ...tpl.nodes.map((n, i) => ({ label: n.label, date: nodeDate(n, i) })).filter((_, i) => checked.has(i)),
      ...customs.filter((_, i) => customOn.has(i)),
    ]
    onChangeRef.current(nodes, tplType, date)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tplType, date, dateOverride, checked, customs, customOn])

  const switchTpl = (type: string) => {
    clearTimers()
    setAnimating(false)
    setTplType(type)
    setDateOverride({})
    // 切换模板后默认全部不勾选，由用户自行点选
    setChecked(new Set())
  }

  // 「添加考试」里边输名称边识别模板：initialType 变化时自动跟随切换；
  // 用户手动切过模板（tplTouchedRef）后不再覆盖人的选择
  useEffect(() => {
    if (tplTouchedRef.current) return
    if (initialType && initialType !== tplType) switchTpl(initialType)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialType])

  const toggle = (i: number) => {
    if (isAdded(i)) return
    // 手动点任意一行即中止自动逐条勾选
    clearTimers()
    setAnimating(false)
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const toggleCustom = (i: number) => {
    clearTimers()
    setAnimating(false)
    setCustomOn((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  /** 添加自定义节点：名称 + 日期人为定义，不依赖模板偏移 */
  const addCustom = () => {
    if (!cLabel.trim()) {
      showToast('请输入节点名称')
      return
    }
    if (!cDate) {
      showToast('请选择节点日期')
      return
    }
    setCustoms((prev) => [...prev, { label: cLabel.trim(), date: cDate }])
    setCustomOn((prev) => new Set(prev).add(customs.length))
    setCLabel('')
    setCDate('')
  }

  /** 全选：清空后按顺序逐条勾选「未添加」节点，带轻微视觉反馈与实时计数 */
  const selectAll = () => {
    clearTimers()
    setAnimating(true)
    const targets = tpl.nodes.map((_, i) => i).filter((i) => !isAdded(i))
    const next = new Set<number>()
    setChecked(new Set())
    setCustomOn(new Set(customs.map((_, i) => i)))
    targets.forEach((i, k) => {
      const t = setTimeout(() => {
        next.add(i)
        setChecked(new Set(next))
        if (k === targets.length - 1) setAnimating(false)
      }, k * 90)
      timersRef.current.push(t)
    })
    if (targets.length === 0) setAnimating(false)
  }

  const clearAll = () => {
    clearTimers()
    setAnimating(false)
    setChecked(new Set())
    setCustomOn(new Set())
  }

  const changeExamDate = (d: string) => {
    setDate(d)
    // 考试日是各节点日期的基准：改基准后清空手动覆盖，全部按偏移重算
    setDateOverride({})
  }

  const nodeDate = (n: { offset: number }, i: number): string =>
    dateOverride[i] ?? (date ? addDays(date, n.offset) : '')

  return (
    <View>
      {/* 考试日期：生成处可改，改后所有节点日期按模板偏移重算 */}
      <View className="row" style={{ marginBottom: 10 }}>
        <Text className="sub" style={{ flexShrink: 0 }}>
          考试日期
        </Text>
        <DatePicker value={date} onChange={changeExamDate} compact />
      </View>

      {/* 模板选择 + 全选/清空同一行：按钮紧跟「节点模板」标题之后，列表下方不再放按钮 */}
      <View className="row" style={{ marginBottom: 10, gap: 6 }}>
        <Text className="sub" style={{ flexShrink: 0 }}>
          节点模板
        </Text>
        <Picker
          mode="selector"
          range={ALL_EXAM_TEMPLATES.map((t) => t.label)}
          onChange={(e) => {
            tplTouchedRef.current = true // 手动选择后不再被 initialType 自动覆盖
            switchTpl(ALL_EXAM_TEMPLATES[Number(e.detail.value)].type)
          }}
        >
          <View className="picker-shell tpl-select">{tpl.label}</View>
        </Picker>
        <View
          className={`btn plain small${animating ? ' is-disabled' : ''}`}
          style={{ flexShrink: 0 }}
          onClick={() => {
            if (!animating) selectAll()
          }}
        >
          {animating ? '全选中…' : '全选'}
        </View>
        <View className="btn plain small" style={{ flexShrink: 0 }} onClick={clearAll}>
          清空
        </View>
      </View>

      {/* 节点列表：一次约展示 4 行，其余上下滑动（ScrollView 保证 catchMove 弹层内可滚） */}
      <ScrollView scroll-y style={{ maxHeight: listMaxHeight }}>
        {/* Q4：已添加节点稳定排序沉底、不再提供选择按钮（仅置灰展示 + 「已添加」标签），
            未添加节点保持模板顺序在前 */}
        {tpl.nodes
          .map((n, i) => ({ n, i }))
          .sort((a, b) => Number(isAdded(a.i)) - Number(isAdded(b.i)))
          .map(({ n, i }) => {
            const on = checked.has(i)
            const added = isAdded(i)
            return (
              <View className={`list-item ${on ? 'done' : ''}${added ? ' is-added' : ''}`} key={n.label}>
                {!added && (
                  <View className={`ms-check${on ? ' on' : ''}`} onClick={() => toggle(i)}>
                    {on ? <Icon name="check" size={12} /> : null}
                  </View>
                )}
                <View className="grow ms-line">
                  <View className="row">
                    <Text className="grow name">{n.label}</Text>
                    {added ? (
                      <Text className="tag added-tag">已添加</Text>
                    ) : (
                      <Text className="sub" style={{ fontSize: 14, flexShrink: 0 }}>
                        {offsetLabel(n.offset)}
                      </Text>
                    )}
                  </View>
                  {added ? (
                    <Text className="sub" style={{ flexShrink: 0 }}>
                      {nodeDate(n, i)}
                    </Text>
                  ) : (
                    <DatePicker
                      compact
                      value={nodeDate(n, i)}
                      onChange={(d) => setDateOverride((prev) => ({ ...prev, [i]: d }))}
                    />
                  )}
                </View>
              </View>
            )
          })}
        {/* 自定义节点：人为定义，追加在模板节点之后 */}
        {customs.map((c, i) => {
          const on = customOn.has(i)
          return (
            <View className={`list-item ${on ? 'done' : ''}`} key={`custom-${i}`}>
              <View className={`ms-check${on ? ' on' : ''}`} onClick={() => toggleCustom(i)}>
                {on ? <Icon name="check" size={12} /> : null}
              </View>
              <View className="grow ms-line">
                <View className="row">
                  <Text className="grow name">{c.label}</Text>
                  <Text className="tag">自定义</Text>
                </View>
                <Text className="sub" style={{ flexShrink: 0 }}>
                  {c.date}
                </Text>
              </View>
            </View>
          )
        })}
      </ScrollView>
      <Text className="sub" style={{ fontSize: 12, marginTop: 4 }}>
        ↕ 一次约展示 4 个节点，其余上下滑动查看
      </Text>

      {/* 自定义节点添加行：名称 + 日期，均可人为定义 */}
      <View className="form-row" style={{ marginTop: 8 }}>
        <View className="field" style={{ flex: 1, marginBottom: 0 }}>
          <Input
            placeholder="自定义节点名称"
            value={cLabel}
            onInput={(e) => setCLabel(e.detail.value)}
          />
        </View>
        <View className="field" style={{ marginBottom: 0 }}>
          <DatePicker value={cDate} onChange={setCDate} />
        </View>
        <View className="btn small" onClick={addCustom}>
          添加
        </View>
      </View>
    </View>
  )
}

interface Props {
  /** 考试名称（弹窗标题用） */
  examName: string
  /** 考试日期，用于计算各节点日期 */
  examDate: string
  /** 初始选中的模板类型（不传则用通用模板） */
  initialType?: string
  /** 已添加节点的 label 列表（追加模式下置灰排除，不再重复生成） */
  existingLabels?: string[]
  /** 确认：返回勾选的节点（已按考试日期算好日期）、最终模板类型、最终考试日期 */
  onConfirm: (nodes: PickedNode[], templateType: string, examDate: string) => void
  onClose: () => void
}

export default function MilestonePickerModal({
  examName,
  examDate,
  initialType,
  existingLabels,
  onConfirm,
  onClose,
}: Props) {
  const [picked, setPicked] = useState<{
    nodes: PickedNode[]
    type: string
    date: string
  }>({ nodes: [], type: initialType ?? GENERIC_EXAM_TEMPLATE.type, date: examDate })

  return (
    <Modal variant="sheet" onClose={onClose}>
      <View className="card-title" style={{ marginBottom: 8 }}>
        <Text style={{ overflow: 'hidden' }}>为「{examName}」选择节点</Text>
        <View className="icon-btn" onClick={onClose}>
          <Icon name="x" size={18} />
        </View>
      </View>

      <MilestonePickerContent
        examDate={examDate}
        initialType={initialType}
        existingLabels={existingLabels}
        onChange={(nodes, type, date) => setPicked({ nodes, type, date })}
      />

      <View
        className={`btn${picked.nodes.length === 0 ? ' is-disabled' : ''}`}
        style={{ width: '100%', marginTop: 10 }}
        onClick={() => {
          if (picked.nodes.length > 0) onConfirm(picked.nodes, picked.type, picked.date)
        }}
      >
        新增 {picked.nodes.length} 个节点
      </View>
    </Modal>
  )
}
