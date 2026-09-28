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

    document.documentElement.classList.add('has-stamp-cursor')
    let x = window.innerWidth * 0.62
    let y = window.innerHeight * 0.42
    let cx = x
    let cy = y
    let raf = 0
    let count = 0
    let lastStamp = 0

    const tick = () => {
      cx += (x - cx) * 0.32
      cy += (y - cy) * 0.32
      const el = cursorRef.current
      if (el) el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onMove = (event) => {
      if (typeof event.clientX !== 'number') return
      x = event.clientX
      y = event.clientY
    }

    const stampAt = (clientX, clientY) => {
      const now = performance.now()
      if (now - lastStamp < 80) return
      lastStamp = now
      const layer = layerRef.current
      if (!layer) return
      const mark = document.createElement('span')
      mark.className = 'ink-impression'
      const rot = (Math.random() * 26 - 13).toFixed(1)
      const px = clientX > 8 || clientY > 8 ? clientX : window.innerWidth * 0.5
      const py = clientX > 8 || clientY > 8 ? clientY : window.innerHeight * 0.45
      mark.style.left = `${px}px`
      mark.style.top = `${py}px`
      mark.style.setProperty('--rot', `${rot}deg`)
      mark.textContent = WORDS[count % WORDS.length]
      count += 1
      document.documentElement.dataset.stamps = String(count)
      document.body.appendChild(mark)
      const marks = document.querySelectorAll('.ink-impression')
      if (marks.length > 18) marks[0].remove()
      window.setTimeout(() => mark.remove(), 7000)
      x = px
      y = py
      cursorRef.current?.classList.add('is-stamping')
      window.setTimeout(() => cursorRef.current?.classList.remove('is-stamping'), 160)
    }

    const onDown = (event) => {
      if (typeof event.button === 'number' && event.button > 0) return
      stampAt(event.clientX, event.clientY)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('click', onDown)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('click', onDown)
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
