import { useEffect, useMemo, useState } from 'react'
import snapshot from './data/github-snapshot.json'
import { site } from './data/content.js'
import { loadGithubActivity } from './github/load.js'
import {
  bestDay,
  describeActivity,
  formatCount,
  mergeActivity,
  toWeeks,
} from './github/model.js'

const login = site.github.user
const EMPTY_LEVEL = 0
const hasSnapshot = Boolean(describeActivity(snapshot))

function dayLevel(day) {
  if (!day) return EMPTY_LEVEL
  const level = Number(day.level)
  if (level >= 0 && level <= 4) return level
  return day.count > 0 ? 1 : 0
}

function flattenWeeks(weeks) {
  const cells = []
  for (const week of weeks) {
    for (const day of week) cells.push(day)
  }
  return cells
}

export default function GithubActivity() {
  const [activity, setActivity] = useState(hasSnapshot ? snapshot : null)
  const [status, setStatus] = useState(hasSnapshot ? 'ready' : 'loading')

  useEffect(() => {
    const controller = new AbortController()
    if (!hasSnapshot) setStatus('loading')

    loadGithubActivity(login, { signal: controller.signal })
      .then((fresh) => {
        setActivity(mergeActivity(snapshot, fresh))
        setStatus('ready')
      })
      .catch((error) => {
        if (error?.name === 'AbortError') return
        if (hasSnapshot) {
          setActivity(snapshot)
          setStatus('ready')
          return
        }
        setActivity(null)
        setStatus('failed')
      })

    return () => controller.abort()
  }, [])

  const view = useMemo(() => (activity ? describeActivity(activity) : null), [activity])

  const cells = useMemo(() => {
    if (status === 'loading') {
      return Array.from({ length: 364 }, () => EMPTY_LEVEL)
    }
    if (!view) return []
    return flattenWeeks(toWeeks(view.days)).map((day) => dayLevel(day))
  }, [status, view])

  const stats =
    status === 'failed'
      ? null
      : [
          {
            label: site.github.stats[0].label,
            value: status === 'loading' ? '—' : formatCount(activity?.repos),
          },
          {
            label: site.github.stats[1].label,
            value: status === 'loading' ? '—' : formatCount(view?.total),
          },
          {
            label: site.github.stats[2].label,
            value:
              status === 'loading'
                ? '—'
                : formatCount(view?.best?.count ?? bestDay(view?.days ?? [])?.count),
          },
        ]

  return (
    <section id="github" className="github-section" aria-label="GitHub activity" data-aside="github">
      <div className="glass github-panel">
        <h2 className="section-title">{site.github.title}</h2>

        {stats ? (
          <div className="github-stats">
            {stats.map((stat) => (
              <div className="github-stat" key={stat.label}>
                <span className="github-stat-value grad">{stat.value}</span>
                <span className="github-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        ) : null}

        {status !== 'failed' ? (
          <div className="github-cal-wrap">
            <div className="github-cells" aria-hidden="true">
              {cells.map((level, index) => (
                <span
                  key={index}
                  className={`github-cell github-cell-${Math.min(4, Math.max(0, level))}`}
                />
              ))}
            </div>
          </div>
        ) : null}

        <p className="github-note">{site.github.note}</p>
        <a
          href={site.github.link.href}
          className="text-link"
          target="_blank"
          rel="me noreferrer"
        >
          {site.github.link.label}
        </a>
      </div>
    </section>
  )
}
