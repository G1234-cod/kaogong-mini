/* 真机效果巡检：用微信开发者工具自动化对每个页面截图（输出到 %TEMP%/kg-shots）
   用法：node scripts/shot.js [页面名过滤，可选] [滚动距离 px，可选，用于截页面下半部分]
   前置：微信开发者工具 → 设置 → 安全设置 → 服务端口 开启 */
const automator = require('miniprogram-automator')
const { spawn } = require('child_process')
const path = require('path')
const os = require('os')
const fs = require('fs')

const CLI = 'D:\\微信\\WeiXin_Web_Test\\微信web开发者工具\\cli.bat'
const PROJECT = path.resolve(__dirname, '..')
const OUT = path.join(os.tmpdir(), 'kg-shots')
const PORT = 9420

const PAGES = [
  ['today', '/pages/today/index'],
  ['courses', '/pages/courses/index'],
  ['checkin', '/pages/checkin/index'],
  ['life', '/pages/life/index'],
  ['settings', '/pages/settings/index'],
  ['food', '/pages/food/index'],
  ['ledger', '/pages/ledger/index'],
  ['todos', '/pages/todos/index'],
  ['periodic', '/pages/periodic/index'],
  ['dates', '/pages/dates/index'],
  ['notes', '/pages/notes/index'],
  ['pomodoro', '/pages/pomodoro/index'],
  ['mood-history', '/pages/mood-history/index'],
  ['pomo-logs', '/pages/pomo-logs/index'],
  ['sub-reminders', '/pages/settings-sub/index?type=reminders'],
  ['sub-city', '/pages/settings-sub/index?type=city'],
  ['sub-intel', '/pages/settings-sub/index?type=intel'],
  ['sub-account', '/pages/settings-sub/index?type=account'],
  ['sub-about', '/pages/settings-sub/index?type=about']
]

const filter = process.argv[2]
const scroll = Number(process.argv[3] || 0)
const targets = filter ? PAGES.filter(([n]) => n.includes(filter)) : PAGES

async function connectWithRetry() {
  for (let i = 0; i < 60; i++) {
    try {
      const mp = await automator.connect({ wsEndpoint: `ws://127.0.0.1:${PORT}` })
      await mp.systemInfo() // 活性探测：连上半死会话时此处抛错，走重试
      return mp
    } catch (e) {
      await new Promise(r => setTimeout(r, 1000))
    }
  }
  throw new Error('连接微信开发者工具自动化端口超时')
}

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  // Node 新版 spawn 不能直接执行 .bat，须经 cmd /c 包装
  spawn('cmd.exe', ['/c', CLI, 'auto', '--project', PROJECT, '--auto-port', String(PORT)], { stdio: 'ignore' })
  let miniProgram = await connectWithRetry()
  await miniProgram.checkVersion()
  const shoot = async (mp, name, url) => {
    await mp.reLaunch(url)
    await new Promise(r => setTimeout(r, 1000))
    if (scroll > 0) {
      await mp.callWxMethod('pageScrollTo', { scrollTop: scroll, duration: 0 })
      await new Promise(r => setTimeout(r, 300))
    }
    await mp.screenshot({ path: path.join(OUT, name + (scroll ? '-s' + scroll : '') + '.png') })
    console.log('shot:', name)
  }
  for (const [name, url] of targets) {
    try {
      await shoot(miniProgram, name, url)
    } catch (e) {
      console.warn('reconnect:', name, (e && e.message) || e)
      try { miniProgram.disconnect() } catch (_) {}
      miniProgram = await connectWithRetry()
      await shoot(miniProgram, name, url)
    }
  }
  miniProgram.disconnect()
  console.log('ALL DONE ->', OUT)
  process.exit(0)
})().catch(e => {
  console.error('FAIL:', (e && e.message) || e)
  process.exit(1)
})
