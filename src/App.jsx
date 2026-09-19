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

function useSpecimenReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.specimen-reveal')
    if (!nodes.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-cast')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

export default function App() {
  useSpecimenReveal()

  return (
    <div className="page">
      <div className="foundry-floor" aria-hidden="true" />

      <header className="hero" id="top">
        <div className="hero-atmosphere" aria-hidden="true" />
        <nav className="site-nav" aria-label="Primary">
          <a className="nav-mark" href="#top">
            AVS · Foundry
          </a>
          <ul>
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hero-cast">
          <p className="specimen-meta stamp-settle">
            <span>Specimen No. 01</span>
            <span className="ember-rule" aria-hidden="true" />
            <span>{person.location}</span>
          </p>
          <p className="brand stamp-settle delay-1">
            <span className="brand-line">{person.firstName}</span>
            <span className="brand-line">{person.lastName}</span>
          </p>
          <h1 className="specimen-label stamp-settle delay-2">{person.headline}</h1>
          <p className="lede stamp-settle delay-3">{person.tagline}</p>
          <div className="cta-row stamp-settle delay-4">
            <a className="cta" href={`mailto:${person.email}`}>
              {cta.primary}
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
      </header>

      <section className="punches specimen-reveal" aria-label="Proof points">
        <div className="section-head">
          <p className="kicker">Punch measurements</p>
          <span className="ember-rule wide" aria-hidden="true" />
        </div>
        <div className="punch-grid">
          {positioning.proofPoints.map((p, i) => (
            <figure
              key={p.label}
              className="punch"
              style={{ '--i': i }}
            >
              <p className="punch-index">P-{String(i + 1).padStart(2, '0')}</p>
              <strong>{p.value}</strong>
              <figcaption>
                <span>{p.label}</span>
                <em>{p.detail}</em>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="work" className="specimens specimen-reveal">
        <div className="section-head">
          <p className="kicker">Type specimens</p>
          <h2>Castings from the floor</h2>
          <span className="ember-rule wide" aria-hidden="true" />
        </div>
        <p className="section-lede">{positioning.thesis}</p>
        {experience.map((job, i) => (
          <article
            key={`${job.company}-${job.start}`}
            className="casting"
            style={{ '--i': i }}
          >
            <header className="casting-head">
              <p className="casting-meta">
                Sort {String(i + 1).padStart(2, '0')} · {job.start} – {job.end}
              </p>
              <h3>
                {job.role}
                <span className="casting-company"> · {job.company}</span>
              </h3>
              <p className="casting-place">{job.location}</p>
            </header>
            <ul>
              {job.highlights.map((h) => (
                <li key={h.slice(0, 48)}>{h}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section id="projects" className="sorts specimen-reveal">
        <div className="section-head">
          <p className="kicker">Custom sorts</p>
          <h2>Projects cut for the case</h2>
          <span className="ember-rule wide" aria-hidden="true" />
        </div>
        <div className="sort-rail">
          {projects.map((project, i) => (
            <article
              key={project.name}
              className="sort"
              style={{ '--i': i }}
            >
              <p className="sort-index">Matrix {String(i + 1).padStart(2, '0')}</p>
              <h3>
                {project.name}
                {project.subtitle ? (
                  <span className="sort-sub"> — {project.subtitle}</span>
                ) : null}
              </h3>
              <p>{project.about}</p>
              <p className="stack">{project.stack.join(' · ')}</p>
              <p className="links">
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noreferrer">
                    Live proof
                  </a>
                ) : null}
                {project.github ? (
                  <a href={project.github} target="_blank" rel="noreferrer">
                    Case file
                  </a>
                ) : null}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="matrix specimen-reveal">
        <div className="section-head">
          <p className="kicker">Alloy matrix</p>
          <h2>Capabilities</h2>
          <span className="ember-rule wide" aria-hidden="true" />
        </div>
        <dl className="alloy-list">
          <div>
            <dt>Languages</dt>
            <dd>{skills.languages.join(' · ')}</dd>
          </div>
          <div>
            <dt>Frameworks</dt>
            <dd>{skills.frameworks.join(' · ')}</dd>
          </div>
          <div>
            <dt>AI</dt>
            <dd>{skills.ai.join(' · ')}</dd>
          </div>
          <div>
            <dt>Data</dt>
            <dd>{skills.databases.join(' · ')}</dd>
          </div>
          <div>
            <dt>Delivery</dt>
            <dd>{skills.cicd.join(' · ')}</dd>
          </div>
        </dl>
      </section>

      <section id="contact" className="colophon specimen-reveal">
        <div className="section-head">
          <p className="kicker">Colophon</p>
          <h2>Commission a cast</h2>
          <span className="ember-rule wide" aria-hidden="true" />
        </div>
        <p className="section-lede">{cta.consultingNote}</p>
        <p className="contact-line">
          <a href={`mailto:${person.email}`}>{person.email}</a>
          <span aria-hidden="true"> · </span>
          <a href={person.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <span aria-hidden="true"> · </span>
          <a href={person.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span aria-hidden="true"> · </span>
          {person.location}
        </p>
      </section>
    </div>
  )
}
