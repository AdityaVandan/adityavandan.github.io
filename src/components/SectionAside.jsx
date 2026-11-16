import { useEffect, useRef, useState } from 'react'
import { site } from '../data/content.js'

/** Keep the pill tucked against the cursor tip, like the reference. */
const OFFSET_X = 12
const OFFSET_Y = 8
const EDGE = 12

function canUseAside() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (window.matchMedia('(hover: none)').matches) return false
  return true
}

function pickLine(lines, index) {
  if (!lines?.length) return ''
  return lines[index % lines.length]
}

/**
 * Coy cursor-following aside that reacts to [data-aside] sections.
 * Decorative only — fine-pointer / hover devices.
 */
export default function SectionAside() {
  const bubbleRef = useRef(null)
  const latestRef = useRef({ x: 0, y: 0 })
  const keyRef = useRef('')
  const countersRef = useRef({})
  const rafRef = useRef(0)
  const [state, setState] = useState({
    visible: false,
    text: '',
    x: 0,
    y: 0,
  })

  useEffect(() => {
    if (!canUseAside()) return undefined

    const asides = site.asides ?? {}

    const place = (x, y) => {
      const bubble = bubbleRef.current
      const width = bubble?.offsetWidth || 200
      const height = bubble?.offsetHeight || 36
      let left = x + OFFSET_X
      let top = y + OFFSET_Y
      if (left + width > window.innerWidth - EDGE) left = x - width - 8
      if (top + height > window.innerHeight - EDGE) top = y - height - 8
      left = Math.max(EDGE, Math.min(left, window.innerWidth - width - EDGE))
      top = Math.max(EDGE, Math.min(top, window.innerHeight - height - EDGE))
      return { x: left, y: top }
    }

    const tick = () => {
      rafRef.current = 0
      const { x, y } = latestRef.current
      const target = document.elementFromPoint(x, y)
      const host = target?.closest?.('[data-aside]')
      const key = host?.getAttribute('data-aside') || ''
      const lines = key ? asides[key] : null

      if (!lines?.length) {
        keyRef.current = ''
        setState((prev) => {
          if (!prev.visible) return prev
          const pos = place(x, y)
          return { ...prev, visible: false, x: pos.x, y: pos.y }
        })
        return
      }

      let text
      if (key !== keyRef.current) {
        const next = (countersRef.current[key] ?? 0) % lines.length
        countersRef.current[key] = next + 1
        keyRef.current = key
        text = pickLine(lines, next)
      } else {
        text = undefined
      }

      const pos = place(x, y)
      setState((prev) => ({
        visible: true,
        text: text ?? prev.text,
        x: pos.x,
        y: pos.y,
      }))
    }

    const onMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      latestRef.current = { x: event.clientX, y: event.clientY }
      if (!rafRef.current) rafRef.current = window.requestAnimationFrame(tick)
    }

    const onLeave = () => {
      keyRef.current = ''
      setState((prev) => (prev.visible ? { ...prev, visible: false } : prev))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={bubbleRef}
      className={`section-aside${state.visible ? ' is-visible' : ''}`}
      style={{ transform: `translate3d(${state.x}px, ${state.y}px, 0)` }}
      aria-hidden="true"
    >
      <span key={state.text} className="section-aside-text">
        {state.text}
      </span>
    </div>
  )
}
