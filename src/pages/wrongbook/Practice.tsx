// 错题练习页（自错题本「开始刷题 / 重做此题」进入）：一屏一题刷卡作答
// 独立子页：无论点返回键还是「完成」，都先回错题本（而非退出错题本回到生活页）
// 左右滑动/箭头切题；点选项自动判分并展示答案解析；连续做对 3 次自动毕业
// 每题作答即时结算 FSRS（写入 quizBook），最后出小结
import { useEffect, useMemo, useRef, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { Text, View, type ITouchEvent } from '@tarojs/components'
import Icon from '../../components/Icon'
import { quizById } from '../../constants/water-quiz'
import { showToast } from '../../utils/platform'
import { settleQuizWrong, willGraduate } from '../../utils/quizBook'
import { useData } from '../../store'

/** 判定为切题的滑动距离（px） */
const SWIPE_THRESHOLD = 60

// Taro View 的触摸回调参数类型与 ITouchEvent 不完全对齐，统一用 any 接收后断言（同 SwipeRow）
type TouchEv = ITouchEvent

export default function Practice() {
  const { data, set } = useData()
  const router = useRouter()
  // 题目经路由传入：?ids=1,2,3（错题本入口生成）
  const quizIds = useMemo(
    () =>
      (router.params.ids ?? '')
        .split(',')
        .map(Number)
        .filter((n) => Number.isInteger(n) && n > 0),
    [router.params.ids]
  )

  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [right, setRight] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [gradCount, setGradCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [animating, setAnimating] = useState(false)
  const start = useRef({ x: 0, y: 0 })

  const total = quizIds.length
  const q = quizById(quizIds[idx])

  /** 返回错题本（正常从错题本进入；兜底：直链进入时重开错题本） */
  const close = () => {
    if (Taro.getCurrentPages().length > 1) Taro.navigateBack()
    else Taro.reLaunch({ url: '/pages/wrongbook/index' })
  }

  // 无题目（直链/热重载丢失参数）：提示后直接回错题本
  useEffect(() => {
    if (quizIds.length === 0) {
      showToast('没有题目可练习')
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** 滑出 → 换题 → 从反侧滑入 */
  const switchTo = (dir: 1 | -1) => {
    if (animating) return
    setAnimating(true)
    setDragX(dir * -500)
    setTimeout(() => {
      setIdx((i) => i + dir)
      setPicked(null)
      setAnimating(false)
      setDragX(dir * 500)
      setTimeout(() => {
        setAnimating(true)
        setDragX(0)
      }, 20)
    }, 200)
  }

  const onTouchStart = (e: any) => {
    const t = (e as TouchEv).touches[0]
    start.current = { x: t.clientX, y: t.clientY }
    setAnimating(false)
  }

  const onTouchMove = (e: any) => {
    const t = (e as TouchEv).touches[0]
    setDragX(t.clientX - start.current.x)
  }

  const onTouchEnd = (e: any) => {
    const t = (e as TouchEv).changedTouches[0]
    const dx = t.clientX - start.current.x
    if (dx <= -SWIPE_THRESHOLD && idx + 1 < total) switchTo(1)
    else if (dx >= SWIPE_THRESHOLD && idx > 0) switchTo(-1)
    else {
      setAnimating(true)
      setDragX(0)
    }
  }

  /** 单题结算：对 → 连对 +1（连对 3 次毕业）；错 → 重排清连对 */
  const settle = (quizId: number, correct: boolean): boolean => {
    const cur = data.quizBook.wrongs.find((w) => w.quizId === quizId)
    if (!cur) return false
    const graduated = willGraduate(cur, correct)
    set('quizBook', (prev) => settleQuizWrong(prev, quizId, correct))
    return graduated
  }

  /** 点选项：自动判分 + 即时结算 */
  const answer = (i: number) => {
    if (picked !== null || !q) return
    setPicked(i)
    const ok = i === q.answer
    const graduated = settle(q.id, ok)
    if (ok) {
      setRight((n) => n + 1)
      if (graduated) {
        setGradCount((n) => n + 1)
        showToast('连续做对 3 次，这题毕业啦')
      }
    } else {
      setWrong((n) => n + 1)
    }
  }

  const next = () => {
    if (idx + 1 < total) switchTo(1)
    else setFinished(true)
  }

  const restart = () => {
    setIdx(0)
    setPicked(null)
    setRight(0)
    setWrong(0)
    setGradCount(0)
    setFinished(false)
  }

  // 小结：全部做完
  if (finished || !q) {
    return (
      <View className="wb-practice">
        <View className="row-between">
          <Text style={{ fontWeight: 600 }}>本轮小结</Text>
          <View onClick={close}>
            <Icon name="x" size={18} />
          </View>
        </View>
        <View className="card" style={{ marginTop: 14 }}>
          <View className="stat-row">
            <View className="stat">
              <Text className="stat-num">{right}</Text>
              <Text className="stat-label">做对</Text>
            </View>
            <View className="stat">
              <Text className="stat-num">{wrong}</Text>
              <Text className="stat-label">做错</Text>
            </View>
            <View className="stat">
              <Text className="stat-num">{gradCount}</Text>
              <Text className="stat-label">毕业</Text>
            </View>
          </View>
          <Text className="sub" style={{ display: 'block', marginTop: 10, textAlign: 'center' }}>
            做错的题明天会重新排期，连对 3 次的题已移出复习队列
          </Text>
        </View>
        <View className="row" style={{ gap: 8, marginTop: 14 }}>
          <View className="btn ghost" style={{ flex: 1 }} onClick={restart}>
            再来一轮
          </View>
          <View className="btn" style={{ flex: 1 }} onClick={close}>
            完成
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="wb-practice">
      {/* 头部：进度 + 关闭 */}
      <View className="row-between">
        <Text className="sub">
          错题练习 · 第 {idx + 1} / {total} 题
        </Text>
        <View onClick={close}>
          <Icon name="x" size={18} />
        </View>
      </View>
      <View className="wb-prog">
        <View className="wb-prog-fill" style={{ width: `${((idx + 1) / total) * 100}%` }} />
      </View>

      {/* 刷卡区：下一张卡的影子 + 当前卡（跟手滑动） */}
      <View className="wb-deck">
        {idx + 1 < total && <View className="wb-deck-ghost" />}
        <View
          className={`wb-deck-card${animating ? ' anim' : ''}`}
          style={{ transform: `translateX(${dragX}px)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <View className="wb-seg">
            <View className="wb-seg-h">
              <View className="wb-seg-ic q">
                <Text>问</Text>
              </View>
              <Text className="wb-seg-t">{q.q}</Text>
            </View>
          </View>

          {q.options.map((opt, i) => {
            const answered = picked !== null
            let cls = 'wb-opt'
            if (answered) {
              if (i === q.answer) cls += ' correct'
              else if (i === picked) cls += ' wrong'
              else cls += ' dim'
            }
            return (
              <View key={i} className={cls} onClick={() => answer(i)}>
                <Text style={{ fontWeight: 600 }}>{String.fromCharCode(65 + i)}.</Text>
                <Text style={{ flex: 1 }}>{opt}</Text>
                {answered && i === q.answer && <Icon name="check" size={14} color="#2f9e6e" />}
                {answered && i === picked && i !== q.answer && <Icon name="x" size={14} color="#c0392b" />}
              </View>
            )
          })}

          {picked !== null && (
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
              <View className="wb-acts">
                <View className="btn small" onClick={next}>
                  {idx + 1 < total ? '下一题' : '完成练习'}
                </View>
              </View>
            </View>
          )}

          {picked === null && (
            <Text className="sub" style={{ display: 'block', marginTop: 14, textAlign: 'center' }}>
              点选项作答，左右滑动可切换题目
            </Text>
          )}
        </View>
      </View>

      {/* 底部：上一题 / 下一题 */}
      <View className="row" style={{ justifyContent: 'space-between', marginTop: 12 }}>
        <View
          className={`wb-pager-btn${idx <= 0 ? ' disabled' : ''}`}
          onClick={() => idx > 0 && switchTo(-1)}
        >
          ‹ 上一题
        </View>
        <Text className="sub">
          做对 {right} · 做错 {wrong}
        </Text>
        <View
          className={`wb-pager-btn${idx + 1 >= total ? ' disabled' : ''}`}
          onClick={() => idx + 1 < total && switchTo(1)}
        >
          下一题 ›
        </View>
      </View>
    </View>
  )
}
