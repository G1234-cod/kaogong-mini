// 专注记录：今天 / 一周 / 一月 / 一年（四档）+ 日期锚点导航
// - anchor 锚点（默认今天）：‹ › 按档位步长翻页（今天±1天/一周±7天/一月±30天/一年±1年），
//   点中间日期弹 DatePicker 跳任意锚点；周/月/年范围均相对 anchor 计算
// - 图表纯 View 绘制（flex 柱状图 / conic-gradient 环图），图例常显（触屏无 hover）
// - 今天列表两行布局（任务名 + 时间·时长小字），修复时间与任务名单行挤压重叠
// - 任务分布环图周/月/年共用 taskSegs 聚合（Top5 + 其他）
import { useMemo, useState } from 'react'
import { Image, Text, View } from '@tarojs/components'
import Icon from '../../components/Icon'
import animalEmpty from '../../assets/images/噜噜发芽.png'
import { useData } from '../../store'
import { addDays, dateStr, daysBetween, pad2, todayStr } from '../../utils/date'
import DatePicker, { fmtDateShort } from '../../components/DatePicker'
import type { PomodoroLog } from '../../types'

type PomoRange = 'today' | 'week' | 'month' | 'year'

/** 周几中文（下标 = Date.getDay()） */
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
/** 任务分布环图配色（Top5 + 其他，共 6 色）：统一暖色板 token */
const PIE_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
]
/** 图表空态文案 */
const EMPTY_TIP = '最近还没有专注记录'

/** 锚点往前 N 天日期序列（旧 → 新，末位为锚点） */
const lastDays = (n: number, anchor: string) =>
  Array.from({ length: n }, (_, i) => addDays(anchor, i - (n - 1)))

/** 日期字符串 → 「周X」 */
const weekdayOf = (date: string) => `周${WEEKDAYS[new Date(date + 'T00:00:00').getDay()]}`

/** 任务分布聚合：按任务汇总分钟（空任务归「未命名」），Top5 + 其余合并「其他」（周/月/年共用） */
const taskSegs = (logs: PomodoroLog[]) => {
  const map = new Map<string, number>()
  for (const l of logs) {
    const name = l.task?.trim() || '未命名'
    map.set(name, (map.get(name) ?? 0) + l.minutes)
  }
  const list = [...map.entries()]
    .map(([name, minutes]) => ({ name, minutes }))
    .filter((x) => x.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)
  const merged =
    list.length > 6
      ? [
          ...list.slice(0, 5),
          { name: '其他', minutes: list.slice(5).reduce((s, x) => s + x.minutes, 0) },
        ]
      : list
  const total = merged.reduce((s, x) => s + x.minutes, 0)
  let acc = 0
  return merged.map((x) => {
    const frac = total > 0 ? x.minutes / total : 0
    const seg = { ...x, frac, start: acc }
    acc += frac
    return seg
  })
}

/** 多日合计（番茄数 + 累计分钟） */
const statsOfDays = (days: string[], daily: Map<string, { minutes: number; count: number }>) => {
  let count = 0
  let minutes = 0
  for (const d of days) {
    const g = daily.get(d)
    if (g) {
      count += g.count
      minutes += g.minutes
    }
  }
  return { count, minutes }
}

/** 年天数（闰年 366，供年档日均分母） */
const daysOfYear = (y: number) => ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365)

