// 心情记录：仪表盘（概览 + 趋势列图 + 分布 + 低落回顾 + 时间线），顶部 周/月/年 切换
// 自 PWA pages/MoodHistory.tsx 迁移：SVG 折线 → 分档列图（WXML 无 svg）：
// 周=7 列（高度=心情档）、月=30 细列、年=12 个月均值列；其余统计区纯 View
import { useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { Image, Text, View } from '@tarojs/components'
import Icon from '../../components/Icon'
import animalEmpty from '../../assets/images/害羞.png'
import { useData } from '../../store'
import { addDays, dateStr, todayStr } from '../../utils/date'
import { MOOD_LABELS } from '../../utils/rewards'

const MOODS = ['😫', '😞', '😐', '🙂', '😄']
// 心情 5 档暖度递进（计划书 §2.1 例外）：由红到绿
const MOOD_COLORS = ['#d95f4c', '#e79b53', '#e3b448', '#8ab062', '#4d7c5f']
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

type MoodRange = 'week' | 'month' | 'year'
type MoodDay = { d: string; m?: { mood: number; note?: string } }

const RANGE_CFG: Record<MoodRange, { label: string; cmp: string }> = {
  week: { label: '周', cmp: '较上周' },
  month: { label: '月', cmp: '较上月' },
  year: { label: '年', cmp: '较去年' },
}

const avgOf = (arr: MoodDay[]) => {
  const xs = arr.filter((x) => x.m)
  return xs.length ? xs.reduce((s, x) => s + x.m!.mood, 0) / xs.length : 0
}

/** 构建某自然周期（周/月/年）的按日序列；offset 0=当前，负数=往前 */
function buildDays(
  range: MoodRange,
  offset: number,
  moods: Record<string, { mood: number; note?: string }>,
  today: string
): MoodDay[] {
  if (range === 'week') {
    const now = new Date(today + 'T00:00:00')
    const monday = addDays(today, -((now.getDay() + 6) % 7))
    const start = addDays(monday, offset * 7)
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(start, i)
      return { d, m: moods[d] }
    })
  }
  if (range === 'month') {
    const base = new Date(today + 'T00:00:00')
    base.setDate(1)
    base.setMonth(base.getMonth() + offset)
    const y = base.getFullYear()
    const m = base.getMonth()
    const dim = new Date(y, m + 1, 0).getDate()
    return Array.from({ length: dim }, (_, i) => {
      const d = dateStr(new Date(y, m, i + 1))
      return { d, m: moods[d] }
    })
  }
  // 年：全年按日（闰年 366 天）
  const y = new Date(today + 'T00:00:00').getFullYear() + offset
  const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
  const daysInYear = leap ? 366 : 365
  return Array.from({ length: daysInYear }, (_, i) => {
    const d = dateStr(new Date(y, 0, i + 1))
    return { d, m: moods[d] }
  })
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

/** 空态：卡通陪伴 + 可点去「打卡」页记一笔 */
function MoodEmpty() {
  return (
    <View className="state-card">
      <View className="emoji-badge">
        <Text className="emoji">🌈</Text>
      </View>
      <Text className="empty">还没有心情记录，去「打卡」页记一笔吧</Text>
      <View className="btn small" onClick={() => Taro.switchTab({ url: '/pages/checkin/index' })}>
        <Text>去「打卡」页</Text>
      </View>
      <Image className="state-animal" src={animalEmpty} mode="aspectFit" />
    </View>
  )
}

