// 提醒 · 日期：原「周期提醒」与「重要日期」两页合并而成（2026-09 改版）
// 上卡 = 周期提醒：新增表单 + 列表；到期行「该做了！」高亮 + 行尾「做完了」一键重置周期
// 下卡 = 重要日期：新增表单 + 列表；倒计时（每年重复自动取今年/明年较近者）+ 提前提醒档位
// 两卡列表均用 TaskRow（tone 循环分色 / 点行弹 DetailSheet 详情 / 左滑删除二次确认），
// 超过 5 条卡内上下滑动（useListCapHeight 量高）；空态 = 卡通图 + 一句话 + 加号按钮（聚焦表单）
import { useState } from 'react'
import { Image, Input, ScrollView, Text, View } from '@tarojs/components'
import TaskRow from '../../components/TaskRow'
import DetailSheet from '../../components/DetailSheet'
import DatePicker, { fmtDateShort } from '../../components/DatePicker'
import Icon from '../../components/Icon'
import { useData } from '../../store'
import { appConfirm } from '../../components/ConfirmDialog'
import { subscribeRemind } from '../../services/api/proxy'
import type { ImportantDate, PeriodicTask } from '../../types'
import { addDays, daysBetween, pad2, todayStr, uid } from '../../utils/date'
import { useListCapHeight } from '../../utils/listCap'
import { showToast } from '../../utils/platform'
import animalPeriodic from '../../assets/images/小兔.png'
import animalDates from '../../assets/images/噜噜呐喊.png'

/** 提前提醒档位：当天 / 提前 1 / 3 / 7 天（可多选，命中当天早上 7:30 推送微信服务通知） */
const REMIND_OPTIONS = [0, 1, 3, 7]

/** 提前提醒档位显示文案：0 → 当天，其余 → 提前N天，升序顿号连接 */
const remindText = (days: number[]) =>
  [...days]
    .sort((a, b) => a - b)
    .map((d) => (d === 0 ? '当天' : `提前${d}天`))
    .join('、')

/** 每年重复的日期取今年/明年中较近的一次；2/29 等在平年不存在时取当月最后一天兜底。
 *  日期为 DatePicker 产出的 YYYY-MM-DD；非每年重复原样返回 */
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

