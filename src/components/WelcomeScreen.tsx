// 首次打开身份选择屏（注册制、无白名单）：
//   🎮 试玩看看 → 建档 guest，注入演示数据存本地沙盒，可随时转正
//   🚀 正式开始 → 微信静默登录建档 user，数据云同步，换机不丢
// 选择只做一次（写入 kg-role-chosen），之后永久免登，不再打扰。
import { Text, View } from '@tarojs/components'

export default function WelcomeScreen({
  onChoose,
}: {
  onChoose: (role: 'user' | 'guest') => void
}) {
  return (
    <View className="welcome">
      <View className="welcome-inner">
        <Text className="welcome-logo">📚</Text>
        <Text className="welcome-title">考公小助手</Text>
        <Text className="welcome-sub">开始之前，先选一种使用方式</Text>

        <View className="welcome-card" onClick={() => onChoose('guest')}>
          <Text className="welcome-emoji">🎮</Text>
          <View className="grow" style={{ textAlign: 'left' }}>
            <Text className="welcome-card-title">试玩看看</Text>
            <Text className="welcome-card-desc">
              用演示数据快速体验全部功能，记录只存本机；之后可随时升级为正式账号并带走记录
            </Text>
          </View>
        </View>

        <View className="welcome-card primary" onClick={() => onChoose('user')}>
          <Text className="welcome-emoji">🚀</Text>
          <View className="grow" style={{ textAlign: 'left' }}>
            <Text className="welcome-card-title">正式开始</Text>
            <Text className="welcome-card-desc">
              微信登录即可，数据实时同步云端，换手机、重装都能自动恢复
            </Text>
          </View>
        </View>

        <Text className="welcome-tip">
          只需这一次选择，之后打开永久免登录。登录仅用于识别账号（不获取微信昵称、头像、手机号），数据仅存自建服务器；继续即表示同意「数据与隐私」说明（设置 → 关于）。
        </Text>
      </View>
    </View>
  )
}
