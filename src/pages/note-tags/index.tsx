// 笔记标签管理：标签列表 + 新增/改名/删除（删除只把标签从笔记上摘掉，不删笔记）/ 拖拽排序
// 业务规则：locked「时政」不可删不可改名（牵动「带时政标签自动进复习池」规则）；
// builtin 内置标签不可删（可改名）；自定义标签全放开
import { useRef, useState } from 'react'
import Taro from '@tarojs/taro'
import { Input, Text, View, type ITouchEvent } from '@tarojs/components'
import { useData } from '../../store'
import { appConfirm } from '../../components/ConfirmDialog'
import Modal from '../../components/Modal'
import Icon from '../../components/Icon'
import { showToast } from '../../utils/platform'
import type { NoteTag } from '../../types'

type ModalState = { mode: 'add' } | { mode: 'edit'; original: NoteTag }

export default function NoteTags() {
  const { data, ready, set } = useData()
  const [modal, setModal] = useState<ModalState | null>(null)
  const [name, setName] = useState('')
  // 拖拽排序：拖动期间用 dragOrder 展示临时顺序，松手一次写回 store（同分类管理页）
  const [dragOrder, setDragOrder] = useState<NoteTag[] | null>(null)
  const [drag, setDrag] = useState<{ index: number; dy: number } | null>(null)
  const orderRef = useRef<NoteTag[] | null>(null)
  const topsRef = useRef<{ top: number; height: number }[]>([])
  const dragInfoRef = useRef<{ index: number; startY: number; originTop: number; h: number; moved: boolean } | null>(null)

  const tags = dragOrder ?? data.noteTags

  const openEdit = (t: NoteTag) => {
    setModal({ mode: 'edit', original: t })
    setName(t.name)
  }

  const openAdd = () => {
    setModal({ mode: 'add' })
    setName('')
  }

  // 拖拽排序：按住把手开始 → 量取各行位置 → 移动时按行中心找落点并实时换位 → 松手一次持久化
  const onDragStart = (index: number, e: any) => {
    const touch = (e as ITouchEvent).touches[0]
    Taro.createSelectorQuery()
      .selectAll('.cat-sort-item')
      .boundingClientRect()
      .exec((res) => {
        const rects = ((res && res[0]) || []) as { top: number; height: number }[]
        if (rects.length !== tags.length) return
        topsRef.current = rects
        orderRef.current = [...tags]
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
      set('noteTags', list)
    }
  }

  /** 用了该标签的笔记条数（删除提示用） */
  const countOf = (tagName: string) => data.notes.filter((n) => n.tags.includes(tagName)).length

  const save = () => {
    if (!modal) return
    const newName = name.trim()
    if (!newName) {
      showToast('请输入标签名称')
      return
    }
    if (newName.length > 8) {
      showToast('标签最多 8 个字')
      return
    }
    const originalName = modal.mode === 'edit' ? modal.original.name : null
    if (data.noteTags.some((t) => t.name === newName && t.name !== originalName)) {
      showToast('标签已存在')
      return
    }
    if (modal.mode === 'add') {
      set('noteTags', (prev) => [...prev, { name: newName }])
    } else {
      const original = modal.original
      // locked 标签不可改名（UI 已禁用输入，双保险）
      const finalName = original.locked ? original.name : newName
      if (finalName !== original.name) {
        // 改名：批量同步所有笔记上的标签（去重，防止笔记恰好同时挂了新旧两个名字）
        set('notes', (prev) =>
          prev.map((n) =>
            n.tags.includes(original.name)
              ? { ...n, tags: [...new Set(n.tags.map((t) => (t === original.name ? finalName : t)))] }
              : n
          )
        )
      }
      set('noteTags', (prev) =>
        prev.map((t) => (t.name === original.name ? { ...t, name: finalName } : t))
      )
    }
    setModal(null)
    showToast('已保存')
  }

  const removeTag = () => {
    if (!modal || modal.mode !== 'edit') return
    const original = modal.original
    if (original.builtin) return
    const n = countOf(original.name)
    const content = n > 0 ? `该标签下 ${n} 条笔记将移除这个标签，笔记本身保留` : '删除后不可恢复'
    void appConfirm('删除标签', content, { danger: true, confirmText: '删除' }).then((ok) => {
      if (!ok) return
      // 删除标签：只从笔记上摘掉，不删笔记
      set('notes', (prev) =>
        prev.map((x) => (x.tags.includes(original.name) ? { ...x, tags: x.tags.filter((t) => t !== original.name) } : x))
      )
      set('noteTags', (prev) => prev.filter((t) => t.name !== original.name))
      setModal(null)
    })
  }

  if (!ready) {
    return (
      <View className="page">
        <View className="skeleton sk-card" />
        <View className="skeleton sk-card" />
      </View>
    )
  }

  return (
    <View className="page">
      <View className="page-title">
        <Icon name="folder" size={16} gap={4} />
        <Text>标签管理</Text>
      </View>

      {/* 标签列表：按住「拖动」把手拖拽排序，点击行改名 */}
      <View className="card">
        {tags.map((t, i) => (
          <View
            className={`list-item cat-sort-item ${drag?.index === i ? 'dragging' : ''}`}
            key={t.name}
            style={drag?.index === i ? { transform: `translateY(${drag.dy}px)` } : undefined}
            onClick={() => openEdit(t)}
          >
            <Text style={{ fontSize: 20 }}>#</Text>
            <View className="grow">
              <Text className="name">{t.name}</Text>
              <Text className="sub">
                {countOf(t.name)} 条笔记 · {t.locked ? '锁定' : t.builtin ? '内置' : '自定义'}
              </Text>
            </View>
            {/* 拖拽把手：catchMove 阻止拖动时页面滚动 */}
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
        <Text>+ 新增标签</Text>
      </View>

      {/* 编辑 / 新增弹层 */}
      {modal && (
        <Modal variant="sheet" closeOnMask={false} onClose={() => setModal(null)}>
          <View className="card-title">
            <Text>{modal.mode === 'edit' ? '编辑标签' : '新增标签'}</Text>
          </View>
          <View className="field">
            <Text className="sub">名称</Text>
            <Input
              value={name}
              maxlength={8}
              disabled={modal.mode === 'edit' && !!modal.original.locked}
              placeholder="标签名称（最多 8 个字）"
              onInput={(e) => setName(e.detail.value)}
            />
          </View>
          {modal.mode === 'edit' && modal.original.locked && (
            <Text className="sub">「时政」标签牵动自动复习规则，不可改名</Text>
          )}
          <View className="row" style={{ justifyContent: 'flex-end' }}>
            {modal.mode === 'add' ? (
              <View className="btn plain small" onClick={() => setModal(null)}>
                <Text>取消</Text>
              </View>
            ) : (
              !modal.original.builtin && (
                <View className="btn danger small" onClick={removeTag}>
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