export default function Reminders() {
  const { data, ready, set } = useData()
  const today = todayStr()

  // ---- 上卡「周期提醒」新增表单 ----
  const [pName, setPName] = useState('')
  const [pEvery, setPEvery] = useState('')
  // ---- 下卡「重要日期」新增表单 ----
  const [dName, setDName] = useState('')
  const [dDate, setDDate] = useState('')
  const [dYearly, setDYearly] = useState(false)
  const [dRemind, setDRemind] = useState<number[]>([])
  // ---- 空态加号按钮：点「＋」聚焦对应卡片的表单输入框（弹出键盘） ----
  const [focusKey, setFocusKey] = useState<'' | 'p' | 'd'>('')

  // ---- 周期详情弹窗草稿（点行弹出，草稿「保存」才写库） ----
  const [pDetailId, setPDetailId] = useState<string | null>(null)
  const [pDraftName, setPDraftName] = useState('')
  const [pDraftEvery, setPDraftEvery] = useState('')
  const [pDraftNote, setPDraftNote] = useState('')
  const pDetail = data.periodic.find((p) => p.id === pDetailId) ?? null

  // ---- 日期详情弹窗草稿（点行弹出，草稿「保存」才写库） ----
  const [dDetailId, setDDetailId] = useState<string | null>(null)
  const [dDraftName, setDDraftName] = useState('')
  const [dDraftDate, setDDraftDate] = useState('')
  const [dDraftYearly, setDDraftYearly] = useState(false)
  const [dDraftRemind, setDDraftRemind] = useState<number[]>([])
  const [dDraftNote, setDDraftNote] = useState('')
  const dDetail = data.dates.find((d) => d.id === dDetailId) ?? null

  // ---- 限 5 条卡内滑动：超条时量取前 5 条主行高度，容器定高内部滚动 ----
  const pCapH = useListCapHeight(
    '.rm-p-list',
    '.rm-p-list .task-row-main',
    data.periodic.length,
    5
  )
  const dCapH = useListCapHeight(
    '.rm-d-list',
    '.rm-d-list .task-row-main',
    data.dates.length,
    5
  )

  // ---- 周期列表：按下次触发日升序（过去最早 → 到期最久的排最前，今天到期次之，未来按近远） ----
  const pList = [...data.periodic].sort((a, b) =>
    addDays(a.lastDone, a.everyDays).localeCompare(addDays(b.lastDone, b.everyDays))
  )
  // 到期数（since >= everyDays）：卡片标题计数 + life 页角标同口径
  const pDueCount = data.periodic.filter(
    (p) => daysBetween(p.lastDone, today) >= p.everyDays
  ).length

  // ---- 日期列表：当天最前 → 未来按剩余天数升序 → 已过（非每年）沉底按逾期久近 ----
  const dList = [...data.dates].sort((a, b) => {
    const rank = (n: number) => (n === 0 ? -1e9 : n > 0 ? n : n + 1e9)
    return (
      rank(daysBetween(today, nextOccurrence(a.date, a.yearly))) -
      rank(daysBetween(today, nextOccurrence(b.date, b.yearly)))
    )
  })
  const dTodayCount = data.dates.filter(
    (d) => daysBetween(today, nextOccurrence(d.date, d.yearly)) === 0
  ).length

  // ---- 周期：新增（lastDone=今天，从今天起算周期） ----
  const addPeriodic = () => {
    if (!pName.trim()) {
      showToast('请输入事项名称')
      return
    }
    const days = Number(pEvery)
    if (!/^\d+$/.test(pEvery.trim()) || days < 1) {
      showToast('请输入间隔天数（至少 1 天的整数）')
      return
    }
    set('periodic', (prev) => [
      ...prev,
      { id: uid(), name: pName.trim(), everyDays: days, lastDone: today },
    ])
    setPName('')
    setPEvery('')
  }

  // ---- 周期：「做完了」= lastDone 重置为今天，下次日期按间隔顺延 ----
  const donePeriodic = (p: PeriodicTask) => {
    subscribeRemind() // 顺带请求一次性订阅授权（须在用户点击回调内同步发起，拒绝静默）
    set('periodic', (prev) => prev.map((x) => (x.id === p.id ? { ...x, lastDone: today } : x)))
  }

  // ---- 周期：删除（左滑 / 弹窗按钮，appConfirm 二次确认，不可逆操作） ----
  const removePeriodic = (id: string, label: string) => {
    void appConfirm(`删除「${label}」？`, undefined, { danger: true, confirmText: '删除' }).then(
      (ok) => {
        if (!ok) return
        set('periodic', (prev) => prev.filter((x) => x.id !== id))
        setPDetailId((cur) => (cur === id ? null : cur))
      }
    )
  }

  // 打开周期详情：带出名称/间隔/说明草稿
  const openPeriodicDetail = (p: PeriodicTask) => {
    setPDetailId(p.id)
    setPDraftName(p.name)
    setPDraftEvery(String(p.everyDays))
    setPDraftNote(p.note ?? '')
  }

  // 周期详情「保存」：名称/间隔/说明草稿写库
  const savePeriodicDetail = (p: PeriodicTask) => {
    if (!pDraftName.trim()) {
      showToast('请输入事项名称')
      return
    }
    const days = Number(pDraftEvery)
    if (!/^\d+$/.test(pDraftEvery.trim()) || days < 1) {
      showToast('请输入间隔天数（至少 1 天的整数）')
      return
    }
    set('periodic', (prev) =>
      prev.map((x) =>
        x.id === p.id
          ? { ...x, name: pDraftName.trim(), everyDays: days, note: pDraftNote.trim() || undefined }
          : x
      )
    )
    setPDetailId(null)
    showToast('已保存 ✓')
  }

  // ---- 日期：新增（设置了提醒时顺带请求一次性订阅授权） ----
  const addDate = () => {
    if (!dName.trim()) {
      showToast('请输入名称')
      return
    }
    if (!dDate) {
      showToast('请选择日期')
      return
    }
    if (dRemind.length) subscribeRemind()
    const days = [...dRemind].sort((a, b) => a - b)
    set('dates', (prev) => [
      ...prev,
      { id: uid(), name: dName.trim(), date: dDate, yearly: dYearly, remindDays: days },
    ])
    showToast(days.length ? '已添加，到期将推送提醒' : '已添加')
    setDName('')
    setDDate('')
    setDYearly(false)
    setDRemind([])
  }

  // 表单 / 弹窗的提前提醒档位勾选（草稿态各自独立）
  const toggleRemind = (day: number) =>
    setDRemind((prev) => (prev.includes(day) ? prev.filter((x) => x !== day) : [...prev, day]))
  const toggleDraftRemind = (day: number) =>
    setDDraftRemind((prev) => (prev.includes(day) ? prev.filter((x) => x !== day) : [...prev, day]))

  // 打开日期详情：带出名称/日期/重复/提醒/说明草稿
  const openDateDetail = (d: ImportantDate) => {
    setDDetailId(d.id)
    setDDraftName(d.name)
    setDDraftDate(d.date)
    setDDraftYearly(d.yearly)
    setDDraftRemind(d.remindDays ?? [])
    setDDraftNote(d.note ?? '')
  }

  // ---- 日期：删除（左滑 / 弹窗按钮，appConfirm 二次确认，不可逆操作） ----
  const removeDate = (id: string, label: string) => {
    void appConfirm(`删除「${label}」？`, undefined, { danger: true, confirmText: '删除' }).then(
      (ok) => {
        if (!ok) return
        set('dates', (prev) => prev.filter((x) => x.id !== id))
        setDDetailId((cur) => (cur === id ? null : cur))
      }
    )
  }

  // 日期详情「保存」：名称/日期/重复/提醒/说明草稿写库
  const saveDateDetail = (d: ImportantDate) => {
    if (!dDraftName.trim()) {
      showToast('请输入名称')
      return
    }
    if (!dDraftDate) {
      showToast('请选择日期')
      return
    }
    if (dDraftRemind.length) subscribeRemind()
    const days = [...dDraftRemind].sort((a, b) => a - b)
    set('dates', (prev) =>
      prev.map((x) =>
        x.id === d.id
          ? {
              ...x,
              name: dDraftName.trim(),
              date: dDraftDate,
              yearly: dDraftYearly,
              remindDays: days,
              note: dDraftNote.trim() || undefined,
            }
          : x
      )
    )
    setDDetailId(null)
    showToast('已保存 ✓')
  }

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
        <Text>⏰ 提醒 · 日期</Text>
      </View>
      <Text className="sub" style={{ display: 'block', marginTop: -6, marginBottom: 12 }}>
        🔔 到期 / 命中当天将通过微信「服务通知」提醒你（需授权订阅）
      </Text>

      {/* ==================== 上卡：周期提醒（表单 + 列表） ==================== */}
      <View className="card">
        <View className="tb-head">
          <Text className="tb-title">周期提醒</Text>
          <Text className="tb-count">
            {pDueCount ? `${pDueCount} 该做 · ` : ''}
            {data.periodic.length} 项
          </Text>
        </View>
        <View className="form-row">
          <View className="field" style={{ flex: 1, marginBottom: 0 }}>
            <Input
              placeholder="事项名称，如：洗衣服"
              value={pName}
              focus={focusKey === 'p'}
              onBlur={() => setFocusKey('')}
              onInput={(e) => setPName(e.detail.value)}
            />
          </View>
          <View className="field" style={{ width: 120, marginBottom: 0 }}>
            <Input
              type="number"
              placeholder="每几天"
              value={pEvery}
              onInput={(e) => setPEvery(e.detail.value)}
            />
          </View>
          <View className="btn small" onClick={addPeriodic}>
            <Text>添加</Text>
          </View>
        </View>
        <Text className="sub rm-add-tip">
          如：洗衣服（每 3 天）、给家里打电话（每 2 天）、换床单（每 14 天）
        </Text>

        {pList.length === 0 ? (
          // 空态：卡通图 + 一句话 + 加号按钮（点「＋」聚焦上方表单）
          <View className="tb-empty">
            <Image className="tb-empty-img" src={animalPeriodic} mode="aspectFit" />
            <Text className="tb-empty-text">添加需要定期做的事项</Text>
            <View className="tb-add-btn" onClick={() => setFocusKey('p')}>
              <Text>＋</Text>
            </View>
          </View>
        ) : (
          // 列表：到期的排前（按到期日升序）；超 5 条容器定高卡内滑动
          <ScrollView
            className="task-list rm-p-list"
            scrollY
            style={pCapH ? { height: `${pCapH}px` } : undefined}
          >
            {pList.map((p, i) => {
              const since = daysBetween(p.lastDone, today)
              const left = p.everyDays - since
              const due = left <= 0
              const next = addDays(p.lastDone, p.everyDays)
              return (
                <TaskRow
                  key={p.id}
                  tone={i % 5}
                  icon="🔁"
                  name={p.name}
                  onRowClick={() => openPeriodicDetail(p)}
                  onDelete={() => removePeriodic(p.id, p.name)}
                  meta={
                    <>
                      {due ? (
                        <Text className="tpill next today">该做了！（已隔 {since} 天）</Text>
                      ) : (
                        <Text className="tpill">还剩 {left} 天</Text>
                      )}
                      <Text className="tpill freq">每 {p.everyDays} 天</Text>
                      {!due && <Text className="tpill">下次 {fmtDateShort(next)}</Text>}
                      {due && (
                        // 行尾「做完了」：重置 lastDone=今天并顺延下次日期（阻断冒泡，避免弹详情）
                        <View
                          className="btn small"
                          style={{ marginLeft: 'auto' }}
                          onClick={(e) => {
                            e.stopPropagation()
                            donePeriodic(p)
                          }}
                        >
                          <Text>做完了</Text>
                        </View>
                      )}
                    </>
                  }
                />
              )
            })}
          </ScrollView>
        )}
      </View>

      {/* ==================== 下卡：重要日期（表单 + 列表） ==================== */}
      <View className="card">
        <View className="tb-head">
          <Text className="tb-title">重要日期</Text>
          <Text className="tb-count">
            {dTodayCount ? `${dTodayCount} 今天 · ` : ''}
            {data.dates.length} 个
          </Text>
        </View>
        <View className="form-row">
          <View className="field" style={{ flex: 1, marginBottom: 0 }}>
            <Input
              placeholder="名称，如：妈妈生日"
              value={dName}
              focus={focusKey === 'd'}
              onBlur={() => setFocusKey('')}
              onInput={(e) => setDName(e.detail.value)}
            />
          </View>
          <View className="field" style={{ marginBottom: 0 }}>
            <DatePicker value={dDate} onChange={setDDate} />
          </View>
          <View className="btn small" onClick={addDate}>
            <Text>添加</Text>
          </View>
        </View>
        <View
          className="row"
          style={{ marginTop: 8, fontSize: 16, color: 'var(--text-sub)' }}
          onClick={() => setDYearly((v) => !v)}
        >
          <View className={`ms-check${dYearly ? ' on' : ''}`}>
            {dYearly ? <Icon name="check" size={12} color="#fff" /> : null}
          </View>
          <Text>每年重复（生日 / 纪念日）</Text>
        </View>
        {/* 提前提醒：表单最后一块，与下方列表用分隔线隔开 */}
        <View
          className="row"
          style={{
            flexWrap: 'wrap',
            gap: 6,
            marginTop: 8,
            paddingBottom: 12,
            marginBottom: 12,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <Text className="sub" style={{ fontSize: 14, width: '100%' }}>
            提前提醒（可多选，命中当天早上 7:30 推送微信）
          </Text>
          {REMIND_OPTIONS.map((d) => (
            <Text
              key={d}
              className={`tag ${dRemind.includes(d) ? 'selected' : ''}`}
              onClick={() => toggleRemind(d)}
            >
              {d === 0 ? '当天' : `提前${d}天`}
            </Text>
          ))}
        </View>

        {dList.length === 0 ? (
          // 空态：卡通图 + 一句话 + 加号按钮（点「＋」聚焦上方表单）
          <View className="tb-empty" style={{ marginTop: 8 }}>
            <Image className="tb-empty-img" src={animalDates} mode="aspectFit" />
            <Text className="tb-empty-text">生日、纪念日、报名截止日…写下来就不会忘</Text>
            <View className="tb-add-btn" onClick={() => setFocusKey('d')}>
              <Text>＋</Text>
            </View>
          </View>
        ) : (
          // 列表：当天最前 → 未来按剩余天数升序；超 5 条容器定高卡内滑动
          <ScrollView
            className="task-list rm-d-list"
            scrollY
            style={dCapH ? { height: `${dCapH}px` } : undefined}
          >
            {dList.map((d, i) => {
              const target = nextOccurrence(d.date, d.yearly)
              const left = daysBetween(today, target)
              return (
                <TaskRow
                  key={d.id}
                  tone={i % 5}
                  icon="📌"
                  name={d.name}
                  onRowClick={() => openDateDetail(d)}
                  onDelete={() => removeDate(d.id, d.name)}
                  meta={
                    <>
                      {/* 倒计时：当天 .today 高亮，未来还有N天，已过（非每年）warn 提示 */}
                      {left === 0 ? (
                        <Text className="tpill next today">就是今天！</Text>
                      ) : left > 0 ? (
                        <Text className="tpill">还有 {left} 天</Text>
                      ) : (
                        <Text className="tpill warn">已过 {-left} 天</Text>
                      )}
                      <Text className="tpill freq">{fmtDateShort(target)}</Text>
                      {d.yearly && <Text className="tpill freq">每年</Text>}
                      {!!d.remindDays?.length && (
                        <Text className="tpill">🔔 {remindText(d.remindDays)}</Text>
                      )}
                    </>
                  }
                />
              )
            })}
          </ScrollView>
        )}
      </View>

      {/* 周期详情弹窗（无子项区）：草稿改名称/间隔/说明，显示下次提醒日，「保存」才写库 */}
      {pDetail && (
        <DetailSheet
          title="周期提醒详情"
          info={
            <>
              <View className="ck-form-label">
                <Text>事项名称</Text>
              </View>
              <View className="field ck-name-field">
                <Input
                  placeholder="如：洗衣服"
                  value={pDraftName}
                  maxlength={20}
                  onInput={(e) => setPDraftName(e.detail.value)}
                />
              </View>
              <View className="ck-form-label">
                <Text>间隔天数</Text>
              </View>
              <View className="field ck-name-field">
                <Input
                  type="number"
                  placeholder="每几天做一次"
                  value={pDraftEvery}
                  onInput={(e) => setPDraftEvery(e.detail.value)}
                />
              </View>
              <View className="ck-form-label">
                <Text>说明（选填）</Text>
              </View>
              <View className="field ck-name-field ck-note-field">
                <Input
                  placeholder="想补充的内容"
                  value={pDraftNote}
                  maxlength={30}
                  onInput={(e) => setPDraftNote(e.detail.value)}
                />
              </View>
              <Text className="sub">
                下次提醒：
                {fmtDateShort(
                  addDays(pDetail.lastDone, Math.max(1, Number(pDraftEvery) || 1))
                )}
              </Text>
            </>
          }
          onSave={() => savePeriodicDetail(pDetail)}
          onDelete={() => removePeriodic(pDetail.id, pDraftName.trim() || pDetail.name)}
          onClose={() => setPDetailId(null)}
        />
      )}

      {/* 日期详情弹窗（无子项区）：草稿改名称/日期/重复/提醒/说明，「保存」才写库 */}
      {dDetail && (
        <DetailSheet
          title="重要日期详情"
          info={
            <>
              <View className="ck-form-label">
                <Text>名称</Text>
              </View>
              <View className="field ck-name-field">
                <Input
                  placeholder="如：妈妈生日"
                  value={dDraftName}
                  maxlength={20}
                  onInput={(e) => setDDraftName(e.detail.value)}
                />
              </View>
              <View className="ck-form-label">
                <Text>日期</Text>
              </View>
              <View className="field ck-name-field">
                <DatePicker value={dDraftDate} onChange={setDDraftDate} />
              </View>
              <View
                className="row"
                style={{ marginTop: 10, fontSize: 15, color: 'var(--text-sub)' }}
                onClick={() => setDDraftYearly((v) => !v)}
              >
                <View className={`ms-check${dDraftYearly ? ' on' : ''}`}>
                  {dDraftYearly ? <Icon name="check" size={12} color="#fff" /> : null}
                </View>
                <Text>每年重复（生日 / 纪念日）</Text>
              </View>
              <View className="ck-form-label">
                <Text>提前提醒（可多选，命中当天早上 7:30 推送微信）</Text>
              </View>
              <View className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
                {REMIND_OPTIONS.map((d) => (
                  <Text
                    key={d}
                    className={`tag ${dDraftRemind.includes(d) ? 'selected' : ''}`}
                    onClick={() => toggleDraftRemind(d)}
                  >
                    {d === 0 ? '当天' : `提前${d}天`}
                  </Text>
                ))}
              </View>
              <View className="ck-form-label">
                <Text>说明（选填）</Text>
              </View>
              <View className="field ck-name-field ck-note-field">
                <Input
                  placeholder="想补充的内容"
                  value={dDraftNote}
                  maxlength={30}
                  onInput={(e) => setDDraftNote(e.detail.value)}
                />
              </View>
            </>
          }
          onSave={() => saveDateDetail(dDetail)}
          onDelete={() => removeDate(dDetail.id, dDraftName.trim() || dDetail.name)}
          onClose={() => setDDetailId(null)}
        />
      )}
    </View>
  )
}
