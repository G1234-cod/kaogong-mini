// 考试节点模板（按考试名自动识别类型套用）
// 原样迁移自 PWA utils.ts；MilestonePickerModal 与考试表单共用

export interface ExamTemplate {
  type: string
  label: string
  /** 考试名关键词（命中即套用该模板） */
  keywords: string[]
  /** 节点：label + 相对考试日的偏移天数（负 = 考前 N 天，正 = 考后 N 天） */
  nodes: { label: string; offset: number }[]
}

export const EXAM_TEMPLATES: ExamTemplate[] = [
  {
    type: 'civil',
    label: '公务员（国考/省考）',
    keywords: ['国考', '省考', '公务员', '公考', '选调', '遴选'],
    nodes: [
      { label: '公告发布', offset: -120 },
      { label: '网上报名', offset: -45 },
      { label: '报名缴费', offset: -35 },
      { label: '打印准考证', offset: -7 },
      { label: '笔试', offset: 0 },
      { label: '成绩公布', offset: 45 },
      { label: '面试', offset: 75 },
      { label: '体检政审', offset: 100 },
    ],
  },
  {
    type: 'cet',
    label: '四六级',
    keywords: ['四级', '六级', 'cet', '四六级'],
    nodes: [
      { label: '报名开始', offset: -60 },
      { label: '打印准考证', offset: -10 },
      { label: '笔试', offset: 0 },
      { label: '成绩发布', offset: 67 },
    ],
  },
  {
    type: 'kaoyan',
    label: '考研',
    keywords: ['考研', '研究生', '硕士'],
    nodes: [
      { label: '预报名', offset: -90 },
      { label: '正式报名', offset: -80 },
      { label: '打印准考证', offset: -10 },
      { label: '初试', offset: 0 },
      { label: '成绩公布', offset: 60 },
      { label: '复试', offset: 100 },
    ],
  },
  {
    type: 'teacher',
    label: '教资',
    keywords: ['教资', '教师资格'],
    nodes: [
      { label: '报名', offset: -60 },
      { label: '打印准考证', offset: -7 },
      { label: '笔试', offset: 0 },
      { label: '成绩公布', offset: 40 },
      { label: '面试', offset: 60 },
    ],
  },
  {
    type: 'final',
    label: '期末/期中',
    keywords: ['期末', '期中'],
    nodes: [
      { label: '复习开始', offset: -14 },
      { label: '考试', offset: 0 },
    ],
  },
]

/** 通用模板：识别不出类型时的兜底 */
export const GENERIC_EXAM_TEMPLATE: ExamTemplate = {
  type: 'generic',
  label: '通用',
  keywords: [],
  nodes: [
    { label: '报名', offset: -60 },
    { label: '冲刺复习', offset: -14 },
    { label: '考试', offset: 0 },
  ],
}

/** 全部模板（含通用），供下拉选择 */
export const ALL_EXAM_TEMPLATES: ExamTemplate[] = [...EXAM_TEMPLATES, GENERIC_EXAM_TEMPLATE]

/** 按考试名匹配模板，识别不出返回 null */
export function matchExamTemplate(name: string): ExamTemplate | null {
  const n = name.toLowerCase()
  for (const t of EXAM_TEMPLATES) {
    if (t.keywords.some((k) => n.includes(k.toLowerCase()))) return t
  }
  return null
}
