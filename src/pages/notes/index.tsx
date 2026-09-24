// 时政收集：随手记素材金句，「时政」标签自动进艾宾浩斯复习池（今日页闪卡）
// 自 PWA pages/Notes.tsx 迁移：textarea → Textarea，tag 按钮为 View
import { useMemo, useState } from 'react'
import { Input, Text, Textarea, View } from '@tarojs/components'
import { useData } from '../../store'
import { uid } from '../../utils/date'
import { firstReviewDate } from '../../utils/review'

const NOTE_TAGS = ['时政', '素材', '心得', '金句', '其他']

export default function Notes() {
  const { data, ready, set } = useData()
  const [text, setText] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState<string | null>(null)

  const add = () => {
    if (!text.trim()) return
    set('notes', (prev) => [
      {
        id: uid(),
        text: text.trim(),
        tags,
        createdAt: Date.now(),
        // 「时政」标签自动进复习池（明天首复习），其他默认不进
        nextReviewDate: tags.includes('时政') ? firstReviewDate() : null,
        reviewStep: 0,
      },
      ...prev,
    ])
    setText('')
    setTags([])
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return data.notes.filter((n) => {
      if (filterTag && !n.tags.includes(filterTag)) return false
      if (!q) return true
      return n.text.toLowerCase().includes(q) || n.tags.some((t) => t.includes(q))
    })
  }, [data.notes, search, filterTag])

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
        <Text>📰 时政收集</Text>
      </View>

      <View className="card">
        <View className="field">
          <Textarea
            style={{ height: 96 }}
            placeholder="粘贴时政新闻、申论素材、看到的好句子…"
            value={text}
            onInput={(e) => setText(e.detail.value)}
            maxlength={-1}
          />
        </View>
        <View className="row" style={{ flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {NOTE_TAGS.map((t) => (
            <Text
              key={t}
              className={`tag ${tags.includes(t) ? 'selected' : ''}`}
              style={{ border: 'none', padding: '4px 12px', fontSize: 13 }}
              onClick={() =>
                setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
              }
            >
              {t}
            </Text>
          ))}
        </View>
        <View className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <View className="btn small" onClick={add}>
            <Text>保存</Text>
          </View>
        </View>
      </View>

      <View className="card" style={{ padding: '8px 14px', marginBottom: 8 }}>
        <Input
          placeholder="搜索记录…"
          value={search}
          onInput={(e) => setSearch(e.detail.value)}
          style={{ border: 'none', padding: '6px 0', borderRadius: 0 }}
        />
        <View className="row" style={{ flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
          <Text
            className={`tag ${filterTag === null ? 'selected' : ''}`}
            style={{ border: 'none', padding: '3px 10px', fontSize: 12 }}
            onClick={() => setFilterTag(null)}
          >
            全部
          </Text>
          {NOTE_TAGS.map((t) => (
            <Text
              key={t}
              className={`tag ${filterTag === t ? 'selected' : ''}`}
              style={{ border: 'none', padding: '3px 10px', fontSize: 12 }}
              onClick={() => setFilterTag(t === filterTag ? null : t)}
            >
              {t}
            </Text>
          ))}
        </View>
      </View>

      {filtered.length === 0 && (
        <View className="empty">
          <Text>{search || filterTag ? '没有匹配的记录' : '还没有记录'}</Text>
        </View>
      )}
      {filtered.map((n) => {
        const inReview = n.nextReviewDate !== null
        const daysLeft = n.nextReviewDate
          ? Math.max(0, Math.ceil((n.nextReviewDate - Date.now()) / 86400000))
          : 0
        return (
          <View className="card" key={n.id}>
            <Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{n.text}</Text>
            <View className="row-between" style={{ marginTop: 8 }}>
              <View className="row" style={{ flexWrap: 'wrap' }}>
                {n.tags.map((t) => (
                  <Text className="tag" key={t}>
                    {t}
                  </Text>
                ))}
                <Text className="sub" style={{ fontSize: 11 }}>
                  {new Date(n.createdAt).toLocaleDateString('zh-CN')}
                </Text>
              </View>
              <View
                className="icon-btn"
                onClick={() => set('notes', (prev) => prev.filter((x) => x.id !== n.id))}
              >
                <Text>🗑</Text>
              </View>
            </View>
            <View style={{ marginTop: 6 }}>
              <Text
                className={`tag review-toggle ${inReview ? 'selected' : ''}`}
                onClick={() =>
                  set('notes', (prev) =>
                    prev.map((x) =>
                      x.id === n.id
                        ? {
                            ...x,
                            nextReviewDate: inReview ? null : firstReviewDate(),
                            reviewStep: inReview ? x.reviewStep : 0,
                          }
                        : x
                    )
                  )
                }
              >
                {inReview
                  ? `🧠 ${n.reviewStep >= 5 ? '已掌握' : daysLeft === 0 ? '今天复习' : `${daysLeft} 天后复习`}`
                  : '🧠 加入复习'}
              </Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}
