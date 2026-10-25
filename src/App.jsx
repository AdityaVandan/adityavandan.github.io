import { useEffect, useState } from 'react'
import Home from './pages/Home.jsx'
import { Essay, EssayMissing } from './pages/Essay.jsx'
import { applyRouteMeta, essayMeta, homeMeta, missingMeta } from './seo/metadata.js'
import { essayFromPath } from './writing.js'

function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return pathname
}

export default function App() {
  const pathname = usePathname()
  const route = essayFromPath(pathname)
  const routeKey = route.kind === 'essay' ? `essay:${route.post.slug}` : route.kind

  useEffect(() => {
    const current = essayFromPath(window.location.pathname)
    if (current.kind === 'essay') applyRouteMeta(essayMeta(current.post))
    else if (current.kind === 'missing') applyRouteMeta(missingMeta())
    else applyRouteMeta(homeMeta())
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
