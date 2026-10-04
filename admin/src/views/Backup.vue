<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api, type Stats, type UserSummary } from '../api'

const users = ref<UserSummary[]>([])
const stats = ref<Stats | null>(null)
const errMsg = ref('')
const okMsg = ref('')

// 旧 PWA 导入
const importOpenid = ref('')
const importText = ref('')
const importing = ref(false)

// 单用户导出
const exportOpenid = ref('')
const exporting = ref(false)

async function load() {
  errMsg.value = ''
  try {
    const [u, s] = await Promise.all([api.users(), api.stats()])
    users.value = u
    stats.value = s
  } catch (e) {
    errMsg.value = e instanceof Error ? e.message : '加载失败'
  }
}

function parseImport(): Record<string, unknown> | null {
  okMsg.value = ''
  errMsg.value = ''
  if (!importOpenid.value) {
    errMsg.value = '请选择导入目标用户'
    return null
  }
  try {
    const obj = JSON.parse(importText.value)
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      errMsg.value = 'JSON 顶层必须是对象'
      return null
    }
    return obj as Record<string, unknown>
  } catch {
    errMsg.value = 'JSON 解析失败，请检查格式'
    return null
  }
}

async function doImport() {
  const data = parseImport()
  if (!data) return
  const keys = Object.keys(data)
  if (!window.confirm(`确认把 ${keys.length} 个数据域【覆盖式】导入用户 ${importOpenid.value}？同名域旧数据将被覆盖。`)) return
  importing.value = true
  try {
    const r = await api.importData(importOpenid.value, data)
    okMsg.value = `导入成功：写入 ${r.keys} 个数据域`
    importText.value = ''
  } catch (e) {
    errMsg.value = e instanceof Error ? e.message : '导入失败'
  } finally {
    importing.value = false
  }
}

async function doExport() {
  if (!exportOpenid.value) {
    errMsg.value = '请选择导出用户'
    return
  }
  exporting.value = true
  errMsg.value = ''
  try {
    const d = await api.userData(exportOpenid.value)
    const blob = new Blob([JSON.stringify(d.data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `kaogong-${exportOpenid.value.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    okMsg.value = `已导出 ${exportOpenid.value} 的全量数据`
  } catch (e) {
    errMsg.value = e instanceof Error ? e.message : '导出失败'
  } finally {
    exporting.value = false
  }
}

const DATA_KEYS = [
  'settings', 'foods', 'budget', 'foodLog', 'exams', 'courses', 'checkinItems', 'checkins',
  'moods', 'rewards', 'todos', 'ledger', 'periodic', 'dates', 'notes', 'threeThings', 'dayLogs', 'pomodoroLogs',
]

onMounted(load)
</script>

<template>
  <div>
    <p v-if="errMsg" class="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-500">{{ errMsg }}</p>
    <p v-if="okMsg" class="mb-4 rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-600">{{ okMsg }}</p>

    <!-- 旧 PWA 导入 -->
    <div class="card mb-5">
      <h2 class="mb-1 text-sm font-semibold">旧 PWA 数据导入（覆盖式）</h2>
      <p class="mb-4 text-xs text-slate-400">
        粘贴旧版 PWA 导出的 JSON（顶层为数据域名）。仅识别 18 个白名单域，逐域覆盖写入目标用户：
        {{ DATA_KEYS.join('、') }}
      </p>
      <div class="mb-3 flex flex-wrap items-end gap-3">
        <div class="min-w-72">
          <label class="label">目标用户（openid）*</label>
          <select v-model="importOpenid" class="input">
            <option value="">请选择（需先「正式开始」注册）</option>
            <option v-for="u in users.filter((x) => x.role === 'user')" :key="u.openid" :value="u.openid">
              {{ u.nickname || u.selfNickname || u.openid }}（{{ u.openid.slice(0, 12) }}…）
            </option>
          </select>
        </div>
        <button class="btn" :disabled="importing" @click="doImport">
          {{ importing ? '导入中…' : '导入' }}
        </button>
      </div>
      <textarea
        v-model="importText"
        class="input h-56 resize-y font-mono text-xs"
        placeholder='{ "checkins": {...}, "moods": {...} }'
      ></textarea>
    </div>

    <!-- 单用户导出 -->
    <div class="card mb-5">
      <h2 class="mb-1 text-sm font-semibold">单用户数据导出</h2>
      <p class="mb-4 text-xs text-slate-400">导出该用户的全量 18 域数据（JSON 文件下载），用于备份留档。</p>
      <div class="flex flex-wrap items-end gap-3">
        <div class="min-w-72">
          <label class="label">选择用户</label>
          <select v-model="exportOpenid" class="input">
            <option value="">请选择</option>
            <option v-for="u in users" :key="u.openid" :value="u.openid">
              {{ u.nickname || u.selfNickname || u.openid }}（{{ u.role === 'user' ? '正式' : '游客' }}）
            </option>
          </select>
        </div>
        <button class="btn" :disabled="exporting" @click="doExport">
          {{ exporting ? '导出中…' : '导出 JSON' }}
        </button>
      </div>
    </div>

    <!-- 数据概况 -->
    <div class="card">
      <h2 class="mb-4 text-sm font-semibold">数据概况</h2>
      <div v-if="stats" class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p class="text-xs text-slate-500">总用户</p>
          <p class="mt-1 text-xl font-semibold">{{ stats.totalUsers }}</p>
        </div>
        <div>
          <p class="text-xs text-slate-500">正式用户</p>
          <p class="mt-1 text-xl font-semibold">{{ stats.userCount }}</p>
        </div>
        <div>
          <p class="text-xs text-slate-500">发券总数</p>
          <p class="mt-1 text-xl font-semibold">{{ stats.grants.issued }}</p>
        </div>
        <div>
          <p class="text-xs text-slate-500">核销数</p>
          <p class="mt-1 text-xl font-semibold">{{ stats.grants.used }}</p>
        </div>
      </div>
      <p v-else class="text-xs text-slate-400">加载中…</p>
    </div>
  </div>
</template>
