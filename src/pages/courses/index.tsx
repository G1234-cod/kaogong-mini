// 课程与考试：考试 CRUD（模板节点/自定义节点/里程碑勾选）+ 录播课进度 CRUD（倒排每日需看节数）
// 自 PWA pages/Courses.tsx 迁移：DatePicker / MilestonePickerModal / appConfirm 均为 Phase 1 已 Taro 化组件
import { useState } from 'react'
import { Input, Label, Text, View } from '@tarojs/components'
import { useData } from '../../store'
import type { Course, Exam } from '../../types'
import DatePicker from '../../components/DatePicker'
import MilestonePickerModal, { type PickedNode } from '../../components/MilestonePickerModal'
import { appConfirm } from '../../components/ConfirmDialog'
import { daysBetween, todayStr, uid } from '../../utils/date'
import {
  ALL_EXAM_TEMPLATES,
  GENERIC_EXAM_TEMPLATE,
  matchExamTemplate,
} from '../../utils/exam-templates'
import { showToast } from '../../utils/platform'

function CourseCard({ course }: { course: Course }) {
  const { set } = useData()
  const [editing, setEditing] = useState(false)
  const today = todayStr()

  const total = Math.max(1, course.total)
  const pct = Math.round((course.done / total) * 100)
  const daysLeft = daysBetween(today, course.targetDate)
  const span = Math.max(1, daysBetween(course.createdAt, course.targetDate))
  const elapsed = Math.min(span, Math.max(0, daysBetween(course.createdAt, today)))
  const expectedPct = Math.round((elapsed / span) * 100)

  const finished = course.done >= course.total
  const lag = !finished && pct < expectedPct - 4
  const perDay = daysLeft > 0 ? Math.ceil((course.total - course.done) / daysLeft) : course.total - course.done

  const save = (patch: Partial<Course>) =>
    set('courses', (prev) => prev.map((c) => (c.id === course.id ? { ...c, ...patch } : c)))

  return (
    <View className="card">
      <View className="card-title">
        <Text style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {course.name}
        </Text>
        <View className="row" style={{ flexShrink: 0 }}>
          {finished ? (
            <Text className="badge ok">已完成 🎉</Text>
          ) : lag ? (
            <Text className="badge lag">进度落后</Text>
          ) : pct > expectedPct + 4 ? (
            <Text className="badge ahead">领先</Text>
          ) : (
            <Text className="badge ok">正常</Text>
          )}
          <View className="icon-btn" onClick={() => setEditing((v) => !v)}>
            ✏️
          </View>
          <View
            className="icon-btn"
            onClick={() => {
              void appConfirm(`删除课程「${course.name}」？`, undefined, {
                danger: true,
                confirmText: '删除',
              }).then((ok) => {
                if (ok) set('courses', (prev) => prev.filter((c) => c.id !== course.id))
              })
            }}
          >
            🗑
          </View>
        </View>
      </View>

      <View className="progress">
        <View className="progress-fill" style={{ width: `${pct}%` }} />
      </View>
      <View className="row-between sub">
        <Text className="sub">
          {course.done}/{course.total} 节 · {pct}%
        </Text>
        <Text className="sub">目标日期 {course.targetDate}</Text>
      </View>

      {!finished && (
        <View className="row-between" style={{ marginTop: 8 }}>
          <View className="sub" style={{ flex: 1, lineHeight: 1.5 }}>
            {daysLeft > 0 ? (
              <Text className="sub">
                还剩 <Text style={{ color: 'var(--danger)', fontWeight: 700 }}>{daysLeft}</Text> 天，每天需看{' '}
                <Text style={{ fontWeight: 700 }}>{perDay}</Text> 节
              </Text>
            ) : (
              <Text style={{ color: 'var(--danger)', fontWeight: 700 }}>
                已到/超过目标日期，还差 {course.total - course.done} 节
              </Text>
            )}
          </View>
          <View className="row">
            <View
              className="btn plain small"
              onClick={() => save({ done: Math.max(0, course.done - 1) })}
            >
              −1
            </View>
            <View
              className="btn small"
              onClick={() => save({ done: Math.min(course.total, course.done + 1) })}
            >
              看完一节 +1
            </View>
          </View>
        </View>
      )}

      {editing && (
        <View style={{ marginTop: 10 }}>
          <View className="field">
            <Label>课程名</Label>
            <Input value={course.name} onInput={(e) => save({ name: e.detail.value })} />
          </View>
          <View className="form-row">
            <View className="field">
              <Label>总节数</Label>
              <Input
                type="number"
                value={String(course.total)}
                onInput={(e) => save({ total: Math.max(1, Number(e.detail.value) || 1) })}
              />
            </View>
            <View className="field">
              <Label>目标完成日</Label>
              <DatePicker value={course.targetDate} onChange={(v) => save({ targetDate: v })} />
            </View>
          </View>
          <View className="btn ghost small" onClick={() => setEditing(false)}>
            完成
          </View>
        </View>
      )}
    </View>
  )
}

