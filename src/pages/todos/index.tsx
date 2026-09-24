// 待办清单：优先级（高中低）+ 子步骤展开 + 父子联动勾选
// 自 PWA pages/Todos.tsx 迁移：checkbox → 自绘 ms-check / child-check，Enter → onConfirm
import { useState } from 'react'
import { Input, Text, View } from '@tarojs/components'
import { useData } from '../../store'
import type { Todo } from '../../types'
import { uid } from '../../utils/date'

// 优先级档位：1 高 / 2 中（默认，旧数据无字段视为 2）/ 3 低
const rank = (t: Todo) => t.priority ?? 2

export default function Todos() {
  const { data, ready, set } = useData()
  const [text, setText] = useState('')
  const [showDone, setShowDone] = useState(false)
  const [prio, setPrio] = useState<1 | 2 | 3>(2) // 新任务优先级，默认「中」
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set()) // 已展开的任务 id
  const [drafts, setDrafts] = useState<Record<string, string>>({}) // 各任务「+ 子步骤」输入草稿

  const add = () => {
    if (!text.trim()) return
    set('todos', (prev) => [
      { id: uid(), text: text.trim(), done: false, createdAt: Date.now(), priority: prio },
      ...prev,
    ])
    setText('')
  }

  // 展开 / 收起子任务区
  const toggleExpand = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  // 勾选父任务：
  // - 有子任务且全勾 → 取消父勾 = 同时取消全部子任务（同向联动）
  // - 无子任务或未全勾 → 仅手动翻转父自身 done，子任务不动
  const toggleParent = (t: Todo) => {
    const kids = t.children ?? []
    const allDone = kids.length > 0 && kids.every((c) => c.done)
    set('todos', (prev) =>
      prev.map((x) =>
        x.id === t.id
          ? allDone
            ? { ...x, done: false, children: kids.map((c) => ({ ...c, done: false })) }
            : { ...x, done: !x.done }
          : x
      )
    )
  }

  // 勾选子任务：全部勾选时父任务 done 自动置 true；取消子任务不反向拉回父状态
  const toggleChild = (t: Todo, cid: string) => {
    set('todos', (prev) =>
      prev.map((x) => {
        if (x.id !== t.id) return x
        const kids = (x.children ?? []).map((c) => (c.id === cid ? { ...c, done: !c.done } : c))
        const all = kids.length > 0 && kids.every((c) => c.done)
        return { ...x, children: kids, done: all || x.done }
      })
    )
  }

  // 添加子步骤（确认键提交）；无子任务的任务不写 children，首次添加才创建
  const addChild = (t: Todo) => {
    const v = (drafts[t.id] ?? '').trim()
    if (!v) return
    set('todos', (prev) =>
      prev.map((x) =>
        x.id === t.id
          ? { ...x, children: [...(x.children ?? []), { id: uid(), text: v, done: false }] }
          : x
      )
    )
    setDrafts((d) => ({ ...d, [t.id]: '' }))
  }

  // 删除子步骤：剩余子任务仍全勾则父保持完成，否则父状态不动
  const removeChild = (t: Todo, cid: string) => {
    set('todos', (prev) =>
      prev.map((x) => {
        if (x.id !== t.id) return x
        const kids = (x.children ?? []).filter((c) => c.id !== cid)
        const all = kids.length > 0 && kids.every((c) => c.done)
        return { ...x, children: kids, done: all || x.done }
      })
    )
  }

  // 排序：未完成在前（priority 升序，同级新建在上）；已完成沉底保持原有顺序
  const undone = data.todos
    .filter((t) => !t.done)
    .sort((a, b) => rank(a) - rank(b) || b.createdAt - a.createdAt)
  const done = data.todos.filter((t) => t.done)
  const visible = showDone ? [...undone, ...done] : undone

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
        {/* 优先级选择器：默认「中」 */}
        <View className="prio-picker">
          <Text className="pp-label">优先级</Text>
          {([1, 2, 3] as const).map((p) => (
            <View
              key={p}
              className={`prio-dot p${p} ${prio === p ? 'sel' : ''}`}
              onClick={() => setPrio(p)}
            />
          ))}
        </View>
      </View>

      <View className="card">
        <View className="card-title">
          <Text>未完成 {undone.length} 件</Text>
          <View className="row sub" style={{ fontSize: 13, gap: 4 }} onClick={() => setShowDone((v) => !v)}>
            <View className={`ms-check${showDone ? ' on' : ''}`} style={{ width: 16, height: 16 }}>
              {showDone ? '✓' : ''}
            </View>
            <Text>显示已完成</Text>
          </View>
        </View>
        {visible.map((t) => {
          const kids = t.children ?? []
          const hasKids = kids.length > 0
          const doneCount = kids.filter((c) => c.done).length
          const expanded = expandedIds.has(t.id)
          return (
            <View className="todo-item-wrap" key={t.id}>
              <View className={`list-item ${t.done ? 'done' : ''}`}>
                <View className={`ms-check${t.done ? ' on' : ''}`} onClick={() => toggleParent(t)}>
                  {t.done ? '✓' : ''}
                </View>
                <Text className="grow name" onClick={() => hasKids && toggleExpand(t.id)}>
                  {t.text}
                </Text>
                <View className={`prio-dot p${rank(t)}`} />
                {hasKids && (
                  <Text className="sub-prog">
                    {doneCount}/{kids.length}
                  </Text>
                )}
                {hasKids && (
                  <View
                    className={`icon-btn expand-arrow ${expanded ? 'open' : ''}`}
                    onClick={() => toggleExpand(t.id)}
                  >
                    <Text>▾</Text>
                  </View>
                )}
                <View
                  className="icon-btn"
                  onClick={() => set('todos', (prev) => prev.filter((x) => x.id !== t.id))}
                >
                  <Text>✕</Text>
                </View>
              </View>
              {hasKids && expanded && (
                <View className="todo-children">
                  {kids.map((c) => (
                    <View className={`todo-child ${c.done ? 'done' : ''}`} key={c.id}>
                      <View
                        className={`child-check ${c.done ? 'on' : ''}`}
                        onClick={() => toggleChild(t, c.id)}
                      >
                        <Text>{c.done ? '✓' : ''}</Text>
                      </View>
                      <Text className="grow name">{c.text}</Text>
                      <View className="child-x" onClick={() => removeChild(t, c.id)}>
                        <Text>✕</Text>
                      </View>
                    </View>
                  ))}
                  <View className="child-add-row">
                    <Text>+</Text>
                    <Input
                      placeholder="添加子步骤，确认键保存"
                      value={drafts[t.id] ?? ''}
                      onInput={(e) => setDrafts((d) => ({ ...d, [t.id]: e.detail.value }))}
                      onConfirm={() => addChild(t)}
                    />
                  </View>
                </View>
              )}
            </View>
          )
        })}
        {visible.length === 0 && (
          <Text className="empty">{showDone ? '什么都没有' : '没有待办，很清爽！'}</Text>
        )}
      </View>
    </View>
  )
}
