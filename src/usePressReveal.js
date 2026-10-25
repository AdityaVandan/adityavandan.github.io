import { useEffect } from 'react'

export function usePressReveal() {
  useEffect(() => {
    const nodes = [...document.querySelectorAll('.press-reveal')]
    if (!nodes.length) return undefined

    const reveal = (node) => node.classList.add('is-pressed')

    // Mobile Safari / short viewports: negative rootMargin + threshold often
    // never intersects, leaving headings stuck at opacity 0.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            reveal(entry.target)
            observer.unobserve(entry.target)
          }
        })
      },
      { root: null, rootMargin: '0px 0px -5% 0px', threshold: 0 },
    )

    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect()
      const inView = rect.top < window.innerHeight && rect.bottom > 0
      if (inView) {
        reveal(node)
      } else {
        observer.observe(node)
      }
    })

    // Safety net: never leave content invisible
    const fallback = window.setTimeout(() => {
      nodes.forEach(reveal)
    }, 1800)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])
}
