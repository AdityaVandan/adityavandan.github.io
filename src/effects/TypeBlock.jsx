import { useRef, useState } from 'react'

export default function TypeBlock({ word }) {
  const ref = useRef(null)
  const drag = useRef(null)
  const rest = ((word.charCodeAt(0) + word.length * 3) % 7) - 3
  const [live, setLive] = useState(false)
  const [style, setStyle] = useState({
    transform: `rotate(${rest}deg)`,
  })

  const end = () => {
    if (!drag.current) return
    drag.current = null
    setLive(false)
    setStyle({
      transform: `rotate(${rest}deg)`,
      transition: 'transform 0.72s cubic-bezier(0.16, 1.45, 0.32, 1)',
    })
  }

  return (
    <span
      ref={ref}
      className={`type-block${live ? ' is-live' : ''}`}
      style={{ ...style, '--rest': `${rest}deg` }}
      onPointerDown={(event) => {
        if (event.button !== 0) return
        event.preventDefault()
        drag.current = { x: event.clientX, y: event.clientY, rot: rest }
        setLive(true)
        setStyle({ transform: `translate3d(0px, 0px, 0) rotate(${rest}deg)`, transition: 'none' })
        try {
          event.currentTarget.setPointerCapture(event.pointerId)
        } catch {
          /* pointer already released */
        }
      }}
      onPointerMove={(event) => {
        if (!drag.current) return
        const dx = event.clientX - drag.current.x
        const dy = event.clientY - drag.current.y
        const rot = Math.max(-14, Math.min(14, drag.current.rot + dx * 0.06))
        setStyle({
          transform: `translate3d(${dx}px, ${dy}px, 0) rotate(${rot}deg)`,
          transition: 'none',
          zIndex: 5,
        })
      }}
      onPointerUp={end}
      onPointerCancel={end}
    >
      {word}
    </span>
  )
}
