/**
 * Snapshot https://medium.com/feed/@van13heisenberg into src/data/writing.json.
 *
 * Medium's public feed lists the latest stories (about ten) and omits full HTML
 * for member-only posts. This script merges each run into the existing snapshot
 * so stories that age out of the feed stay in the archive. A later run still
 * upgrades a story when the feed starts including its full text.
 *
 * Run from the repo root: `npm run snapshot`
 */
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { XMLParser } from 'fast-xml-parser'
import { parseHTML } from 'linkedom'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const FEED_URL = process.env.MEDIUM_FEED_URL || 'https://medium.com/feed/@van13heisenberg'
const PROFILE_URL = 'https://medium.com/@van13heisenberg'
const snapshotPath = join(root, 'src', 'data', 'writing.json')
const imageDir = join(root, 'public', 'images', 'writing')
const IMAGE_PREFIX = '/images/writing/'
const MAX_IMAGE_EDGE = 1600
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'

const ALLOWED = new Set([
  'p',
  'h2',
  'h3',
  'blockquote',
  'pre',
  'code',
  'figure',
  'figcaption',
  'img',
  'a',
  'ul',
  'ol',
  'li',
  'strong',
  'em',
  'br',
  'hr',
])
const DROPPED = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'form',
  'noscript',
  'svg',
  'canvas',
  'link',
  'meta',
])

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  isArray: (name) => name === 'item' || name === 'category',
})

function asText(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'object') {
    if (typeof value['#text'] === 'string') return value['#text']
    if (typeof value.__cdata === 'string') return value.__cdata
  }
  return ''
}

function cleanMediumUrl(href) {
  try {
    const url = new URL(href)
    url.searchParams.delete('source')
    if ([...url.searchParams.keys()].length === 0) url.search = ''
    url.hash = ''
    return url.href
  } catch {
    return href
  }
}

function slugFromLink(link, id) {
  try {
    const part = new URL(link).pathname.split('/').filter(Boolean).pop() || ''
    const bare = part.replace(new RegExp(`-?${id}$`, 'i'), '')
    const slug = bare
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return slug
  } catch {
    /* fall through to id */
  }
  return id
}

function titleCaseSlug(value) {
  return value
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function publicationFromUrl(link) {
  try {
    const url = new URL(link)
    if (url.hostname === 'tech.groww.in') return 'Groww Engineering'
    if (url.hostname !== 'medium.com') return url.hostname
    const [head] = url.pathname.split('/').filter(Boolean)
    if (!head || head.startsWith('@') || head === 'p') return null
    return titleCaseSlug(head)
  } catch {
    return null
  }
}

function excerptFrom(text, max = 220) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean) return ''
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const last = cut.lastIndexOf(' ')
  return `${cut.slice(0, last > 80 ? last : max).trim()}…`
}

function replaceGistFrames(html) {
  return html.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, (block) => {
    const href = block.match(/href="([^"]+)"/i)?.[1]
    if (!href || !/^https:\/\//i.test(href)) return ''
    return `<p><a href="${cleanMediumUrl(href)}">Code sample on Medium</a></p>`
  })
}

function safeLink(href) {
  if (!href) return null
  if (href.startsWith('/writing/')) return href
  if (href.startsWith(IMAGE_PREFIX)) return href
  try {
    const url = new URL(href, 'https://adityavandan.github.io')
    if (url.protocol !== 'https:' && url.protocol !== 'http:' && url.protocol !== 'mailto:') {
      return null
    }
    if (url.protocol === 'mailto:') return url.href
    return cleanMediumUrl(url.href)
  } catch {
    return null
  }
}

