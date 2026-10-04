// 待办清单：纯待办管理页（与打卡彻底分开，不再混排打卡项）
// 行交互：勾选圈 = 完成/取消（记 doneAt，完成后沉底）；行主体 = 弹详情弹窗（可查看可修改）；
//        右侧箭头 = 原地展开子任务；左滑 = 删除（二次确认）；完成时底部浮出 3 秒「撤销」
// 添加区：名称 + 按钮同一行；截止日期必选（今天 / 明天 / 选日期 / 🎲 随机 3-6 天）；优先级默认「低」
// 排序：先优先级（高→中→低），同级内逾期最前、再按截止日期升序（无截止靠后）；已完成沉底（可开关查看）
import { useRef, useState } from 'react'
import { Image, Input, ScrollView, Text, View } from '@tarojs/components'
import Icon from '../../components/Icon'
import animalEmpty from '../../assets/images/比耶.png'
import { useData } from '../../store'
import type { Todo } from '../../types'
import DatePicker, { fmtDateShort } from '../../components/DatePicker'
import ChildRow from '../../components/ChildRow'
import DetailSheet from '../../components/DetailSheet'
import TaskRow from '../../components/TaskRow'
import UndoTip, { type UndoTipData } from '../../components/UndoTip'
import { appConfirm } from '../../components/ConfirmDialog'
import { useListCapHeight } from '../../utils/listCap'
import { addDays, todayStr, uid } from '../../utils/date'
import { showToast } from '../../utils/platform'

// 优先级：1 高 / 2 中 / 3 低（新任务默认低；旧数据无字段视为 2）
const PRIO_LABEL: Record<1 | 2 | 3, string> = { 1: '高', 2: '中', 3: '低' }
const rank = (t: Todo) => t.priority ?? 2

