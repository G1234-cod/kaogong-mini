// 今日：考试倒计时 / 艾宾浩斯复习闪卡 / 天气（定位+城市搜索） / 每日一句 / 今日三件事 /
// 临近一餐与下一餐 / 喝水打卡（常识判断题） / 今日打卡 / 睡眠督促
// 自 PWA pages/Today.tsx 迁移：DOM API → Taro（getLocation / navigateTo / switchTab / 自绘勾选框），
// 外部服务（天气/城市/一言）→ services/api/proxy stub，美团 → navigateToMiniProgram
import { useCallback, useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { Input, Text, View } from '@tarojs/components'
import { useData } from '../../store'
import type { DayLog, GeoCandidate, MealSlot, Weather } from '../../types'
import { QUOTES } from '../../constants/quotes'
import { cityLabel } from '../../constants/cities'
import { pickWaterQuiz, type WaterQuiz } from '../../constants/water-quiz'
import { fetchHitokoto, fetchWeather, reverseGeocode, searchCities } from '../../services/api/proxy'
import { openMeituanWaimai } from '../../services/meituan'
import { daysBetween, fmtHM, hmToMin, nowMin, todayStr } from '../../utils/date'
import { isNoteDue, nextReviewState } from '../../utils/review'
import { showToast } from '../../utils/platform'

function useNow(intervalMs = 30000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])
  return now
}

const WEEKDAY_CN = ['日', '一', '二', '三', '四', '五', '六']

