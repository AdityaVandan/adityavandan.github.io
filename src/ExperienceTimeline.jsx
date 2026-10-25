import { useLayoutEffect, useRef, useState } from 'react'
import { activeStation, ruleProgress, stationPress } from './timeline/progress.js'

const READ_RATIO = 0.4
const LEAD_RATIO = 0.28

function plateNumber(value) {
  return String(value).padStart(2, '0')
}

export default function ExperienceTimeline({ jobs }) {
  const trackRef = useRef(null)
  const spineRef = useRef(null)
  const stationRefs = useRef([])
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const reducedRef = useRef(reduced)

  useLayoutEffect(() => {
    const track = trackRef.current
    const spine = spineRef.current
    if (!track || !spine) return undefined

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let cancelled = false

    const apply = () => {
      const reduce = motion.matches
      track.classList.toggle('is-tracked', !reduce)
      if (reducedRef.current !== reduce) {
        reducedRef.current = reduce
        setReduced(reduce)
      }

      const stations = []
      for (let index = 0; index < jobs.length; index += 1) {
        const station = stationRefs.current[index]
        if (!station) return
        stations.push(station)
      }
      const marks = stations.map((station) => station.querySelector('.timeline-mark'))
      const first = marks[0]
      const last = marks[marks.length - 1]
      if (!first || !last) return

      const rootRect = track.getBoundingClientRect()
      const firstRect = first.getBoundingClientRect()
      const lastRect = last.getBoundingClientRect()
      const firstMid = firstRect.top + firstRect.height / 2
      const lastMid = lastRect.top + lastRect.height / 2
      const centerX = firstRect.left + firstRect.width / 2 - rootRect.left

      spine.style.top = `${firstMid - rootRect.top}px`
      spine.style.height = `${Math.max(lastMid - firstMid, 0)}px`
      spine.style.left = `${centerX - 1.5}px`
      spine.style.bottom = 'auto'

      const viewport = window.innerHeight || 1
      const readY = viewport * READ_RATIO
      const lead = viewport * LEAD_RATIO
      const progress = reduce ? 1 : ruleProgress(firstMid, lastMid - firstMid, readY)

      track.style.setProperty('--rule-progress', progress.toFixed(4))
      track.classList.toggle('is-idle', !reduce && progress <= 0.001)
      track.classList.toggle('is-complete', reduce || progress >= 0.999)

      const presses = stations.map((station, index) => {
        const rect = marks[index].getBoundingClientRect()
        const press = reduce ? 1 : stationPress(rect.top + rect.height / 2, readY, lead)
        // Whole-value custom properties. Calc() against a registered <number>
        // is dropped in current Chrome, which left the type fully inked.
        const fade = (0.58 + press * 0.42).toFixed(3)
        const shift = `${((1 - press) * 18).toFixed(2)}px`
        const offset = (press * 2).toFixed(2)
        station.style.setProperty('--press', press.toFixed(4))
        station.style.setProperty('--fade', fade)
        station.style.setProperty('--shift', shift)
        station.style.setProperty('--mark-scale', (0.84 + press * 0.16).toFixed(4))
        station.style.setProperty(
          '--mark-shadow',
          `${offset}px ${offset}px 0 rgba(26, 18, 8, 0.18)`,
        )
        return press
      })

      const next = activeStation(reduce ? stations.map(() => 1) : presses)
      stations.forEach((station, index) => {
        station.classList.toggle('is-current', !reduce && index === next)
      })
      if (!reduce && next !== activeRef.current) {
        activeRef.current = next
        setActive(next)
      }
    }

    const request = () => {
      if (cancelled || frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        if (!cancelled) apply()
      })
    }

    apply()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request, { passive: true })
    motion.addEventListener('change', request)
    document.fonts?.ready?.then(() => {
      if (!cancelled) request()
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      motion.removeEventListener('change', request)
    }
  }, [jobs.length])

  if (!jobs.length) return null

  const current = jobs[Math.min(active, jobs.length - 1)]

  return (
    <div className="timeline">
      <p className="timeline-folio" aria-hidden="true">
        {reduced ? (
          <>
            {jobs[jobs.length - 1].start} – {jobs[0].end}
            <span className="sep"> · </span>
            {plateNumber(jobs.length)} impressions
          </>
        ) : (
          <>
            Impression {plateNumber(active + 1)}
            <span className="sep"> / </span>
            {plateNumber(jobs.length)}
            <span className="sep"> · </span>
            {current.company}
            <span className="sep"> · </span>
            {current.start} – {current.end}
          </>
        )}
      </p>

      <div className="timeline-track" ref={trackRef}>
        <div className="timeline-spine" ref={spineRef} aria-hidden="true">
          <div className="timeline-rule" />
          <div className="timeline-rule-ink" />
        </div>
        <ol className="timeline-list">
          {jobs.map((job, index) => (
            <li
              key={`${job.company}-${job.start}`}
              className="timeline-station"
              ref={(node) => {
                stationRefs.current[index] = node
              }}
            >
              <article>
                <p className="timeline-when">
                  <span className="timeline-index">{plateNumber(index + 1)}</span>
                  <span className="timeline-dates">
                    <span>{job.start}</span>
                    <span className="timeline-end">{job.end}</span>
                  </span>
                  <span className="timeline-place">{job.location}</span>
                </p>
                <div className="timeline-mark" aria-hidden="true" />
                <div className="timeline-copy">
                  <h3>
                    {job.role}
                    <span className="sep"> · </span>
                    {job.company}
                  </h3>
                  <ul>
                    {job.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
