// 专注记录：今天（逐条）/ 一周（柱状图+任务分布环图）/ 一月（30 天迷你柱趋势图）
// 自 PWA pages/PomoLogs.tsx 迁移：SVG 图表 → 纯 View 绘制（flex 柱状图 / conic-gradient 环图 / 30 列趋势图），
// <title> 悬停提示 → 图例常显（触屏无 hover）
import { useMemo, useState } from 'react'
import { Text, View } from '@tarojs/components'
import { useData } from '../../store'
import { addDays, daysBetween, todayStr } from '../../utils/date'

type PomoRange = 'today' | 'week' | 'month'

/** 周几中文（下标 = Date.getDay()） */
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
/** 任务分布环图配色（Top5 + 其他，共 6 色） */
const PIE_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#34d399', '#fbbf24', '#d1d5db']
/** 图表空态文案 */
const EMPTY_TIP = '最近还没有专注记录'

/** 近 N 天日期序列（旧 → 新，末位为今天） */
const lastDays = (n: number, today: string) =>
  Array.from({ length: n }, (_, i) => addDays(today, i - (n - 1)))

/** 日期字符串 → 「周X」 */
const weekdayOf = (date: string) => `周${WEEKDAYS[new Date(date + 'T00:00:00').getDay()]}`

/** 从逐日聚合表汇总近 N 天统计（番茄数 + 累计分钟） */
const statsOf = (n: number, today: string, daily: Map<string, { minutes: number; count: number }>) => {
  let count = 0
  let minutes = 0
  for (let i = 0; i < n; i++) {
    const g = daily.get(addDays(today, -i))
    if (g) {
      count += g.count
      minutes += g.minutes
    }
  }
  return { count, minutes }
}

