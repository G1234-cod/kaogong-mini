// 无头渲染探针打包器：把 Taro 依赖桩掉后用 node 跑 entry.jsx
const path = require('path')
const esbuild = require('esbuild')

const stubs = path.join(__dirname, 'stubs.jsx')
const stubDatePicker = path.join(__dirname, 'stubs-datepicker.jsx')

const stubPlugin = {
  name: 'smoke-stubs',
  setup(build) {
    // 有副作用/宿主依赖 → 全部指向桩
    build.onResolve({ filter: /^@tarojs\/(taro|components)$/ }, () => ({ path: stubs }))
    build.onResolve({ filter: /^\.\.\/\.\.\/store$/ }, () => ({ path: stubs }))
    build.onResolve({ filter: /components\/DatePicker$/ }, () => ({ path: stubDatePicker }))
    build.onResolve({ filter: /components\/ConfirmDialog$/ }, () => ({ path: stubs }))
    build.onResolve({ filter: /utils\/platform$/ }, () => ({ path: stubs }))
    // 样式与图片：空模块
    build.onResolve({ filter: /\.(scss|css|png|jpe?g|svg|gif)$/ }, (args) => ({
      path: args.path,
      namespace: 'empty',
    }))
    build.onLoad({ filter: /.*/, namespace: 'empty' }, () => ({ contents: '' }))
  },
}

async function main() {
  const r = await esbuild.build({
    entryPoints: [path.join(__dirname, 'entry.jsx')],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: path.join(__dirname, 'out.cjs'),
    jsx: 'automatic',
    plugins: [stubPlugin],
    logLevel: 'silent',
    external: ['react', 'react-dom'],
  })
  if (r.errors && r.errors.length) {
    console.error(r.errors)
    process.exit(1)
  }
  require(path.join(__dirname, 'out.cjs'))
}

main().catch((e) => {
  console.error('BUILD/RUN FAIL:', e)
  process.exit(1)
})
