/**
 * Build for GitHub Pages (master branch, path /).
 *
 * Flow:
 * 1. Restore Vite entry from index.source.html → index.html
 * 2. vite build → dist/
 * 3. Sync dist/ to repo root (committed static site)
 * 4. Restore index.source.html as the durable Vite entry; keep built index.html for Pages
 */
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
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

// Vite expects index.html at project root during build
copyFileSync(sourceHtml, rootHtml)

const build = spawnSync('npx', ['vite', 'build'], { stdio: 'inherit', shell: true })
if (build.status !== 0) process.exit(build.status ?? 1)

if (!existsSync(dist)) {
  console.error('dist/ missing after build')
  process.exit(1)
}

writeEssayShells(dist)

const assetsDir = join(root, 'assets')
if (existsSync(assetsDir)) rmSync(assetsDir, { recursive: true, force: true })

const publishedEssays = join(root, 'writing')
if (existsSync(publishedEssays)) rmSync(publishedEssays, { recursive: true, force: true })

const publishedEssayImages = join(root, 'images', 'writing')
if (existsSync(publishedEssayImages)) rmSync(publishedEssayImages, { recursive: true, force: true })

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

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function essayShell(template, post) {
  const title = `${post.title} — Aditya Vandan Sharma`
  const description = post.excerpt || post.title
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
  html = html.replace(
    /(name="description"\s+content=")[\s\S]*?(")/,
    `$1${escapeHtml(description)}$2`,
  )
  const canonical = `<link rel="canonical" href="${escapeHtml(post.url)}" />`
  if (html.includes('rel="canonical"')) {
    html = html.replace(/[ \t]*<link rel="canonical"[^>]*>/, `    ${canonical}`)
  } else {
    html = html.replace('</head>', `    ${canonical}\n  </head>`)
  }
  return html
}

function writeEssayShells(distDir) {
  const snapshotPath = join(root, 'src', 'data', 'writing.json')
  if (!existsSync(snapshotPath)) {
    console.warn('No writing snapshot — skipping /writing shells')
    return
  }
  const snapshot = JSON.parse(readFileSync(snapshotPath, 'utf8'))
  const posts = Array.isArray(snapshot.posts) ? snapshot.posts : []
  const template = readFileSync(join(distDir, 'index.html'), 'utf8')
  const writingDir = join(distDir, 'writing')
  if (existsSync(writingDir)) rmSync(writingDir, { recursive: true, force: true })

  for (const post of posts) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug || '')) {
      throw new Error(`Unsafe essay slug: ${post.slug}`)
    }
    const dir = join(writingDir, post.slug)
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), essayShell(template, post))
  }

  writeFileSync(join(distDir, '404.html'), template)
  console.log(`Wrote ${posts.length} essay shells and 404.html`)
}
