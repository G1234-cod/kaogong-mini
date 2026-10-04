import { useState } from 'react'
import { View, Input, Text, ScrollView } from '@tarojs/components'
import Icon from './Icon'
import Modal from './Modal'
import type { CheckinFreq, CheckinItem } from '../types'
import { WEEKDAY_LABELS } from '../utils/checkin'

/** 频率六模式：选择器弹窗选项 + 对应参数区（星期 chips / 次数 stepper / 日期网格）+ 底部摘要 */
const FREQ_MODES: [CheckinFreq, string][] = [
  ['daily', '每天'],
  ['weekly', '每周选几天'],
  ['weeklyN', '每周 N 次'],
  ['monthlyN', '每月 N 次'],
  ['monthlyDays', '每月选几号'],
  ['dailyN', '每天 N 次'],
]
// N 次模式切换时的默认次数（每周 3 / 每月 10 / 每天 2）
const FREQ_COUNT_DEFAULT: Partial<Record<CheckinFreq, number>> = { weeklyN: 3, monthlyN: 10, dailyN: 2 }
// 需要「次数」参数的模式
const COUNT_MODES: CheckinFreq[] = ['weeklyN', 'monthlyN', 'dailyN']

/** 频率模式的显示文案（选择器当前值用） */
const freqLabel = (f: CheckinFreq) => FREQ_MODES.find(([k]) => k === f)?.[1] ?? '每天'

interface CheckinItemFormProps {
  /** 草稿（新建/编辑共用），字段改动通过 onChange 合并 */
  value: CheckinItem
  onChange: (patch: Partial<CheckinItem>) => void
}

/** 打卡项表单（受控）：名称 → 频率（点开弹选项的选择器 + 参数区）→ 说明。
 *  分类 / 优先级 / 图标已按改版移除：图标由 autoEmoji(name) 按名称自动配。
 *  新建弹窗与详情编辑弹窗共用；提交按钮（添加 / 保存）由调用方放弹窗最底部。 */
export default function CheckinItemForm({ value, onChange }: CheckinItemFormProps) {
  const freq = value.freq ?? 'daily'
  const freqDays = value.freqDays ?? []
  const freqCount = value.freqCount ?? FREQ_COUNT_DEFAULT[freq] ?? 1
  // 频率选择器：点「频率」行弹出选项列表（带勾选），选完即收起
  const [freqOpen, setFreqOpen] = useState(false)

  /** 切换频率模式：N 次模式顺带兜底默认次数 */
  const switchFreq = (f: CheckinFreq) => {
    if (FREQ_COUNT_DEFAULT[f]) onChange({ freq: f, freqCount: FREQ_COUNT_DEFAULT[f]! })
    else onChange({ freq: f })
  }
  /** 切换打卡日/打卡日期（结果保持升序） */
  const toggleFreqDay = (d: number) =>
    onChange({ freqDays: freqDays.includes(d) ? freqDays.filter((x) => x !== d) : [...freqDays, d].sort((a, b) => a - b) })

  /** 频率摘要 pill 文案（大白话预告打卡节奏） */
  const freqSummary = () => {
    switch (freq) {
      case 'weekly':
        return freqDays.length > 0 ? `每周 ${[...freqDays].sort((a, b) => a - b).map((d) => WEEKDAY_LABELS[d]).join('')} 打卡` : '请至少选择一个打卡日'
      case 'weeklyN':
        return `每周打卡 ${freqCount} 次（不限星期）`
      case 'monthlyN':
        return `每月打卡 ${freqCount} 次（不限日期）`
      case 'monthlyDays':
        return freqDays.length > 0 ? `每月 ${[...freqDays].sort((a, b) => a - b).join('、')} 号打卡` : '请至少选择一个日期'
      case 'dailyN':
        return `每天打卡 ${freqCount} 次`
      default:
        return '每天打卡'
    }
  }

  return (
    <View>
      {/* 名称：标签与输入框同一行（提交按钮在弹窗最底部，不在名称行） */}
      <View className="ck-form-line">
        <Text className="ck-form-label">名称</Text>
        <View className="field ck-name-field">
          <Input
            placeholder="打卡项（如：练字）"
            value={value.name}
            onInput={(e) => onChange({ name: e.detail.value })}
            maxlength={12}
          />
        </View>
      </View>

      {/* 频率：点开弹选项的选择器（六模式带勾选），选完收起再调参数 */}
      <View className="ck-form-line">
        <Text className="ck-form-label">频率</Text>
        <View className="ck-freq-select" onClick={() => setFreqOpen(true)}>
          <Text className="ck-freq-value">{freqLabel(freq)}</Text>
          <Icon name="arrow-down" size={13} color="#b0a697" />
        </View>
      </View>
      {freqOpen && (
        <Modal variant="center" className="ck-freq-modal" onClose={() => setFreqOpen(false)}>
          <View className="ck-sheet-h">
            <Text>选择频率</Text>
            <View className="icon-btn" onClick={() => setFreqOpen(false)}>
              <Icon name="x" size={14} />
            </View>
          </View>
          {FREQ_MODES.map(([k, label]) => (
            <View
              key={k}
              className={`ck-freq-opt${freq === k ? ' sel' : ''}`}
              onClick={() => {
                switchFreq(k)
                setFreqOpen(false)
              }}
            >
              <Text>{label}</Text>
              {freq === k ? <Icon name="check" size={16} color="#be5016" /> : null}
            </View>
          ))}
        </Modal>
      )}
      {/* weekly：星期圆点 chips 勾选打卡日 */}
      {freq === 'weekly' && (
        <View className="ck-week-row">
          {WEEKDAY_LABELS.map((label, d) => (
            <View
              key={d}
              className={`ck-week-day ${freqDays.includes(d) ? 'active' : ''}`}
              onClick={() => toggleFreqDay(d)}
            >
              {label}
            </View>
          ))}
        </View>
      )}
      {/* weeklyN/monthlyN/dailyN：次数 stepper（± 按钮） */}
      {COUNT_MODES.includes(freq) && (
        <View className="ck-count-row">
          <Text className="ck-count-label">次数</Text>
          <View className="ck-stepper">
            <View
              className="ck-step-btn"
              onClick={() => onChange({ freqCount: Math.max(1, freqCount - 1) })}
            >
              −
            </View>
            <Text className="ck-step-val">{freqCount}</Text>
            <View
              className="ck-step-btn"
              onClick={() => onChange({ freqCount: Math.min(99, freqCount + 1) })}
            >
              +
            </View>
          </View>
        </View>
      )}
      {/* monthlyDays：1-31 日期网格（固定高度内滚） */}
      {freq === 'monthlyDays' && (
        <ScrollView scroll-y className="ck-date-scroll">
          <View className="ck-date-grid">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <View
                key={d}
                className={`ck-date-cell ${freqDays.includes(d) ? 'active' : ''}`}
                onClick={() => toggleFreqDay(d)}
              >
                {d}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
      {/* 频率摘要 pill：大白话预告打卡节奏 */}
      <View className="ck-freq-summary">
        <Icon name="check-square" size={13} gap={4} />
        <Text>将按「{freqSummary()}」提醒</Text>
      </View>

      {/* 说明：标签与输入框同一行 */}
      <View className="ck-form-line">
        <Text className="ck-form-label">说明</Text>
        <View className="field">
          <Input
            placeholder="一句话说明（可不填）"
            value={value.note ?? ''}
            onInput={(e) => onChange({ note: e.detail.value })}
            maxlength={30}
          />
        </View>
      </View>
    </View>
  )
}
