import { useEffect } from 'react'

/**
 * Drive --p for the aurora animation when CSS scroll timelines are missing.
 */
export function useScrollGlow(pageRef) {
  useEffect(() => {
    const page = pageRef.current
    if (!page) return undefined
    if (window.CSS?.supports?.('animation-timeline: scroll()')) return undefined

    const onScroll = () => {
      const scrolling = document.scrollingElement || document.documentElement
      const max = scrolling.scrollHeight - scrolling.clientHeight
      if (max > 40) page.style.setProperty('--p', (scrolling.scrollTop / max).toFixed(4))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [pageRef])
}
