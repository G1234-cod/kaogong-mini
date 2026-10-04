export default {
  pages: [
    'pages/today/index',
    'pages/courses/index',
    'pages/checkin/index',
    'pages/life/index',
    'pages/settings/index',
    'pages/food/index',
    'pages/ledger/index',
    'pages/ledger-cats/index',
    'pages/ledger-search/index',
    'pages/todos/index',
    'pages/reminders/index',
    'pages/notes/index',
    'pages/note-tags/index',
    'pages/wrongbook/index',
    'pages/wrongbook/practice',
    'pages/pomodoro/index',
    'pages/mood-history/index',
    'pages/pomo-logs/index',
    'pages/settings-sub/index',
    'pages/ai-chat/index'
  ],
  window: {
    backgroundColor: '#faf7f2',
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#faf7f2',
    navigationBarTitleText: '考公小助手',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    // 自定义 tabBar（src/custom-tab-bar）：支持液态指示动画 + 左右滑动切换主题
    custom: true,
    color: '#7a6a5b',
    selectedColor: '#be5016',
    backgroundColor: '#fffdfa',
    borderStyle: 'white',
    list: [
      { pagePath: 'pages/today/index', text: '今日' },
      { pagePath: 'pages/courses/index', text: '课程' },
      { pagePath: 'pages/checkin/index', text: '打卡' },
      { pagePath: 'pages/life/index', text: '生活' },
      { pagePath: 'pages/settings/index', text: '设置' }
    ]
  },
  lazyCodeLoading: 'requiredComponents',
  // 天气卡「自动检测当前位置」使用模糊定位，须在此声明（微信 2022 起强制）。
  // 注意：模糊定位(getFuzzyLocation)与精确定位(getLocation)互斥，同时声明会编译报错；
  // 个人主体 getLocation 权限基本申请不下来，故统一走 getFuzzyLocation（需后台「接口设置」准入申请）
  requiredPrivateInfos: ['getFuzzyLocation'],
  // 需授权定位 scope 时必须配置用途说明（否则授权后仍会定位失败）
  permission: {
    'scope.userFuzzyLocation': {
      desc: '用于自动定位所在城市，展示当地天气与附近美食推荐'
    },
    'scope.userLocation': {
      desc: '用于查看附近美食位置与导航'
    }
  },
  // 点餐按钮跳转美团外卖 / 饿了么小程序需在此声明目标 appId
  navigateToMiniProgramAppIdList: ['wxde8ac0a21135c07d', 'wxece3a9a4c82f58c9']
}