function ExamCard({ exam }: { exam: Exam }) {
  const { set } = useData()
  const [label, setLabel] = useState('')
  const [date, setDate] = useState('')
  const [tplOpen, setTplOpen] = useState(false)
  const today = todayStr()
  const left = daysBetween(today, exam.date)

  // 当前类型：显式记录 > 名称匹配 > 通用
  const curType = exam.templateType ?? matchExamTemplate(exam.name)?.type ?? GENERIC_EXAM_TEMPLATE.type
  const curTpl = ALL_EXAM_TEMPLATES.find((t) => t.type === curType) ?? GENERIC_EXAM_TEMPLATE

  const save = (patch: Partial<Exam>) =>
    set('exams', (prev) => prev.map((e) => (e.id === exam.id ? { ...e, ...patch } : e)))

  /** 弹窗勾选后替换节点：已有节点时先确认 */
  const applyPicked = (nodes: PickedNode[], templateType: string) => {
    setTplOpen(false)
    const apply = () => {
      save({
        templateType,
        milestones: nodes.map((n) => ({ id: uid(), label: n.label, date: n.date, done: n.date < today })),
      })
      showToast(`已生成 ${nodes.length} 个节点`)
    }
    if (exam.milestones.length === 0) {
      apply()
      return
    }
    void appConfirm(
      '替换现有节点？',
      `现有 ${exam.milestones.length} 个节点（含勾选状态）会被新选择的 ${nodes.length} 个节点替换`,
      { danger: true, confirmText: '替换' }
    ).then((ok) => {
      if (ok) apply()
    })
  }

  const addMilestone = () => {
    if (!label.trim() || !date) return
    save({ milestones: [...exam.milestones, { id: uid(), label: label.trim(), date, done: false }] })
    setLabel('')
    setDate('')
  }

  return (
    <View className="card">
      <View className="card-title">
        <Text>🎯 {exam.name}</Text>
        <View
          className="icon-btn"
          onClick={() => {
            void appConfirm(`删除考试「${exam.name}」及其节点？`, undefined, {
              danger: true,
              confirmText: '删除',
            }).then((ok) => {
              if (ok) set('exams', (prev) => prev.filter((e) => e.id !== exam.id))
            })
          }}
        >
          🗑
        </View>
      </View>
      <View className="row-between">
        <Text className="sub">考试日 {exam.date}</Text>
        <Text className="chip">
          {left > 0 ? `还剩 ${left} 天` : left === 0 ? '今天考试！' : `已过去 ${-left} 天`}
        </Text>
      </View>

      {/* 节点选择：点开弹窗勾选要哪些节点 */}
      <View className="row" style={{ marginTop: 8 }}>
        <Text className="sub" style={{ flexShrink: 0 }}>
          节点模板
        </Text>
        <View
          className="btn plain small"
          style={{ flex: 1, justifyContent: 'flex-start', textAlign: 'left' }}
          onClick={() => setTplOpen(true)}
        >
          {curTpl.label} · {exam.milestones.length} 个节点（点击选择 ✎）
        </View>
      </View>

      <View style={{ marginTop: 8 }}>
        {exam.milestones.map((m) => (
          <View className={`list-item ${m.done ? 'done' : ''}`} key={m.id}>
            <View
              className={`ms-check${m.done ? ' on' : ''}`}
              onClick={() =>
                save({
                  milestones: exam.milestones.map((x) =>
                    x.id === m.id ? { ...x, done: !x.done } : x
                  ),
                })
              }
            >
              {m.done ? '✓' : ''}
            </View>
            <View className="grow ms-line">
              <Text className="name">{m.label}</Text>
              <DatePicker
                compact
                value={m.date}
                onChange={(d) =>
                  save({
                    milestones: exam.milestones.map((x) => (x.id === m.id ? { ...x, date: d } : x)),
                  })
                }
              />
            </View>
            <View
              className="icon-btn"
              onClick={() => save({ milestones: exam.milestones.filter((x) => x.id !== m.id) })}
            >
              ✕
            </View>
          </View>
        ))}
        {exam.milestones.length === 0 && (
          <Text className="empty">还没有节点，点上方模板按钮勾选，或手动添加</Text>
        )}
      </View>

      <View className="form-row" style={{ marginTop: 8 }}>
        <View className="field" style={{ flex: 1, marginBottom: 0 }}>
          <Input
            placeholder="节点名称（如：报名）"
            value={label}
            onInput={(e) => setLabel(e.detail.value)}
          />
        </View>
        <View className="field" style={{ marginBottom: 0 }}>
          <DatePicker value={date} onChange={setDate} />
        </View>
        <View className="btn small" onClick={addMilestone}>
          添加
        </View>
      </View>

      {tplOpen && (
        <MilestonePickerModal
          examName={exam.name}
          examDate={exam.date}
          initialType={curType}
          onConfirm={applyPicked}
          onClose={() => setTplOpen(false)}
        />
      )}
    </View>
  )
}

