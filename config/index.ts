import { defineConfig } from '@tarojs/cli'

import devConfig from './dev'
import prodConfig from './prod'

// designWidth=390：现有 PWA 按 390 视口设计，styles.css 的 px 值 1:1 直迁无需换算
export default defineConfig(async (merge) => {
  const baseConfig = {
    projectName: 'kaogong-mini',
    date: '2026-9-24',
    designWidth: 390,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
      390: 750 / 390
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [],
    framework: 'react',
    compiler: {
      type: 'webpack5',
      prebundle: { enable: false }
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false
        }
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true
      }
    },
    h5: {}
  }

  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, devConfig)
  }
  return merge({}, baseConfig, prodConfig)
})
