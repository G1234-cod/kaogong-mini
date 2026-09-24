// 日期与通用工具（自原 PWA utils.ts 原样迁移）
export function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n)
}

export function dateStr(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function todayStr(): string {
  return dateStr(new Date())
}

export function addDays(dateStrIn: string, days: number): string {
  const d = new Date(dateStrIn + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return dateStr(d)
}

/** from 到 to 相差天数（to 更晚为正） */
export function daysBetween(from: string, to: string): number {
  const a = new Date(from + 'T00:00:00').getTime()
  const b = new Date(to + 'T00:00:00').getTime()
  return Math.round((b - a) / 86400000)
}

/** "07:30" -> 450 分钟 */
export function hmToMin(hm: string): number {
  const [h, m] = hm.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export function nowMin(): number {
  const d = new Date()
  return d.getHours() * 60 + d.getMinutes()
}

export function fmtHM(min: number): string {
  return `${pad2(Math.floor(min / 60))}:${pad2(min % 60)}`
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
