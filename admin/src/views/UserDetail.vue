<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { api, type UserDataResp } from '../api'

const props = defineProps<{ openid: string }>()

const info = ref<UserDataResp | null>(null)
const loading = ref(true)
const errMsg = ref('')
const saving = ref(false)

const editNickname = ref('')
const editRole = ref<'user' | 'guest'>('user')

const moodEl = ref<HTMLDivElement | null>(null)
const pomoEl = ref<HTMLDivElement | null>(null)
let charts: echarts.ECharts[] = []

const data = computed<Record<string, unknown>>(() => info.value?.data ?? {})

// ---- 派生明细 ----
interface CheckinDay {
  day: string
  count: number
}
const heatDays = computed<CheckinDay[]>(() => {
  const checkins = (data.value.checkins || {}) as Record<string, string[]>
  return Object.entries(checkins)
    .filter(([, ids]) => Array.isArray(ids) && ids.length > 0)
    .map(([day, ids]) => ({ day, count: ids.length }))
    .sort((a, b) => a.day.localeCompare(b.day))
    .slice(-84)
})

interface MoodPoint {
  day: string
  mood: number
}
const moodPoints = computed<MoodPoint[]>(() => {
  const moods = (data.value.moods || {}) as Record<string, { mood?: number }>
  return Object.entries(moods)
    .filter(([, m]) => m && typeof m.mood === 'number')
    .map(([day, m]) => ({ day, mood: m.mood as number }))
    .sort((a, b) => a.day.localeCompare(b.day))
    .slice(-30)
})

interface PomoDay {
  date: string
  minutes: number
  count: number
}
const pomoDays = computed<PomoDay[]>(() => {
  const logs = (data.value.pomodoroLogs || []) as { date?: string; minutes?: number }[]
  const acc = new Map<string, PomoDay>()
  for (const p of logs) {
    const day = p.date || ''
    if (!day) continue
    const cur = acc.get(day) || { date: day, minutes: 0, count: 0 }
    cur.minutes += p.minutes || 0
    cur.count += 1
    acc.set(day, cur)
  }
  return [...acc.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-30)
})

const threeThings = computed(() => {
  const tt = (data.value.threeThings || {}) as Record<string, { items?: { text?: string; done?: boolean }[] }>
  return Object.entries(tt)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 7)
})

const todos = computed(() => ((data.value.todos || []) as { text?: string; done?: boolean }[]).slice(0, 20))

const ledger = computed(() => ((data.value.ledger || []) as Record<string, unknown>[]).slice(-10).reverse())

const notes = computed(() => ((data.value.notes || []) as { title?: string; nextReviewDate?: string | null; reviewStep?: number }[]).slice(0, 20))

interface RewardRow {
  id: string
  title: string
  emoji: string
  condType?: string
  condParam?: number
  claimed: boolean
  granted: boolean
  used?: boolean
  code?: string
  achievedAt?: number
}
const rewards = computed<RewardRow[]>(() => ((data.value.rewards || []) as RewardRow[]).slice().reverse())

const checkinItems = computed(() => (data.value.checkinItems || []) as { id: string; title?: string }[])

function fmtTime(ms?: number): string {
  if (!ms) return '-'
  return new Date(ms).toLocaleString('zh-CN', { hour12: false })
}

