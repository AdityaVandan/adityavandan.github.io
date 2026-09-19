import { useEffect } from 'react'
import {
  person,
  positioning,
  experience,
  projects,
  skills,
  cta,
  nav,
} from './data/content.js'

/**
 * Consulting Narrative Deck — partner-level case narrative for companies
 * seeking consultants. Sequential slide sections, not a McKinsey clone.
 */
function useDeckReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.deck-reveal')
    if (!nodes.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.14 },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

function SlideChrome({ number, title }) {
  return (
    <div className="slide-chrome">
      <span className="slide-number" aria-hidden="true">
        {number}
      </span>
      <span className="slide-title">{title}</span>
      <span className="copper-rule" aria-hidden="true" />
    </div>
  )
}

export default function App() {
  useDeckReveal()

  return (
    <div className="deck">
      <div className="topo-atmosphere" aria-hidden="true" />

      <nav className="deck-nav" aria-label="Primary">
        <a className="nav-mark" href="#top">
          A.V.S.
        </a>
        <ul>
          {nav.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <header className="hero slide" id="top">
        <div className="hero-inner">
          <p className="brand">{person.name}</p>
          <h1 className="claim">{person.headline}</h1>
          <p className="lede">{person.tagline}</p>
          <div className="cta-row">
            <a className="cta" href={`mailto:${person.email}`}>
              Start a conversation
            </a>
            <a
              className="cta ghost"
              href={person.github}
              target="_blank"
              rel="noreferrer"
            >
              {cta.secondary}
            </a>
          </div>
        </div>
        <p className="hero-folio" aria-hidden="true">
          Engagement brief · {person.location}
        </p>
      </header>

      <section className="slide deck-reveal" id="situation" aria-labelledby="situation-heading">
        <SlideChrome number="01" title="Situation" />
        <h2 id="situation-heading">The brief</h2>
        <p className="slide-lede">{positioning.thesis}</p>
        <p className="audience">
          Written for {positioning.audience.toLowerCase()}.
        </p>
      </section>

      <section className="slide deck-reveal" id="impact" aria-labelledby="impact-heading">
        <SlideChrome number="02" title="Impact" />
        <h2 id="impact-heading">What moved the needle</h2>
        <p className="slide-lede">
          Outcomes from production AI work — not demo metrics.
        </p>
        <div className="impact-narrative">
          {positioning.proofPoints.map((p, i) => (
            <blockquote key={p.label} className="impact-callout">
              <span className="callout-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="callout-prose">
                <strong className="callout-value">{p.value}</strong>
                <span className="callout-label"> — {p.label}. </span>
                <span className="callout-detail">{p.detail}.</span>
              </p>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="slide deck-reveal" id="work" aria-labelledby="engagements-heading">
        <SlideChrome number="03" title="Engagements" />
        <h2 id="engagements-heading">Selected engagements</h2>
        <p className="slide-lede">
          Full-stack AI delivery across product, services, and agent tooling.
        </p>
        {experience.map((job) => (
          <article key={`${job.company}-${job.start}`} className="engagement">
            <header className="engagement-header">
              <h3>
                {job.company}
                <span className="role"> · {job.role}</span>
              </h3>
              <p className="engagement-meta">
                {job.start} – {job.end} · {job.location}
              </p>
            </header>
            <ul>
              {job.highlights.map((h) => (
                <li key={h.slice(0, 48)}>{h}</li>
              ))}
            </ul>
          </article>
        ))}
        <aside className="capabilities" aria-label="Capabilities">
          <p className="cap-label">Operating stack</p>
          <p>{skills.languages.join(' · ')}</p>
          <p>{skills.frameworks.join(' · ')}</p>
          <p>{skills.ai.join(' · ')}</p>
          <p>{skills.databases.join(' · ')}</p>
          <p>{skills.cicd.join(' · ')}</p>
        </aside>
      </section>

      <section className="slide deck-reveal" id="projects" aria-labelledby="builds-heading">
        <SlideChrome number="04" title="Builds" />
        <h2 id="builds-heading">Independent builds</h2>
        <p className="slide-lede">
          Side systems that sharpen execution instincts between engagements.
        </p>
        {projects.map((project) => (
          <article key={project.name} className="build">
            <h3>
              {project.name}
              {project.subtitle ? (
                <span className="subtitle"> — {project.subtitle}</span>
              ) : null}
            </h3>
            <p>{project.about}</p>
            <p className="stack">{project.stack.join(' · ')}</p>
            <p className="links">
              {project.link ? (
                <a href={project.link} target="_blank" rel="noreferrer">
                  Live
                </a>
              ) : null}
              {project.github ? (
                <a href={project.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              ) : null}
            </p>
          </article>
        ))}
      </section>

      <section className="slide deck-reveal next" id="contact" aria-labelledby="next-heading">
        <SlideChrome number="05" title="Next" />
        <h2 id="next-heading">Where this goes next</h2>
        <p className="slide-lede">{cta.consultingNote}</p>
        <div className="cta-row">
          <a className="cta" href={`mailto:${person.email}`}>
            Start a conversation
          </a>
        </div>
        <p className="contact-lines">
          <a href={`mailto:${person.email}`}>{person.email}</a>
          <span className="sep"> · </span>
          <a href={person.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <span className="sep"> · </span>
          <a href={person.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span className="sep"> · </span>
          <span>{person.location}</span>
        </p>
      </section>
    </div>
  )
}
