// 心情记录：仪表盘（概览 + 趋势列图 + 分布 + 低落回顾 + 时间线），顶部 周/月/年 切换
// 自 PWA pages/MoodHistory.tsx 迁移：SVG 折线 → 分档列图（WXML 无 svg）：
// 周=7 列（高度=心情档）、月=30 细列、年=12 个月均值列；其余统计区纯 View
import { useMemo, useState } from 'react'
import { Text, View } from '@tarojs/components'
import { useData } from '../../store'
import { addDays, todayStr } from '../../utils/date'
import { MOOD_LABELS } from '../../utils/rewards'

const MOODS = ['😫', '😞', '😐', '🙂', '😄']
const MOOD_COLORS = ['#ef4444', '#f97316', '#fbbf24', '#4ade80', '#22c55e']
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

type MoodRange = 'week' | 'month' | 'year'
type MoodDay = { d: string; m?: { mood: number; note?: string } }

const RANGE_CFG: Record<MoodRange, { label: string; days: number; cmp: string }> = {
  week: { label: '周', days: 7, cmp: '较上周' },
  month: { label: '月', days: 30, cmp: '较上月' },
  year: { label: '年', days: 365, cmp: '较去年' },
}

const avgOf = (arr: MoodDay[]) => {
  const xs = arr.filter((x) => x.m)
  return xs.length ? xs.reduce((s, x) => s + x.m!.mood, 0) / xs.length : 0
}

/** 单日心情行：emoji + 日期周几 + 档位 + 当天话语 */
function MoodRow({ d, m, today }: { d: string; m: { mood: number; note?: string }; today: string }) {
  const dt = new Date(d + 'T00:00:00')
  const weekday = WEEKDAYS[dt.getDay()]
  return (
    <View className="mood-entry">
      <Text className="me-emoji">{MOODS[m.mood - 1]}</Text>
      <View className="grow">
        <View className="row-between">
          <Text className="me-date">
            {d === today ? '今天' : `${Number(d.slice(5, 7))}/${Number(d.slice(8))}`} · 周{weekday}
          </Text>
          <Text className="sub">{MOOD_LABELS[m.mood - 1]}</Text>
        </View>
        {m.note && <Text className="me-note">「{m.note}」</Text>}
      </View>
    </View>
  )
}

