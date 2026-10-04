// 时政收集：随手记素材金句，「时政」标签自动进艾宾浩斯复习池（今日页闪卡）
// 交互：标签横滑（标签再多也放得下）+ 保存按钮固定右侧；点「搜索」按钮才搜，命中文字高亮；
// 卡片点按可编辑、可复制、可改复习日期；长文折叠 3 行；列表分页加载
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import Taro, { useReachBottom } from '@tarojs/taro'
import { Image, Input, ScrollView, Text, Textarea, View } from '@tarojs/components'
import Icon from '../../components/Icon'
import SwipeRow from '../../components/SwipeRow'
import Modal from '../../components/Modal'
import DatePicker from '../../components/DatePicker'
import animalEmpty from '../../assets/images/思考.png'
import { useData } from '../../store'
import { dateStr, uid } from '../../utils/date'
import { firstReviewDate, noteReviewState } from '../../utils/review'
import { appConfirm } from '../../components/ConfirmDialog'
import { copyText, showToast } from '../../utils/platform'
import { AUTO_REVIEW_TAG } from '../../constants/notes'
import type { Note } from '../../types'

/** 每页渲染条数（滑到底自动加载下一批；几十上百条不需要虚拟列表） */
const PAGE_SIZE = 15
/** 超过该字数（或 3 个以上换行）默认折叠成 3 行 */
const CLAMP_LEN = 60
const DAY_MS = 86400000

const isLongText = (s: string) => s.length > CLAMP_LEN || (s.match(/\n/g)?.length ?? 0) >= 3

/** 关键词高亮：把 text 中命中 kw 的片段包一层 .note-hl（不区分大小写） */
function renderHighlight(text: string, kw: string): ReactNode {
  if (!kw) return text
  const q = kw.toLowerCase()
  const lower = text.toLowerCase()
  const out: ReactNode[] = []
  let cursor = 0
  let idx = lower.indexOf(q)
  let key = 0
  while (idx !== -1) {
    if (idx > cursor) out.push(text.slice(cursor, idx))
    out.push(
      <Text className="note-hl" key={key++}>
        {text.slice(idx, idx + q.length)}
      </Text>
    )
    cursor = idx + q.length
    idx = lower.indexOf(q, cursor)
  }
  out.push(text.slice(cursor))
  return out
}

