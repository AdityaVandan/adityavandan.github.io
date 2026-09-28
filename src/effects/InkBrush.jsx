import { useEffect, useRef } from 'react'

export default function InkBrush() {
  const ref = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.gesture = 'ink-brush'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = ref.current
    if (!canvas || reduce) {
      return () => {
        delete document.documentElement.dataset.gesture
      }
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let width = 0
    let height = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    let last = null
    let raf = 0

    const blot = (x, y, heavy) => {
      ctx.fillStyle = heavy ? 'rgba(26, 18, 8, 0.9)' : 'rgba(74, 31, 28, 0.55)'
      ctx.beginPath()
      ctx.ellipse(x, y, heavy ? 7 : 3.2, heavy ? 8 : 3.6, 0.4, 0, Math.PI * 2)
      ctx.fill()
    }

    const stroke = (from, to, heavy) => {
      const dist = Math.hypot(to.x - from.x, to.y - from.y)
      const speed = Math.min(dist, 48)
      const lineWidth = heavy ? Math.max(8, 22 - speed * 0.2) : Math.max(2.2, 5 - speed * 0.04)
      ctx.strokeStyle = heavy ? 'rgba(26, 18, 8, 0.95)' : 'rgba(26, 18, 8, 0.55)'
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.quadraticCurveTo(from.x, from.y, (from.x + to.x) / 2, (from.y + to.y) / 2)
      ctx.stroke()
    }

    const loop = () => {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.004)'
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onMove = (event) => {
      const point = { x: event.clientX, y: event.clientY }
      const heavy = event.buttons > 0 || event.pointerType === 'touch'
      if (last) stroke(last, point, heavy)
      else blot(point.x, point.y, heavy)
      last = point
    }

    const onDown = (event) => {
      const interactive = event.target?.closest?.('a, button')
      if (!interactive && event.cancelable) event.preventDefault()
      const point = { x: event.clientX, y: event.clientY }
      blot(point.x, point.y, true)
      last = point
    }

    const onUp = () => {
      last = null
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('mousedown', onDown, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('pointercancel', onUp)
    document.documentElement.addEventListener('pointerleave', onUp)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('pointercancel', onUp)
      document.documentElement.removeEventListener('pointerleave', onUp)
      delete document.documentElement.dataset.gesture
    }
  }, [])

  return <canvas ref={ref} className="ink-brush" aria-hidden="true" />
}
