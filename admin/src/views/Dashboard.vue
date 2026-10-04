<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { api, type Stats } from '../api'

const stats = ref<Stats | null>(null)
const loading = ref(true)
const errMsg = ref('')

const lineEl = ref<HTMLDivElement | null>(null)
const heatEl = ref<HTMLDivElement | null>(null)
const barEl = ref<HTMLDivElement | null>(null)
let charts: echarts.ECharts[] = []

function pct(v: number): string {
  return `${Math.round(v * 100)}%`
}

async function load() {
  loading.value = true
  errMsg.value = ''
  try {
    const s = await api.stats(30)
    stats.value = s
    renderCharts(s)
  } catch (e) {
    errMsg.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
}

function renderCharts(s: Stats) {
  charts.forEach((c) => c.dispose())
  charts = []

  // 近 30 天活跃折线
  if (lineEl.value) {
    const line = echarts.init(lineEl.value)
    charts.push(line)
    line.setOption({
      grid: { left: 40, right: 16, top: 24, bottom: 28 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: s.dailyActive.map((d) => d.day.slice(5)),
        axisLabel: { color: '#64748b', fontSize: 11 },
      },
      yAxis: { type: 'value', minInterval: 1, axisLabel: { color: '#64748b', fontSize: 11 } },
      series: [
        {
          name: '活跃人数',
          type: 'line',
          smooth: true,
          symbolSize: 6,
          data: s.dailyActive.map((d) => d.count),
          itemStyle: { color: '#4f46e5' },
          areaStyle: { color: 'rgba(79,70,229,0.12)' },
        },
      ],
    })
  }

  // 近 12 周打卡热力（84 天窗口，按周×星期铺格）
  if (heatEl.value) {
    const heat = echarts.init(heatEl.value)
    charts.push(heat)
    const counts = new Map<string, number>(s.heat)
    const cells: { value: [number, number, number] }[] = []
    const today = new Date()
    for (let i = 0; i < 84; i++) {
      const d = new Date(today.getTime() - (83 - i) * 86400000)
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const week = Math.floor(i / 7)
      const weekday = (d.getDay() + 6) % 7 // 周一 = 0
      cells.push({ value: [week, weekday, counts.get(iso) ?? 0] })
    }
    const maxV = Math.max(1, ...cells.map((c) => c.value[2]))
    heat.setOption({
      tooltip: {
        formatter: (p: { value: [number, number, number] }) => `打卡人数：${p.value[2]}`,
      },
      grid: { left: 32, right: 16, top: 12, bottom: 24 },
      xAxis: {
        type: 'category',
        data: Array.from({ length: 12 }, (_, i) => `W${i + 1}`),
        axisLabel: { color: '#64748b', fontSize: 10 },
      },
      yAxis: {
        type: 'category',
        data: ['一', '二', '三', '四', '五', '六', '日'],
        axisLabel: { color: '#64748b', fontSize: 10 },
      },
      visualMap: {
        min: 0,
        max: maxV,
        calculable: false,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        show: false,
        inRange: { color: ['#eef2ff', '#a5b4fc', '#4f46e5', '#312e81'] },
      },
      series: [
        {
          type: 'heatmap',
          data: cells,
          itemStyle: { borderColor: '#fff', borderWidth: 2, borderRadius: 4 },
          emphasis: { itemStyle: { borderColor: '#4f46e5' } },
        },
      ],
    })
  }

  // 目标考试分布横条
  if (barEl.value) {
    const bar = echarts.init(barEl.value)
    charts.push(bar)
    const entries = Object.entries(s.examDist)
    bar.setOption({
      grid: { left: 64, right: 24, top: 12, bottom: 24 },
      tooltip: {},
      xAxis: { type: 'value', minInterval: 1, axisLabel: { color: '#64748b', fontSize: 11 } },
      yAxis: {
        type: 'category',
        data: entries.map(([k]) => k),
        axisLabel: { color: '#64748b', fontSize: 11 },
      },
      series: [
        {
          type: 'bar',
          data: entries.map(([, v]) => v),
          barWidth: 14,
          itemStyle: { color: '#4f46e5', borderRadius: [0, 7, 7, 0] },
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

    <template v-else-if="stats">
      <!-- 4 个 KPI 卡 -->
      <div class="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div class="card">
          <p class="text-xs text-slate-500">总用户</p>
          <p class="mt-1 text-2xl font-semibold">{{ stats.totalUsers }}</p>
          <p class="mt-1 text-xs text-slate-400">正式 {{ stats.userCount }} · 转正率 {{ pct(stats.upgradeRate) }}</p>
        </div>
        <div class="card">
          <p class="text-xs text-slate-500">今日活跃</p>
          <p class="mt-1 text-2xl font-semibold">{{ stats.todayActive }}</p>
          <p class="mt-1 text-xs text-slate-400">近 7 天新增 {{ stats.new7 }}</p>
        </div>
        <div class="card">
          <p class="text-xs text-slate-500">发券 / 核销</p>
          <p class="mt-1 text-2xl font-semibold">{{ stats.grants.issued }} / {{ stats.grants.used }}</p>
          <p class="mt-1 text-xs text-slate-400">含 B 端直发与任务达成</p>
        </div>
        <div class="card">
          <p class="text-xs text-slate-500">生活均值</p>
          <p class="mt-1 text-2xl font-semibold">{{ stats.avgMood }} / {{ stats.avgWater }}</p>
          <p class="mt-1 text-xs text-slate-400">近 7 天心情均分 · 日均喝水杯数</p>
        </div>
      </div>

      <!-- 近 30 天活跃折线 -->
      <div class="card mb-5">
        <h2 class="mb-3 text-sm font-semibold">近 30 天活跃人数</h2>
        <div ref="lineEl" class="h-64"></div>
      </div>

      <!-- 热力 + 考试分布 -->
      <div class="mb-5 grid gap-4 lg:grid-cols-2">
        <div class="card">
          <h2 class="mb-3 text-sm font-semibold">近 12 周打卡热力（打卡人数）</h2>
          <div ref="heatEl" class="h-56"></div>
        </div>
        <div class="card">
          <h2 class="mb-3 text-sm font-semibold">目标考试分布</h2>
          <div ref="barEl" class="h-56"></div>
        </div>
      </div>

      <!-- 学习指标条 -->
      <div class="card">
        <h2 class="mb-4 text-sm font-semibold">学习指标（正式用户均值）</h2>
        <div class="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <div v-for="m in [
            { label: '今日打卡完成率', value: pct(stats.metrics.checkinRate), ratio: stats.metrics.checkinRate },
            { label: '平均连续全勤', value: `${stats.metrics.avgStreak} 天`, ratio: Math.min(stats.metrics.avgStreak / 14, 1) },
            { label: '专注日均', value: `${stats.metrics.focusDaily} 分钟`, ratio: Math.min(stats.metrics.focusDaily / 120, 1) },
            { label: '三件事完成率', value: pct(stats.metrics.threeRate), ratio: stats.metrics.threeRate },
            { label: '复习掌握率', value: pct(stats.metrics.reviewRate), ratio: stats.metrics.reviewRate },
          ]" :key="m.label">
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-600">{{ m.label }}</span>
              <span class="font-medium">{{ m.value }}</span>
            </div>
            <div class="mt-1.5 h-2 rounded-full bg-slate-100">
              <div class="h-2 rounded-full bg-primary" :style="{ width: `${Math.round(Math.min(m.ratio, 1) * 100)}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
