import { useEffect, useRef, useState } from 'react'
import { site } from '../data/content.js'

/** Keep the pill tucked against the custom cursor tip, like the reference. */
const OFFSET_X = 14
const OFFSET_Y = 10
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

/** Figma multiplayer arrow — white halo under a solid fill (tip at top-left). */
const FIGMA_CURSOR_PATH =
  'M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3638H5.65376Z'

function AsideCursor() {
  return (
    <svg
      className="section-aside-cursor-glyph"
      width="24"
      height="36"
      viewBox="0 0 24 36"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={FIGMA_CURSOR_PATH}
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="2.25"
        strokeLinejoin="round"
      />
      <path d={FIGMA_CURSOR_PATH} fill="currentColor" />
    </svg>
  )
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
    cursorX: 0,
    cursorY: 0,
    bubbleX: 0,
    bubbleY: 0,
  })

  useEffect(() => {
    if (!canUseAside()) return undefined

    const asides = site.asides ?? {}
    const root = document.documentElement

    const placeBubble = (x, y) => {
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

    const setActive = (active) => {
      root.classList.toggle('aside-cursor-active', active)
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
        setActive(false)
        setState((prev) => {
          if (!prev.visible) {
            return prev.cursorX === x && prev.cursorY === y
              ? prev
              : { ...prev, cursorX: x, cursorY: y }
          }
          const pos = placeBubble(x, y)
          return {
            ...prev,
            visible: false,
            cursorX: x,
            cursorY: y,
            bubbleX: pos.x,
            bubbleY: pos.y,
          }
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

      const pos = placeBubble(x, y)
      setActive(true)
      setState((prev) => ({
        visible: true,
        text: text ?? prev.text,
        cursorX: x,
        cursorY: y,
        bubbleX: pos.x,
        bubbleY: pos.y,
      }))
    }

    const onMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      latestRef.current = { x: event.clientX, y: event.clientY }
      if (!rafRef.current) rafRef.current = window.requestAnimationFrame(tick)
    }

    const onLeave = () => {
      keyRef.current = ''
      setActive(false)
      setState((prev) => (prev.visible ? { ...prev, visible: false } : prev))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
      setActive(false)
    }
  }, [])

  return (
    <>
      <div
        className={`section-aside-cursor${state.visible ? ' is-visible' : ''}`}
        style={{ transform: `translate3d(${state.cursorX}px, ${state.cursorY}px, 0)` }}
        aria-hidden="true"
      >
        <AsideCursor />
      </div>
      <div
        ref={bubbleRef}
        className={`section-aside${state.visible ? ' is-visible' : ''}`}
        style={{ transform: `translate3d(${state.bubbleX}px, ${state.bubbleY}px, 0)` }}
        aria-hidden="true"
      >
        <span key={state.text} className="section-aside-text">
          {state.text}
        </span>
      </div>
    </>
  )
}
