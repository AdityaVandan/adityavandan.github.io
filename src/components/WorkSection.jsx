import { useId, useRef, useState } from 'react'
import { site } from '../data/content.js'

const jobs = site.work.jobs

function defaultIndex() {
  const index = jobs.findIndex((job) => job.company === site.work.defaultSelected)
  return index >= 0 ? index : 0
}

function CompanyLogo({ job, className }) {
  if (!job.logo?.src) return null
  return (
    <img
      className={className}
      src={job.logo.src}
      alt=""
      width={40}
      height={40}
      decoding="async"
      aria-hidden="true"
    />
  )
}

export default function WorkSection() {
  const baseId = useId()
  const [selected, setSelected] = useState(defaultIndex)
  const tabRefs = useRef([])
  const current = jobs[selected]

  const focusTab = (index) => {
    setSelected(index)
    tabRefs.current[index]?.focus()
  }

  const onKeyDown = (event, index) => {
    let next = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % jobs.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (index - 1 + jobs.length) % jobs.length
    }
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = jobs.length - 1
    if (next == null) return
    event.preventDefault()
    focusTab(next)
  }

  return (
    <section id="work" className="work" data-aside="work">
      <div className="section-header">
        <h2 className="section-title">{site.work.title}</h2>
        <p className="section-intro">{site.work.intro}</p>
      </div>

      <div role="tablist" aria-label="Employers" className="glass segmented">
        {jobs.map((job, index) => {
          const active = index === selected
          const tabId = `${baseId}-tab-${index}`
          const panelId = `${baseId}-panel`
          return (
            <button
              key={job.company}
              type="button"
              role="tab"
              id={tabId}
              className={`seg seg-tab${active ? ' seg-active' : ''}`}
              aria-selected={active}
              aria-controls={panelId}
              tabIndex={active ? 0 : -1}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <CompanyLogo job={job} className="work-tab-logo" />
              <span>{job.company}</span>
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        className="glass work-panel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${selected}`}
      >
        <div className="work-heading">
          <CompanyLogo job={current} className="work-panel-logo" />
          {current.url ? (
            <a
              className="work-company grad"
              href={current.url}
              target="_blank"
              rel="noreferrer"
            >
              {current.company}
            </a>
          ) : (
            <span className="work-company grad">{current.company}</span>
          )}
          <span className="work-role">{current.role}</span>
          <span className="work-dates">
            {current.start} to {current.end}
          </span>
        </div>
        <ul className="work-highlights">
          {current.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