/** 趋势列图：天级（周/月）列高=心情档，颜色=档位色，缺记=底部灰点 */
function MoodColumns({ days, range, today }: { days: MoodDay[]; range: MoodRange; today: string }) {
  const thin = range === 'month'
  return (
    <View>
      <View style={{ display: 'flex', alignItems: 'flex-end', height: 110 }}>
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
                    borderRadius: 2,
                    background: 'var(--text-sub)',
                    opacity: 0.4,
                  }}
                />
              </View>
            )
          }
          const h = Math.max(6, (m.mood / 5) * 86)
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
                <Text style={{ fontSize: 18, marginBottom: 2 }}>{MOODS[m.mood - 1]}</Text>
              )}
              <View
                style={{
                  width: thin ? 6 : '58%',
                  height: h,
                  borderRadius: 2,
                  background: MOOD_COLORS[m.mood - 1],
                  opacity: isToday ? 1 : 0.85,
                  boxShadow: isToday ? '0 0 0 2px var(--primary)' : 'none',
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
                fontSize: 12,
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
  // 自然周期 + ‹› 前后翻（与打卡热力图一致，不能翻到未来）
  const [weekOffset, setWeekOffset] = useState(0)
  const [monthOffset, setMonthOffset] = useState(0)
  const [yearOffset, setYearOffset] = useState(0)
  const { cmp } = RANGE_CFG[range]

  const offset = range === 'week' ? weekOffset : range === 'month' ? monthOffset : yearOffset

  // 当前自然周期与上一周期，均为天级序列
  const win = useMemo<MoodDay[]>(
    () => buildDays(range, offset, data.moods, today),
    [range, offset, data.moods, today]
  )
  const prevWin = useMemo<MoodDay[]>(
    () => buildDays(range, offset - 1, data.moods, today),
    [range, offset, data.moods, today]
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

  // ---- 导航标题 + 前后翻 ----
  const periodLabel = useMemo(() => {
    const now = new Date(today + 'T00:00:00')
    if (range === 'week') {
      const monday = addDays(today, -((now.getDay() + 6) % 7))
      const start = addDays(monday, weekOffset * 7)
      return `${start.slice(5)} ~ ${addDays(start, 6).slice(5)}`
    }
    if (range === 'month') {
      const base = new Date(today + 'T00:00:00')
      base.setDate(1)
      base.setMonth(base.getMonth() + monthOffset)
      return `${base.getFullYear()} 年 ${base.getMonth() + 1} 月`
    }
    return `${now.getFullYear() + yearOffset} 年`
  }, [range, weekOffset, monthOffset, yearOffset, today])

  const goPrev = () => {
    if (range === 'week') setWeekOffset((o) => o - 1)
    else if (range === 'month') setMonthOffset((o) => o - 1)
    else setYearOffset((o) => o - 1)
  }
  const goNext = () => {
    if (offset >= 0) return
    if (range === 'week') setWeekOffset((o) => o + 1)
    else if (range === 'month') setMonthOffset((o) => o + 1)
    else setYearOffset((o) => o + 1)
  }

  // 年档：全年按日太密 → 聚合为固定 12 个月（月内均值，空月缺记）
  const monthCols = useMemo<MoodDay[]>(() => {
    if (range !== 'year') return win
    const year = win[0]?.d.slice(0, 4) ?? String(new Date(today + 'T00:00:00').getFullYear() + yearOffset)
    const byMonth = new Map<string, number[]>()
    for (const { d, m } of win) {
      if (!m) continue
      const key = d.slice(0, 7)
      const arr = byMonth.get(key) ?? []
      arr.push(m.mood)
      byMonth.set(key, arr)
    }
    return Array.from({ length: 12 }, (_, i) => {
      const ym = `${year}-${String(i + 1).padStart(2, '0')}`
      const arr = byMonth.get(ym)
      return arr
        ? { d: `${ym}-01`, m: { mood: Math.round(arr.reduce((s, x) => s + x, 0) / arr.length) } }
        : { d: `${ym}-01` }
    })
  }, [range, win, today, yearOffset])

  // ---- 低落日回顾（mood ≤ 2）----
  const lowDays = entries.filter((x) => (x.m?.mood ?? 5) <= 2)

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

      {/* 日期导航：‹ 标题 ›（不能翻到未来） */}
      <View className="heat-nav">
        <View className="heat-nav-btn" onClick={goPrev}>
          ‹
        </View>
        <Text className="heat-nav-title">{periodLabel}</Text>
        <View
          className={`heat-nav-btn ${offset >= 0 ? 'is-disabled' : ''}`}
          onClick={goNext}
        >
          ›
        </View>
      </View>

      {/* 心情概览 */}
      <View className="card">
        <View className="card-title">
          <Text>🌈 心情概览</Text>
          <Text className="sub">
            {recorded} 天有记录
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
            {/* A+C 组合：变化值升入大行并做成趋势色胶囊徽章，副文案只留「比上周期 + 方向词」，
                避免「比上周期 +0.5 好转」长句在 1/3 窄列里折成两行 */}
            <View className={`mood-delta mood-delta-${avg && avgPrev ? trend : 'flat'}`}>
              <Text className={`mood-trend-${avg && avgPrev ? trend : 'flat'}`}>
                {avg && avgPrev
                  ? `${trendArrow} ${diff > 0 ? '+' : ''}${diff.toFixed(1)}`
                  : '·'}
              </Text>
            </View>
            <Text className="sub">
              {avg && avgPrev ? `${cmp} ${trendWord}` : '暂无对比'}
            </Text>
          </View>
          <View className="mood-avg">
            <Text className="big">{goodDays}</Text>
            <Text className="sub">心情不错</Text>
          </View>
        </View>
      </View>

      {/* 趋势列图：列高=心情档，颜色=档位色；缺记=底部灰点 */}
      <View className="card">
        <View className="card-title">
          <Icon name="chart-line" size={16} gap={4} />
          <Text>心情趋势</Text>
          <Text className="sub">灰点=无记录</Text>
        </View>
        {entries.length === 0 ? (
          <MoodEmpty />
        ) : (
          <MoodColumns days={monthCols} range={range} today={today} />
        )}
      </View>

      {/* 心情分布 */}
      <View className="card">
        <View className="card-title">
          <Icon name="chart-bar" size={16} gap={4} />
          <Text>心情分布</Text>
          <Text className="sub">
            {recorded ? `最常出现：${MOODS[topIdx]} ${MOOD_LABELS[topIdx]}` : '本周期'}
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
          recorded ? (
            <Text className="empty">本周期没有低落记录，状态很稳 👍</Text>
          ) : (
            <MoodEmpty />
          )
        ) : (
          <>
            <View className="mood-scroll">
              {lowDays.map(({ d, m }) => (
                <MoodRow key={d} d={d} m={m!} today={today} />
              ))}
            </View>
            <Text className="sub" style={{ fontSize: 16, marginTop: 6 }}>
              那几天都过来了，翻篇继续 💪
            </Text>
          </>
        )}
      </View>

      {/* 心情时间线：每天一条（心情 + 当天话语） */}
      <View className="card">
        <View className="card-title">
          <Icon name="book" size={16} gap={4} />
          <Text>心情时间线</Text>
          <Text className="sub">每天一条 · 上下滑动</Text>
        </View>
        {entries.length === 0 ? (
          <MoodEmpty />
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
