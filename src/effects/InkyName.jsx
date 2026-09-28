import { useEffect, useRef, useState } from 'react'

let spillSeq = 0

export default function InkyName({ text }) {
  const [hot, setHot] = useState(false)
  const [spills, setSpills] = useState([])
  const lastSpawn = useRef(0)

  useEffect(() => {
    document.documentElement.dataset.gesture = 'ink-drip'
    return () => {
      delete document.documentElement.dataset.gesture
    }
  }, [])

  const spawn = (clientX, el, count) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const now = performance.now()
    if (now - lastSpawn.current < 160) return
    lastSpawn.current = now
    const rect = el.getBoundingClientRect()
    const base = ((clientX - rect.left) / Math.max(rect.width, 1)) * 100
    const next = Array.from({ length: count }, (_, i) => {
      spillSeq += 1
      return {
        id: spillSeq,
        x: Math.min(94, Math.max(6, base + (i - (count - 1) / 2) * 7)),
        h: 68 + ((spillSeq * 17) % 56),
      }
    })
    setSpills((list) => [...list, ...next].slice(-12))
  }

  return (
    <p
      className={`brand ink-bleed inky-name${hot ? ' is-hot' : ''}`}
      onPointerEnter={(event) => {
        setHot(true)
        spawn(event.clientX, event.currentTarget, 2)
      }}
      onMouseEnter={(event) => {
        setHot(true)
        spawn(event.clientX, event.currentTarget, 2)
      }}
      onPointerLeave={() => setHot(false)}
      onMouseLeave={() => setHot(false)}
      onPointerDown={(event) => {
        event.preventDefault()
        spawn(event.clientX, event.currentTarget, 1)
      }}
      onMouseDown={(event) => {
        event.preventDefault()
        spawn(event.clientX, event.currentTarget, 1)
      }}
    >
      {text}
      <span className="ink-well" aria-hidden="true">
        <span className="ink-bloom" />
        {spills.map((spill) => (
          <span
            key={spill.id}
            className="ink-drip"
            style={{ left: `${spill.x}%`, height: `${spill.h}px` }}
          >
            <span className="ink-drip-stem" />
            <span className="ink-drip-blob" />
          </span>
        ))}
      </span>
    </p>
  )
}