function sanitizeArticle(html) {
  const prepared = replaceGistFrames(html)
  const { document } = parseHTML(`<!DOCTYPE html><body><div id="essay-root">${prepared}</div></body>`)
  const root = document.getElementById('essay-root')
  let publication = null

  for (const image of [...root.querySelectorAll('img')]) {
    const src = image.getAttribute('src') || ''
    if (src.includes('/_/stat') || src.includes('medium.com/_/stat')) image.remove()
  }

  const boilerplate = [
    /if you enjoyed this story/i,
    /click the 👏 button/i,
    /publishes technical (stuff|pieces)/i,
    /you can subscribe to get them/i,
    /read more of our articles/i,
  ]
  for (const paragraph of [...root.querySelectorAll('p')]) {
    const text = (paragraph.textContent || '').replace(/\s+/g, ' ').trim()
    const published = text.match(/published in\s+(.+?)\s+on Medium/i)
    if (published) {
      publication = published[1].trim()
      paragraph.remove()
      continue
    }
    if (boilerplate.some((pattern) => pattern.test(text))) paragraph.remove()
  }

  for (const heading of [...root.querySelectorAll('h1,h2,h3,h4,h5,h6')]) {
    const level = Number(heading.tagName.slice(1))
    const next = document.createElement(level <= 3 ? 'h2' : 'h3')
    next.innerHTML = heading.innerHTML
    heading.replaceWith(next)
  }

  for (const pre of [...root.querySelectorAll('pre')]) {
    pre.innerHTML = pre.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/\u00a0/g, ' ')
  }

  cleanNode(root)

  for (const node of [...root.querySelectorAll('p, h2, h3, figure, blockquote')]) {
    const text = (node.textContent || '').replace(/\u00a0/g, ' ').trim()
    const hasMedia = node.querySelector('img')
    if (!text && !hasMedia) node.remove()
  }

  while (root.lastElementChild?.tagName === 'HR') root.lastElementChild.remove()

  const serialized = root.innerHTML.trim()
  if (/<script|onerror\s*=|onload\s*=|javascript:/i.test(serialized)) {
    throw new Error('Sanitizer left executable markup in an essay')
  }
  return { html: serialized, publication }
}

function cleanNode(node) {
  for (const child of [...node.children]) cleanNode(child)
  if (!node.tagName || node.id === 'essay-root') return

  const tag = node.tagName.toLowerCase()
  if (DROPPED.has(tag)) {
    node.remove()
    return
  }
  if (!ALLOWED.has(tag)) {
    node.replaceWith(...node.childNodes)
    return
  }

  if (tag === 'a') {
    const href = safeLink(node.getAttribute('href'))
    for (const attr of [...node.attributes]) node.removeAttribute(attr.name)
    if (!href) {
      node.replaceWith(...node.childNodes)
      return
    }
    node.setAttribute('href', href)
    if (/^https?:/i.test(href)) {
      node.setAttribute('rel', 'noreferrer')
      node.setAttribute('target', '_blank')
    }
    return
  }

  if (tag === 'img') {
    const src = node.getAttribute('src') || ''
    const alt = node.getAttribute('alt') || ''
    for (const attr of [...node.attributes]) node.removeAttribute(attr.name)
    if (!/^https:\/\//i.test(src) && !src.startsWith(IMAGE_PREFIX)) {
      node.remove()
      return
    }
    node.setAttribute('src', src)
    node.setAttribute('alt', alt)
    node.setAttribute('loading', 'lazy')
    return
  }

  for (const attr of [...node.attributes]) node.removeAttribute(attr.name)
}

function imageFileName(src) {
  const base = new URL(src).pathname.split('/').pop() || 'image'
  const safe = base.replace(/[^a-zA-Z0-9._-]+/g, '_')
  return safe.includes('.') ? safe : `${safe}.jpg`
}

function cappedImageUrl(src) {
  return src.replace(/\/max\/(\d+)\//, (_match, edge) => {
    const next = Math.min(Number(edge) || MAX_IMAGE_EDGE, MAX_IMAGE_EDGE)
    return `/max/${next}/`
  })
}

async function downloadImage(src) {
  const filename = imageFileName(src)
  const target = join(imageDir, filename)
  if (!existsSync(target)) {
    const response = await fetch(cappedImageUrl(src), {
      headers: { 'user-agent': USER_AGENT, accept: 'image/avif,image/webp,image/*,*/*' },
      redirect: 'follow',
      signal: AbortSignal.timeout(30000),
    })
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }
    const type = response.headers.get('content-type') || ''
    if (!type.startsWith('image/')) {
      throw new Error(`not an image (${type || 'unknown type'})`)
    }
    const bytes = Buffer.from(await response.arrayBuffer())
    if (bytes.length < 32) throw new Error('image response was empty')
    writeFileSync(target, bytes)
  }
  return `${IMAGE_PREFIX}${filename}`
}

