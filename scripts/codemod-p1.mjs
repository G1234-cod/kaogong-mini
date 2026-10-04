// P1 尺寸 token 化 codemod（一次性脚本）
// 字号 24 档 → 8 档：10/12/14/16/18/22/28/40（就近归档、并档取大）
// 圆角 13 档 → 5 档：2/6/10/16/999（50% 正圆与 0 直角为几何原语，保留）
// scss：数值 → var(--fs-*) / var(--r-*)；tsx 内联：数值 → 对应档位 px 数字
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.argv[2] || 'src'

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(scss|tsx|ts)$/.test(name)) out.push(p)
  }
  return out
}

// 原值 → 档位值
const FS = {
  10: 10, 11: 12, 12: 12, 13: 14, 14: 14, 15: 16, 16: 16, 17: 16,
  18: 18, 19: 18, 20: 22, 22: 22, 24: 22, 26: 28, 28: 28, 32: 28,
  34: 40, 36: 40, 40: 40, 42: 40, 46: 40, 52: 40, 58: 40, 74: 40,
}
const FS_VAR = { 10: 1, 12: 2, 14: 3, 16: 4, 18: 5, 22: 6, 28: 7, 40: 8 }
// 圆角：原值 → 档位值（0 / 999 / 50% 不动）
const R = { 1: 2, 2: 2, 3: 2, 4: 6, 6: 6, 8: 10, 9: 10, 10: 10, 12: 16, 14: 16, 16: 16 }
const R_VAR = { 2: 1, 6: 2, 10: 3, 16: 4 }

const unmapped = new Map()
const note = (v, where) => unmapped.set(`${v} @ ${where}`, (unmapped.get(`${v} @ ${where}`) || 0) + 1)

const files = walk(ROOT)
let changed = 0

for (const f of files) {
  const src = readFileSync(f, 'utf8')
  const isScss = f.endsWith('.scss')
  let out = src.split('\n').map((line) => {
    // ---- scss: font-size: Npx → var(--fs-N) ----
    if (isScss) {
      const fs = line.match(/(font-size:\s*)([\d.]+)px/)
      if (fs) {
        const v = Number(fs[2])
        if (FS[v] !== undefined) line = line.replace(fs[0], `${fs[1]}var(--fs-${FS_VAR[FS[v]]})`)
        else note(v, f)
      }
      // ---- scss: border-radius: <tokens> → 每个 Npx 档位化 ----
      const br = line.match(/(border-radius:\s*)([^;]+)/)
      if (br) {
        const val = br[2].replace(/([\d.]+)px/g, (m, num) => {
          const v = Number(num)
          if (R[v] !== undefined) return `var(--r-${R_VAR[R[v]]})`
          if (v === 999) return 'var(--r-full)'
          note(v, f)
          return m
        })
        line = line.replace(br[0], `${br[1]}${val}`)
      }
      return line
    }
    // ---- tsx/ts: fontSize: N → 档位 px 数字 ----
    line = line.replace(/\bfontSize:\s*'?([\d.]+)'?/g, (m, num) => {
      const v = Number(num)
      if (FS[v] !== undefined) return `fontSize: ${FS[v]}`
      note(v, f)
      return m
    })
    // ---- tsx/ts: borderRadius: N → 档位 px 数字（999/0/'50%' 不动）----
    line = line.replace(/\bborderRadius:\s*'?([\d.]+)'?/g, (m, num) => {
      const v = Number(num)
      if (R[v] !== undefined) return `borderRadius: ${R[v]}`
      if (v === 999 || v === 0) return m
      note(v, f)
      return m
    })
    return line
  }).join('\n')
  if (out !== src) {
    writeFileSync(f, out)
    changed++
  }
}

console.log(`changed files: ${changed}`)
if (unmapped.size) {
  console.log('UNMAPPED values:')
  for (const [k, n] of unmapped) console.log(`  ${k} × ${n}`)
} else {
  console.log('all values mapped')
}
