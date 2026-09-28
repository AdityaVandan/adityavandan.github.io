import { useEffect, useRef } from 'react'

const WORDS = ['PROOF', 'SET', 'READ', 'FILED', 'INKED']

export default function InkStamp() {
  const cursorRef = useRef(null)
  const layerRef = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.gesture = 'ink-stamp'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      return () => {
        delete document.documentElement.dataset.gesture
      }
    }

    const armCursor = () => document.documentElement.classList.add('has-stamp-cursor')
    let x = window.innerWidth * 0.7
    let y = window.innerHeight * 0.35
    let cx = x
    let cy = y
    let raf = 0
    let count = 0

    const tick = () => {
      cx += (x - cx) * 0.32
      cy += (y - cy) * 0.32
      const el = cursorRef.current
      if (el) el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onMove = (event) => {
      if (event.pointerType === 'mouse') armCursor()
      x = event.clientX
      y = event.clientY
    }

    const onDown = (event) => {
      if (event.button !== 0) return
      if (event.pointerType === 'mouse') armCursor()
      x = event.clientX
      y = event.clientY
      const layer = layerRef.current
      if (!layer) return
      const mark = document.createElement('span')
      mark.className = 'ink-impression'
      const rot = (Math.random() * 26 - 13).toFixed(1)
      mark.style.left = `${event.clientX}px`
      mark.style.top = `${event.clientY}px`
      mark.style.setProperty('--rot', `${rot}deg`)
      mark.textContent = WORDS[count % WORDS.length]
      count += 1
      layer.appendChild(mark)
      while (layer.childElementCount > 18) layer.firstElementChild?.remove()
      window.setTimeout(() => mark.remove(), 2600)
      cursorRef.current?.classList.add('is-stamping')
      window.setTimeout(() => cursorRef.current?.classList.remove('is-stamping'), 160)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.documentElement.classList.remove('has-stamp-cursor')
      delete document.documentElement.dataset.gesture
    }
  }, [])

  return (
    <>
      <div className="stamp-cursor" ref={cursorRef} aria-hidden="true">
        <span className="stamp-cursor-ring">A.V.S.</span>
      </div>
      <div className="impression-layer" ref={layerRef} aria-hidden="true" />
    </>
  )
}
