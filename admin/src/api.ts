// B 端 API 封装：同域 /api/admin/* + X-Admin-Token；401/403 清口令触发重登事件
const TOKEN_KEY = 'kg-admin-token'

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(t: string): void {
  localStorage.setItem(TOKEN_KEY, t)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch('/api' + path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': getToken(),
      ...(init?.headers || {}),
    },
  })
  if (res.status === 401 || res.status === 403) {
    clearToken()
    window.dispatchEvent(new CustomEvent('kg-admin-unauthorized'))
    throw new ApiError(res.status, '口令无效或已过期，请重新输入')
  }
  if (!res.ok) {
    let msg = res.statusText || `HTTP ${res.status}`
    try {
      const body = await res.json()
      if (body?.detail) msg = String(body.detail)
    } catch {
      /* 非 JSON 错误体 */
    }
    throw new ApiError(res.status, msg)
  }
  return (await res.json()) as T
}

function json(method: string, body: unknown): RequestInit {
  return { method, body: JSON.stringify(body) }
}

// ---- 类型（与 server/main.py 响应对齐） ----
export interface UserSummary {
  openid: string
  role: 'user' | 'guest'
  nickname: string
  selfNickname: string
  lastSeenAt: number
  createdAt: number
  streak: number
  focusTotal: number
  exam: string | null
}

export interface Stats {
  totalUsers: number
  userCount: number
  todayActive: number
  new7: number
  upgradeRate: number
  dailyActive: { day: string; count: number }[]
  heat: [string, number][]
  metrics: {
    checkinRate: number
    avgStreak: number
    focusDaily: number
    threeRate: number
    reviewRate: number
  }
  examDist: Record<string, number>
  avgMood: number
  avgWater: number
  grants: { issued: number; used: number }
}

export interface AdminTask {
  id: string
  title: string
  emoji: string
  desc: string
  condType: string
  condParam: number
  mode: 'auto' | 'code'
  hidden: boolean
  scope: string
  targetOpenids: string[]
  active: boolean
  createdAt: number
  achievedCount: number
}

export interface TaskPayload {
  title: string
  emoji: string
  desc: string
  condType: string
  condParam: number
  mode: 'auto' | 'code'
  hidden: boolean
  scope: string
  targetOpenids: string[]
}

export interface GrantRow {
  id: string
  openid: string
  title: string
  emoji: string
  desc: string
  grantedAt: number
}

export interface UserDataResp extends UserSummary {
  data: Record<string, unknown>
}

export const api = {
  stats: (days = 30) => request<Stats>(`/admin/stats?days=${days}`),

  users: (q = '') => request<UserSummary[]>(`/admin/users?q=${encodeURIComponent(q)}`),

  userData: (openid: string) => request<UserDataResp>(`/admin/users/${openid}/data`),

  patchUser: (openid: string, body: { nickname?: string; role?: string }) =>
    request<{ ok: boolean }>(`/admin/users/${openid}`, json('PUT', body)),

  importData: (openid: string, data: Record<string, unknown>) =>
    request<{ ok: boolean; keys: number }>('/admin/import', json('POST', { openid, data })),

  tasks: () => request<AdminTask[]>('/admin/tasks'),

  addTask: (body: TaskPayload) => request<{ ok: boolean; id: string }>('/admin/tasks', json('POST', body)),

  editTask: (tid: string, body: Partial<TaskPayload> & { active?: boolean }) =>
    request<{ ok: boolean }>(`/admin/tasks/${tid}`, json('PUT', body)),

  delTask: (tid: string) => request<{ ok: boolean }>(`/admin/tasks/${tid}`, { method: 'DELETE' }),

  grant: (body: { openid: string; title: string; emoji: string; desc: string }) =>
    request<{ ok: boolean }>('/admin/grant', json('POST', body)),

  grants: () => request<GrantRow[]>('/admin/grants'),
}
