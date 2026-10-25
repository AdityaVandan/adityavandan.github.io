import snapshot from './data/writing.json'

export const writingPosts = snapshot.posts

export function formatEssayDate(iso) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}

export function essayFromPath(pathname) {
  let path = pathname.split('?')[0].split('#')[0]
  if (path.endsWith('/index.html')) path = path.slice(0, -'/index.html'.length)
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  if (path === '' || path === '/') return { kind: 'home' }
  if (path === '/writing') return { kind: 'index' }
  const match = path.match(/^\/writing\/([^/]+)$/)
  if (!match) return { kind: 'home' }
  const slug = decodeURIComponent(match[1])
  const post = writingPosts.find((item) => item.slug === slug)
  return post ? { kind: 'essay', post } : { kind: 'missing', slug }
}
