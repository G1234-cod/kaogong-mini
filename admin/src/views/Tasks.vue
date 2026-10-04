<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { api, type AdminTask, type GrantRow, type TaskPayload, type UserSummary } from '../api'

const COND_TYPES = [
  { value: 'streak', label: '连续全勤（天）' },
  { value: 'total_full', label: '累计全勤（天）' },
  { value: 'weekend_full', label: '周末双满勤（无需参数）' },
  { value: 'mood3', label: '连续好心情（天）' },
  { value: 'pomo_day', label: '单日番茄数（个）' },
]

const tasks = ref<AdminTask[]>([])
const grants = ref<GrantRow[]>([])
const users = ref<UserSummary[]>([])
const loading = ref(true)
const errMsg = ref('')
const saving = ref(false)

// 任务表单（新增/编辑共用，editingId 为空 = 新增）
const editingId = ref('')
const form = reactive<TaskPayload>({
  title: '',
  emoji: '🎁',
  desc: '',
  condType: 'streak',
  condParam: 3,
  mode: 'auto',
  hidden: false,
  scope: 'all',
  targetOpenids: [],
})

// 直发表单
const grantForm = reactive({ openid: '', title: '', emoji: '🎁', desc: '' })

async function load() {
  loading.value = true
  errMsg.value = ''
  try {
    const [t, g] = await Promise.all([api.tasks(), api.grants()])
    tasks.value = t
    grants.value = g
  } catch (e) {
    errMsg.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
}

async function loadUsers() {
  try {
    users.value = await api.users()
  } catch {
    /* 用户列表仅用于下拉，失败不阻塞 */
  }
}

function resetForm() {
  editingId.value = ''
  Object.assign(form, {
    title: '',
    emoji: '🎁',
    desc: '',
    condType: 'streak',
    condParam: 3,
    mode: 'auto',
    hidden: false,
    scope: 'all',
    targetOpenids: [],
  })
}

function editTask(t: AdminTask) {
  editingId.value = t.id
  Object.assign(form, {
    title: t.title,
    emoji: t.emoji,
    desc: t.desc,
    condType: t.condType,
    condParam: t.condParam,
    mode: t.mode,
    hidden: t.hidden,
    scope: t.scope,
    targetOpenids: [...t.targetOpenids],
  })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function saveTask() {
  if (!form.title.trim()) {
    errMsg.value = '请填写任务标题'
    return
  }
  saving.value = true
  errMsg.value = ''
  try {
    if (editingId.value) {
      await api.editTask(editingId.value, { ...form, title: form.title.trim() })
    } else {
      await api.addTask({ ...form, title: form.title.trim() })
    }
    resetForm()
    await load()
  } catch (e) {
    errMsg.value = e instanceof Error ? e.message : '保存失败'
  } finally {
    saving.value = false
  }
}

async function toggleActive(t: AdminTask) {
  try {
    await api.editTask(t.id, { active: !t.active })
    await load()
  } catch (e) {
    errMsg.value = e instanceof Error ? e.message : '操作失败'
  }
}

async function removeTask(t: AdminTask) {
  if (!window.confirm(`确认删除任务「${t.title}」？已达成的用户奖励不受影响。`)) return
  try {
    await api.delTask(t.id)
    await load()
  } catch (e) {
    errMsg.value = e instanceof Error ? e.message : '删除失败'
  }
}

async function sendGrant() {
  if (!grantForm.openid || !grantForm.title.trim()) {
    errMsg.value = '请填写发给谁和券标题'
    return
  }
  saving.value = true
  errMsg.value = ''
  try {
    await api.grant({
      openid: grantForm.openid,
      title: grantForm.title.trim(),
      emoji: grantForm.emoji || '🎁',
      desc: grantForm.desc.trim(),
    })
    Object.assign(grantForm, { title: '', desc: '' })
    await load()
  } catch (e) {
    errMsg.value = e instanceof Error ? e.message : '发放失败'
  } finally {
    saving.value = false
  }
}

function fmtTime(ms: number): string {
  return new Date(ms).toLocaleString('zh-CN', { hour12: false })
}

onMounted(() => {
  load()
  loadUsers()
})
</script>

<template>
  <div>
    <p v-if="errMsg" class="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-500">{{ errMsg }}</p>

    <!-- 任务发布 / 编辑表单 -->
    <div class="card mb-5">
      <h2 class="mb-4 text-sm font-semibold">{{ editingId ? '编辑任务' : '发布新任务' }}</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label class="label">标题 *</label>
          <input v-model="form.title" class="input" placeholder="如：奶茶自由券" />
        </div>
        <div>
          <label class="label">图标（emoji）</label>
          <input v-model="form.emoji" class="input" />
        </div>
        <div>
          <label class="label">解锁条件</label>
          <select v-model="form.condType" class="input">
            <option v-for="c in COND_TYPES" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
        </div>
        <div>
          <label class="label">条件参数</label>
          <input
            v-model.number="form.condParam"
            class="input"
            type="number"
            min="0"
            :disabled="form.condType === 'weekend_full'"
          />
        </div>
        <div>
          <label class="label">发放方式</label>
          <select v-model="form.mode" class="input">
            <option value="auto">自动发放</option>
            <option value="code">兑换码（手动核销）</option>
          </select>
        </div>
        <div>
          <label class="label">可见性</label>
          <select v-model="form.hidden" class="input">
            <option :value="false">明示任务（展示进度）</option>
            <option :value="true">隐藏彩蛋（达成才揭晓）</option>
          </select>
        </div>
        <div class="sm:col-span-2 lg:col-span-3">
          <label class="label">描述</label>
          <input v-model="form.desc" class="input" placeholder="奖励说明，如：任意品牌任意杯型，加料全糖随你" />
        </div>
        <div>
          <label class="label">适用范围</label>
          <select v-model="form.scope" class="input">
            <option value="all">全体用户</option>
            <option value="target">指定用户</option>
          </select>
        </div>
        <div class="sm:col-span-2">
          <label class="label">指定 openid（scope=指定用户 时生效，逗号分隔）</label>
          <input
            :value="form.targetOpenids.join(',')"
            class="input"
            placeholder="oXxxx1,oXxxx2"
            @input="form.targetOpenids = ($event.target as HTMLInputElement).value.split(',').map((s) => s.trim()).filter(Boolean)"
          />
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button class="btn" :disabled="saving" @click="saveTask">
          {{ saving ? '保存中…' : editingId ? '保存修改' : '发布任务' }}
        </button>
        <button v-if="editingId" class="btn-ghost" @click="resetForm">取消编辑</button>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="card mb-5 overflow-x-auto">
      <h2 class="mb-3 text-sm font-semibold">任务列表（{{ tasks.length }}）</h2>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-100 text-left text-xs text-slate-400">
            <th class="py-2 pr-3">任务</th>
            <th class="py-2 pr-3">条件</th>
            <th class="py-2 pr-3">方式</th>
            <th class="py-2 pr-3">范围</th>
            <th class="py-2 pr-3">达成人数</th>
            <th class="py-2 pr-3">状态</th>
            <th class="py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tasks" :key="t.id" class="border-b border-slate-50">
            <td class="py-2.5 pr-3">
              {{ t.emoji }} {{ t.title }}
              <span v-if="t.hidden" class="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-400">隐藏</span>
              <p class="mt-0.5 max-w-xs text-xs text-slate-400">{{ t.desc }}</p>
            </td>
            <td class="py-2.5 pr-3 text-xs">
              {{ COND_TYPES.find((c) => c.value === t.condType)?.label || t.condType }}
              <span v-if="t.condType !== 'weekend_full'">≥ {{ t.condParam }}</span>
            </td>
            <td class="py-2.5 pr-3 text-xs">{{ t.mode === 'auto' ? '自动' : '兑换码' }}</td>
            <td class="py-2.5 pr-3 text-xs">
              {{ t.scope === 'all' ? '全体' : `指定 ${t.targetOpenids.length} 人` }}
            </td>
            <td class="py-2.5 pr-3">{{ t.achievedCount }}</td>
            <td class="py-2.5 pr-3">
              <button
                class="rounded-full px-2 py-0.5 text-xs"
                :class="t.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'"
                @click="toggleActive(t)"
              >
                {{ t.active ? '上架中' : '已下架' }}
              </button>
            </td>
            <td class="py-2.5">
              <button class="mr-2 text-xs text-primary" @click="editTask(t)">编辑</button>
              <button class="text-xs text-red-400" @click="removeTask(t)">删除</button>
            </td>
          </tr>
          <tr v-if="!tasks.length">
            <td colspan="7" class="py-8 text-center text-slate-400">暂无任务</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 直接发券 -->
    <div class="card mb-5">
      <h2 class="mb-4 text-sm font-semibold">直接发券（不限任务条件）</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label class="label">发给谁（openid）*</label>
          <input v-model="grantForm.openid" class="input" list="openid-list" placeholder="搜索/粘贴 openid" />
          <datalist id="openid-list">
            <option v-for="u in users" :key="u.openid" :value="u.openid">
              {{ u.nickname || u.selfNickname || u.role }}
            </option>
          </datalist>
        </div>
        <div>
          <label class="label">券标题 *</label>
          <input v-model="grantForm.title" class="input" placeholder="如：奶茶自由券" />
        </div>
        <div>
          <label class="label">图标（emoji）</label>
          <input v-model="grantForm.emoji" class="input" />
        </div>
        <div>
          <label class="label">描述</label>
          <input v-model="grantForm.desc" class="input" placeholder="使用说明" />
        </div>
      </div>
      <button class="btn mt-4" :disabled="saving" @click="sendGrant">发放</button>
      <p class="mt-2 text-xs text-slate-400">发放后用户下次启动小程序会在奖励页收到新奖励提示。</p>
    </div>

    <!-- 发放记录流水 -->
    <div class="card overflow-x-auto">
      <h2 class="mb-3 text-sm font-semibold">发放记录流水（{{ grants.length }}）</h2>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-100 text-left text-xs text-slate-400">
            <th class="py-2 pr-3">时间</th>
            <th class="py-2 pr-3">用户</th>
            <th class="py-2 pr-3">券</th>
            <th class="py-2">描述</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="g in grants" :key="g.id" class="border-b border-slate-50">
            <td class="py-2 pr-3 text-xs text-slate-500">{{ fmtTime(g.grantedAt) }}</td>
            <td class="py-2 pr-3 font-mono text-xs">{{ g.openid }}</td>
            <td class="py-2 pr-3">{{ g.emoji }} {{ g.title }}</td>
            <td class="py-2 text-xs text-slate-500">{{ g.desc }}</td>
          </tr>
          <tr v-if="!grants.length">
            <td colspan="4" class="py-8 text-center text-slate-400">暂无发放记录</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