async function localizeImages(html) {
  const { document } = parseHTML(`<!DOCTYPE html><body><div id="essay-root">${html}</div></body>`)
  const root = document.getElementById('essay-root')
  let coverImage = null
  for (const image of [...root.querySelectorAll('img')]) {
    const src = image.getAttribute('src') || ''
    if (!src || src.startsWith(IMAGE_PREFIX)) {
      coverImage ||= src || null
      continue
    }
    try {
      const local = await downloadImage(src)
      image.setAttribute('src', local)
      coverImage ||= local
    } catch (error) {
      console.warn(`Image kept on Medium CDN (${src}): ${error.message}`)
      coverImage ||= src
    }
  }
  return { html: root.innerHTML.trim(), coverImage }
}

function rewriteInternalLinks(html, posts) {
  const { document } = parseHTML(`<!DOCTYPE html><body><div id="essay-root">${html}</div></body>`)
  const root = document.getElementById('essay-root')
  for (const anchor of [...root.querySelectorAll('a')]) {
    const href = anchor.getAttribute('href') || ''
    const match = posts.find((post) => {
      if (href === post.url) return true
      try {
        const path = new URL(href).pathname
        return path.endsWith(`/${post.id}`) || path.endsWith(`-${post.id}`)
      } catch {
        return false
      }
    })
    if (!match) continue
    anchor.setAttribute('href', `/writing/${match.slug}`)
    anchor.removeAttribute('target')
    anchor.removeAttribute('rel')
  }
  return root.innerHTML.trim()
}

function parsePreview(html) {
  const { document } = parseHTML(`<!DOCTYPE html><body>${html}</body>`)
  const snippet = document.querySelector('.medium-feed-snippet')?.textContent || ''
  const src = document.querySelector('img')?.getAttribute('src') || ''
  return {
    excerpt: excerptFrom(snippet),
    image: /^https:\/\//i.test(src) ? src : '',
  }
}

function parseItem(item) {
  const title = asText(item.title).trim()
  const url = cleanMediumUrl(asText(item.link).trim())
  const guid = asText(item.guid).trim()
  const id = guid.split('/').pop()
  if (!title || !url || !id) return null

  const encoded = asText(item['content:encoded'])
  const description = asText(item.description)
  const complete =
    encoded.length > 0 &&
    !encoded.includes('medium-feed-item') &&
    !encoded.includes('Continue reading on Medium')

  const publishedAt = new Date(asText(item.pubDate)).toISOString()
  const updatedRaw = asText(item['atom:updated'])
  const updatedAt = updatedRaw ? new Date(updatedRaw).toISOString() : publishedAt
  const categories = (item.category || []).map((category) => asText(category).trim()).filter(Boolean)

  return {
    id,
    slug: slugFromLink(url, id),
    title,
    url,
    publishedAt,
    updatedAt,
    tags: categories,
    publication: publicationFromUrl(url),
    complete,
    encoded: complete ? encoded : '',
    description: complete ? '' : description,
  }
}

function assignSlugs(posts) {
  const used = new Set()
  for (const post of posts) {
    let slug = post.slug
    if (used.has(slug)) slug = `${post.slug}-${post.id}`
    used.add(slug)
    post.slug = slug
  }
}

