// 无头渲染排障入口：逐场景渲染全部注册页，抓渲染期异常
import React from 'react'
import { renderToString } from 'react-dom/server'
import { setScenario, buildData, buildRaw } from './stubs'
import { mergeWithDefaults } from '../../src/store/normalize'

import Today from '../../src/pages/today/index'
import Courses from '../../src/pages/courses/index'
import Checkin from '../../src/pages/checkin/index'
import Life from '../../src/pages/life/index'
import Settings from '../../src/pages/settings/index'
import Food from '../../src/pages/food/index'
import Ledger from '../../src/pages/ledger/index'
import LedgerCats from '../../src/pages/ledger-cats/index'
import LedgerSearch from '../../src/pages/ledger-search/index'
import Todos from '../../src/pages/todos/index'
import Periodic from '../../src/pages/periodic/index'
import Dates from '../../src/pages/dates/index'
import Notes from '../../src/pages/notes/index'
import Wrongbook from '../../src/pages/wrongbook/index'
import Pomodoro from '../../src/pages/pomodoro/index'
import MoodHistory from '../../src/pages/mood-history/index'
import PomoLogs from '../../src/pages/pomo-logs/index'
import SettingsSub from '../../src/pages/settings-sub/index'
import AiChat from '../../src/pages/ai-chat/index'

const pages = {
  Today, Courses, Checkin, Life, Settings, Food,
  Ledger, LedgerCats, LedgerSearch, Todos, Periodic, Dates, Notes, Wrongbook,
  Pomodoro, MoodHistory, PomoLogs, SettingsSub, AiChat,
}
const scenarios = ['defaults', 'full', 'serverish', 'nulls', 'dirty']

console.log('==== A. mergeWithDefaults 自身健壮性 ====')
for (const s of scenarios) {
  setScenario(s)
  try {
    const out = mergeWithDefaults(buildRaw())
    const bad = Object.keys(out).filter((k) => out[k] === null || out[k] === undefined)
    console.log('MERGE OK  ', s.padEnd(9), bad.length ? '残留空字段: ' + bad.join(',') : '全部有值')
  } catch (e) {
    console.log('MERGE FAIL', s.padEnd(9), String((e && e.message) || e))
    console.log('   ' + String((e && e.stack) || e).split('\n').slice(0, 4).join('\n   '))
  }
}

console.log('==== B. 页面渲染（数据经 mergeWithDefaults） ====')
let failCount = 0
for (const s of scenarios) {
  for (const name of Object.keys(pages)) {
    setScenario(s)
    const Comp = pages[name]
    try {
      const html = renderToString(React.createElement(Comp))
      console.log('OK  ', s.padEnd(9), name.padEnd(13), 'len=' + html.length)
    } catch (e) {
      failCount++
      console.log('FAIL', s.padEnd(9), name.padEnd(13), String((e && e.message) || e))
      console.log('   ' + String((e && e.stack) || e).split('\n').slice(0, 5).join('\n   '))
    }
  }
}
console.log(failCount ? `==== 共 ${failCount} 个渲染失败 ====` : '==== 全部页面渲染通过 ====')
