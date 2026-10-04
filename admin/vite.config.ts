import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base '/admin/'：nginx `location /admin/` 托管构建产物，history 路由 try_files 回退 index.html
export default defineConfig({
  base: '/admin/',
  plugins: [vue()],
  server: {
    port: 5180,
    // 后端无 CORS：本地 dev 靠代理同源转发；生产同域 /api 天然同源
    proxy: {
      '/api': {
        target: 'https://app.gyx-a.cn',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1600,
  },
})
