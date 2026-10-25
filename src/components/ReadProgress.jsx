import { useEffect, useState } from 'react'

function readingPercent(node) {
  const total = node.offsetHeight
  if (total <= 1) return 100
  const revealed = window.innerHeight - node.getBoundingClientRect().top
  const clamped = Math.min(Math.max(revealed, 0), total)
  return Math.round((clamped / total) * 100)
}

export function ReadProgress({ targetRef }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const node = targetRef.current
    if (!node) return undefined

    const measure = () => setProgress(readingPercent(node))
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(node)
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [targetRef])

  return (
    <div
      className="read-progress"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-valuetext={`${progress} percent read`}
    >
      <span className="read-progress-value">{progress}%</span>
      <span className="read-progress-track" aria-hidden="true">
        <span className="read-progress-bar" style={{ width: `${progress}%` }} />
      </span>
    </div>
  )
}