async function load() {
  loading.value = true
  errMsg.value = ''
  try {
    const d = await api.userData(props.openid)
    info.value = d
    editNickname.value = d.nickname || ''
    editRole.value = d.role
    renderCharts()
  } catch (e) {
    errMsg.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
}

async function saveUser() {
  saving.value = true
  try {
    await api.patchUser(props.openid, { nickname: editNickname.value.trim(), role: editRole.value })
    await load()
  } catch (e) {
    errMsg.value = e instanceof Error ? e.message : '保存失败'
  } finally {
    saving.value = false
  }
}

function renderCharts() {
  charts.forEach((c) => c.dispose())
  charts = []

  if (moodEl.value && moodPoints.value.length) {
    const mood = echarts.init(moodEl.value)
    charts.push(mood)
    mood.setOption({
      grid: { left: 32, right: 12, top: 16, bottom: 24 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: moodPoints.value.map((p) => p.day.slice(5)),
        axisLabel: { color: '#64748b', fontSize: 10 },
      },
      yAxis: { type: 'value', min: 1, max: 5, axisLabel: { color: '#64748b', fontSize: 10 } },
      series: [
        {
          type: 'line',
          smooth: true,
          data: moodPoints.value.map((p) => p.mood),
          itemStyle: { color: '#4f46e5' },
        },
      ],
    })
  }

  if (pomoEl.value && pomoDays.value.length) {
    const pomo = echarts.init(pomoEl.value)
    charts.push(pomo)
    pomo.setOption({
      grid: { left: 32, right: 12, top: 16, bottom: 24 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: pomoDays.value.map((p) => p.date.slice(5)),
        axisLabel: { color: '#64748b', fontSize: 10 },
      },
      yAxis: { type: 'value', axisLabel: { color: '#64748b', fontSize: 10 } },
      series: [
        {
          name: '专注分钟',
          type: 'bar',
          barWidth: 10,
          data: pomoDays.value.map((p) => p.minutes),
          itemStyle: { color: '#4f46e5', borderRadius: [5, 5, 0, 0] },
        },
      ],
    })
  }
}

function onResize() {
  charts.forEach((c) => c.resize())
}

onMounted(() => {
  load()
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  charts.forEach((c) => c.dispose())
})
</script>

<template>
  <div>
    <div v-if="loading" class="card text-sm text-slate-500">加载中…</div>
    <div v-else-if="errMsg" class="card text-sm text-red-500">{{ errMsg }}</div>

    <template v-else-if="info">
      <!-- 基本信息 + 管理操作 -->
      <div class="card mb-5">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 class="text-base font-semibold">
              {{ info.nickname || info.selfNickname || '（未填昵称）' }}
              <span
                class="ml-2 rounded-full px-2 py-0.5 text-xs"
                :class="info.role === 'user' ? 'bg-indigo-50 text-primary' : 'bg-slate-100 text-slate-500'"
              >
                {{ info.role === 'user' ? '正式' : '游客' }}
              </span>
            </h2>
            <p class="mt-1 text-xs text-slate-400">openid：{{ info.openid }}</p>
            <div class="mt-2 flex gap-6 text-sm">
              <span>目标考试：<b>{{ info.exam || '-' }}</b></span>
              <span>连续全勤：<b>{{ info.streak }} 天</b></span>
              <span>累计专注：<b>{{ info.focusTotal }} 分钟</b></span>
            </div>
            <div class="mt-1 flex gap-6 text-xs text-slate-400">
              <span>注册：{{ fmtTime(info.createdAt) }}</span>
              <span>最近活跃：{{ fmtTime(info.lastSeenAt) }}</span>
              <span>自填昵称：{{ info.selfNickname || '-' }}</span>
            </div>
          </div>
          <div class="flex items-end gap-2">
            <div>
              <label class="label">B 端昵称</label>
              <input v-model="editNickname" class="input w-40" placeholder="备注昵称" />
            </div>
            <div>
              <label class="label">身份</label>
              <select v-model="editRole" class="input w-28">
                <option value="user">正式</option>
                <option value="guest">游客</option>
              </select>
            </div>
            <button class="btn" :disabled="saving" @click="saveUser">
              {{ saving ? '保存中…' : '保存' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 单人打卡热力（近 84 天，格子深浅 = 当日打卡项数） -->
      <div class="card mb-5">
        <h2 class="mb-3 text-sm font-semibold">打卡热力（近 84 天）</h2>
        <div class="flex flex-wrap gap-1">
          <div
            v-for="d in heatDays"
            :key="d.day"
            class="h-5 w-5 rounded"
            :style="{ background: `rgba(79,70,229,${Math.min(0.15 + d.count * 0.25, 1)})` }"
            :title="`${d.day}：${d.count} 项`"
          ></div>
          <p v-if="!heatDays.length" class="text-xs text-slate-400">暂无打卡记录</p>
        </div>
        <p class="mt-2 text-xs text-slate-400">打卡项：{{ checkinItems.map((i) => i.title || i.id).join('、') || '（未配置）' }}</p>
      </div>

      <!-- 心情趋势 + 专注图表 -->
      <div class="mb-5 grid gap-4 lg:grid-cols-2">
        <div class="card">
          <h2 class="mb-3 text-sm font-semibold">心情趋势（近 30 次记录）</h2>
          <div ref="moodEl" class="h-52"></div>
          <p v-if="!moodPoints.length" class="text-xs text-slate-400">暂无心情记录</p>
        </div>
        <div class="card">
          <h2 class="mb-3 text-sm font-semibold">专注分布（近 30 个有记录日）</h2>
          <div ref="pomoEl" class="h-52"></div>
          <p v-if="!pomoDays.length" class="text-xs text-slate-400">暂无专注记录</p>
        </div>
      </div>

      <!-- 三件事 + 复习 -->
      <div class="mb-5 grid gap-4 lg:grid-cols-2">
        <div class="card">
          <h2 class="mb-3 text-sm font-semibold">每日三件事（近 7 天）</h2>
          <div v-if="threeThings.length" class="space-y-3">
            <div v-for="([day, entry]) in threeThings" :key="day">
              <p class="text-xs text-slate-400">{{ day }}</p>
              <ul class="mt-1 space-y-1">
                <li v-for="(it, i) in entry.items || []" :key="i" class="text-sm">
                  <span class="mr-1">{{ it.done ? '☑' : '☐' }}</span>{{ it.text }}
                </li>
              </ul>
            </div>
          </div>
          <p v-else class="text-xs text-slate-400">暂无记录</p>
        </div>
        <div class="card">
          <h2 class="mb-3 text-sm font-semibold">笔记与复习</h2>
          <table v-if="notes.length" class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-100 text-left text-xs text-slate-400">
                <th class="py-1.5">标题</th>
                <th class="py-1.5">复习步</th>
                <th class="py-1.5">下次复习</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(n, i) in notes" :key="i" class="border-b border-slate-50">
                <td class="py-1.5">{{ n.title || '（无标题）' }}</td>
                <td class="py-1.5">{{ n.reviewStep ?? '-' }}</td>
                <td class="py-1.5 text-xs text-slate-500">{{ n.nextReviewDate || '-' }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="text-xs text-slate-400">暂无笔记</p>
        </div>
      </div>

      <!-- 待办 + 账本 -->
      <div class="mb-5 grid gap-4 lg:grid-cols-2">
        <div class="card">
          <h2 class="mb-3 text-sm font-semibold">待办（最近 20 条）</h2>
          <ul v-if="todos.length" class="space-y-1.5">
            <li v-for="(t, i) in todos" :key="i" class="text-sm">
              <span class="mr-1">{{ t.done ? '☑' : '☐' }}</span>{{ t.text }}
            </li>
          </ul>
          <p v-else class="text-xs text-slate-400">暂无待办</p>
        </div>
        <div class="card">
          <h2 class="mb-3 text-sm font-semibold">账本（最近 10 笔）</h2>
          <table v-if="ledger.length" class="w-full text-sm">
            <tbody>
              <tr v-for="(l, i) in ledger" :key="i" class="border-b border-slate-50">
                <td class="py-1.5 text-xs text-slate-500">{{ String(l.date || '-') }}</td>
                <td class="py-1.5">{{ String(l.note || l.category || '-') }}</td>
                <td class="py-1.5 text-right">{{ String(l.amount ?? '-') }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="text-xs text-slate-400">暂无账目</p>
        </div>
      </div>

      <!-- 任务与奖励时间线（含兑换码核销） -->
      <div class="card">
        <h2 class="mb-3 text-sm font-semibold">任务与奖励时间线</h2>
        <table v-if="rewards.length" class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-100 text-left text-xs text-slate-400">
              <th class="py-2 pr-3">奖励</th>
              <th class="py-2 pr-3">条件</th>
              <th class="py-2 pr-3">来源</th>
              <th class="py-2 pr-3">达成时间</th>
              <th class="py-2 pr-3">兑换码</th>
              <th class="py-2">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rewards" :key="r.id" class="border-b border-slate-50">
              <td class="py-2 pr-3">{{ r.emoji }} {{ r.title }}</td>
              <td class="py-2 pr-3 text-xs text-slate-500">
                {{ r.condType ? `${r.condType}${r.condParam ? ` ≥ ${r.condParam}` : ''}` : '-' }}
              </td>
              <td class="py-2 pr-3 text-xs text-slate-500">
                {{ r.id.startsWith('grant-') ? 'B 端直发' : '任务达成' }}
              </td>
              <td class="py-2 pr-3 text-xs text-slate-500">{{ fmtTime(r.achievedAt) }}</td>
              <td class="py-2 pr-3 font-mono text-xs">{{ r.code || '-' }}</td>
              <td class="py-2 text-xs">
                <span v-if="r.used" class="text-slate-400">已核销</span>
                <span v-else-if="r.granted" class="text-primary">已发放</span>
                <span v-else-if="r.claimed" class="text-emerald-600">已领取</span>
                <span v-else class="text-slate-400">未达成</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-xs text-slate-400">暂无奖励记录</p>
      </div>
    </template>
  </div>
</template>
