// 记账分类管理：支出/收入分类列表 + 新增/编辑弹层（改名 / 改图标 / 删除归并「其他」）
// 业务规则：locked「其他」不可删不可改名（可改图标）；builtin 不可删（可改名改图标）；自定义全放开
// 改名/删除需按 type 过滤同步 ledger 流水（支出/收入各有一个「其他」，同名不同类）
// 排序：按住「拖动」把手上下拖拽交换位置（小程序无原生拖拽 API，touch 手势 + 实时换位），松手一次持久化
import { useRef, useState } from 'react'
import Taro from '@tarojs/taro'
import { Input, ScrollView, Text, View, type ITouchEvent } from '@tarojs/components'
import { useData } from '../../store'
import { appConfirm } from '../../components/ConfirmDialog'
import Modal from '../../components/Modal'
import Icon from '../../components/Icon'
import { showToast } from '../../utils/platform'
import { EMOJI_LIBRARY } from '../../constants/categories'
import type { LedgerCategory } from '../../types'

type ModalState = { mode: 'add' } | { mode: 'edit'; original: LedgerCategory }

export default function LedgerCats() {
  const { data, ready, set } = useData()
  const [tab, setTab] = useState<'expense' | 'income'>('expense')
  const [modal, setModal] = useState<ModalState | null>(null)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('')
  // 拖拽排序：拖动期间用 dragOrder 展示临时顺序，松手一次写回 store
  const [dragOrder, setDragOrder] = useState<LedgerCategory[] | null>(null)
  const [drag, setDrag] = useState<{ index: number; dy: number } | null>(null)
  const orderRef = useRef<LedgerCategory[] | null>(null)
  const topsRef = useRef<{ top: number; height: number }[]>([])
  const dragInfoRef = useRef<{ index: number; startY: number; originTop: number; h: number; moved: boolean } | null>(null)

  const cats = dragOrder ?? data.ledgerCats[tab]

  const openEdit = (c: LedgerCategory) => {
    setModal({ mode: 'edit', original: c })
    setName(c.name)
    setEmoji(c.emoji)
  }

  const openAdd = () => {
    setModal({ mode: 'add' })
    setName('')
    setEmoji('')
  }

  // 拖拽排序：按住把手开始 → 量取各行位置 → 移动时按行中心找落点并实时换位 → 松手一次持久化
  const onDragStart = (index: number, e: any) => {
    const touch = (e as ITouchEvent).touches[0]
    Taro.createSelectorQuery()
      .selectAll('.cat-sort-item')
      .boundingClientRect()
      .exec((res) => {
        const rects = ((res && res[0]) || []) as { top: number; height: number }[]
        if (rects.length !== cats.length) return
        topsRef.current = rects
        orderRef.current = [...cats]
        dragInfoRef.current = {
          index,
          startY: touch.clientY,
          originTop: rects[index].top,
          h: rects[index].height,
          moved: false,
        }
        setDrag({ index, dy: 0 })
      })
  }

  const onDragMove = (e: any) => {
    const info = dragInfoRef.current
    const tops = topsRef.current
    const list = orderRef.current
    if (!info || !tops.length || !list) return
    const dy = (e as ITouchEvent).touches[0].clientY - info.startY
    if (Math.abs(dy) > 4) info.moved = true
    // 落点：拖动行的中心落在哪个行区间
    const center = info.originTop + dy + info.h / 2
    let to = tops.length - 1
    for (let k = 0; k < tops.length; k++) {
      if (center < tops[k].top + tops[k].height) {
        to = k
        break
      }
    }
    if (to !== info.index) {
      ;[list[info.index], list[to]] = [list[to], list[info.index]]
      setDragOrder([...list])
      info.index = to
    }
    // transform 补偿：换位后行渲染在 tops[info.index].top，视觉位置应为 originTop + dy
    setDrag({ index: info.index, dy: info.originTop + dy - tops[info.index].top })
  }

  const onDragEnd = () => {
    const info = dragInfoRef.current
    const list = orderRef.current
    dragInfoRef.current = null
    orderRef.current = null
    topsRef.current = []
    setDrag(null)
    setDragOrder(null)
    if (info && info.moved && list) {
      set('ledgerCats', (prev) =>
        tab === 'expense' ? { ...prev, expense: list } : { ...prev, income: list }
      )
    }
  }

  // 同类型下某分类的流水笔数（旧数据无 type 视为 expense）
  const countOf = (catName: string) =>
    data.ledger.filter((l) => l.category === catName && (l.type ?? 'expense') === tab).length

  const save = () => {
    if (!modal) return
    const newName = name.trim()
    if (!newName) {
      showToast('请输入分类名称')
      return
    }
    const newEmoji = emoji || '📦'
    const originalName = modal.mode === 'edit' ? modal.original.name : null
    if (cats.some((c) => c.name === newName && c.name !== originalName)) {
      showToast('分类已存在')
      return
    }
    if (modal.mode === 'add') {
      set('ledgerCats', (prev) =>
        tab === 'expense'
          ? { ...prev, expense: [...prev.expense, { name: newName, emoji: newEmoji }] }
          : { ...prev, income: [...prev.income, { name: newName, emoji: newEmoji }] }
      )
    } else {
      const original = modal.original
      const finalName = original.locked ? original.name : newName
      // 改名：批量同步同类型同名流水的分类（按 type 过滤，不误伤另一类同名「其他」）
      if (finalName !== original.name) {
        set('ledger', (prev) =>
          prev.map((l) =>
            l.category === original.name && (l.type ?? 'expense') === tab
              ? { ...l, category: finalName }
              : l
          )
        )
      }
      set('ledgerCats', (prev) =>
        tab === 'expense'
          ? {
              ...prev,
              expense: prev.expense.map((c) =>
                c.name === original.name ? { ...c, name: finalName, emoji: newEmoji } : c
              ),
            }
          : {
              ...prev,
              income: prev.income.map((c) =>
                c.name === original.name ? { ...c, name: finalName, emoji: newEmoji } : c
              ),
            }
      )
    }
    setModal(null)
    showToast('已保存')
  }

  const removeCat = () => {
    if (!modal || modal.mode !== 'edit') return
    const original = modal.original
    if (original.builtin || original.locked) return
    const n = countOf(original.name)
    void appConfirm('删除分类', `该分类下 ${n} 笔记录将归入「其他」`, { danger: true }).then((ok) => {
      if (!ok) return
      set('ledger', (prev) =>
        prev.map((l) =>
          l.category === original.name && (l.type ?? 'expense') === tab
            ? { ...l, category: '其他' }
            : l
        )
      )
      set('ledgerCats', (prev) =>
        tab === 'expense'
          ? { ...prev, expense: prev.expense.filter((c) => c.name !== original.name) }
          : { ...prev, income: prev.income.filter((c) => c.name !== original.name) }
      )
      setModal(null)
    })
  }

  if (!ready) {
    return (
      <View className="page">
        <View className="skeleton sk-card" />
        <View className="skeleton sk-card" />
        <View className="skeleton sk-card" />
      </View>
    )
  }

  return (
    <View className="page">
      <View className="page-title">
        <Icon name="folder" size={16} gap={4} />
        <Text>分类管理</Text>
      </View>

      {/* 支出 / 收入切换 */}
      <View className="type-toggle">
        {([['expense', '支出'], ['income', '收入']] as const).map(([t, label]) => (
          <View
            key={t}
            className={`type-btn ${tab === t ? 'active' : ''}`}
            onClick={() => {
              setTab(t)
              setDragOrder(null)
            }}
          >
            <Text>{label}</Text>
          </View>
        ))}
      </View>

      {/* 分类列表：按住「拖动」把手拖拽排序，点击行编辑 */}
      <View className="card">
        {cats.map((c, i) => (
          <View
            className={`list-item cat-sort-item ${drag?.index === i ? 'dragging' : ''}`}
            key={c.name}
            style={drag?.index === i ? { transform: `translateY(${drag.dy}px)` } : undefined}
            onClick={() => openEdit(c)}
          >
            <Text style={{ fontSize: 22 }}>{c.emoji}</Text>
            <View className="grow">
              <Text className="name">{c.name}</Text>
              <Text className="sub">{c.locked ? '系统' : c.builtin ? '内置' : '自定义'}</Text>
            </View>
            {/* 拖拽把手标签（替代原上/下箭头按钮）：catchMove 阻止拖动时页面滚动 */}
            <View
              className="drag-handle"
              catchMove
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => onDragStart(i, e)}
              onTouchMove={onDragMove}
              onTouchEnd={onDragEnd}
              onTouchCancel={onDragEnd}
            >
              <Icon name="grip" size={13} />
              <Text>拖动</Text>
            </View>
            <Icon name="arrow-up" size={16} className="arrow-r" />
          </View>
        ))}
      </View>

      {/* 新增入口 */}
      <View className="btn" onClick={openAdd}>
        <Text>+ 新增分类</Text>
      </View>

      {/* 编辑 / 新增弹层 */}
      {modal && (
        <Modal variant="sheet" onClose={() => setModal(null)}>
          <View className="card-title">
            <Text>{modal.mode === 'edit' ? '编辑分类' : '新增分类'}</Text>
          </View>
          <View className="field">
            <Text className="sub">名称</Text>
            <Input
              value={name}
              disabled={modal.mode === 'edit' && !!modal.original.locked}
              placeholder="分类名称"
              onInput={(e) => setName(e.detail.value)}
            />
          </View>
          {modal.mode === 'edit' && modal.original.locked && (
            <Text className="sub">「其他」不可改名</Text>
          )}
          <View className="field">
            <Text className="sub">图标</Text>
            <ScrollView scrollY style={{ height: 220 }}>
              <View className="cat-grid">
                {EMOJI_LIBRARY.map((em) => (
                  <View
                    key={em}
                    className={`cat-item ${emoji === em ? 'active' : ''}`}
                    onClick={() => setEmoji(em)}
                  >
                    <Text className="cat-emoji">{em}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
          <View className="row" style={{ justifyContent: 'flex-end' }}>
            {modal.mode === 'add' ? (
              <View className="btn plain small" onClick={() => setModal(null)}>
                <Text>取消</Text>
              </View>
            ) : (
              !modal.original.builtin &&
              !modal.original.locked && (
                <View className="btn danger small" onClick={removeCat}>
                  <Text>删除</Text>
                </View>
              )
            )}
            <View className="btn small" onClick={save}>
              <Text>保存</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  )
}
