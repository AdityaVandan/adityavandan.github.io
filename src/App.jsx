import { useEffect, useState } from 'react'
import Home from './pages/Home.jsx'
import { Essay, EssayMissing } from './pages/Essay.jsx'
import { essayFromPath } from './writing.js'

const HOME_TITLE = 'Aditya Vandan Sharma — Full-stack AI Software Engineer'
const HOME_DESCRIPTION =
  'Aditya Vandan Sharma — Full-stack AI software engineer. Tesco, Rippling, Groww.'
const HOME_CANONICAL = 'https://adityavandan.github.io/'

function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return pathname
}

function setMeta(name, content) {
  const node = document.querySelector(`meta[name="${name}"]`)
  if (node) node.setAttribute('content', content)
}

function setCanonical(href) {
  let node = document.querySelector('link[rel="canonical"]')
  if (!node) {
    node = document.createElement('link')
    node.setAttribute('rel', 'canonical')
    document.head.append(node)
  }
  node.setAttribute('href', href)
}

export default function App() {
  const pathname = usePathname()
  const route = essayFromPath(pathname)
  const routeKey = route.kind === 'essay' ? `essay:${route.post.slug}` : route.kind

  useEffect(() => {
    const current = essayFromPath(window.location.pathname)
    if (current.kind === 'essay') {
      document.title = `${current.post.title} — Aditya Vandan Sharma`
      setMeta('description', current.post.excerpt || current.post.title)
      setCanonical(current.post.url)
      return
    }
    if (current.kind === 'missing') {
      document.title = 'Essay not found — Aditya Vandan Sharma'
      setMeta('description', 'This essay is not in the snapshot.')
      setCanonical(HOME_CANONICAL)
      return
    }
    document.title = HOME_TITLE
    setMeta('description', HOME_DESCRIPTION)
    setCanonical(HOME_CANONICAL)
  }, [routeKey])

  useEffect(() => {
    if (route.kind === 'essay' || route.kind === 'missing') return undefined
    const id = route.kind === 'index' ? 'writing' : window.location.hash.replace('#', '')
    if (!id) return undefined
    const scroll = () => document.getElementById(id)?.scrollIntoView({ block: 'start' })
    const frame = window.requestAnimationFrame(scroll)
    const later = window.setTimeout(scroll, 60)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(later)
    }
  }, [route.kind, pathname])

  if (route.kind === 'essay') return <Essay post={route.post} />
  if (route.kind === 'missing') return <EssayMissing />
  return <Home />
}
