import { useEffect, useRef } from 'react'

export default function MagneticName({ text }) {
  const ref = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.gesture = 'magnetic-type'
    const root = ref.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!root || reduce) {
      return () => {
        delete document.documentElement.dataset.gesture
      }
    }

    const letters = [...root.querySelectorAll('.magnet-letter')]
    const state = letters.map(() => ({
      x: 0,
      y: 0,
      r: 0,
      vx: 0,
      vy: 0,
      vr: 0,
      ox: 0,
      oy: 0,
    }))

    const measure = () => {
      letters.forEach((el, i) => {
        state[i].ox = el.offsetLeft + el.offsetWidth / 2
        state[i].oy = el.offsetTop + el.offsetHeight / 2
      })
    }
    measure()
    document.fonts?.ready?.then(measure)
    window.addEventListener('resize', measure)

    let px = -9999
    let py = -9999
    let inside = false
    let raf = 0

    const tick = () => {
      const rootRect = root.getBoundingClientRect()
      letters.forEach((el, i) => {
        const s = state[i]
        let tx = 0
        let ty = 0
        let tr = 0
        if (inside) {
          const cx = rootRect.left + s.ox
          const cy = rootRect.top + s.oy
          const dx = px - cx
          const dy = py - cy
          const dist = Math.hypot(dx, dy) || 1
          const reach = 230
          if (dist < reach) {
            const force = (1 - dist / reach) ** 1.15
            tx = (dx / dist) * 30 * force
            ty = (dy / dist) * 26 * force
            tr = (dx / dist) * 12 * force
          }
        }
        s.vx += (tx - s.x) * 0.085
        s.vy += (ty - s.y) * 0.085
        s.vr += (tr - s.r) * 0.085
        s.vx *= 0.68
        s.vy *= 0.68
        s.vr *= 0.68
        s.x += s.vx
        s.y += s.vy
        s.r += s.vr
        el.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${s.r.toFixed(2)}deg)`
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onMove = (event) => {
      const rect = root.getBoundingClientRect()
      const pad = 200
      inside =
        event.clientX > rect.left - pad &&
        event.clientX < rect.right + pad &&
        event.clientY > rect.top - pad &&
        event.clientY < rect.bottom + pad
      px = event.clientX
      py = event.clientY
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', measure)
      delete document.documentElement.dataset.gesture
    }
  }, [])

  return (
    <p className="brand ink-bleed magnet-name" ref={ref} aria-label={text}>
      {[...text].map((ch, i) =>
        ch === ' ' ? (
          <span key={`s-${i}`} className="magnet-space" aria-hidden="true" />
        ) : (
          <span key={`${ch}-${i}`} className="magnet-letter" aria-hidden="true">
            {ch}
          </span>
        ),
      )}
    </p>
  )
}