/** 趋势列图：天级（周/月）列高=心情档，颜色=档位色，缺记=底部灰点 */
function MoodColumns({ days, range, today }: { days: MoodDay[]; range: MoodRange; today: string }) {
  const thin = range === 'month'
  return (
    <View>
      <View style={{ display: 'flex', alignItems: 'flex-end', height: 92 }}>
        {days.map(({ d, m }) => {
          const isToday = d === today
          if (!m) {
            // 无记录：底部 2px 灰点示意
            return (
              <View
                key={d}
                style={{
                  flex: 1,
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}
              >
                <View
                  style={{
                    width: thin ? 3 : 8,
                    height: 2,
                    borderRadius: 1,
                    background: 'var(--text-sub)',
                    opacity: 0.4,
                  }}
                />
              </View>
            )
          }
          const h = Math.max(6, (m.mood / 5) * 76)
          return (
            <View
              key={d}
              style={{
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {!thin && (
                <Text style={{ fontSize: 10, marginBottom: 2 }}>{MOODS[m.mood - 1]}</Text>
              )}
              <View
                style={{
                  width: thin ? 4 : '58%',
                  height: h,
                  borderRadius: 3,
                  background: MOOD_COLORS[m.mood - 1],
                  opacity: isToday ? 1 : 0.85,
                  boxShadow: isToday ? '0 0 0 2px rgba(99,102,241,0.45)' : 'none',
                }}
              />
            </View>
          )
        })}
      </View>
      {/* X 轴刻度：周=每天 M/D；月=每 5 天；年=每月 */}
      <View style={{ display: 'flex', marginTop: 4 }}>
        {days.map(({ d }, i) => {
          const show =
            range === 'week' ||
            (range === 'month' && (i === 0 || (i + 1) % 5 === 0)) ||
            (range === 'year' && d.endsWith('-01'))
          return (
            <Text
              key={d}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 8,
                color: 'var(--text-sub)',
                visibility: show ? 'visible' : 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {range === 'year'
                ? `${Number(d.slice(5, 7))}月`
                : range === 'week'
                  ? `${Number(d.slice(5, 7))}/${Number(d.slice(8))}`
                  : String(Number(d.slice(8)))}
            </Text>
          )
        })}
      </View>
    </View>
  )
}

export default function MoodHistory() {
  const { data, ready } = useData()
  const today = todayStr()
  const [range, setRange] = useState<MoodRange>('week')
  const { days: dayCount, cmp } = RANGE_CFG[range]

  // 本周期 + 上一个等长周期（用于对比）
  const win = useMemo<MoodDay[]>(
    () =>
      Array.from({ length: dayCount }, (_, i) => {
        const d = addDays(today, i - dayCount + 1)
        return { d, m: data.moods[d] }
      }),
    [data.moods, today, dayCount]
  )
  const prevWin = useMemo<MoodDay[]>(
    () =>
      Array.from({ length: dayCount }, (_, i) => {
        const d = addDays(today, i - 2 * dayCount + 1)
        return { d, m: data.moods[d] }
      }),
    [data.moods, today, dayCount]
  )

  const entries = useMemo(() => win.filter((x) => x.m).slice().reverse(), [win]) // 最新在前

  // ---- 概览：周期均值 + 对比上一周期 ----
  const avg = avgOf(win)
  const avgPrev = avgOf(prevWin)
  const diff = avg && avgPrev ? avg - avgPrev : 0
  const trend: 'up' | 'down' | 'flat' = diff > 0.05 ? 'up' : diff < -0.05 ? 'down' : 'flat'
  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'
  const trendWord = trend === 'up' ? '好转' : trend === 'down' ? '回落' : '持平'
  const goodDays = win.filter((x) => (x.m?.mood ?? 0) >= 4).length
  const recorded = entries.length

  // ---- 分布 + 最常出现 ----
  const dist = MOOD_LABELS.map((_, i) => win.filter((x) => x.m?.mood === i + 1).length)
  const topIdx = dist.indexOf(Math.max(...dist))

  // 年档：365 列太密 → 聚合为 12 个月（月内均值，无记录月跳过）
  const monthCols = useMemo<MoodDay[]>(() => {
    if (range !== 'year') return win
    const byMonth = new Map<string, number[]>()
    for (const { d, m } of win) {
      if (!m) continue
      const key = d.slice(0, 7)
      const arr = byMonth.get(key) ?? []
      arr.push(m.mood)
      byMonth.set(key, arr)
    }
    return [...byMonth.entries()].map(([ym, arr]) => ({
      d: `${ym}-01`,
      m: { mood: Math.round(arr.reduce((s, x) => s + x, 0) / arr.length) },
    }))
  }, [range, win])

  // ---- 低落日回顾（mood ≤ 2）----
  const lowDays = entries.filter((x) => (x.m?.mood ?? 5) <= 2)
  const emptyTip = '还没有心情记录，去「打卡」页记一笔吧'

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
      {/* 周 / 月 / 年 切换 */}
      <View className="seg-tabs" style={{ marginBottom: 12 }}>
        {(Object.keys(RANGE_CFG) as MoodRange[]).map((k) => (
          <View
            key={k}
            className={`seg-tab ${range === k ? 'active' : ''}`}
            onClick={() => setRange(k)}
          >
            <Text>{RANGE_CFG[k].label}</Text>
          </View>
        ))}
      </View>

      {/* 心情概览 */}
      <View className="card">
        <View className="card-title">
          <Text>🌈 心情概览</Text>
          <Text className="sub">
            近{RANGE_CFG[range].label} · {recorded} 天有记录
          </Text>
        </View>
        <View className="row-between">
          <View className="mood-avg">
            <Text className="big">{avg ? MOODS[Math.round(avg) - 1] : '·'}</Text>
            <Text className="sub">
              {avg ? `平均 ${MOOD_LABELS[Math.round(avg) - 1]} ${avg.toFixed(1)}` : '暂无'}
            </Text>
          </View>
          <View className="mood-avg">
            <Text className={`big mood-trend-${avg && avgPrev ? trend : 'flat'}`}>
              {avg && avgPrev ? trendArrow : '·'}
            </Text>
            <Text className="sub">
              {avg && avgPrev
                ? `${cmp} ${trend === 'flat' ? '持平' : `${diff > 0 ? '+' : ''}${diff.toFixed(1)} ${trendWord}`}`
                : '暂无对比'}
            </Text>
          </View>
          <View className="mood-avg">
            <Text className="big">{goodDays}</Text>
            <Text className="sub">天心情不错</Text>
          </View>
        </View>
      </View>

      {/* 趋势列图：列高=心情档，颜色=档位色；缺记=底部灰点 */}
      <View className="card">
        <View className="card-title">
          <Text>📈 心情趋势</Text>
          <Text className="sub">列高=当天心情，灰点=无记录</Text>
        </View>
        {entries.length === 0 ? (
          <Text className="empty">{emptyTip}</Text>
        ) : (
          <MoodColumns days={monthCols} range={range} today={today} />
        )}
      </View>

      {/* 心情分布 */}
      <View className="card">
        <View className="card-title">
          <Text>📊 心情分布</Text>
          <Text className="sub">
            {recorded ? `最常出现：${MOODS[topIdx]} ${MOOD_LABELS[topIdx]}` : `近${RANGE_CFG[range].label}`}
          </Text>
        </View>
        {MOOD_LABELS.map((label, i) => {
          const cnt = dist[i]
          const pct = recorded ? (cnt / recorded) * 100 : 0
          return (
            <View className="mood-dist-row" key={label}>
              <Text className="md-emoji">{MOODS[i]}</Text>
              <Text className="md-label">{label}</Text>
              <View className="md-bar">
                <View className="md-fill" style={{ width: `${pct}%`, background: MOOD_COLORS[i] }} />
              </View>
              <Text className="md-count">{cnt} 天</Text>
            </View>
          )
        })}
      </View>

      {/* 低落日回顾 */}
      <View className="card">
        <View className="card-title">
          <Text>🫂 低落日回顾</Text>
          <Text className="sub">{lowDays.length} 天</Text>
        </View>
        {lowDays.length === 0 ? (
          <Text className="empty">
            {recorded ? `近${RANGE_CFG[range].label}没有低落记录，状态很稳 👍` : emptyTip}
          </Text>
        ) : (
          <>
            <View className="mood-scroll">
              {lowDays.map(({ d, m }) => (
                <MoodRow key={d} d={d} m={m!} today={today} />
              ))}
            </View>
            <Text className="sub" style={{ fontSize: 11, marginTop: 6 }}>
              那几天都过来了，翻篇继续 💪
            </Text>
          </>
        )}
      </View>

      {/* 心情时间线：每天一条（心情 + 当天话语） */}
      <View className="card">
        <View className="card-title">
          <Text>📖 心情时间线</Text>
          <Text className="sub">每天一条 · 上下滑动</Text>
        </View>
        {entries.length === 0 ? (
          <Text className="empty">{emptyTip}</Text>
        ) : (
          <View className="mood-scroll">
            {entries.map(({ d, m }) => (
              <MoodRow key={d} d={d} m={m!} today={today} />
            ))}
          </View>
        )}
      </View>
    </View>
  )
}