export default function Todos() {
  const { data, ready, set } = useData()
  const today = todayStr()
  const tomorrow = addDays(today, 1)
  // ---- 添加区草稿 ----
  const [text, setText] = useState('')
  const [prio, setPrio] = useState<1 | 2 | 3>(3) // 默认「低」
  const [due, setDue] = useState('') // 截止日期必选（YYYY-MM-DD）
  const [showDone, setShowDone] = useState(false) // 已完成沉底，默认收起
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set()) // 原地展开的任务 id
  // ---- 详情弹窗：点任务行弹出（改信息/加子步骤）；父项字段走草稿「保存」，子项勾选/增删立即写库 ----
  const [detailId, setDetailId] = useState<string | null>(null)
  const [draftText, setDraftText] = useState('')
  const [draftNote, setDraftNote] = useState('')
  const [draftPrio, setDraftPrio] = useState<1 | 2 | 3>(2)
  const [draftDue, setDraftDue] = useState('')
  // ---- 完成撤销提示 ----
  const [undoTip, setUndoTip] = useState<UndoTipData | null>(null)
  const undoSeq = useRef(0)
  const showUndo = (label: string, undo: () => void) => {
    undoSeq.current += 1
    setUndoTip({ id: undoSeq.current, label, undo })
  }

  const detail = data.todos.find((t) => t.id === detailId) ?? null

  // 打开详情弹窗：带出父项字段草稿
  const openDetail = (t: Todo) => {
    setDetailId(t.id)
    setDraftText(t.text)
    setDraftNote(t.note ?? '')
    setDraftPrio(rank(t))
    setDraftDue(t.dueDate ?? '')
  }

  // 添加：名称与截止日期必填（优先级默认低，不选也有值）
  const add = () => {
    if (!text.trim()) {
      showToast('请输入任务内容')
      return
    }
    if (!due) {
      showToast('请选择截止日期')
      return
    }
    set('todos', (prev) => [
      {
        id: uid(),
        text: text.trim(),
        done: false,
        createdAt: Date.now(),
        priority: prio,
        dueDate: due,
      },
      ...prev,
    ])
    setText('')
    setDue('')
    setPrio(3)
  }

  // 展开 / 收起子任务区（卡内滚动高度不变，展开区随行内滚动）
  const toggleExpand = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  // 勾选父任务（与今日页同口径）：
  // - 有子任务且全勾 → 再点 = 父子一起取消（同向联动）
  // - 否则 → 仅翻转父自身 done（记/清 doneAt，供今日页「今天完成 → 沉底」判定）
  const toggleParent = (t: Todo) => {
    const kids = t.children ?? []
    const allDone = kids.length > 0 && kids.every((c) => c.done)
    const nextDone = !allDone && !t.done
    const next: Todo = allDone
      ? { ...t, done: false, doneAt: undefined, children: kids.map((c) => ({ ...c, done: false })) }
      : { ...t, done: nextDone, doneAt: nextDone ? Date.now() : undefined }
    set('todos', (prev) => prev.map((x) => (x.id === t.id ? next : x)))
    if (nextDone) {
      showUndo(`已完成「${t.text}」`, () =>
        set('todos', (prev) => prev.map((x) => (x.id === t.id ? t : x)))
      )
    }
  }

  // 勾选子任务（与今日页同口径）：全部勾完父任务自动完成（记 doneAt）；取消子任务不反向拉回父状态
  const toggleChild = (t: Todo, cid: string) => {
    const kids = (t.children ?? []).map((c) => (c.id === cid ? { ...c, done: !c.done } : c))
    const all = kids.length > 0 && kids.every((c) => c.done)
    const next: Todo = {
      ...t,
      children: kids,
      done: all || t.done,
      doneAt: all && !t.done ? Date.now() : t.doneAt,
    }
    set('todos', (prev) => prev.map((x) => (x.id === t.id ? next : x)))
    if (all && !t.done) {
      showUndo(`已完成「${t.text}」`, () =>
        set('todos', (prev) => prev.map((x) => (x.id === t.id ? t : x)))
      )
    }
  }

  // 添加子步骤（详情弹窗里提交）：立即写库
  const addChild = (t: Todo, name: string) => {
    const v = name.trim()
    if (!v) {
      showToast('请输入子步骤内容')
      return
    }
    set('todos', (prev) =>
      prev.map((x) =>
        x.id === t.id
          ? { ...x, children: [...(x.children ?? []), { id: uid(), text: v, done: false }] }
          : x
      )
    )
  }

  // 子步骤原地改名（铅笔 → 本行输入框 → ✓ 保存）：立即写库
  const renameChild = (t: Todo, cid: string, name: string) => {
    set('todos', (prev) =>
      prev.map((x) =>
        x.id === t.id
          ? { ...x, children: (x.children ?? []).map((c) => (c.id === cid ? { ...c, text: name } : c)) }
          : x
      )
    )
  }

  // 删除子步骤（详情弹窗里点垃圾桶，appConfirm 确认后删）：剩余子任务仍全勾则父保持完成
  const removeChild = (t: Todo, cid: string, name: string) => {
    void appConfirm(`删除子步骤「${name}」？`, undefined, { danger: true, confirmText: '删除' }).then((ok) => {
      if (!ok) return
      set('todos', (prev) =>
        prev.map((x) => {
          if (x.id !== t.id) return x
          const kids = (x.children ?? []).filter((c) => c.id !== cid)
          const all = kids.length > 0 && kids.every((c) => c.done)
          return { ...x, children: kids, done: all || x.done }
        })
      )
    })
  }

  // 删除任务（左滑触发，appConfirm 二次确认后删）
  const removeTodo = (t: Todo) => {
    void appConfirm(`删除任务「${t.text}」？`, undefined, { danger: true, confirmText: '删除' }).then((ok) => {
      if (!ok) return
      set('todos', (prev) => prev.filter((x) => x.id !== t.id))
      setDetailId((cur) => (cur === t.id ? null : cur))
    })
  }

  // 保存详情弹窗的父项字段（名称/说明/优先级/截止），「取消」则放弃草稿
  const saveDetail = (t: Todo) => {
    if (!draftText.trim()) {
      showToast('请输入任务内容')
      return
    }
    if (!draftDue) {
      showToast('请选择截止日期')
      return
    }
    set('todos', (prev) =>
      prev.map((x) =>
        x.id === t.id
          ? {
              ...x,
              text: draftText.trim(),
              note: draftNote.trim() || undefined,
              priority: draftPrio,
              dueDate: draftDue,
            }
          : x
      )
    )
    setDetailId(null)
    showToast('已保存 ✓')
  }

  // 逾期（有截止日期且早于今天）未完成项红标，靠截止升序自然排在组内最前
  const isOver = (t: Todo) => !t.done && !!t.dueDate && t.dueDate < today
  // 排序：先优先级（高→中→低），同级内有截止的在前、按截止升序（逾期最前），无截止靠后；已完成沉底
  const undone = data.todos
    .filter((t) => !t.done)
    .sort(
      (a, b) =>
        rank(a) - rank(b) ||
        (a.dueDate ? 0 : 1) - (b.dueDate ? 0 : 1) ||
        (a.dueDate ?? '').localeCompare(b.dueDate ?? '') ||
        b.createdAt - a.createdAt
    )
  const done = data.todos.filter((t) => t.done).sort((a, b) => b.createdAt - a.createdAt)
  const visible = showDone ? [...undone, ...done] : undone

  // 一屏最多 7 条：超出量前 7 条主行高固定容器，卡内滑动（展开子任务时卡片总高不变）
  const listH = useListCapHeight('.todo-list', '.todo-list .task-row-main', visible.length, 7)

  if (!ready) {
    return (
      <View className="page">
        <View className="card">
          <Text className="sub">加载中…</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="page">
      <View className="page-title">
        <Text>🛒 待办清单</Text>
      </View>

      {/* 添加区：名称 + 按钮同一行；截止必选（今天/明天/选日期/🎲随机 3-6 天）；优先级默认低 */}
      <View className="card">
        <View className="form-row">
          <View className="field" style={{ flex: 1, marginBottom: 0 }}>
            <Input
              placeholder="要买的东西、要办的事…"
              value={text}
              onInput={(e) => setText(e.detail.value)}
              onConfirm={add}
            />
          </View>
          <View className="btn small" onClick={add}>
            <Text>添加</Text>
          </View>
        </View>
        {/* 截止日期（必选）：今天 / 明天 / 日历选日期 / 🎲 随机 3-6 天 */}
        <View className="prio-picker">
          <Text className="pp-label">截止</Text>
          <View className={`chip ${due === today ? 'success' : ''}`} onClick={() => setDue(today)}>
            <Text>今天</Text>
          </View>
          <View className={`chip ${due === tomorrow ? 'success' : ''}`} onClick={() => setDue(tomorrow)}>
            <Text>明天</Text>
          </View>
          <DatePicker value={due} onChange={setDue} placeholder="选日期" compact />
          <View
            className="chip"
            onClick={() => setDue(addDays(today, 3 + Math.floor(Math.random() * 4)))}
          >
            <Text>🎲 随机</Text>
          </View>
        </View>
        {/* 优先级：文字胶囊三档（替代原圆点），默认「低」 */}
        <View className="prio-picker">
          <Text className="pp-label">优先级</Text>
          {([1, 2, 3] as const).map((p) => (
            <View
              key={p}
              className={`prio-pick p${p}${prio === p ? ' sel' : ''}`}
              onClick={() => setPrio(p)}
            >
              <Text>{PRIO_LABEL[p]}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 列表卡：一屏 7 条卡内滑动；已完成沉底（默认收起） */}
      <View className="card">
        <View className="tb-head">
          <Icon name="check-square" size={16} gap={4} />
          <Text className="tb-title">待办</Text>
          <View
            className="row sub"
            style={{ fontSize: 13, gap: 4 }}
            onClick={() => setShowDone((v) => !v)}
          >
            <View className={`ms-check${showDone ? ' on' : ''}`}>
              {showDone ? <Icon name="check" size={12} color="#fff" /> : null}
            </View>
            <Text>已完成</Text>
          </View>
          <Text className="tb-count">{undone.length} 件未完成</Text>
        </View>
        <ScrollView scrollY className="task-list todo-list" style={listH ? { height: listH } : undefined}>
          {visible.map((t, i) => {
            const kids = t.children ?? []
            const hasKids = kids.length > 0
            const doneCount = kids.filter((c) => c.done).length
            const expanded = expandedIds.has(t.id)
            return (
              <TaskRow
                key={t.id}
                tone={i % 5}
                done={t.done}
                name={t.text}
                inlineMeta
                meta={
                  <>
                    <Text className={`prio-pill p${rank(t)}`}>{PRIO_LABEL[rank(t)]}</Text>
                    {hasKids && (
                      <Text className="tpill prog">
                        {doneCount}/{kids.length}
                      </Text>
                    )}
                    {t.dueDate &&
                      (isOver(t) ? (
                        <Text className="tpill warn">逾期 {fmtDateShort(t.dueDate)}</Text>
                      ) : t.dueDate === today ? (
                        <Text className="tpill next today">今天</Text>
                      ) : (
                        <Text className="tpill">{fmtDateShort(t.dueDate)}</Text>
                      ))}
                  </>
                }
                expandable={hasKids}
                expanded={expanded}
                onRowClick={() => openDetail(t)}
                onArrowClick={() => toggleExpand(t.id)}
                onToggleCheck={() => toggleParent(t)}
                onDelete={() => removeTodo(t)}
              >
                {kids.map((c) => (
                  <ChildRow
                    key={c.id}
                    name={c.text}
                    done={c.done}
                    depth={1}
                    onToggle={() => toggleChild(t, c.id)}
                    onRename={(n) => renameChild(t, c.id, n)}
                    onDelete={() => removeChild(t, c.id, c.text)}
                  />
                ))}
              </TaskRow>
            )
          })}
        </ScrollView>
        {/* 空态：列表卡内部，.state-card 不带 .card（避免嵌套双卡） */}
        {visible.length === 0 && (
          <View className="state-card">
            <View className="emoji-badge">
              <Text className="emoji">🛒</Text>
            </View>
            <Text className="empty">{showDone ? '什么都没有' : '没有待办，很清爽！'}</Text>
            <Image className="state-animal" src={animalEmpty} mode="aspectFit" />
          </View>
        )}
      </View>

      {/* 详情弹窗：①说明区（名称/优先级同行，说明/截止，保存才写库）②子步骤区（勾选/增删立即写库）③按钮区 */}
      {detail && (
        <DetailSheet
          title="待办详情"
          onClose={() => setDetailId(null)}
          onSave={() => saveDetail(detail)}
          onDelete={() => {
            void appConfirm(`删除任务「${draftText.trim() || detail.text}」？`, undefined, { danger: true, confirmText: '删除' }).then((ok) => {
              if (!ok) return
              set('todos', (prev) => prev.filter((x) => x.id !== detail.id))
              setDetailId(null)
            })
          }}
          info={
            <View>
              {/* 名称与输入框同行 */}
              <View className="ck-form-line">
                <Text className="ck-form-label">名称</Text>
                <View className="field">
                  <Input
                    value={draftText}
                    placeholder="要办的事…"
                    maxlength={30}
                    onInput={(e) => setDraftText(e.detail.value)}
                  />
                </View>
              </View>
              {/* 优先级与选择器同行 */}
              <View className="ck-form-line">
                <Text className="ck-form-label">优先级</Text>
                {([1, 2, 3] as const).map((p) => (
                  <View
                    key={p}
                    className={`prio-pick p${p}${draftPrio === p ? ' sel' : ''}`}
                    onClick={() => setDraftPrio(p)}
                  >
                    <Text>{PRIO_LABEL[p]}</Text>
                  </View>
                ))}
              </View>
              {/* 说明与输入框同行 */}
              <View className="ck-form-line">
                <Text className="ck-form-label">说明</Text>
                <View className="field">
                  <Input
                    value={draftNote}
                    placeholder="补充说明（可不填）"
                    maxlength={30}
                    onInput={(e) => setDraftNote(e.detail.value)}
                  />
                </View>
              </View>
              {/* 截止日期：今天 / 明天 / 选日期 / 清除（旧数据无日期可补可清） */}
              <View className="prio-picker">
                <Text className="pp-label">截止</Text>
                <View
                  className={`chip ${draftDue === today ? 'success' : ''}`}
                  onClick={() => setDraftDue(today)}
                >
                  <Text>今天</Text>
                </View>
                <View
                  className={`chip ${draftDue === tomorrow ? 'success' : ''}`}
                  onClick={() => setDraftDue(tomorrow)}
                >
                  <Text>明天</Text>
                </View>
                <DatePicker value={draftDue} onChange={setDraftDue} placeholder="选日期" compact />
                {!!draftDue && (
                  <View className="chip todo-clear" onClick={() => setDraftDue('')}>
                    <Text>清除</Text>
                  </View>
                )}
              </View>
            </View>
          }
          items={(detail.children ?? []).map((c) => ({ id: c.id, label: c.text, done: c.done }))}
          addPlaceholder="+ 子步骤名称"
          onToggleChild={(cid) => toggleChild(detail, cid)}
          onRenameChild={(cid, name) => renameChild(detail, cid, name)}
          onAddChild={(name) => addChild(detail, name)}
          onRemoveChild={(cid) => {
            const c = (detail.children ?? []).find((x) => x.id === cid)
            if (c) removeChild(detail, cid, c.text)
          }}
        />
      )}

      {/* 完成撤销：沉底后 3 秒内可撤回 */}
      <UndoTip tip={undoTip} onExpire={() => setUndoTip(null)} />
    </View>
  )
}
