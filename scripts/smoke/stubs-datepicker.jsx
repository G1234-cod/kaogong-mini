// DatePicker 桩（与主桩分开，避免 default 导出冲突）
import React from 'react'

export default function DatePicker(p) {
  return React.createElement('date-picker', p, p && p.children)
}
export const fmtDateShort = (d) => d