export default function PomoLogs() {
  const { data, ready } = useData()
  const today = todayStr()
  const [range, setRange] = useState<PomoRange>('today')
  const [anchor, setAnchor] = useState(today)

  /** 时间戳 → H:MM（手动格式化：toLocaleTimeString 可能输出「上午8:30」超宽挤压任务名） */
  const fmtTime = (ts: number) => {
    const d = new Date(ts)
    return `${d.getHours()}:${pad2(d.getMinutes())}`
  }

  // 逐日聚合（全量）：date → { minutes, count }
  const daily = useMemo(() => {
    const map = new Map<string, { minutes: number; count: number }>()
    for (const l of data.pomodoroLogs) {
      const g = map.get(l.date) ?? { minutes: 0, count: 0 }
      g.minutes += l.minutes
      g.count++
      map.set(l.date, g)
    }
    return map
  }, [data.pomodoroLogs])

  // 逐月聚合（年档用）：YYYY-MM → { minutes, count }
  const monthly = useMemo(() => {
    const map = new Map<string, { minutes: number; count: number }>()
    for (const l of data.pomodoroLogs) {
      const ym = l.date.slice(0, 7)
      const g = map.get(ym) ?? { minutes: 0, count: 0 }
      g.minutes += l.minutes
      g.count++
      map.set(ym, g)
    }
    return map
  }, [data.pomodoroLogs])

  const anchorY = Number(anchor.slice(0, 4))

  // 柱图数据：近 7 天 / 近 30 天（相对锚点）/ 锚点年 12 个月
  const weekDays = useMemo(
    () => lastDays(7, anchor).map((date) => ({ date, minutes: daily.get(date)?.minutes ?? 0 })),
    [daily, anchor]
  )
  const monthDays = useMemo(
    () => lastDays(30, anchor).map((date) => ({ date, minutes: daily.get(date)?.minutes ?? 0 })),
    [daily, anchor]
  )
  const yearMonths = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const ym = `${anchorY}-${pad2(i + 1)}`
        return { ym, m: i + 1, minutes: monthly.get(ym)?.minutes ?? 0 }
      }),
    [monthly, anchorY]
  )

  // 当前档位范围内的原始记录（今天逐条列表 / 环图聚合共用）
  const rangeLogs = useMemo(() => {
    if (range === 'today') return data.pomodoroLogs.filter((l) => l.date === anchor)
    if (range === 'year') return data.pomodoroLogs.filter((l) => l.date.slice(0, 4) === String(anchorY))
    const span = range === 'week' ? 7 : 30
    return data.pomodoroLogs.filter((l) => {
      const diff = daysBetween(l.date, anchor)
      return diff >= 0 && diff < span
    })
  }, [data.pomodoroLogs, range, anchor, anchorY])

  // 今天档：逐条记录（按完成时间正序）+ 当日合计
  const todayLogs = useMemo(() => [...rangeLogs].sort((a, b) => a.endedAt - b.endedAt), [rangeLogs])
  const todayMinutes = useMemo(() => todayLogs.reduce((s, l) => s + l.minutes, 0), [todayLogs])

  // 任务分布环图（周/月/年共用聚合）
  const segs = useMemo(() => taskSegs(rangeLogs), [rangeLogs])
  const segTotal = segs.reduce((s, x) => s + x.minutes, 0)

  // ---- 各档柱图派生数据 ----
  const weekTotal = weekDays.reduce((s, d) => s + d.minutes, 0)
  const weekPeak = Math.max(...weekDays.map((d) => d.minutes))
  const weekMax = Math.max(1, weekPeak)
  const monthTotal = monthDays.reduce((s, d) => s + d.minutes, 0)
  const monthPeak = Math.max(...monthDays.map((d) => d.minutes))
  const monthMax = Math.max(1, monthPeak)
  const yearTotal = yearMonths.reduce((s, m) => s + m.minutes, 0)
  const yearPeak = Math.max(...yearMonths.map((m) => m.minutes))
  const yearMax = Math.max(1, yearPeak)

  // 三盒统计（周/月/年）：番茄数 / 累计分钟 / 日均分钟
  const stats = useMemo(() => {
    if (range === 'week') return { ...statsOfDays(weekDays.map((d) => d.date), daily), divisor: 7 }
    if (range === 'month') return { ...statsOfDays(monthDays.map((d) => d.date), daily), divisor: 30 }
    if (range === 'year') {
      let count = 0
      for (const m of yearMonths) count += monthly.get(m.ym)?.count ?? 0
      return { count, minutes: yearTotal, divisor: daysOfYear(anchorY) }
    }
    return null
  }, [range, daily, weekDays, monthDays, yearMonths, monthly, yearTotal, anchorY])

  // 锚点翻页：按档位步长
  const shiftAnchor = (dir: 1 | -1) => {
    if (range === 'year') {
      const d = new Date(anchor + 'T00:00:00')
      d.setFullYear(d.getFullYear() + dir)
      setAnchor(dateStr(d))
    } else {
      const step = range === 'today' ? 1 : range === 'week' ? 7 : 30
      setAnchor(addDays(anchor, dir * step))
    }
  }
  const canForward = daysBetween(anchor, today) > 0 // 锚点已到今天时禁用 ›

  // 各档范围文案（环图 / 三盒标题共用）
  const rangeText =
    range === 'week' ? '近 7 天' : range === 'month' ? '近 30 天' : `${anchorY} 年`

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
      {/* 档位胶囊：今天 / 一周 / 一月 / 一年 */}
      <View className="seg-tabs" style={{ marginBottom: 12 }}>
        {(
          [
            ['today', '今天'],
            ['week', '一周'],
            ['month', '一月'],
            ['year', '一年'],
          ] as [PomoRange, string][]
        ).map(([k, label]) => (
          <View
            key={k}
            className={`seg-tab ${range === k ? 'active' : ''}`}
            onClick={() => setRange(k)}
          >
            <Text>{label}</Text>
          </View>
        ))}
      </View>

      {/* 日期锚点导航：‹ 锚点日期（点击弹日历任选） › */}
      <View className="pomo-nav">
        <View className="pomo-nav-btn" onClick={() => shiftAnchor(-1)}>
          <Icon name="arrow-up" size={18} className="arrow-l" />
        </View>
        <DatePicker
          value={anchor}
          onChange={(v) => setAnchor(v)}
          compact
          fmt={(v) => (range === 'year' ? `${v.slice(0, 4)}年` : fmtDateShort(v))}
        />
        <View
          className={`pomo-nav-btn${canForward ? '' : ' disabled'}`}
          onClick={() => canForward && shiftAnchor(1)}
        >
          <Icon name="arrow-up" size={18} className="arrow-r" />
        </View>
      </View>

      {/* 今天：合计大数字 + 逐条列表（两行布局，任务名/时间不再挤压） */}
      {range === 'today' && (
        <View className="card">
          <View className="card-title">
            <Icon name="tomato" size={16} gap={4} /><Text>{anchor === today ? '今日专注' : `${fmtDateShort(anchor)}专注`}</Text>
            <Text className="sub">{todayLogs.length} 次</Text>
          </View>
          <View style={{ textAlign: 'center', margin: '4px 0 12px' }}>
            <Text className="sub">当日累计</Text>
            <View className="pomo-big-num">
              <Text>{todayMinutes}</Text>
              <Text style={{ fontSize: 16, fontWeight: 600, marginLeft: 3 }}>分钟</Text>
            </View>
          </View>
          {todayLogs.length === 0 &&
            (anchor === today ? (
              <View className="state-card">
                <View className="emoji-badge">
                  <Text className="emoji">🌱</Text>
                </View>
                <Text className="empty">今天还没开始专注，去种一颗种子吧</Text>
                <Image className="state-animal" src={animalEmpty} mode="aspectFit" />
              </View>
            ) : (
              <Text className="empty">这一天没有专注记录</Text>
            ))}
          {todayLogs.map((l, i) => (
            <View className="pomo-item" key={i}>
              <Text className="pomo-item-name">{l.task || '专注'}</Text>
              <View className="pomo-item-meta">
                <Text>{fmtTime(l.endedAt)}</Text>
                <Text>·</Text>
                <Text>{l.minutes} 分钟</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 一周：近 7 天每日柱状图（flex 列，锚点日高亮） */}
      {range === 'week' && (
        <View className="card">
          <View className="card-title">
            <Icon name="chart-bar" size={16} gap={4} /><Text>每日专注</Text>
            {weekTotal > 0 && <Text className="chip">峰值 {weekPeak} 分钟</Text>}
          </View>
          {weekTotal === 0 ? (
            <Text className="empty">{EMPTY_TIP}</Text>
          ) : (
            <View>
              {/* 柱区：7 列，柱顶数值 + 底部周几 */}
              <View style={{ display: 'flex', alignItems: 'flex-end', height: 110 }}>
                {weekDays.map((d) => {
                  const isAnchor = d.date === anchor
                  const h = d.minutes > 0 ? Math.max(4, (d.minutes / weekMax) * 84) : 0
                  return (
                    <View
                      key={d.date}
                      style={{
                        flex: 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Text style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 2 }}>
                        {d.minutes > 0 ? d.minutes : ''}
                      </Text>
                      <View
                        style={{
                          width: '58%',
                          minWidth: 12,
                          height: h,
                          borderRadius: '4px 4px 0 0',
                          background: isAnchor ? 'var(--chart-bar)' : 'var(--chart-bar-dim)',
                        }}
                      />
                    </View>
                  )
                })}
              </View>
              <View style={{ display: 'flex', marginTop: 4 }}>
                {weekDays.map((d) => {
                  const isAnchor = d.date === anchor
                  return (
                    <Text
                      key={d.date}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        fontSize: 14,
                        fontWeight: isAnchor ? 700 : 400,
                        color: isAnchor ? 'var(--primary)' : 'var(--text-sub)',
                      }}
                    >
                      {isAnchor && anchor === today ? '今天' : weekdayOf(d.date)}
                    </Text>
                  )
                })}
              </View>
            </View>
          )}
        </View>
      )}

      {/* 一月：近 30 天趋势（30 列迷你柱） */}
      {range === 'month' && (
        <View className="card">
          <View className="card-title">
            <Icon name="chart-line" size={16} gap={4} /><Text>近 30 天趋势</Text>
            {monthTotal > 0 && <Text className="sub">峰值 {monthPeak} 分钟</Text>}
          </View>
          {monthTotal === 0 ? (
            <Text className="empty">{EMPTY_TIP}</Text>
          ) : (
            <View>
              <View style={{ display: 'flex', alignItems: 'flex-end', height: 92 }}>
                {monthDays.map((d) => {
                  const isAnchor = d.date === anchor
                  const h = d.minutes > 0 ? Math.max(2, (d.minutes / monthMax) * 76) : 0
                  return (
                    <View key={d.date} style={{ flex: 1, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                      <View
                        style={{
                          width: 6,
                          height: h,
                          borderRadius: '4px 4px 0 0',
                          background: isAnchor ? 'var(--chart-bar)' : 'var(--chart-bar-dim)',
                        }}
                      />
                    </View>
                  )
                })}
              </View>
              {/* X 轴刻度：第 1 / 5 / 10 / 15 / 20 / 25 / 30 天 */}
              <View style={{ display: 'flex', marginTop: 4 }}>
                {monthDays.map((d, i) => {
                  const show = i === 0 || (i + 1) % 5 === 0
                  return (
                    <Text
                      key={d.date}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        fontSize: 14,
                        color: 'var(--text-sub)',
                        visibility: show ? 'visible' : 'hidden',
                      }}
                    >
                      {i + 1}
                    </Text>
                  )
                })}
              </View>
            </View>
          )}
        </View>
      )}

      {/* 一年：12 个月柱状图（锚点月高亮） */}
      {range === 'year' && (
        <View className="card">
          <View className="card-title">
            <Icon name="chart-bar" size={16} gap={4} /><Text>{anchorY} 年每月专注</Text>
            {yearTotal > 0 && <Text className="sub">峰值 {yearPeak} 分钟</Text>}
          </View>
          {yearTotal === 0 ? (
            <Text className="empty">{EMPTY_TIP}</Text>
          ) : (
            <View>
              <View style={{ display: 'flex', alignItems: 'flex-end', height: 92 }}>
                {yearMonths.map((m) => {
                  const isAnchor = m.m === Number(anchor.slice(5, 7))
                  const h = m.minutes > 0 ? Math.max(4, (m.minutes / yearMax) * 64) : 0
                  return (
                    <View
                      key={m.ym}
                      style={{
                        flex: 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Text style={{ fontSize: 12, color: 'var(--text-sub)', marginBottom: 2 }}>
                        {m.minutes > 0 ? m.minutes : ''}
                      </Text>
                      <View
                        style={{
                          width: '52%',
                          minWidth: 12,
                          height: h,
                          borderRadius: '4px 4px 0 0',
                          background: isAnchor ? 'var(--chart-bar)' : 'var(--chart-bar-dim)',
                        }}
                      />
                    </View>
                  )
                })}
              </View>
              {/* X 轴：1-12 月 */}
              <View style={{ display: 'flex', marginTop: 4 }}>
                {yearMonths.map((m) => (
                  <Text
                    key={m.ym}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: 12,
                      color: 'var(--text-sub)',
                    }}
                  >
                    {m.m}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* 任务分布环图（conic-gradient，周/月/年共用） */}
      {range !== 'today' && segs.length > 0 && (
        <View className="card">
          <View className="card-title">
            <View className="emoji-badge sm">
              <Text className="emoji">🥧</Text>
            </View>
            <Text>任务分布（{rangeText}）</Text>
          </View>
          <View style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* conic-gradient 环图：外环分色，内圈挖空显示总量 */}
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                flexShrink: 0,
                position: 'relative',
                background: `conic-gradient(${segs
                  .map(
                    (s, i) =>
                      `${PIE_COLORS[i]} ${(s.start * 100).toFixed(2)}% ${(
                        (s.start + s.frac) * 100
                      ).toFixed(2)}%`
                  )
                  .join(', ')})`,
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  inset: 20,
                  borderRadius: '50%',
                  background: 'var(--card)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: 800 }}>{segTotal}</Text>
                <Text style={{ fontSize: 12, color: 'var(--text-sub)' }}>分钟</Text>
              </View>
            </View>
            {/* 图例：色块 + 任务名 + 分钟数与百分比 */}
            <View
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              {segs.map((s, i) => (
                <View
                  key={`${s.name}-${i}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16 }}
                >
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 2,
                      background: PIE_COLORS[i],
                      flexShrink: 0,
                    }}
                  />
                  <Text
                    style={{
                      flex: 1,
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.name}
                  </Text>
                  <Text className="sub" style={{ flexShrink: 0 }}>
                    {s.minutes}分 · {Math.round(s.frac * 100)}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* 一周 / 一月 / 一年：三盒统计 */}
      {stats && (
        <View className="card">
          <View className="card-title">
            <View className="emoji-badge sm">
              <Text className="emoji">⏱</Text>
            </View>
            <Text>{rangeText}专注</Text>
          </View>
          <View className="pomo-stats-row">
            <View className="pomo-stat-box">
              <Text className="num">{stats.count}</Text>
              <Text className="sub">番茄数</Text>
            </View>
            <View className="pomo-stat-box">
              <Text className="num">{stats.minutes}</Text>
              <Text className="sub">累计分钟</Text>
            </View>
            <View className="pomo-stat-box">
              <Text className="num">{Math.round((stats.minutes / stats.divisor) * 10) / 10}</Text>
              <Text className="sub">日均分钟</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
