export default {
  pages: [
    'pages/today/index',
    'pages/courses/index',
    'pages/checkin/index',
    'pages/life/index',
    'pages/settings/index',
    'pages/food/index',
    'pages/ledger/index',
    'pages/todos/index',
    'pages/periodic/index',
    'pages/dates/index',
    'pages/notes/index',
    'pages/pomodoro/index',
    'pages/mood-history/index',
    'pages/pomo-logs/index',
    'pages/settings-sub/index'
  ],
  window: {
    backgroundColor: '#f5f6fa',
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#f5f6fa',
    navigationBarTitleText: '考公小助手',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#6b7280',
    selectedColor: '#4f46e5',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      { pagePath: 'pages/today/index', text: '今日' },
      { pagePath: 'pages/courses/index', text: '课程' },
      { pagePath: 'pages/checkin/index', text: '打卡' },
      { pagePath: 'pages/life/index', text: '生活' },
      { pagePath: 'pages/settings/index', text: '设置' }
    ]
  },
  lazyCodeLoading: 'requiredComponents'
}
