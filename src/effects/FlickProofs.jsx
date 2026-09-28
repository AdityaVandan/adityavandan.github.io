import { useEffect, useRef, useState } from 'react'

export default function FlickProofs({ points }) {
  useEffect(() => {
    document.documentElement.dataset.gesture = 'flick-cards'
    return () => {
      delete document.documentElement.dataset.gesture
    }
  }, [])

  const [index, setIndex] = useState(0)
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const start = useRef(null)

  const settle = (clientX) => {
    if (!start.current) return
    const dx = clientX - start.current.x
    if (dx < -52) setIndex((i) => Math.min(points.length - 1, i + 1))
    else if (dx > 52) setIndex((i) => Math.max(0, i - 1))
    start.current = null
    setDrag(0)
    setDragging(false)
  }

  const onPointerDown = (event) => {
    if (event.button !== 0) return
    start.current = { x: event.clientX }
    setDragging(true)
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      /* pointer already released */
    }
  }

  const onPointerMove = (event) => {
    if (!start.current) return
    const raw = event.clientX - start.current.x
    const atStart = index === 0 && raw > 0
    const atEnd = index === points.length - 1 && raw < 0
    setDrag(atStart || atEnd ? raw * 0.35 : raw)
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      setIndex((i) => Math.min(points.length - 1, i + 1))
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setIndex((i) => Math.max(0, i - 1))
    }
  }

  return (
    <div className="flick-stage">
      <p className="flick-folio">
        Impression {String(index + 1).padStart(2, '0')} / {String(points.length).padStart(2, '0')}
        <span> · drag the card</span>
      </p>
      <div
        className={`flick-deck${dragging ? ' is-dragging' : ''}`}
        onPointerDown={onPointerDown}
        onMouseDown={onPointerDown}
        onPointerMove={onPointerMove}
        onMouseMove={onPointerMove}
        onPointerUp={(event) => settle(event.clientX)}
        onMouseUp={(event) => settle(event.clientX)}
        onPointerCancel={(event) => settle(event.clientX)}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Proof points. Drag or use arrow keys."
      >
        {points.map((point, i) => {
          const offset = i - index
          const x = offset * 48 + (i === index ? drag : 0)
          const rot = offset * -3.2 + (i === index ? drag / 22 : 0)
          const y = Math.abs(offset) * 10
          return (
            <article
              key={point.label}
              className="flick-card"
              aria-hidden={i !== index}
              style={{
                transform: `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`,
                zIndex: 20 - Math.abs(offset),
                opacity: Math.abs(offset) > 2 ? 0 : 1,
              }}
            >
              <strong>{point.value}</strong>
              <span>{point.label}</span>
              <em>{point.detail}</em>
            </article>
          )
        })}
      </div>
      <div className="flick-nav">
        <button
          type="button"
          className="flick-btn"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          Previous
        </button>
        <button
          type="button"
          className="flick-btn"
          onClick={() => setIndex((i) => Math.min(points.length - 1, i + 1))}
          disabled={index === points.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}