export default function Courses() {
  const { data, ready, set } = useData()
  const [name, setName] = useState('')
  const [total, setTotal] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [examName, setExamName] = useState('')
  const [examDate, setExamDate] = useState('')
  // 新建考试：先弹窗勾选节点，确认后才真正创建
  const [picker, setPicker] = useState<{ name: string; date: string; initialType?: string } | null>(null)
  const today = todayStr()

  const addCourse = () => {
    if (!name.trim() || !total || !targetDate) return
    const course: Course = {
      id: uid(),
      name: name.trim(),
      total: Math.max(1, Number(total)),
      done: 0,
      targetDate,
      createdAt: today,
    }
    set('courses', (prev) => [...prev, course])
    setName('')
    setTotal('')
    setTargetDate('')
  }

  const openExamPicker = () => {
    if (!examName.trim() || !examDate) return
    const tpl = matchExamTemplate(examName)
    setPicker({ name: examName.trim(), date: examDate, initialType: tpl?.type })
  }

  const createExam = (nodes: PickedNode[], templateType: string) => {
    if (!picker) return
    const exam: Exam = {
      id: uid(),
      name: picker.name,
      date: picker.date,
      milestones: nodes.map((n) => ({ id: uid(), label: n.label, date: n.date, done: n.date < today })),
      templateType,
    }
    set('exams', (prev) => [...prev, exam])
    showToast(`已为「${exam.name}」生成 ${nodes.length} 个节点`)
    setPicker(null)
    setExamName('')
    setExamDate('')
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
        <Text>📚 课程与考试</Text>
      </View>

      <Text className="section-label" style={{ marginTop: 0 }}>
        考试倒计时
      </Text>
      {data.exams.length === 0 && (
        <View className="card">
          <Text className="empty">添加目标考试（如 2027 国考），在弹窗里勾选报名、缴费等关键节点</Text>
        </View>
      )}
      {data.exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
      <View className="card">
        <View className="form-row">
          <View className="field" style={{ flex: 1, marginBottom: 0 }}>
            <Input
              placeholder="考试名称（如 2027 国考）"
              value={examName}
              onInput={(e) => setExamName(e.detail.value)}
            />
          </View>
          <View className="field" style={{ marginBottom: 0 }}>
            <DatePicker value={examDate} onChange={setExamDate} />
          </View>
          <View className="btn small" onClick={openExamPicker}>
            添加
          </View>
        </View>
      </View>

      <Text className="section-label">录播课进度</Text>
      {data.courses.length === 0 && (
        <View className="card">
          <Text className="empty">添加你报的录播课，记录进度，自动倒排每天该看几节</Text>
        </View>
      )}
      {data.courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
      <View className="card">
        <View className="field">
          <Label>课程名</Label>
          <Input placeholder="如：行测系统班" value={name} onInput={(e) => setName(e.detail.value)} />
        </View>
        <View className="form-row">
          <View className="field">
            <Label>总节数</Label>
            <Input
              type="number"
              placeholder="80"
              value={total}
              onInput={(e) => setTotal(e.detail.value)}
            />
          </View>
          <View className="field">
            <Label>目标完成日</Label>
            <DatePicker value={targetDate} onChange={setTargetDate} />
          </View>
          <View className="btn small" onClick={addCourse}>
            添加
          </View>
        </View>
      </View>

      {/* 新建考试 · 节点勾选弹窗 */}
      {picker && (
        <MilestonePickerModal
          examName={picker.name}
          examDate={picker.date}
          initialType={picker.initialType}
          onConfirm={createExam}
          onClose={() => setPicker(null)}
        />
      )}
    </View>
  )
}