export default function Notes() {
  const { data, ready, set } = useData()
  // ---- 新建区 ----
  const [text, setText] = useState('')
  const [tags, setTags] = useState<string[]>([])
  // ---- 搜索/筛选：searchInput=输入框内容，kw=已提交的关键词（点搜索才更新，不边打边搜） ----
  const [searchInput, setSearchInput] = useState('')
  const [kw, setKw] = useState('')
  const [filterTag, setFilterTag] = useState<string | null>(null)
  // ---- 列表分页 ----
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  // ---- 卡片展开 ----
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  // ---- 新卡片入场动画 ----
  const [newId, setNewId] = useState<string | null>(null)
  // ---- 编辑弹层 ----
  const [editing, setEditing] = useState<Note | null>(null)
  const [draftText, setDraftText] = useState('')
  const [draftTags, setDraftTags] = useState<string[]>([])
  // ---- 复习日期弹层 ----
  const [reviewOf, setReviewOf] = useState<Note | null>(null)

  // 标签数据源 = noteTags 域（用户可增改删、排序，见 pages/note-tags）
  const tagDefs = data.noteTags

  // 从标签管理页返回后：已选/筛选中的标签若被改名或删除，自动剔除（防止笔记挂上不存在的标签）
  useEffect(() => {
    const names = new Set(tagDefs.map((t) => t.name))
    setTags((prev) => (prev.some((t) => !names.has(t)) ? prev.filter((t) => names.has(t)) : prev))
    setFilterTag((prev) => (prev && !names.has(prev) ? null : prev))
  }, [tagDefs])

  const add = () => {
    const content = text.trim()
    if (!content) {
      showToast('请输入内容')
      return
    }
    const id = uid()
    set('notes', (prev) => [
      {
        id,
        text: content,
        tags,
        createdAt: Date.now(),
        // 带「时政」标签自动进复习池（明天首复习），其他默认不进
        nextReviewDate: tags.includes(AUTO_REVIEW_TAG) ? firstReviewDate() : null,
        reviewStep: 0,
        review: noteReviewState({ reviewStep: 0 }),
      },
      ...prev,
    ])
    setText('')
    setTags([])
    // 新卡入场动画（350ms 后摘掉动画类）
    setNewId(id)
    setTimeout(() => setNewId(null), 400)
    showToast('已保存')
  }

  /** 左滑删除笔记（SwipeRow 触发）：先 appConfirm 确认再删（不可逆操作二次确认） */
  const removeNote = (id: string) => {
    void appConfirm('删除这条记录？', undefined, { danger: true, confirmText: '删除' }).then((ok) => {
      if (ok) set('notes', (prev) => prev.filter((x) => x.id !== id))
    })
  }

  // ---- 搜索：点「搜索」按钮 / 键盘「搜索」键才提交，让用户明确知道搜过了 ----
  const doSearch = () => {
    setKw(searchInput.trim())
    setVisibleCount(PAGE_SIZE)
  }

  const clearSearchInput = () => {
    setSearchInput('')
    setKw('')
    setVisibleCount(PAGE_SIZE)
  }

  const clearAll = () => {
    setSearchInput('')
    setKw('')
    setFilterTag(null)
    setVisibleCount(PAGE_SIZE)
  }

  // 模糊匹配：内容、标签包含关键词即命中（不区分大小写）
  const filtered = useMemo(() => {
    const q = kw.toLowerCase()
    return data.notes.filter((n) => {
      if (filterTag && !n.tags.includes(filterTag)) return false
      if (!q) return true
      return n.text.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q))
    })
  }, [data.notes, kw, filterTag])

  // 筛选条件变化时回到第一页
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [kw, filterTag])

  // 滑到页面底部自动加载下一批（条数走 ref，避免触底回调拿到旧闭包）
  const totalRef = useRef(0)
  totalRef.current = filtered.length
  useReachBottom(() => {
    setVisibleCount((c) => (c < totalRef.current ? c + PAGE_SIZE : c))
  })

  const visible = filtered.slice(0, visibleCount)

  // ---- 编辑 ----
  const openEdit = (n: Note) => {
    setEditing(n)
    setDraftText(n.text)
    setDraftTags(n.tags)
  }

  const saveEdit = () => {
    if (!editing) return
    const content = draftText.trim()
    if (!content) {
      showToast('内容不能为空')
      return
    }
    const id = editing.id
    set('notes', (prev) =>
      prev.map((x) => (x.id === id ? { ...x, text: content, tags: draftTags } : x))
    )
    setEditing(null)
    showToast('已保存')
  }

  // ---- 复习排期 ----
  /** 复习状态文案：已掌握 / 今天复习 / N 天后复习 / 加入复习 */
  const reviewLabel = (n: Note) => {
    if (n.reviewStep >= 5 && n.nextReviewDate === null) return '🧠 已掌握'
    if (n.nextReviewDate === null) return '🧠 加入复习'
    const daysLeft = Math.max(0, Math.ceil((n.nextReviewDate - Date.now()) / DAY_MS))
    return daysLeft === 0 ? '🧠 今天复习' : `🧠 ${daysLeft} 天后复习`
  }

  /**
   * 安排复习日期：
   * - 已在复习池（含逾期）：只改日期，保留现有记忆状态
   * - 新加入 / 已掌握重新加入：记忆状态重置为初始（reviewStep 0）
   */
  const scheduleReview = (id: string, ms: number) => {
    set('notes', (prev) =>
      prev.map((x) => {
        if (x.id !== id) return x
        const joining = x.nextReviewDate === null
        return {
          ...x,
          nextReviewDate: ms,
          reviewStep: joining ? 0 : x.reviewStep,
          review: joining ? noteReviewState({ reviewStep: 0 }) : x.review,
        }
      })
    )
    setReviewOf(null)
    showToast('复习日期已更新')
  }

  /** 移出复习池（保留记忆状态，今日页不再出现） */
  const leaveReview = (id: string) => {
    set('notes', (prev) => prev.map((x) => (x.id === id ? { ...x, nextReviewDate: null } : x)))
    setReviewOf(null)
    showToast('已移出复习池')
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
        <Icon name="clipboard" size={16} gap={4} />
        <Text className="grow">时政收集</Text>
      </View>

      {/* ===== 新建卡：输入框 + 横滑标签 + 固定右侧的保存按钮 ===== */}
      <View className="card">
        <View className="field">
          <Textarea
            style={{ height: 120 }}
            placeholder="粘贴时政新闻、申论素材、看到的好句子…"
            value={text}
            onInput={(e) => setText(e.detail.value)}
            maxlength={-1}
          />
        </View>
        <View className="note-tags-bar">
          <ScrollView scrollX className="note-tags-scroll" enhanced showScrollbar={false}>
            <View className="note-chip-row">
              {tagDefs.map((t) => (
                <Text
                  key={t.name}
                  className={`tag ${tags.includes(t.name) ? 'selected' : ''}`}
                  onClick={() =>
                    setTags((prev) =>
                      prev.includes(t.name) ? prev.filter((x) => x !== t.name) : [...prev, t.name]
                    )
                  }
                >
                  {t.name}
                </Text>
              ))}
            </View>
          </ScrollView>
          <View className="btn small note-save-btn" onClick={add}>
            <Text>保存</Text>
          </View>
        </View>
      </View>

      {/* ===== 搜索卡：输入框 + 搜索按钮一行；下面横滑标签筛选，尾部「管理」 ===== */}
      <View className="card">
        <View className="note-search-bar">
          <View className="note-search-input">
            <Icon name="search" size={15} color="#8a7a6a" />
            <Input
              placeholder="搜索内容或标签"
              value={searchInput}
              confirmType="search"
              onInput={(e) => setSearchInput(e.detail.value)}
              onConfirm={doSearch}
            />
            {searchInput !== '' && (
              <View className="note-search-clear" onClick={clearSearchInput}>
                <Icon name="x" size={12} color="#8a7a6a" />
              </View>
            )}
          </View>
          <View className="btn small note-search-btn" onClick={doSearch}>
            <Text>搜索</Text>
          </View>
        </View>
        <ScrollView scrollX className="note-filter-scroll" enhanced showScrollbar={false}>
          <View className="note-chip-row">
            <Text
              className={`tag ${filterTag === null ? 'selected' : ''}`}
              onClick={() => setFilterTag(null)}
            >
              全部
            </Text>
            {tagDefs.map((t) => (
              <Text
                key={t.name}
                className={`tag ${filterTag === t.name ? 'selected' : ''}`}
                onClick={() => setFilterTag((p) => (p === t.name ? null : t.name))}
              >
                {t.name}
              </Text>
            ))}
            <View
              className="tag note-manage-tag"
              onClick={() => Taro.navigateTo({ url: '/pages/note-tags/index' })}
            >
              <Icon name="gear" size={13} color="#8a6a4a" />
              <Text>管理</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* ===== 结果提示：让用户明确「搜过了、筛过了」 ===== */}
      {(kw || filterTag) && (
        <View className="note-result-bar">
          <Text className="sub">
            找到 {filtered.length} 条
            {kw ? ` · “${kw}”` : ''}
            {filterTag ? ` · 标签：${filterTag}` : ''}
          </Text>
          <Text className="note-act" onClick={clearAll}>
            清除
          </Text>
        </View>
      )}

      {/* ===== 空态 ===== */}
      {filtered.length === 0 && (
        <View className="card state-card">
          <View className="emoji-badge">
            <Text className="emoji">📰</Text>
          </View>
          <Text className="empty">
            {kw || filterTag ? '没有匹配的记录，换个关键词或清除筛选试试' : '还没有记录，随手记下今天看到的时政素材吧'}
          </Text>
          <Image className="state-animal" src={animalEmpty} mode="aspectFit" />
        </View>
      )}

      {/* ===== 笔记卡片列表（分页） ===== */}
      {visible.map((n) => {
        const inReview = n.nextReviewDate !== null
        const long = isLongText(n.text)
        const clamped = long && !expanded[n.id]
        const shownTags = n.tags.slice(0, 2)
        const extraTags = n.tags.length - shownTags.length
        return (
          <SwipeRow key={n.id} onDelete={() => removeNote(n.id)}>
            <View className={`card note-card ${newId === n.id ? 'note-in' : ''}`}>
              {/* 内容区：点按进入编辑；长文折叠 3 行，可展开/收起 */}
              <View className="note-text-zone" onClick={() => openEdit(n)}>
                <Text className={`note-text ${clamped ? 'clamped' : ''}`}>
                  {renderHighlight(n.text, kw)}
                </Text>
                {long && (
                  <Text
                    className="note-expand"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpanded((p) => ({ ...p, [n.id]: !p[n.id] }))
                    }}
                  >
                    {expanded[n.id] ? '收起' : '展开'}
                  </Text>
                )}
              </View>

              {/* 标签 + 日期 + 复习状态：同一行 */}
              <View className="note-meta">
                <View className="note-meta-tags">
                  {shownTags.map((t) => (
                    <Text className="tag" key={t}>
                      {renderHighlight(t, kw)}
                    </Text>
                  ))}
                  {extraTags > 0 && <Text className="tag">+{extraTags}</Text>}
                </View>
                <Text className="note-date">{dateStr(new Date(n.createdAt))}</Text>
                <Text
                  className={`tag review-toggle ${inReview ? 'selected' : ''}`}
                  onClick={() => setReviewOf(n)}
                >
                  {reviewLabel(n)}
                </Text>
              </View>

              {/* 操作行：复制 / 编辑 */}
              <View className="note-actions">
                <Text className="note-act" onClick={() => void copyText(n.text)}>
                  复制
                </Text>
                <Text className="note-act" onClick={() => openEdit(n)}>
                  编辑
                </Text>
              </View>
            </View>
          </SwipeRow>
        )
      })}

      {/* ===== 分页底部 ===== */}
      {filtered.length > 0 && visibleCount < filtered.length && (
        <View className="note-loadmore" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
          <Text>展开更多（还有 {filtered.length - visibleCount} 条）</Text>
        </View>
      )}
      {filtered.length > 0 && visibleCount >= filtered.length && (
        <View className="note-end">
          <Text>到底啦 · 共 {filtered.length} 条</Text>
        </View>
      )}

      {/* ===== 编辑弹层：改内容、改标签 ===== */}
      {editing && (
        <Modal variant="sheet" closeOnMask={false} onClose={() => setEditing(null)}>
          <View className="card-title">
            <Text>编辑笔记</Text>
          </View>
          <View className="field">
            <Textarea
              style={{ height: 160 }}
              value={draftText}
              onInput={(e) => setDraftText(e.detail.value)}
              maxlength={-1}
            />
          </View>
          <View className="field">
            <Text className="sub" style={{ display: 'block', marginBottom: 6 }}>
              标签
            </Text>
            <View className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
              {tagDefs.map((t) => (
                <Text
                  key={t.name}
                  className={`tag ${draftTags.includes(t.name) ? 'selected' : ''}`}
                  onClick={() =>
                    setDraftTags((prev) =>
                      prev.includes(t.name) ? prev.filter((x) => x !== t.name) : [...prev, t.name]
                    )
                  }
                >
                  {t.name}
                </Text>
              ))}
            </View>
          </View>
          <View className="row" style={{ justifyContent: 'flex-end' }}>
            <View className="btn plain small" onClick={() => setEditing(null)}>
              <Text>取消</Text>
            </View>
            <View className="btn small" onClick={saveEdit}>
              <Text>保存</Text>
            </View>
          </View>
        </Modal>
      )}

      {/* ===== 复习日期弹层：快捷档 + 自选日期 + 移出复习池 ===== */}
      {reviewOf && (
        <Modal variant="sheet" onClose={() => setReviewOf(null)}>
          <View className="card-title">
            <Text>复习安排</Text>
          </View>
          {[
            { label: '今天复习', ms: Date.now() },
            { label: '明天复习', ms: Date.now() + DAY_MS },
            { label: '3 天后', ms: Date.now() + 3 * DAY_MS },
            { label: '7 天后', ms: Date.now() + 7 * DAY_MS },
          ].map((opt) => (
            <View className="list-item" key={opt.label} onClick={() => scheduleReview(reviewOf.id, opt.ms)}>
              <Text className="grow">{opt.label}</Text>
              <Icon name="arrow-up" size={16} className="arrow-r" />
            </View>
          ))}
          {/* 自选日期：复用自研日历弹层 */}
          <View className="list-item">
            <Text className="grow" style={{ alignSelf: 'center' }}>
              自选日期
            </Text>
            <DatePicker
              value=""
              placeholder="选择日期"
              compact
              onChange={(ds) => scheduleReview(reviewOf.id, new Date(ds + 'T00:00:00').getTime())}
            />
          </View>
          {reviewOf.nextReviewDate !== null && (
            <View
              className="list-item"
              onClick={() => leaveReview(reviewOf.id)}
            >
              <Text className="grow" style={{ color: 'var(--danger)' }}>
                移出复习池
              </Text>
            </View>
          )}
        </Modal>
      )}
    </View>
  )
}
