// 生活：宫格导航入口（待办 / 提醒·日期角标）→ 各工具页
// 自 PWA pages/Life.tsx 迁移：open(key) → Taro.navigateTo
// 2026-09 改版：原「周期提醒」「重要日期」两格合并为一格「提醒 · 日期」（跳合并页），
// 角标 = 到期周期数 + 命中日期数（与原两格角标口径一致）
import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useData } from '../../store'
import { daysBetween, pad2, todayStr } from '../../utils/date'
import { useTabSwipe } from '../../utils/tabSwipe'
import companionImg from '../../assets/images/挥手.png'

const ENTRIES: { key: string; icon: string; sticker: string; title: string; desc: string; url: string; tint: string }[] = [
  { key: 'food', icon: '🍽', sticker: '✨', title: '吃什么', desc: '选择困难终结者', url: '/pages/food/index', tint: 'var(--tint-1)' },
  { key: 'ledger', icon: '💰', sticker: '🧧', title: '记账本', desc: '花销与预算', url: '/pages/ledger/index', tint: 'var(--tint-2)' },
  { key: 'todos', icon: '🛒', sticker: '🎀', title: '待办清单', desc: '要办的事、要买的东西', url: '/pages/todos/index', tint: 'var(--tint-3)' },
  { key: 'reminders', icon: '⏰', sticker: '🌟', title: '提醒 · 日期', desc: '周期提醒、生日、纪念日', url: '/pages/reminders/index', tint: 'var(--tint-4)' },
  { key: 'notes', icon: '📰', sticker: '🐣', title: '时政收集', desc: '素材金句随手记', url: '/pages/notes/index', tint: 'var(--tint-6)' },
  { key: 'wrongbook', icon: '📕', sticker: '🍀', title: '错题本', desc: '答错的题都在这', url: '/pages/wrongbook/index', tint: 'var(--tint-7)' },
  { key: 'pomodoro', icon: '🌸', sticker: '🦋', title: '种花番茄钟', desc: '专注一朵花', url: '/pages/pomodoro/index', tint: 'var(--tint-8)' },
  // 第 8 格占位：不做跳转，只展示「敬请期待」
  { key: 'soon', icon: '🎁', sticker: '🌈', title: '敬请期待', desc: '新功能开发中', url: '', tint: 'var(--tint-5)' },
]

/** 每年重复的日期取今年/明年中较近的一次（2/29 平年取当月最后一天兜底）；非每年原样返回。
 *  与合并页 pages/reminders 同一逻辑（日期为 DatePicker 产出的 YYYY-MM-DD） */
const nextOccurrence = (d: string, isYearly: boolean): string => {
  if (!isYearly) return d
  const today = todayStr()
  const mm = Number(d.slice(5, 7))
  const dd = Number(d.slice(8, 10))
  const pick = (y: number) => {
    const day = Math.min(dd, new Date(y, mm, 0).getDate())
    return `${y}-${pad2(mm)}-${pad2(day)}`
  }
  const thisYear = pick(Number(today.slice(0, 4)))
  return thisYear >= today ? thisYear : pick(Number(today.slice(0, 4)) + 1)
}

export default function Life() {
  const { data, ready } = useData()
  const tabSwipe = useTabSwipe(3)
  const today = todayStr()
  // 到期周期数（距上次完成天数 ≥ 间隔）
  const periodicDue = data.periodic.filter(
    (p) => daysBetween(p.lastDone, today) >= p.everyDays
  ).length
  // 命中日期数：当天必命中，提前档位按 remindDays 命中；今日页已点「知道了」（lastAck=今天）的不计
  const dateHits = data.dates.filter((d) => {
    const left = daysBetween(today, nextOccurrence(d.date, d.yearly))
    return left >= 0 && (left === 0 || (d.remindDays ?? []).includes(left)) && d.lastAck !== today
  }).length
  const badge: Record<string, number> = {
    todos: ready ? data.todos.filter((t) => !t.done).length : 0,
    reminders: ready ? periodicDue + dateHits : 0,
  }

  return (
    <View className="page tab-page" {...tabSwipe}>
      <View className="page-title">
        <Text>🌈 生活</Text>
      </View>
      <View className="grid-menu">
        {ENTRIES.map((e) => (
          <View
            className={`grid-card${e.url ? '' : ' soon'}`}
            key={e.key}
            onClick={() => e.url && Taro.navigateTo({ url: e.url })}
          >
            {/* 右上角卡通贴纸 */}
            <Text className="grid-sticker">{e.sticker}</Text>
            <Text className="grid-icon" style={{ background: e.tint }}>
              {e.icon}
            </Text>
            <View className="grid-title">
              <Text>{e.title}</Text>
              {badge[e.key] ? <Text className="grid-badge">{badge[e.key]}</Text> : null}
            </View>
            <Text className="grid-desc">{e.desc}</Text>
          </View>
        ))}
      </View>
      <View className="card companion-card">
        <Image className="companion-img" src={companionImg} mode="aspectFit" />
        <Text className="companion-hi">今天也要好好生活呀～</Text>
        <Text className="companion-tip">
          💡 三餐时间、喝水、睡眠提醒在「今日」页；提醒时间可在「设置 → 作息与提醒」中调整。
        </Text>
      </View>
    </View>
  )
}
