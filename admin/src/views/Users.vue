<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api, type UserSummary } from '../api'

const router = useRouter()
const users = ref<UserSummary[]>([])
const q = ref('')
const loading = ref(false)
const errMsg = ref('')

async function load() {
  loading.value = true
  errMsg.value = ''
  try {
    users.value = await api.users(q.value.trim())
  } catch (e) {
    errMsg.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
}

function fmtTime(ms: number): string {
  if (!ms) return '-'
  return new Date(ms).toLocaleString('zh-CN', { hour12: false })
}

function openUser(u: UserSummary) {
  router.push({ name: 'user-detail', params: { openid: u.openid } })
}

onMounted(load)
</script>

<template>
  <div>
    <div class="card mb-5 flex items-center gap-3">
      <input
        v-model="q"
        class="input max-w-sm"
        placeholder="搜索昵称或 openid"
        @keyup.enter="load"
      />
      <button class="btn" @click="load">搜索</button>
      <span class="ml-auto text-xs text-slate-400">共 {{ users.length }} 人</span>
    </div>

    <div v-if="loading" class="card text-sm text-slate-500">加载中…</div>
    <div v-else-if="errMsg" class="card text-sm text-red-500">{{ errMsg }}</div>

    <div v-else class="card overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-100 text-left text-xs text-slate-400">
            <th class="py-2 pr-4">身份</th>
            <th class="py-2 pr-4">昵称</th>
            <th class="py-2 pr-4">目标考试</th>
            <th class="py-2 pr-4">连续全勤</th>
            <th class="py-2 pr-4">累计专注(分)</th>
            <th class="py-2 pr-4">注册时间</th>
            <th class="py-2 pr-4">最近活跃</th>
            <th class="py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="u in users"
            :key="u.openid"
            class="cursor-pointer border-b border-slate-50 hover:bg-slate-50"
            @click="openUser(u)"
          >
            <td class="py-2.5 pr-4">
              <span
                class="rounded-full px-2 py-0.5 text-xs"
                :class="u.role === 'user' ? 'bg-indigo-50 text-primary' : 'bg-slate-100 text-slate-500'"
              >
                {{ u.role === 'user' ? '正式' : '游客' }}
              </span>
            </td>
            <td class="py-2.5 pr-4">
              {{ u.nickname || u.selfNickname || '（未填）' }}
              <span v-if="u.nickname && u.selfNickname && u.nickname !== u.selfNickname" class="text-xs text-slate-400">
                / 自填 {{ u.selfNickname }}
              </span>
            </td>
            <td class="py-2.5 pr-4">{{ u.exam || '-' }}</td>
            <td class="py-2.5 pr-4">{{ u.streak }} 天</td>
            <td class="py-2.5 pr-4">{{ u.focusTotal }}</td>
            <td class="py-2.5 pr-4 text-xs text-slate-500">{{ fmtTime(u.createdAt) }}</td>
            <td class="py-2.5 pr-4 text-xs text-slate-500">{{ fmtTime(u.lastSeenAt) }}</td>
            <td class="py-2.5">
              <span class="text-xs text-primary">查看详情 →</span>
            </td>
          </tr>
          <tr v-if="!users.length">
            <td colspan="8" class="py-8 text-center text-slate-400">暂无用户</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
