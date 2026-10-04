/* 统一 SVG 图标组件（P1-5）：内层标记取自 constants/icons.ts，描边属性由根节点统一注入
   - 微信小程序不支持 JSX 内联 <svg>，故经 encodeURIComponent 转 data URI 由 <Image> 承载
   - 禁用 <style> 与百分比单位（小程序 SVG 渲染限制）
   - 不要放进 <Text> 内（text 不支持嵌套 image），作为兄弟节点放置，image 默认行内排布 */
import { Image } from '@tarojs/components'
import { ICONS } from '../constants/icons'

interface IconProps {
  name: string
  size?: number
  color?: string
  /** 右侧间距（px），与文字标签并排时用 */
  gap?: number
  className?: string
}

export default function Icon({ name, size = 16, color = '#3d3028', gap = 0, className }: IconProps) {
  const inner = ICONS[name] ?? ''
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}"` +
    ` fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  return (
    <Image
      src={src}
      className={className}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        verticalAlign: 'middle',
        marginRight: gap,
      }}
    />
  )
}
