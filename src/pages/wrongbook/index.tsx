// 错题本：喝水常识判断错题独立成页（自「生活」宫格进入）
// 数据域 quizBook：统计 + 错题列表 + 单题管理
// v2：问/答/解分段卡片（答案解析打码揭晓）· 每页 10 道翻页 · 管理模式批量处理 · 刷题练习（独立子页 practice）
// 到期错题仍会自动进入「今日」页复习队列（FSRS 简化版），本页负责浏览、练习与管理
import { useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { Image, Text, Textarea, View } from '@tarojs/components'
import Icon from '../../components/Icon'
import Modal from '../../components/Modal'
import SwipeRow from '../../components/SwipeRow'
import animalEmpty from '../../assets/images/小狗跳跃.png'
import { useData } from '../../store'
import { quizById } from '../../constants/water-quiz'
import { firstReviewDate, reviewPriority } from '../../utils/review'
import { settleQuizWrong, willGraduate } from '../../utils/quizBook'
import { dateStr } from '../../utils/date'
import { appConfirm } from '../../components/ConfirmDialog'
import { showToast } from '../../utils/platform'
import type { QuizWrong } from '../../types'

type Filter = 'all' | 'due' | 'mastered'

/** 每页展示条数：页内竖滑浏览，翻页切换下一批（不自动加载） */
const PAGE_SIZE = 10

/** 错因标签预设 */
const TAG_PRESETS = ['粗心', '概念不清', '计算错误', '审题偏差', '完全不会']

export default function WrongBook() {
  const { data, ready, set } = useData()
  const [filter, setFilter] = useState<Filter>('all')
  const [page, setPage] = useState(1)
  const [manage, setManage] = useState(false)
  const [checked, setChecked] = useState<number[]>([])
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  const [sheet, setSheet] = useState<{ type: 'more' | 'tags' | 'memo'; quizId: number } | null>(null)
  const [tagDraft, setTagDraft] = useState<string[]>([])
  const [memoDraft, setMemoDraft] = useState('')

  const wrongs = data.quizBook.wrongs
  const dueCount = wrongs.filter((w) => w.nextReviewDate !== null).length
  const masteredCount = wrongs.length - dueCount

  const filtered = useMemo(() => {
    return wrongs.filter((w) => {
      if (filter === 'due') return w.nextReviewDate !== null
      if (filter === 'mastered') return w.nextReviewDate === null
      return true
    })
  }, [wrongs, filter])

  // 翻页切片：每页 PAGE_SIZE 道
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  /** 切筛选时回到第一页 */
  const changeFilter = (k: Filter) => {
    setFilter(k)
    setPage(1)
  }

  /** 翻页并回到顶部 */
  const gotoPage = (p: number) => {
    const next = Math.min(totalPages, Math.max(1, p))
    if (next === page) return
    setPage(next)
    Taro.pageScrollTo({ scrollTop: 0, duration: 200 })
  }

  // 列表变短（如练习毕业移出待复习）时把页码收回有效范围，避免尾页空白
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const patchWrong = (quizId: number, patch: Partial<QuizWrong>) =>
    set('quizBook', (prev) => ({
      ...prev,
      wrongs: prev.wrongs.map((w) => (w.quizId === quizId ? { ...w, ...patch } : w)),
    }))

  /**
   * 答题结算（卡片自评 / 练习页共用 utils/quizBook 同一套规则）：
   * 对 → FSRS 评分后排期后移 + 连对 +1（连对 3 次毕业）；错 → 重排 + 错次 +1 + 连对清零。
   * 返回该题是否毕业。
   */
  const settleWrong = (quizId: number, correct: boolean): boolean => {
    const cur = wrongs.find((w) => w.quizId === quizId)
    if (!cur) return false
    const graduated = willGraduate(cur, correct)
    set('quizBook', (prev) => settleQuizWrong(prev, quizId, correct))
    return graduated
  }

  /** 卡片自评（做对了 / 又错了）：结算后重新打码 */
  const selfRate = (quizId: number, correct: boolean) => {
    const graduated = settleWrong(quizId, correct)
    setRevealed((prev) => ({ ...prev, [quizId]: false }))
    showToast(graduated ? '连续做对 3 次，已自动标记掌握' : correct ? '已记录，复习时间后移' : '已记录，明天重新排期')
  }

  /** 左滑/更多菜单移除单题：不可逆操作二次确认 */
  const removeWrong = (quizId: number) => {
    void appConfirm('移除这道错题？', '移除后不再进入复习队列', {
      danger: true,
      confirmText: '移除',
    }).then((ok) => {
      if (!ok) return
      set('quizBook', (prev) => ({
        ...prev,
        wrongs: prev.wrongs.filter((w) => w.quizId !== quizId),
      }))
      setChecked((prev) => prev.filter((id) => id !== quizId))
      setSheet(null)
      showToast('已移除')
    })
  }

  // ---- 管理模式：勾选 + 批量操作 ----
  const toggleCheck = (quizId: number) =>
    setChecked((prev) =>
      prev.includes(quizId) ? prev.filter((id) => id !== quizId) : [...prev, quizId]
    )

  const allChecked = filtered.length > 0 && filtered.every((w) => checked.includes(w.quizId))

  const toggleAll = () =>
    setChecked(allChecked ? [] : Array.from(new Set([...checked, ...filtered.map((w) => w.quizId)])))

  const bulkMaster = () => {
    if (checked.length === 0) return
    set('quizBook', (prev) => ({
      ...prev,
      wrongs: prev.wrongs.map((w) => (checked.includes(w.quizId) ? { ...w, nextReviewDate: null } : w)),
    }))
    setChecked([])
    showToast('已批量标记掌握')
  }

  const bulkDelete = () => {
    if (checked.length === 0) return
    void appConfirm(`删除这 ${checked.length} 道错题？`, '删除后不再进入复习队列', {
      danger: true,
      confirmText: '删除',
    }).then((ok) => {
      if (!ok) return
      set('quizBook', (prev) => ({
        ...prev,
        wrongs: prev.wrongs.filter((w) => !checked.includes(w.quizId)),
      }))
      setChecked([])
      showToast('已删除')
    })
  }

  // ---- 刷题入口：到期优先，无到期则巩固全部待复习；跳独立练习子页（返回键先回本页） ----
  const startPractice = (ids?: number[]) => {
    const queue = wrongs
      .filter((w) => w.nextReviewDate !== null)
      .sort((a, b) => reviewPriority(b, dateStr(new Date())) - reviewPriority(a, dateStr(new Date())))
      .map((w) => w.quizId)
    const list = ids ?? (queue.length > 0 ? queue : wrongs.map((w) => w.quizId))
    if (list.length === 0) {
      showToast('还没有错题可以练习')
      return
    }
    Taro.navigateTo({ url: `/pages/wrongbook/practice?ids=${list.join(',')}` })
  }

  // ---- 更多菜单 / 标签 / 笔记 ----
  const openSheet = (type: 'more' | 'tags' | 'memo', w: QuizWrong) => {
    if (type === 'tags') setTagDraft(w.tags ?? [])
    if (type === 'memo') setMemoDraft(w.memo ?? '')
    setSheet({ type, quizId: w.quizId })
  }

  const saveTags = () => {
    if (sheet) patchWrong(sheet.quizId, { tags: tagDraft })
    setSheet(null)
    showToast('标签已保存')
  }

  const saveMemo = () => {
    if (sheet) patchWrong(sheet.quizId, { memo: memoDraft.trim() })
    setSheet(null)
    showToast('笔记已保存')
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
        <Icon name="book" size={16} gap={4} />
        <Text>错题本</Text>
      </View>

      {/* 统计卡：错题池 / 待复习 / 已掌握 */}
      <View className="card">
        <View className="stat-row">
          <View className="stat">
            <Text className="stat-num">{wrongs.length}</Text>
            <Text className="stat-label">错题池</Text>
          </View>
          <View className="stat">
            <Text className="stat-num">{dueCount}</Text>
            <Text className="stat-label">待复习</Text>
          </View>
          <View className="stat">
            <Text className="stat-num">{masteredCount}</Text>
            <Text className="stat-label">已掌握</Text>
          </View>
        </View>
      </View>

      {/* 刷题 CTA */}
      {wrongs.length > 0 && (
        <View
          className="btn small emoji-cta"
          style={{ marginBottom: 10 }}
          onClick={() => startPractice()}
        >
          <View className="emoji-badge sm">
            <Text className="emoji">🧠</Text>
          </View>
          <Text>开始刷题（{dueCount > 0 ? `共 ${dueCount} 道待复习` : '巩固全部错题'}）</Text>
        </View>
      )}

      {/* 筛选 chips + 管理开关 */}
      <View className="row-between" style={{ marginBottom: 10 }}>
        <View className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
          {(
            [
              ['all', '全部'],
              ['due', '待复习'],
              ['mastered', '已掌握'],
            ] as [Filter, string][]
          ).map(([k, label]) => (
            <Text
              key={k}
              className={`tag ${filter === k ? 'selected' : ''}`}
              onClick={() => changeFilter(k)}
            >
              {label}
            </Text>
          ))}
        </View>
        {wrongs.length > 0 && (
          <Text
            className={`tag ${manage ? 'selected' : ''}`}
            onClick={() => {
              setManage(!manage)
              setChecked([])
            }}
          >
            {manage ? '完成' : '⚙ 管理'}
          </Text>
        )}
      </View>

      {wrongs.length === 0 ? (
        <View className="card state-card">
          <View className="emoji-badge">
            <Text className="emoji">💧</Text>
          </View>
          <Text className="empty">
            还没有错题。在「今日」页喝水答题答错时会自动记入这里，并按记忆曲线安排复习。
          </Text>
          <Image className="state-animal" src={animalEmpty} mode="aspectFit" />
        </View>
      ) : filtered.length === 0 ? (
        <View className="empty">
          <Text>该分类下没有错题</Text>
        </View>
      ) : (
        pageItems.map((w) => {
          const q = quizById(w.quizId)
          if (!q) return null
          const mastered = w.nextReviewDate === null
          const shown = !!revealed[w.quizId]
          const isChecked = checked.includes(w.quizId)
          return (
            <SwipeRow key={w.quizId} onDelete={manage ? undefined : () => removeWrong(w.quizId)}>
              <View
                className={`card wb-card${manage ? ' manage' : ''}${isChecked ? ' checked' : ''}`}
                onClick={manage ? () => toggleCheck(w.quizId) : undefined}
              >
                {manage && (
                  <View className={`wb-check${isChecked ? ' on' : ''}`}>
                    {isChecked && <Icon name="check" size={12} color="#fff" />}
                  </View>
                )}

                {/* 状态行 */}
                <View className="row-between" style={{ marginBottom: 6 }}>
                  <View className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
                    <View className={`chip ${mastered ? 'success' : 'warn'}`}>
                      <Icon name={mastered ? 'check' : 'repeat'} size={12} gap={4} />
                      <Text>{mastered ? '已掌握' : '待复习'}</Text>
                    </View>
                    {(w.correctStreak || 0) > 0 && !mastered && (
                      <View className="chip">
                        <Text>连对 {w.correctStreak} 次</Text>
                      </View>
                    )}
                  </View>
                  <Text className="sub">答错 {w.wrongCount} 次</Text>
                </View>

                {/* 错因标签 */}
                {(w.tags?.length ?? 0) > 0 && (
                  <View className="row" style={{ flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                    {w.tags!.map((t) => (
                      <Text key={t} className="chip plain" style={{ fontSize: 'var(--fs-1)' }}>
                        {t}
                      </Text>
                    ))}
                  </View>
                )}

                {/* 问题 */}
                <View className="wb-seg">
                  <View className="wb-seg-h">
                    <View className="wb-seg-ic q">
                      <Text>问</Text>
                    </View>
                    <Text className="wb-seg-t">{q.q}</Text>
                  </View>
                </View>

                {/* 答案解析：默认打码，点遮罩揭晓 */}
                {!shown ? (
                  <View
                    className="wb-mask"
                    onClick={manage ? undefined : () => setRevealed((prev) => ({ ...prev, [w.quizId]: true }))}
                  >
                    <Icon name="lock" size={13} gap={4} />
                    <Text>先自己想一想，点这里揭晓答案与解析</Text>
                  </View>
                ) : (
                  <View className="wb-rise">
                    <View className="wb-div" />
                    <View className="wb-seg">
                      <View className="wb-seg-h">
                        <View className="wb-seg-ic a">
                          <Icon name="check" size={10} color="#fff" />
                        </View>
                        <Text className="wb-seg-l">答案</Text>
                      </View>
                      <Text className="wb-seg-ans">{q.options[q.answer]}</Text>
                    </View>
                    <View className="wb-div" />
                    <View className="wb-seg">
                      <View className="wb-seg-h">
                        <View className="wb-seg-ic e">
                          <Text>解</Text>
                        </View>
                        <Text className="wb-seg-l">解析</Text>
                      </View>
                      <Text className="wb-seg-exp">{q.explain}</Text>
                    </View>

                    {/* 自评双按钮 */}
                    <View className="wb-acts">
                      <View className="btn small" onClick={() => selfRate(w.quizId, true)}>
                        <Icon name="check" size={14} gap={4} color="#fff" />
                        <Text>做对了</Text>
                      </View>
                      <View className="btn ghost small" onClick={() => selfRate(w.quizId, false)}>
                        <Icon name="x" size={14} gap={4} />
                        <Text>又错了</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* 次要按钮行 */}
                <View className="wb-acts-sub">
                  <Text className="wb-act-text" onClick={() => startPractice([w.quizId])}>
                    重做此题
                  </Text>
                  <Text className="wb-act-text" onClick={() => openSheet('memo', w)}>
                    {w.memo ? '改笔记' : '加笔记'}
                  </Text>
                  <Text className="wb-act-text" onClick={() => openSheet('tags', w)}>
                    标签
                  </Text>
                  <Text className="wb-act-text" onClick={() => openSheet('more', w)}>
                    更多
                  </Text>
                </View>

                {/* 笔记摘要 */}
                {!!w.memo && (
                  <Text className="sub" style={{ display: 'block', marginTop: 6 }}>
                    📝 {w.memo}
                  </Text>
                )}
              </View>
            </SwipeRow>
          )
        })
      )}

      {/* 底部翻页条：页内竖滑浏览，翻页看下一批 */}
      {!manage && filtered.length > PAGE_SIZE && (
        <View className="wb-pager">
          <View
            className={`wb-pager-btn${page <= 1 ? ' disabled' : ''}`}
            onClick={() => gotoPage(page - 1)}
          >
            ‹ 上一页
          </View>
          <Text className="wb-pager-info">
            第 {page} / {totalPages} 页 · 本页 {pageItems.length} 道 · 共 {filtered.length} 道
          </Text>
          <View
            className={`wb-pager-btn${page >= totalPages ? ' disabled' : ''}`}
            onClick={() => gotoPage(page + 1)}
          >
            下一页 ›
          </View>
        </View>
      )}

      {/* 管理模式底部批量操作栏 */}
      {manage && (
        <View className="wb-manage-bar">
          <Text className="wb-act-text" onClick={toggleAll}>
            {allChecked ? '取消全选' : '全选'}
          </Text>
          <View className="row" style={{ gap: 8 }}>
            <View className="btn ghost small" onClick={bulkMaster}>
              标记掌握{checked.length > 0 ? ` (${checked.length})` : ''}
            </View>
            <View className="btn danger small" onClick={bulkDelete}>
              删除{checked.length > 0 ? ` (${checked.length})` : ''}
            </View>
          </View>
        </View>
      )}
      {manage && <View style={{ height: 56 }} />}

      {/* 更多菜单 */}
      {sheet?.type === 'more' &&
        (() => {
          const w = wrongs.find((x) => x.quizId === sheet.quizId)
          if (!w) return null
          const mastered = w.nextReviewDate === null
          return (
            <Modal variant="sheet" onClose={() => setSheet(null)}>
              <Text className="wb-sheet-title">更多操作</Text>
              <View
                className="wb-sheet-item"
                onClick={() => {
                  patchWrong(w.quizId, mastered ? { nextReviewDate: firstReviewDate() } : { nextReviewDate: null })
                  setSheet(null)
                  showToast(mastered ? '已重新加入复习队列' : '已标记为掌握')
                }}
              >
                {mastered ? '重新加入复习队列' : '标记已掌握'}
              </View>
              <View className="wb-sheet-item danger" onClick={() => removeWrong(w.quizId)}>
                删除这道错题
              </View>
              <View className="wb-sheet-item" onClick={() => setSheet(null)}>
                取消
              </View>
            </Modal>
          )
        })()}

      {/* 标签弹层 */}
      {sheet?.type === 'tags' && (
        <Modal variant="sheet" onClose={() => setSheet(null)}>
          <Text className="wb-sheet-title">错因标签（可多选）</Text>
          <View className="wb-tag-grid">
            {TAG_PRESETS.map((t) => (
              <Text
                key={t}
                className={`tag ${tagDraft.includes(t) ? 'selected' : ''}`}
                onClick={() =>
                  setTagDraft((prev) =>
                    prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                  )
                }
              >
                {t}
              </Text>
            ))}
          </View>
          <View className="btn small" onClick={saveTags}>
            保存
          </View>
        </Modal>
      )}

      {/* 笔记弹层 */}
      {sheet?.type === 'memo' && (
        <Modal variant="sheet" onClose={() => setSheet(null)}>
          <Text className="wb-sheet-title">我的笔记</Text>
          <Textarea
            className="wb-memo-input"
            value={memoDraft}
            placeholder="记下这道题为什么错、下次怎么避免…"
            maxlength={200}
            onInput={(e) => setMemoDraft(e.detail.value)}
          />
          <View className="btn small" onClick={saveMemo}>
            保存
          </View>
        </Modal>
      )}
    </View>
  )
}