/** 考试日期中文显示：2027年3月14日 · 周日 */
function examDateCN(date: string): string {
  const d = new Date(date + 'T00:00:00')
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 · 周${WEEKDAY_CN[d.getDay()]}`
}

export default function Today() {
  const { data, ready, auth, set } = useData()
  const now = useNow()
  const today = todayStr()
  const minute = nowMin()

  // ---- 考试倒计时：最近一场 + 其余一行小字 ----
  const upcomingExams = useMemo(
    () =>
      data.exams
        .filter((e) => daysBetween(today, e.date) >= 0)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [data.exams, today]
  )
  const nextExam = upcomingExams[0] ?? null
  const otherExams = upcomingExams.slice(1, 4)

  // ---- 天气 ----
  const [weather, setWeather] = useState<Weather | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const loadWeather = useCallback(() => {
    const city = data.settings.city
    if (!city) {
      setWeather(null)
      return
    }
    setWeatherLoading(true)
    fetchWeather(city.lat, city.lon)
      .then(setWeather)
      .catch(() => setWeather(null))
      .finally(() => setWeatherLoading(false))
  }, [data.settings.city])
  useEffect(() => {
    loadWeather()
  }, [loadWeather])

  // ---- 位置设置弹窗（天气卡定位按钮）：自动检测 + 手动搜索（支持区县） ----
  const [locOpen, setLocOpen] = useState(false)
  const [locQuery, setLocQuery] = useState('')
  const [locCands, setLocCands] = useState<GeoCandidate[]>([])
  const [locSearching, setLocSearching] = useState(false)
  const [locDetecting, setLocDetecting] = useState(false)

  const applyCity = (c: { name: string; province?: string; city?: string; lat: number; lon: number }) => {
    set('settings', (prev) => ({ ...prev, city: c }))
    setLocOpen(false)
    setLocCands([])
    setLocQuery('')
    showToast(`📍 已切换到 ${cityLabel(c)}`)
  }

  const searchLoc = async () => {
    const q = locQuery.trim()
    if (!q) return
    setLocSearching(true)
    try {
      const list = await searchCities(q)
      setLocCands(list)
      if (list.length === 0) showToast('没有找到这个地名，换个写法试试')
    } catch {
      showToast('搜索失败，请检查网络')
    } finally {
      setLocSearching(false)
    }
  }

  // 自动检测：定位取坐标 → 反查省市区名；反查失败也照常用坐标取天气
  const detectLocation = async () => {
    if (locDetecting) return
    setLocDetecting(true)
    try {
      const pos = await Taro.getLocation({ type: 'wgs84' })
      try {
        const r = await reverseGeocode(pos.latitude, pos.longitude)
        applyCity({ name: r.name, province: r.province, city: r.city, lat: r.lat, lon: r.lon })
      } catch {
        applyCity({ name: '当前位置', province: '', lat: pos.latitude, lon: pos.longitude })
      }
    } catch {
      showToast('定位失败，请允许定位权限后重试')
    } finally {
      setLocDetecting(false)
    }
  }

  // ---- 每日一句：本地大库随机 + 一言扩充 ----
  const [quoteOffset, setQuoteOffset] = useState(0)
  const [webQuote, setWebQuote] = useState<string | null>(null)
  const [showWebQuote, setShowWebQuote] = useState(false)

  const localQuote = useMemo(() => {
    if (QUOTES.length === 0) return null
    const dayIndex = Math.floor(Date.now() / 86400000)
    return QUOTES[(dayIndex * 37 + quoteOffset * 101) % QUOTES.length]
  }, [quoteOffset])

  // 预取一句联网诗词，点「换一换」时才展示
  useEffect(() => {
    void fetchHitokoto().then((q) => {
      if (q) setWebQuote(q)
    })
  }, [])

  const quote = showWebQuote && webQuote ? webQuote : localQuote
  const cycleQuote = () => {
    if (!showWebQuote && webQuote) {
      setShowWebQuote(true)
      return
    }
    setShowWebQuote(false)
    setWebQuote(null)
    setQuoteOffset((o) => o + 1)
    // 异步预取下一句联网诗词备用
    void fetchHitokoto().then((q) => {
      if (q) setWebQuote(q)
    })
  }

  // ---- 今日三件事 ----
  const threeThings = data.threeThings[today]?.items ?? [
    { text: '', done: false },
    { text: '', done: false },
    { text: '', done: false },
  ]
  const updateThings = (items: { text: string; done: boolean }[]) =>
    set('threeThings', (prev) => ({ ...prev, [today]: { items } }))

  // ---- 日志（喝水/三餐） ----
  const dayLog: DayLog = data.dayLogs[today] ?? { water: [], stand: [], meals: {} }
  const updateLog = (patch: Partial<DayLog>) =>
    set('dayLogs', (prev) => ({
      ...prev,
      [today]: { ...{ water: [], stand: [], meals: {} }, ...prev[today], ...patch },
    }))

  const lastWater = dayLog.water.length ? Math.max(...dayLog.water) : null
  const waterDue =
    lastWater === null
      ? minute >= hmToMin(data.settings.wake) + data.settings.water.intervalMin
      : minute - lastWater >= data.settings.water.intervalMin

  const meals = [
    { key: 'breakfast', label: '早餐', emoji: '🌅', time: data.settings.meals.breakfast },
    { key: 'lunch', label: '午餐', emoji: '🍱', time: data.settings.meals.lunch },
    { key: 'dinner', label: '晚餐', emoji: '🌙', time: data.settings.meals.dinner },
  ]

  const sleepMin = hmToMin(data.settings.sleep)
  const sleepDue = minute >= sleepMin - 30
  // 睡眠督促仅 19:30 后显示
  const showSleep = minute >= 19 * 60 + 30

  // ---- 临近一餐卡：当前时间落在某餐前 2h 窗口内显示那一餐，冲突取最近 ----
  const nearMeal = useMemo(() => {
    const cands = meals
      .map((m) => ({ ...m, diff: minute - hmToMin(m.time) }))
      .filter((m) => m.diff >= -120 && m.diff <= 120)
      .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff))
    return cands[0] ?? null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minute, data.settings.meals])

  // ---- 下一餐预告：不在任何一餐窗口内时常驻显示 ----
  const nextMeal = useMemo(() => {
    const cands = meals
      .map((m) => ({ ...m, diff: hmToMin(m.time) - minute }))
      .filter((m) => m.diff > 0)
      .sort((a, b) => a.diff - b.diff)
    if (cands[0]) return cands[0]
    // 今天三餐都已过点 → 明天早餐
    const breakfast = meals[0]
    return { ...breakfast, diff: 24 * 60 - minute + hmToMin(breakfast.time) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minute, data.settings.meals])

  const hour = now.getHours()
  const greeting =
    hour < 5 ? '夜深了，早点休息'
    : hour < 11 ? '早上好，今天也要加油'
    : hour < 14 ? '中午好，别忘了吃饭'
    : hour < 18 ? '下午好，保持节奏'
    : hour < 23 ? '晚上好，再坚持一会儿'
    : '夜深了，早点休息'

  // ---- 今日复习（艾宾浩斯闪卡） ----
  const reviewNotes = useMemo(
    () => data.notes.filter((n) => isNoteDue(n, today)),
    [data.notes, today]
  )
  const reviewPool = useMemo(
    () => data.notes.filter((n) => n.nextReviewDate !== null && n.reviewStep < 5).length,
    [data.notes]
  )
  const [reviewDone, setReviewDone] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const reviewTotal = reviewNotes.length + reviewDone
  const curNote = reviewNotes[0] ?? null

  const answerReview = (known: boolean) => {
    if (!curNote) return
    const next = nextReviewState(curNote.reviewStep, known)
    set('notes', (prev) => prev.map((x) => (x.id === curNote.id ? { ...x, ...next } : x)))
    if (known && next.reviewStep >= 5) showToast('🎉 这张卡已掌握！')
    setFlipped(false)
    setReviewDone((n) => n + 1)
  }

  // ---- 常识判断喝水题：先选中后提交，✕ 关闭不打卡 ----
  const [waterQuiz, setWaterQuiz] = useState<WaterQuiz | null>(null)
  const [quizPicked, setQuizPicked] = useState<number | null>(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizRevealed, setQuizRevealed] = useState(false)

  const openWaterQuiz = () => {
    setWaterQuiz(pickWaterQuiz())
    setQuizPicked(null)
    setQuizSubmitted(false)
    setQuizRevealed(false)
  }

  const recordWater = () => {
    updateLog({ water: [...dayLog.water, minute] })
    setWaterQuiz(null)
  }

  if (!ready) {
    return (
      <View className="page">
        <View className="card">
          <Text className="sub">正在登录与同步数据…</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="page">
      {auth?.role === 'guest' && (
        <View className="row" style={{ justifyContent: 'center', marginBottom: 10 }}>
          <Text className="chip warn">演示模式 · 样板数据</Text>
        </View>
      )}

      <View className="page-title">
        <Text>
          {now.getMonth() + 1}月{now.getDate()}日 · {greeting}
        </Text>
      </View>

      {/* 考试倒计时 —— 紧凑常驻置顶：最近一场 + 具体日期 + 其余一行小字 */}
      {nextExam ? (
        <View className="countdown-compact">
          <View className="cd-main">
            <Text className="cd-days">
              {daysBetween(today, nextExam.date)}
              <Text style={{ fontSize: 12, fontWeight: 500, marginLeft: 2 }}>天</Text>
            </Text>
            <View className="cd-info">
              <Text className="cd-name">{nextExam.name}</Text>
              <Text className="cd-date">{examDateCN(nextExam.date)}</Text>
            </View>
          </View>
          {otherExams.length > 0 && (
            <Text className="cd-others">
              {otherExams.map((e) => `${e.name} ${daysBetween(today, e.date)} 天`).join(' · ')}
            </Text>
          )}
        </View>
      ) : (
        <View className="countdown-compact">
          <View className="cd-main">
            <Text className="cd-days" style={{ fontSize: 20 }}>
              🎯
            </Text>
            <View className="cd-info">
              <Text className="cd-name">还没有设置目标考试</Text>
              <Text className="cd-date">去「课程」页添加</Text>
            </View>
          </View>
        </View>
      )}

      {/* 今日复习闪卡（紧跟倒计时） */}
      {curNote ? (
        <View className="card">
          <View className="card-title">
            <Text>🧠 今日复习</Text>
            <Text className="sub">
              {Math.min(reviewDone + 1, reviewTotal)}/{reviewTotal} · 第 {curNote.reviewStep + 1} 轮
            </Text>
          </View>
          <View className="flashcard" key={curNote.id} onClick={() => setFlipped((v) => !v)}>
            <View className={`flash-inner ${flipped ? 'flipped' : ''}`}>
              <View className="flash-face flash-front">
                <Text className="flash-text">{curNote.text}</Text>
                <Text className="sub" style={{ fontSize: 11 }}>
                  尽力回忆要点，点击翻面
                </Text>
              </View>
              <View className="flash-face flash-back">
                <View className="sub" style={{ marginBottom: 4, textAlign: 'center' }}>
                  {curNote.tags.map((t) => (
                    <Text className="tag" key={t}>
                      {t}
                    </Text>
                  ))}
                  记录于 {new Date(curNote.createdAt).toLocaleDateString('zh-CN')}
                </View>
                <View className="flash-btns">
                  <View
                    className="btn small ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      answerReview(false)
                    }}
                  >
                    忘记 😵
                  </View>
                  <View
                    className="btn small"
                    onClick={(e) => {
                      e.stopPropagation()
                      answerReview(true)
                    }}
                  >
                    认识 😀
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      ) : reviewDone > 0 ? (
        <View className="card">
          <Text className="empty">🎉 今日复习完成，明天见！</Text>
        </View>
      ) : reviewPool > 0 ? (
        <View className="card">
          <Text className="empty">🧠 今日无待复习卡片（池中共 {reviewPool} 张）</Text>
        </View>
      ) : null}

      {/* 天气：直接展示 */}
      <View className="card">
        {data.settings.city ? (
          weather ? (
            <>
              <View className="card-title">
                <Text>📍 {cityLabel(data.settings.city)}</Text>
                <View className="row">
                  <View
                    className="icon-btn"
                    style={{ fontSize: 13 }}
                    onClick={() => setLocOpen(true)}
                  >
                    🧭
                  </View>
                  <View
                    className="icon-btn"
                    style={{ fontSize: 13, opacity: weatherLoading ? 0.5 : 1 }}
                    onClick={() => {
                      if (!weatherLoading) loadWeather()
                    }}
                  >
                    {weatherLoading ? '…' : '🔄'}
                  </View>
                </View>
              </View>
              <View className="weather-line">
                <Text className="temp">{weather.temp}°C</Text>
                <Text className="sub">
                  {weather.desc} · {weather.tMin}~{weather.tMax}°C
                </Text>
              </View>
              <Text className="sub" style={{ marginTop: 2 }}>
                体感 {weather.feels}°C · 湿度 {weather.humidity}%
                {weather.rainProb >= 40 ? ' · ☔ 记得带伞' : ''}
                {weather.tMin <= 10 ? ' · 🧥 注意保暖' : ''}
              </Text>
            </>
          ) : (
            <Text className="sub">{weatherLoading ? '天气加载中…' : '天气获取失败，点右上角重试'}</Text>
          )
        ) : (
          <View className="row-between">
            <Text className="sub">设置城市后显示天气提醒</Text>
            <View
              className="btn ghost small"
              onClick={() => Taro.switchTab({ url: '/pages/settings/index' })}
            >
              去设置
            </View>
          </View>
        )}
      </View>

      {/* 每日一句：直接展示 */}
      <View className="card">
        <View className="card-title">
          <Text>💡 每日一句</Text>
          <View className="icon-btn" onClick={cycleQuote}>
            🔄
          </View>
        </View>
        <Text className="quote-text">{quote}</Text>
      </View>

      {/* 今日三件事 */}
      <View className="card">
        <View className="card-title">
          <Text>🎯 今日三件事</Text>
          <Text className="sub">
            {threeThings.filter((t) => t.text && t.done).length}/
            {threeThings.filter((t) => t.text).length}
          </Text>
        </View>
        {threeThings.map((thing, i) => (
          <View className="list-item" key={i}>
            <View
              className={`ms-check${thing.done ? ' on' : ''}`}
              style={thing.text ? undefined : { opacity: 0.35 }}
              onClick={() => {
                if (!thing.text) return
                const items = threeThings.map((t, j) =>
                  j === i ? { ...t, done: !t.done } : t
                )
                updateThings(items)
              }}
            >
              {thing.done ? '✓' : ''}
            </View>
            <Input
              className="grow"
              style={{ border: 'none', padding: '4px 0', borderRadius: 0 }}
              placeholder={`第 ${i + 1} 件重要的事`}
              value={thing.text}
              onInput={(e) => {
                const items = threeThings.map((t, j) =>
                  j === i ? { ...t, text: e.detail.value } : t
                )
                updateThings(items)
              }}
            />
          </View>
        ))}
      </View>

      {/* 临近一餐卡：仅当前时间落在某餐前 2h 窗口内显示 */}
      {nearMeal && (
        <View className={`card ${dayLog.meals[nearMeal.key] ? 'done-state' : nearMeal.diff >= 0 ? 'due' : ''}`}>
          <View className="hero-tip">
            <Text className="emoji">{dayLog.meals[nearMeal.key] ? '✅' : nearMeal.emoji}</Text>
            <View className="grow" style={{ flex: 1 }}>
              <View className="row-between">
                <Text>
                  {nearMeal.label} {nearMeal.time}
                </Text>
                {dayLog.meals[nearMeal.key] ? (
                  <Text className="chip success">已吃</Text>
                ) : nearMeal.diff >= 0 ? (
                  <Text className="chip warn">该吃饭了</Text>
                ) : (
                  <Text className="sub">还有 {fmtHM(Math.max(0, -nearMeal.diff))}</Text>
                )}
              </View>
              {data.foodLog[today]?.[nearMeal.key as MealSlot] && (
                <Text className="sub" style={{ marginTop: 2 }}>
                  今天吃的是「{data.foodLog[today]?.[nearMeal.key as MealSlot]}」
                </Text>
              )}
              {!dayLog.meals[nearMeal.key] && (
                <View className="row" style={{ marginTop: 8, flexWrap: 'wrap' }}>
                  <View
                    className="btn small"
                    onClick={() => updateLog({ meals: { ...dayLog.meals, [nearMeal.key]: true } })}
                  >
                    吃过了
                  </View>
                  <View className="btn ghost small" onClick={() => void openMeituanWaimai()}>
                    美团 ↗
                  </View>
                  <View
                    className="btn ghost small"
                    onClick={() => showToast('请在微信内搜索「饿了么」小程序下单')}
                  >
                    饿了么 ↗
                  </View>
                  <View
                    className="btn plain small"
                    onClick={() => Taro.navigateTo({ url: '/pages/food/index' })}
                  >
                    帮我选 🎲
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* 下一餐预告：不在任何一餐互动窗口内时常驻显示 */}
      {!nearMeal && nextMeal && (
        <View className="card next-meal">
          <View className="hero-tip">
            <Text className="emoji">{nextMeal.emoji}</Text>
            <View style={{ flex: 1 }}>
              <View className="row-between">
                <Text>
                  下一餐 · {nextMeal.label} {nextMeal.time}
                </Text>
                <Text className="sub">还有 {fmtHM(nextMeal.diff)}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 喝水 */}
      <View className={`card ${waterDue ? 'due' : ''}`}>
        <View className="hero-tip">
          <Text className="emoji">{waterDue ? '💧' : '🥤'}</Text>
          <View style={{ flex: 1 }}>
            <View className="row-between">
              <Text>喝水</Text>
              <Text className={waterDue ? 'chip warn' : 'sub'}>
                {waterDue ? '该喝水啦' : `每 ${data.settings.water.intervalMin} 分钟一杯`}
              </Text>
            </View>
            <View className="progress">
              <View
                className="progress-fill"
                style={{
                  width: `${Math.min(100, (dayLog.water.length / data.settings.water.targetCups) * 100)}%`,
                }}
              />
            </View>
            <View className="row-between">
              <Text className="sub">
                今日 {dayLog.water.length}/{data.settings.water.targetCups} 杯
              </Text>
              <View className="btn small" onClick={openWaterQuiz}>
                喝一杯 💧
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 今日打卡 */}
      <View className="card">
        <View className="card-title">
          <Text>✅ 今日打卡</Text>
          <Text className="sub">
            {(data.checkins[today] ?? []).length}/{data.checkinItems.length}
          </Text>
        </View>
        {data.checkinItems.length === 0 && <Text className="empty">去「打卡」页添加打卡项</Text>}
        {data.checkinItems.map((item) => {
          const checked = (data.checkins[today] ?? []).includes(item.id)
          return (
            <View className={`list-item ${checked ? 'done' : ''}`} key={item.id}>
              <View
                className={`ms-check${checked ? ' on' : ''}`}
                onClick={() => {
                  const cur = data.checkins[today] ?? []
                  const next = checked ? cur.filter((x) => x !== item.id) : [...cur, item.id]
                  set('checkins', (prev) => ({ ...prev, [today]: next }))
                }}
              >
                {checked ? '✓' : ''}
              </View>
              <Text className="grow name">
                {item.emoji} {item.name}
              </Text>
              <View
                className="btn small ghost"
                onClick={() => {
                  const cur = data.checkins[today] ?? []
                  if (!cur.includes(item.id))
                    set('checkins', (prev) => ({ ...prev, [today]: [...cur, item.id] }))
                }}
              >
                打卡
              </View>
            </View>
          )
        })}
      </View>

      {/* 睡眠督促：仅 19:30 后显示（固定区尾部） */}
      {showSleep && (
        <View className={`card ${sleepDue ? 'due' : ''}`}>
          <View className="hero-tip">
            <Text className="emoji">{sleepDue ? '😴' : '🌙'}</Text>
            <View style={{ flex: 1 }}>
              <View className="row-between">
                <Text>睡眠督促</Text>
                <Text className={sleepDue ? 'chip warn' : 'sub'}>
                  {sleepDue ? '该睡觉了，别刷手机！' : '距睡觉还有 ' + fmtHM(Math.max(0, sleepMin - minute))}
                </Text>
              </View>
              <Text className="sub" style={{ marginTop: 4 }}>
                目标：{data.settings.wake} 起床 · {data.settings.sleep} 睡觉
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* 位置设置弹窗：自动检测定位 + 手动搜索（支持区县） */}
      {locOpen && (
        <View className="modal-mask center" catchMove>
          <View className="modal">
            <View className="card-title">
              <Text>📍 所在位置</Text>
              <View className="quiz-close" onClick={() => setLocOpen(false)}>
                ✕
              </View>
            </View>
            {data.settings.city && (
              <Text className="sub" style={{ marginBottom: 8 }}>
                当前：{cityLabel(data.settings.city)}
              </Text>
            )}
            <View
              className={`btn${locDetecting ? ' is-disabled' : ''}`}
              style={{ width: '100%' }}
              onClick={() => void detectLocation()}
            >
              {locDetecting ? '📡 定位中…' : '📡 自动检测当前位置'}
            </View>
            <Text className="sub" style={{ textAlign: 'center', margin: '10px 0 6px' }}>
              或手动搜索（支持区县级，如 洛龙区）
            </Text>
            <View className="form-row">
              <View className="field" style={{ flex: 1, marginBottom: 0 }}>
                <Input
                  placeholder="城市 / 区县名"
                  value={locQuery}
                  onInput={(e) => setLocQuery(e.detail.value)}
                  onConfirm={() => void searchLoc()}
                />
              </View>
              <View
                className={`btn small${locSearching ? ' is-disabled' : ''}`}
                onClick={() => {
                  if (!locSearching) void searchLoc()
                }}
              >
                {locSearching ? '搜索中…' : '搜索'}
              </View>
            </View>
            {locCands.length > 0 && (
              <View style={{ marginTop: 10 }}>
                {locCands.map((c, i) => (
                  <View className="list-item" key={i} onClick={() => applyCity(c)}>
                    <Text className="grow">
                      {cityLabel(c)} <Text className="sub">{c.province}</Text>
                    </Text>
                    <Text className="sub">›</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      {/* 常识判断喝水题弹窗：先选中后提交，✕ 关闭不打卡 */}
      {waterQuiz && (
        <View className="modal-mask center" catchMove>
          <View className="modal quiz-modal">
            <View className="card-title">
              <Text>💧 喝水小考 · 常识判断</Text>
              <View className="quiz-close" onClick={() => setWaterQuiz(null)}>
                ✕
              </View>
            </View>
            <View className="quiz-q">{waterQuiz.q}</View>
            <View className="quiz-opts">
              {waterQuiz.options.map((opt, i) => {
                const answered = quizSubmitted || quizRevealed
                const state = quizPicked === i && !answered
                  ? 'sel'
                  : !answered
                    ? ''
                    : i === waterQuiz.answer
                      ? 'correct'
                      : quizPicked === i
                        ? 'wrong'
                        : ''
                return (
                  <View
                    key={i}
                    className={`quiz-opt ${state}`}
                    onClick={() => {
                      if (!answered) setQuizPicked(i)
                    }}
                  >
                    <Text className="grow">{opt}</Text>
                    {answered && i === waterQuiz.answer && <Text className="opt-mark">✓</Text>}
                    {answered && quizPicked === i && i !== waterQuiz.answer && (
                      <Text className="opt-mark">✗</Text>
                    )}
                    {!answered && quizPicked === i && <Text className="opt-mark pick">●</Text>}
                  </View>
                )
              })}
            </View>
            {!quizSubmitted && !quizRevealed && (
              <View className="row" style={{ marginTop: 12, gap: 8 }}>
                <View
                  className={`btn${quizPicked === null ? ' is-disabled' : ''}`}
                  style={{ flex: 1 }}
                  onClick={() => {
                    if (quizPicked !== null) setQuizSubmitted(true)
                  }}
                >
                  提交答案
                </View>
                <View
                  className="btn ghost"
                  style={{ flex: 1 }}
                  onClick={() => setQuizRevealed(true)}
                >
                  直接看答案
                </View>
              </View>
            )}
            {(quizSubmitted || quizRevealed) && (
              <View className="quiz-explain">
                <View style={{ fontWeight: 700, marginBottom: 4 }}>
                  <Text>
                    {quizSubmitted
                      ? quizPicked === waterQuiz.answer
                        ? '✅ 答对了！'
                        : '❌ 答错了，正确答案已标绿'
                      : '📌 正确答案已标绿'}
                  </Text>
                </View>
                <Text className="sub">{waterQuiz.explain}</Text>
                <View
                  className="btn small"
                  style={{ marginTop: 10, width: '100%' }}
                  onClick={recordWater}
                >
                  记录喝水 💧
                </View>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  )
}