async function toSnapshotPost(item) {
  if (item.complete) {
    const sanitized = sanitizeArticle(item.encoded)
    const localized = await localizeImages(sanitized.html)
    const quote = sanitized.html.match(/<blockquote[\s>][\s\S]*?<\/blockquote>/i)
    const firstParagraph = sanitized.html.match(/<p[\s>][\s\S]*?<\/p>/i)
    const excerptSource = (quote || firstParagraph)?.[0]?.replace(/<[^>]+>/g, ' ') || item.title
    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      url: item.url,
      publishedAt: item.publishedAt,
      updatedAt: item.updatedAt,
      tags: item.tags,
      publication: sanitized.publication || item.publication,
      complete: true,
      excerpt: excerptFrom(excerptSource),
      coverImage: localized.coverImage,
      html: localized.html,
    }
  }

  const preview = parsePreview(item.description)
  let coverImage = null
  let html = ''
  if (preview.image) {
    try {
      coverImage = await downloadImage(preview.image)
    } catch (error) {
      console.warn(`Cover kept on Medium CDN (${preview.image}): ${error.message}`)
      coverImage = preview.image
    }
    const alt = item.title.replace(/"/g, '&quot;')
    html = `<figure><img src="${coverImage}" alt="${alt}" loading="lazy"></figure>`
  }
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    url: item.url,
    publishedAt: item.publishedAt,
    updatedAt: item.updatedAt,
    tags: item.tags,
    publication: item.publication,
    complete: false,
    excerpt: preview.excerpt || excerptFrom(item.title),
    coverImage,
    html,
  }
}

function readPrevious() {
  if (!existsSync(snapshotPath)) return []
  const previous = JSON.parse(readFileSync(snapshotPath, 'utf8'))
  return Array.isArray(previous.posts) ? previous.posts : []
}

function stripFetchedFields(post) {
  const { encoded: _encoded, description: _description, ...rest } = post
  return rest
}

function postsEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right)
}

function referencedImages(posts) {
  const names = new Set()
  for (const post of posts) {
    const haystack = `${post.html || ''}\n${post.coverImage || ''}`
    for (const match of haystack.matchAll(/\/images\/writing\/([a-zA-Z0-9._-]+)/g)) {
      names.add(match[1])
    }
  }
  return names
}

async function main() {
  console.log(`Fetching ${FEED_URL}`)
  const response = await fetch(FEED_URL, {
    headers: { 'user-agent': USER_AGENT, accept: 'application/rss+xml, application/xml, text/xml' },
    redirect: 'follow',
    signal: AbortSignal.timeout(30000),
  })
  if (!response.ok) {
    throw new Error(`Feed request failed: ${response.status} ${response.statusText}`)
  }
  const xml = await response.text()
  if (!xml.includes('<rss')) {
    throw new Error('Medium did not return an RSS feed')
  }

  const channel = parser.parse(xml)?.rss?.channel
  const items = channel?.item || []
  if (!items.length) throw new Error('Medium feed returned no stories')

  mkdirSync(imageDir, { recursive: true })
  const freshItems = items.map(parseItem).filter(Boolean)
  assignSlugs(freshItems)
  const freshPosts = []
  for (const item of freshItems) {
    const post = stripFetchedFields(await toSnapshotPost(item))
    freshPosts.push(post)
    console.log(`${post.complete ? 'full   ' : 'preview'}  ${post.publishedAt.slice(0, 10)}  ${post.title}`)
  }

  const freshIds = new Set(freshPosts.map((post) => post.id))
  const archived = readPrevious().filter((post) => !freshIds.has(post.id))
  const merged = [...freshPosts, ...archived].sort((a, b) => {
    const byDate = b.publishedAt.localeCompare(a.publishedAt)
    return byDate || a.id.localeCompare(b.id)
  })
  assignSlugs(merged)

  for (const post of merged) {
    post.html = rewriteInternalLinks(post.html || '', merged)
  }

  const previous = readPrevious()
  if (postsEqual(previous, merged)) {
    console.log(`Snapshot already current (${merged.length} stories)`)
    return
  }

  const keep = referencedImages(merged)
  if (existsSync(imageDir)) {
    for (const name of readdirSync(imageDir)) {
      if (!keep.has(name)) rmSync(join(imageDir, name))
    }
  }

  const snapshot = {
    source: PROFILE_URL,
    feed: FEED_URL,
    fetchedAt: new Date().toISOString(),
    posts: merged,
  }
  writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`)
  const full = merged.filter((post) => post.complete).length
  console.log(`Wrote ${merged.length} stories (${full} full, ${merged.length - full} preview) to ${snapshotPath}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
