<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, clearToken, getToken, setToken } from './api'

const route = useRoute()
const router = useRouter()

const authed = ref(!!getToken())
const tokenInput = ref('')
const errMsg = ref('')
const checking = ref(false)

async function submit() {
  const t = tokenInput.value.trim()
  if (!t) {
    errMsg.value = '请输入口令'
    return
  }
  checking.value = true
  errMsg.value = ''
  setToken(t)
  try {
    await api.stats()
    authed.value = true
    tokenInput.value = ''
  } catch (e) {
    clearToken()
    errMsg.value = e instanceof Error ? e.message : '验证失败'
  } finally {
    checking.value = false
  }
}

function logout() {
  clearToken()
  authed.value = false
}

function onUnauthorized() {
  authed.value = false
  errMsg.value = '口令已失效，请重新输入'
}

onMounted(() => window.addEventListener('kg-admin-unauthorized', onUnauthorized))
onBeforeUnmount(() => window.removeEventListener('kg-admin-unauthorized', onUnauthorized))

const navs = [
  { path: '/', label: '看板' },
  { path: '/users', label: '用户' },
  { path: '/tasks', label: '任务与发券' },
  { path: '/backup', label: '备份与数据' },
]

function isActive(path: string): boolean {
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}
</script>

<template>
  <div class="mx-auto min-h-screen max-w-6xl px-4 py-6">
    <!-- D2 鉴权门：无口令 / 403 时显示 -->
    <div v-if="!authed" class="mx-auto mt-24 max-w-sm card">
      <h1 class="mb-1 text-lg font-semibold">考公小助手 · 管理后台</h1>
      <p class="mb-4 text-sm text-slate-500">请输入管理口令（ADMIN_TOKEN）</p>
      <input
        v-model="tokenInput"
        class="input mb-3"
        type="password"
        placeholder="管理口令"
        @keyup.enter="submit"
      />
      <p v-if="errMsg" class="mb-3 text-sm text-red-500">{{ errMsg }}</p>
      <button class="btn w-full justify-center" :disabled="checking" @click="submit">
        {{ checking ? '验证中…' : '进入后台' }}
      </button>
    </div>

    <template v-else>
      <header class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <h1 class="text-lg font-semibold">考公小助手 · 管理后台</h1>
          <nav class="flex items-center gap-1">
            <router-link
              v-for="n in navs"
              :key="n.path"
              :to="n.path"
              class="rounded-xl px-3 py-1.5 text-sm"
              :class="isActive(n.path) ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-200'"
            >
              {{ n.label }}
            </router-link>
          </nav>
        </div>
        <button class="btn-ghost" @click="logout">退出口令</button>
      </header>

      <router-view v-if="authed" :key="route.fullPath" />
    </template>
  </div>
</template>