export default function PomoLogs() {
  const { data, ready } = useData()
  const today = todayStr()
  const [range, setRange] = useState<PomoRange>('today')

  const fmtTime = (ts: number) =>
    new Date(ts).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  // 今天：逐条记录（按完成时间正序）
  const todayLogs = useMemo(
    () =>
      data.pomodoroLogs
        .filter((l) => l.date === today)
        .sort((a, b) => a.endedAt - b.endedAt),
    [data.pomodoroLogs, today]
  )
  const todayMinutes = useMemo(() => todayLogs.reduce((s, l) => s + l.minutes, 0), [todayLogs])

  // 近 30 天逐日聚合：date → { minutes, count }（一周 / 一月共用）
  const daily = useMemo(() => {
    const map = new Map<string, { minutes: number; count: number }>()
    for (const l of data.pomodoroLogs) {
      const diff = daysBetween(l.date, today)
      if (diff < 0 || diff >= 30) continue
      const g = map.get(l.date) ?? { minutes: 0, count: 0 }
      g.minutes += l.minutes
      g.count++
      map.set(l.date, g)
    }
    return map
  }, [data.pomodoroLogs, today])

  // 近 7 / 30 天每日分钟数（供柱状图 / 趋势图）
  const weekDays = useMemo(
    () => lastDays(7, today).map((date) => ({ date, minutes: daily.get(date)?.minutes ?? 0 })),
    [daily, today]
  )
  const monthDays = useMemo(
    () => lastDays(30, today).map((date) => ({ date, minutes: daily.get(date)?.minutes ?? 0 })),
    [daily, today]
  )

  // 三盒统计原始数据
  const weekStats = useMemo(() => statsOf(7, today, daily), [today, daily])
  const monthStats = useMemo(() => statsOf(30, today, daily), [today, daily])

  // 近 7 天任务分布：按任务聚合分钟（空任务归「未命名」），Top5 + 其余合并「其他」
  const weekTaskSegs = useMemo(() => {
    const map = new Map<string, number>()
    for (const l of data.pomodoroLogs) {
      const diff = daysBetween(l.date, today)
      if (diff < 0 || diff >= 7) continue
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
  }, [data.pomodoroLogs, today])

  // ---- 图表派生数据 ----
  const weekTotal = weekDays.reduce((s, d) => s + d.minutes, 0)
  const weekPeak = Math.max(...weekDays.map((d) => d.minutes))
  const weekMax = Math.max(1, weekPeak)
  const monthTotal = monthDays.reduce((s, d) => s + d.minutes, 0)
  const monthPeak = Math.max(...monthDays.map((d) => d.minutes))
  const monthMax = Math.max(1, monthPeak)
  const taskTotal = weekTaskSegs.reduce((s, x) => s + x.minutes, 0)

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
      {/* 档位胶囊：今天 / 一周 / 一月 */}
      <View className="seg-tabs" style={{ marginBottom: 12 }}>
        {(
          [
            ['today', '今天'],
            ['week', '一周'],
            ['month', '一月'],
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

      {/* 今天：合计大数字 + 逐条列表 */}
      {range === 'today' && (
        <View className="card">
          <View className="card-title">
            <Text>🍅 今日专注</Text>
            <Text className="sub">{todayLogs.length} 次</Text>
          </View>
          <View style={{ textAlign: 'center', margin: '4px 0 12px' }}>
            <Text className="sub">今日累计</Text>
            <View style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.2, color: 'var(--primary)' }}>
              <Text>{todayMinutes}</Text>
              <Text style={{ fontSize: 13, fontWeight: 600, marginLeft: 3 }}>分钟</Text>
            </View>
          </View>
          {todayLogs.length === 0 && (
            <Text className="empty">今天还没开始专注，去种一颗种子吧</Text>
          )}
          {todayLogs.map((l, i) => (
            <View className="list-item" key={i}>
              <Text className="pomo-log-time">{fmtTime(l.endedAt)}</Text>
              <Text className="grow name">{l.task || '专注'}</Text>
              <Text className="chip">{l.minutes} 分钟</Text>
            </View>
          ))}
        </View>
      )}

      {/* 一周：每日柱状图（flex 列） + 任务分布环图（conic-gradient） */}
      {range === 'week' && (
        <>
          <View className="card">
            <View className="card-title">
              <Text>📊 近 7 天每日专注</Text>
              {weekTotal > 0 && <Text className="sub">峰值 {weekPeak} 分钟</Text>}
            </View>
            {weekTotal === 0 ? (
              <Text className="empty">{EMPTY_TIP}</Text>
            ) : (
              <View>
                {/* 柱区：7 列，柱顶数值 + 底部周几 */}
                <View style={{ display: 'flex', alignItems: 'flex-end', height: 92 }}>
                  {weekDays.map((d) => {
                    const isToday = d.date === today
                    const h = d.minutes > 0 ? Math.max(4, (d.minutes / weekMax) * 64) : 0
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
                        <Text style={{ fontSize: 9, color: 'var(--text-sub)', marginBottom: 2 }}>
                          {d.minutes > 0 ? d.minutes : ''}
                        </Text>
                        <View
                          style={{
                            width: '58%',
                            height: h,
                            borderRadius: 3,
                            background: isToday
                              ? 'linear-gradient(180deg, #6366f1, #8b5cf6)'
                              : 'rgba(99,102,241,0.35)',
                          }}
                        />
                      </View>
                    )
                  })}
                </View>
                <View style={{ display: 'flex', marginTop: 4 }}>
                  {weekDays.map((d) => {
                    const isToday = d.date === today
                    return (
                      <Text
                        key={d.date}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          fontSize: 10,
                          fontWeight: isToday ? 700 : 400,
                          color: isToday ? 'var(--primary)' : 'var(--text-sub)',
                        }}
                      >
                        {isToday ? '今天' : weekdayOf(d.date)}
                      </Text>
                    )
                  })}
                </View>
              </View>
            )}
          </View>

          {/* 任务分布环图（近 7 天，Top5 + 其他） */}
          {weekTaskSegs.length > 0 && (
            <View className="card">
              <View className="card-title">
                <Text>🥧 任务分布（近 7 天）</Text>
              </View>
              <View style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* conic-gradient 环图：外环分色，内圈挖空显示总量 */}
                <View
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: '50%',
                    flexShrink: 0,
                    position: 'relative',
                    background: `conic-gradient(${weekTaskSegs
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
                      inset: 18,
                      borderRadius: '50%',
                      background: 'var(--card)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: 800 }}>{taskTotal}</Text>
                    <Text style={{ fontSize: 10, color: 'var(--text-sub)' }}>分钟</Text>
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
                  {weekTaskSegs.map((s, i) => (
                    <View
                      key={`${s.name}-${i}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
                    >
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 3,
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
        </>
      )}

      {/* 一月：近 30 天趋势（30 列迷你柱） */}
      {range === 'month' && (
        <View className="card">
          <View className="card-title">
            <Text>📈 近 30 天趋势</Text>
            {monthTotal > 0 && <Text className="sub">峰值 {monthPeak} 分钟</Text>}
          </View>
          {monthTotal === 0 ? (
            <Text className="empty">{EMPTY_TIP}</Text>
          ) : (
            <View>
              <View style={{ display: 'flex', alignItems: 'flex-end', height: 92 }}>
                {monthDays.map((d) => {
                  const isToday = d.date === today
                  const h = d.minutes > 0 ? Math.max(2, (d.minutes / monthMax) * 76) : 0
                  return (
                    <View key={d.date} style={{ flex: 1, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                      <View
                        style={{
                          width: 4,
                          height: h,
                          borderRadius: 2,
                          background: isToday
                            ? 'linear-gradient(180deg, #6366f1, #8b5cf6)'
                            : 'rgba(99,102,241,0.35)',
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
                        fontSize: 9,
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

      {/* 一周 / 一月：三盒统计 */}
      {(range === 'week' || range === 'month') && (
        <View className="card">
          <View className="card-title">
            <Text>⏱ 近 {range === 'week' ? 7 : 30} 天专注</Text>
          </View>
          <View className="pomo-stats-row">
            <View className="pomo-stat-box">
              <Text className="num">{(range === 'week' ? weekStats : monthStats).count}</Text>
              <Text className="sub">番茄数</Text>
            </View>
            <View className="pomo-stat-box">
              <Text className="num">{(range === 'week' ? weekStats : monthStats).minutes}</Text>
              <Text className="sub">累计分钟</Text>
            </View>
            <View className="pomo-stat-box">
              <Text className="num">
                {Math.round(
                  ((range === 'week' ? weekStats : monthStats).minutes /
                    (range === 'week' ? 7 : 30)) *
                    10
                ) / 10}
              </Text>
              <Text className="sub">日均分钟</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
