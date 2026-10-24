/**
 * Build for GitHub Pages (master branch, path /).
 *
 * Flow:
 * 1. Refresh the committed GitHub snapshot (keeps going if GitHub is quiet)
 * 2. Restore Vite entry from index.source.html → index.html
 * 3. vite build → dist/
 * 4. Sync dist/ to repo root (committed static site)
 * 5. Restore index.source.html as the durable Vite entry; keep built index.html for Pages
 */
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const dist = join(root, 'dist')
const sourceHtml = join(root, 'index.source.html')
const rootHtml = join(root, 'index.html')

if (!existsSync(sourceHtml)) {
  console.error('Missing index.source.html')
  process.exit(1)
}

const refresh = spawnSync('node', ['scripts/fetch-github-stats.mjs'], { stdio: 'inherit' })
if (refresh.status !== 0) {
  console.warn('Continuing with the committed GitHub snapshot')
}

// Vite expects index.html at project root during build
copyFileSync(sourceHtml, rootHtml)

const build = spawnSync('npx', ['vite', 'build'], { stdio: 'inherit', shell: true })
if (build.status !== 0) process.exit(build.status ?? 1)

if (!existsSync(dist)) {
  console.error('dist/ missing after build')
  process.exit(1)
}

const assetsDir = join(root, 'assets')
if (existsSync(assetsDir)) rmSync(assetsDir, { recursive: true, force: true })

for (const entry of readdirSync(dist, { withFileTypes: true })) {
  const from = join(dist, entry.name)
  const to = join(root, entry.name)
  if (entry.name === 'src' || entry.name === 'scripts') continue
  if (entry.isDirectory()) {
    cpSync(from, to, { recursive: true })
  } else {
    copyFileSync(from, to)
  }
}

writeFileSync(join(root, '.nojekyll'), '')
console.log('Synced dist/ → repo root for GitHub Pages (index.html is production build)')
