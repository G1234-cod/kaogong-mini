// 课程与考试：考试 CRUD（模板节点/自定义节点/里程碑勾选）+ 录播课进度 CRUD（倒排每日需看节数）
// 自 PWA pages/Courses.tsx 迁移：DatePicker / MilestonePickerModal / appConfirm 均为 Phase 1 已 Taro 化组件
import { useState } from 'react'
import { Image, Input, Label, ScrollView, Text, View } from '@tarojs/components'
import Icon from '../../components/Icon'
import SwipeRow from '../../components/SwipeRow'
import animalEmpty from '../../assets/images/学士蛋.png'
import { useData } from '../../store'
import type { Course, Exam } from '../../types'
import DatePicker from '../../components/DatePicker'
import Modal from '../../components/Modal'
import MilestonePickerModal, {
  MilestonePickerContent,
  type PickedNode,
} from '../../components/MilestonePickerModal'
import { appConfirm } from '../../components/ConfirmDialog'
import { daysBetween, todayStr, uid } from '../../utils/date'
import { useTabSwipe } from '../../utils/tabSwipe'
import {
  GENERIC_EXAM_TEMPLATE,
  matchExamTemplate,
} from '../../utils/exam-templates'
import { showToast } from '../../utils/platform'

/** 考试类型主题色（每一个考试类型一种卡片）：tile 色点 + 倒计时大数字同色，兜底中性灰棕 */
const EXAM_TYPE_COLORS: Record<string, string> = {
  civil: '#be5016', // 公务员（国考/省考）主橙
  cet: '#4a6fa5', // 四六级 蓝
  kaoyan: '#2f9e6e', // 考研 绿
  teacher: '#b45309', // 教资 琥珀
  final: '#c0392b', // 期末/期中 红
}

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
    /* 课程 tile（米色块）：大卡内的课程分区，内拆「进度」「每日任务」两张白子卡 */
    <View className="tile">
      <View className="tile-head">
        <Text className="tile-name">{course.name}</Text>
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
            <Icon name="pencil" size={18} />
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
            <Icon name="trash" size={18} />
          </View>
        </View>
      </View>

      {/* 子卡A：看课进度 */}
      <View className="subcard">
        <View className="progress">
          <View className="progress-fill" style={{ width: `${pct}%` }} />
        </View>
        <View className="row-between" style={{ marginTop: 6 }}>
          <Text className="sub">
            {course.done}/{course.total} 节 · {pct}%
          </Text>
          <Text className="sub">目标 {course.targetDate}</Text>
        </View>
      </View>

      {/* 子卡B：每日任务一行——信息精简为一句话 + 按钮组右对齐（需求3，窄屏不再折行） */}
      {!finished && (
        <View className="subcard">
          <View className="cc-line">
            {daysLeft > 0 ? (
              <Text className="cc-line-info">
                剩 <Text className={`cc-num${daysLeft <= 7 ? ' warn' : ''}`}>{daysLeft}</Text> 天 · 每天看{' '}
                <Text className="cc-num">{perDay}</Text> 节
              </Text>
            ) : (
              <Text className="cc-line-info">
                已过目标 · 还差 <Text className="cc-num danger">{course.total - course.done}</Text> 节
              </Text>
            )}
            <View className="cc-line-btns">
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
  // 节点区是否展开：默认收起只显示「下一个节点」，解决节点多时一卡占满一屏
  const [expanded, setExpanded] = useState(false)
  const today = todayStr()
  const left = daysBetween(today, exam.date)

  // 当前类型：显式记录 > 名称匹配 > 通用
  const curType = exam.templateType ?? matchExamTemplate(exam.name)?.type ?? GENERIC_EXAM_TEMPLATE.type
  // 类型主题色：tile 色点 + 倒计时大数字同色（每一个考试类型一种卡片）
  const typeColor = EXAM_TYPE_COLORS[curType] ?? '#7a6a5b'

  const save = (patch: Partial<Exam>) =>
    set('exams', (prev) => prev.map((e) => (e.id === exam.id ? { ...e, ...patch } : e)))

  /** 弹窗勾选后追加节点：已添加的节点由弹窗（existingLabels）排除，仅追加新勾选节点 */
  const applyPicked = (nodes: PickedNode[], templateType: string, examDate: string) => {
    setTplOpen(false)
    save({
      templateType,
      date: examDate,
      milestones: [
        ...exam.milestones,
        ...nodes.map((n) => ({ id: uid(), label: n.label, date: n.date, done: n.date < today })),
      ],
    })
    showToast(`已新增 ${nodes.length} 个节点`)
  }

  const addMilestone = () => {
    if (!label.trim()) {
      showToast('请输入节点名称')
      return
    }
    if (!date) {
      showToast('请选择节点日期')
      return
    }
    save({
      milestones: [...exam.milestones, { id: uid(), label: label.trim(), date, done: date < today }],
    })
    setLabel('')
    setDate('')
  }

  /** 左滑删除节点（SwipeRow 触发）：先 appConfirm 确认再删（不可逆操作二次确认） */
  const removeMilestone = (id: string, label: string) => {
    void appConfirm(`删除节点「${label}」？`, undefined, { danger: true, confirmText: '删除' }).then(
      (ok) => {
        if (ok) save({ milestones: exam.milestones.filter((x) => x.id !== id) })
      }
    )
  }

  // 未完成在上、完成沉底；同状态内按日期升序（改日期后自动重排）
  const sortedMilestones = [...exam.milestones].sort(
    (a, b) => Number(a.done) - Number(b.done) || a.date.localeCompare(b.date)
  )
  // 折叠态摘要：已完成数 + 下一个待办节点（未完成里日期最近的）
  const doneCount = exam.milestones.filter((m) => m.done).length
  const next = sortedMilestones.find((m) => !m.done)
  const nextLeft = next ? daysBetween(today, next.date) : 0
  const milestoneItems = sortedMilestones.map((m) => (
    <SwipeRow key={m.id} onDelete={() => removeMilestone(m.id, m.label)}>
      <View className={`list-item ${m.done ? 'done' : ''}`}>
        <View
          className={`ms-check${m.done ? ' on' : ''}`}
          onClick={() =>
            save({
              milestones: exam.milestones.map((x) => (x.id === m.id ? { ...x, done: !x.done } : x)),
            })
          }
        >
          {m.done ? <Icon name="check" size={12} color="#fff" /> : null}
        </View>
        <View className="grow ms-line">
          <Text className="name">{m.label}</Text>
          <DatePicker
            compact
            value={m.date}
            onChange={(d) =>
              save({
                // 改日期后按「早于今天 = 已完成」重新判定，排序随之刷新
                milestones: exam.milestones.map((x) =>
                  x.id === m.id ? { ...x, date: d, done: d < today } : x
                ),
              })
            }
          />
        </View>
      </View>
    </SwipeRow>
  ))

  return (
    /* 考试 tile（米色块）：内拆「时间倒计时」「节点信息」两张白子卡（需求2） */
    <View className="tile">
      <View className="tile-head">
        <View className="tile-dot" style={{ background: typeColor }} />
        <Text className="tile-name">{exam.name}</Text>
        <View className="row" style={{ flexShrink: 0 }}>
          <View className="icon-btn" onClick={() => setTplOpen(true)}>
            <Icon name="clipboard" size={18} />
          </View>
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
            <Icon name="trash" size={18} />
          </View>
        </View>
      </View>

      {/* 子卡A：考试时间与倒计时（大数字用类型主题色） */}
      <View className="subcard">
        <View className="exam-cd">
          <Text className="exam-cd-num" style={{ color: typeColor }}>
            {Math.abs(left)}
            <Text className="exam-cd-unit">
              {left > 0 ? '天后考试' : left === 0 ? '今天考试' : '天前已考'}
            </Text>
          </Text>
          <Text className="exam-cd-date">考试日 {exam.date}</Text>
        </View>
      </View>

      {/* 子卡B：节点信息（空态引导 / 下一节点 / 摘要 / 橱窗 / 添加表单） */}
      <View className="subcard">

      {exam.milestones.length === 0 && (
        <View className="empty" onClick={() => setTplOpen(true)}>
          <View className="row" style={{ justifyContent: 'center' }}>
            <Icon name="clipboard" size={16} gap={4} />
            <Text>还没有节点，点此勾选模板节点</Text>
          </View>
          <Text className="note-sub">或在下方手动添加</Text>
        </View>
      )}

      {exam.milestones.length > 0 && (
        <>
          {/* 下一个节点摘要（skill 审计精修）：两行结构不变；去「卡中卡」底色块改由分隔线分组，
              日期为次要信息降级为纯色文字（今天黄 / 过期红），不再占彩色胶囊容器 */}
          <View className="exam-next">
            {next ? (
              <>
                <Text className="exam-next-label">🎯 下一个节点</Text>
                <View className="exam-next-main">
                  <Text className="exam-next-name">{next.label}</Text>
                  <Text
                    className={`exam-next-date${nextLeft === 0 ? ' today' : nextLeft < 0 ? ' over' : ''}`}
                  >
                    {`${next.date.slice(5)} · ${
                      nextLeft > 0 ? `还剩 ${nextLeft} 天` : nextLeft === 0 ? '就是今天' : '已过期'
                    }`}
                  </Text>
                </View>
              </>
            ) : (
              <View className="exam-next-main">
                <Text className="exam-next-name">🎉 全部节点已完成</Text>
              </View>
            )}
          </View>
          {/* 摘要行（skill 审计精修）：两个胶囊合并为一行灰字，节点数不再重复 */}
          <View className="exam-sum">
            <Text className="exam-sum-txt">
              已过 {doneCount} / {exam.milestones.length} 个节点
            </Text>
            <View className="exam-toggle" onClick={() => setExpanded((v) => !v)}>
              <Text>{expanded ? '收起节点' : '查看全部'}</Text>
              <Icon name={expanded ? 'arrow-up' : 'arrow-down'} size={14} />
            </View>
          </View>
          {/* 展开区（skill 审计精修）：节点橱窗一次只露 4 行；小程序 scroll-view 纵向滚动
              需固定 height，故按节点数动态算高（≤4 行时刚好包住不滚动，>4 行固定 4 行高） */}
          {expanded && (
            <ScrollView
              scrollY
              className="ms-window"
              style={{ marginTop: 12, height: Math.min(sortedMilestones.length, 4) * 55 }}
            >
              {milestoneItems}
            </ScrollView>
          )}
        </>
      )}

      {/* 添加节点表单：无节点时始终显示；有节点时展开才显示 */}
      {(exam.milestones.length === 0 || expanded) && (
        <View className="form-row" style={{ marginTop: 12 }}>
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
      )}

      </View>

      {tplOpen && (
        <MilestonePickerModal
          examName={exam.name}
          examDate={exam.date}
          initialType={curType}
          existingLabels={exam.milestones.map((m) => m.label)}
          onConfirm={applyPicked}
          onClose={() => setTplOpen(false)}
        />
      )}
    </View>
  )
}

/** 「添加考试」页面中心弹窗（Q1）：名称 + 考试日期 + 节点模板选择 + 模板/自定义节点勾选（Q2），
    一步创建，不再底部弹层两段式 */
function AddExamModal({
  name,
  onName,
  onCancel,
  onCreate,
}: {
  name: string
  onName: (v: string) => void
  onCancel: () => void
  onCreate: (nodes: PickedNode[], templateType: string, examDate: string) => void
}) {
  const [picked, setPicked] = useState<{
    nodes: PickedNode[]
    type: string
    date: string
  }>({ nodes: [], type: '', date: '' })

  const submit = () => {
    if (!name.trim()) {
      showToast('请输入考试名称')
      return
    }
    if (!picked.date) {
      showToast('请选择考试日期')
      return
    }
    onCreate(picked.nodes, picked.type, picked.date)
  }

  return (
    <Modal variant="center" onClose={onCancel} closeOnMask={false}>
      <View className="card-title" style={{ marginBottom: 8 }}>
        <Text>添加考试</Text>
        <View className="icon-btn" onClick={onCancel}>
          <Icon name="x" size={18} />
        </View>
      </View>
      <View className="field">
        <Text className="sub" style={{ display: 'block', marginBottom: 4 }}>
          考试名称
        </Text>
        <Input
          placeholder="如 2027 国考、省考笔试"
          value={name}
          onInput={(e) => onName(e.detail.value)}
        />
      </View>
      {/* 节点选择与「选择节点」弹窗同款：考试日期 + 节点模板 + 模板节点勾选 + 自定义节点 */}
      <MilestonePickerContent
        examDate=""
        initialType={matchExamTemplate(name)?.type}
        onChange={(nodes, type, date) => setPicked({ nodes, type, date })}
      />
      <View className="row" style={{ gap: 10, marginTop: 12 }}>
        <View className="btn ghost" style={{ flex: 1 }} onClick={onCancel}>
          取消
        </View>
        <View className="btn" style={{ flex: 2 }} onClick={submit}>
          创建考试 · {picked.nodes.length} 个节点
        </View>
      </View>
    </Modal>
  )
}

/** 「添加课程」页面中心弹窗（问题1）：课程名 + 总节数 + 目标完成日，一步创建，不再底部大表单 */
function AddCourseModal({
  onCancel,
  onCreate,
}: {
  onCancel: () => void
  onCreate: (name: string, total: string, targetDate: string) => void
}) {
  const [name, setName] = useState('')
  const [total, setTotal] = useState('')
  const [targetDate, setTargetDate] = useState('')

  const submit = () => {
    if (!name.trim()) {
      showToast('请输入课程名')
      return
    }
    if (!total) {
      showToast('请输入总节数')
      return
    }
    if (!targetDate) {
      showToast('请选择目标完成日')
      return
    }
    onCreate(name.trim(), total, targetDate)
  }

  return (
    <Modal variant="center" onClose={onCancel} closeOnMask={false}>
      <View className="card-title" style={{ marginBottom: 8 }}>
        <Text>添加课程</Text>
        <View className="icon-btn" onClick={onCancel}>
          <Icon name="x" size={18} />
        </View>
      </View>
      <View className="field">
        <Text className="sub" style={{ display: 'block', marginBottom: 4 }}>
          课程名
        </Text>
        <Input placeholder="如：行测系统班" value={name} onInput={(e) => setName(e.detail.value)} />
      </View>
      <View className="form-row">
        <View className="field" style={{ flex: 'none', width: 100 }}>
          <Text className="sub" style={{ display: 'block', marginBottom: 4 }}>
            总节数
          </Text>
          <Input type="number" placeholder="80" value={total} onInput={(e) => setTotal(e.detail.value)} />
        </View>
        <View className="field" style={{ flex: 1, minWidth: 0 }}>
          <Text className="sub" style={{ display: 'block', marginBottom: 4 }}>
            目标完成日
          </Text>
          <DatePicker value={targetDate} onChange={setTargetDate} />
        </View>
      </View>
      <View className="row" style={{ gap: 10, marginTop: 12 }}>
        <View className="btn ghost" style={{ flex: 1 }} onClick={onCancel}>
          取消
        </View>
        <View className="btn" style={{ flex: 2 }} onClick={submit}>
          创建课程
        </View>
      </View>
    </Modal>
  )
}

export default function Courses() {
  const { data, ready, set } = useData()
  const tabSwipe = useTabSwipe(1)
  const [examName, setExamName] = useState('')
  // 「添加考试」页面中心弹窗（标题行按钮 / 空态卡点击均弹出），弹窗内一步完成节点选择
  const [addOpen, setAddOpen] = useState(false)
  // 「添加课程」页面中心弹窗（问题1：仿添加考试，底部大表单已移除）
  const [addCourseOpen, setAddCourseOpen] = useState(false)
  const today = todayStr()

  // 课程弹窗确认回调：字段校验已由 AddCourseModal 内部完成，此处直接落库
  const createCourse = (name: string, total: string, targetDate: string) => {
    const course: Course = {
      id: uid(),
      name,
      total: Math.max(1, Number(total)),
      done: 0,
      targetDate,
      createdAt: today,
    }
    set('courses', (prev) => [...prev, course])
    showToast(`已添加课程「${course.name}」`)
    setAddCourseOpen(false)
  }

  const createExam = (nodes: PickedNode[], templateType: string, examDate: string) => {
    const exam: Exam = {
      id: uid(),
      name: examName.trim(),
      date: examDate,
      milestones: nodes.map((n) => ({ id: uid(), label: n.label, date: n.date, done: n.date < today })),
      templateType,
    }
    set('exams', (prev) => [...prev, exam])
    showToast(
      nodes.length > 0
        ? `已为「${exam.name}」生成 ${nodes.length} 个节点`
        : `已创建「${exam.name}」，可随时在卡片里添加节点`
    )
    setAddOpen(false)
    setExamName('')
  }

  if (!ready) {
    return (
      <View className="page">
        <View className="skeleton sk-card" />
        <View className="skeleton sk-card" />
        <View className="skeleton sk-card" />
      </View>
    )
  }

  // 模块头副标题（问题2）：考试取最近考试剩余天数，录播取进行中课程数
  const examLeftDays = data.exams.map((e) => daysBetween(today, e.date)).filter((d) => d > 0)
  const examSub =
    data.exams.length > 0
      ? examLeftDays.length > 0
        ? `最近的考试还有 ${Math.min(...examLeftDays)} 天`
        : '考试已全部结束'
      : '添加目标考试，倒计时提醒'
  const courseSub =
    data.courses.length > 0
      ? `${data.courses.filter((c) => c.done < c.total).length} 门课进行中`
      : '记录看课进度，自动倒排'

  return (
    <View className="page tab-page" {...tabSwipe}>
      <View className="page-title">
        <Icon name="book" size={16} gap={4} />
        <Text>课程与考试</Text>
      </View>

      {/* 大卡1：考试倒计时（需求1）——模块头收进卡内，卡内每个考试一张米色 tile */}
      <View className="card">
        <View className="module-head" style={{ marginTop: 0 }}>
          <Icon name="clock" size={18} color="#b45309" className="module-ico" />
          <View className="module-txt">
            <Text className="module-name">考试倒计时</Text>
            <Text className="module-sub">{examSub}</Text>
          </View>
          <View className="module-add" onClick={() => setAddOpen(true)}>
            ＋ 添加考试
          </View>
        </View>
        {data.exams.length === 0 && (
          <View className="state-card is-clickable" onClick={() => setAddOpen(true)}>
            <View className="emoji-badge">
              <Text className="emoji">🎯</Text>
            </View>
            <Text className="empty">添加目标考试（如 2027 国考），在弹窗里勾选报名、缴费等关键节点</Text>
            <View className="btn small">添加考试</View>
            <Image className="state-animal" src={animalEmpty} mode="aspectFit" />
          </View>
        )}
        {data.exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </View>

      {/* 大卡2：录播课进度（需求1）——卡内每门课一张米色 tile */}
      <View className="card">
        <View className="module-head module-course">
          <Icon name="book" size={18} color="#2f9e6e" className="module-ico" />
          <View className="module-txt">
            <Text className="module-name">录播课进度</Text>
            <Text className="module-sub">{courseSub}</Text>
          </View>
          <View className="module-add" onClick={() => setAddCourseOpen(true)}>
            ＋ 添加课程
          </View>
        </View>
        {data.courses.length === 0 && (
          <View className="state-card is-clickable" onClick={() => setAddCourseOpen(true)}>
            <View className="emoji-badge">
              <Text className="emoji">📚</Text>
            </View>
            <Text className="empty">添加你报的录播课，记录进度，自动倒排每天该看几节</Text>
            <View className="btn small">添加课程</View>
            <Image className="state-animal" src={animalEmpty} mode="aspectFit" />
          </View>
        )}
        {data.courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </View>

      {addOpen && (
        <AddExamModal
          name={examName}
          onName={setExamName}
          onCancel={() => setAddOpen(false)}
          onCreate={createExam}
        />
      )}
      {addCourseOpen && (
        <AddCourseModal onCancel={() => setAddCourseOpen(false)} onCreate={createCourse} />
      )}
    </View>
  )
}
 