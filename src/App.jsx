import {
  person,
  positioning,
  experience,
  projects,
  skills,
  openSource,
  education,
  cta,
  nav,
} from './data/content.js'

const marginNotes = {
  work: 'sites of observation',
  projects: 'lab specimens',
  skills: 'kit inventory',
  contact: 'next expedition',
}

const proofArrows = ['↗', '→', '↘']

export default function App() {
  return (
    <div className="notebook">
      <div className="page-curl" aria-hidden="true" />

      <aside className="spine" aria-hidden="true">
        <span className="spine-label">FIELD NOTES</span>
      </aside>

      <div className="sheet">
        <nav className="journal-nav" aria-label="Journal sections">
          <a href="#top" className="nav-home">
            Journal
          </a>
          <ul>
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <header className="hero entry" id="top">
          <div className="margin-col">
            <p className="margin-note fade-in delay-1">Vol. I · {person.location}</p>
            <p className="margin-note fade-in delay-2">AI systems · field</p>
            <svg className="margin-arrow" viewBox="0 0 80 40" aria-hidden="true">
              <path d="M8 28 C 28 8, 48 8, 72 18" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M64 12 L72 18 L64 24" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>

          <div className="entry-body">
            <p className="journal-meta">Field Research Journal</p>
            <h1 className="brand">
              <span className="brand-line">{person.name}</span>
              <span className="pen-underline" aria-hidden="true" />
            </h1>
            <p className="role-line">{person.headline}</p>

            <article className="first-entry">
              <p className="entry-label">
                <span className="entry-num">01</span> Opening observation
              </p>
              <p className="thesis">{positioning.thesis}</p>
              <p className="lede">{person.tagline}</p>
            </article>

            <div className="cta-row">
              <a className="cta" href={`mailto:${person.email}`}>
                Request briefing
              </a>
              <a className="cta ghost" href={person.github} target="_blank" rel="noreferrer">
                {cta.secondary}
              </a>
            </div>
          </div>
        </header>

        <section className="proof entry" aria-label="Field evidence">
          <div className="margin-col">
            <p className="margin-note fade-in">measured outcomes</p>
          </div>
          <div className="entry-body">
            <p className="entry-label">
              <span className="entry-num">02</span> Margin findings
            </p>
            <div className="proof-list">
              {positioning.proofPoints.map((p, i) => (
                <figure key={p.label} className="proof-item">
                  <div className="proof-margin">
                    <strong className="proof-value">{p.value}</strong>
                    <span className="proof-arrow" aria-hidden="true">
                      {proofArrows[i % proofArrows.length]}
                    </span>
                    <svg className="callout-line" viewBox="0 0 60 24" aria-hidden="true">
                      <path
                        d="M2 12 H48 M42 6 L50 12 L42 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <figcaption>
                    <span className="proof-label">{p.label}</span>
                    <em>{p.detail}</em>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="entry" id="work">
          <div className="margin-col">
            <p className="margin-note fade-in">{marginNotes.work}</p>
            <p className="margin-note small fade-in delay-1">
              Tesco · Rippling · Groww
            </p>
          </div>
          <div className="entry-body">
            <h2>
              Work evidence
              <span className="pen-underline short" aria-hidden="true" />
            </h2>
            <p className="section-lede">
              Logged observations from production deployments — triage agents,
              design systems, and product surfaces at scale.
            </p>

            {experience.map((job, idx) => (
              <article key={`${job.company}-${job.start}`} className="job specimen">
                <header className="job-header">
                  <div className="job-margin-tag">
                    <span className="specimen-id">
                      W-{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <h3>
                      {job.role}
                      <span className="company"> · {job.company}</span>
                    </h3>
                    <p className="meta">
                      {job.start} – {job.end} · {job.location}
                    </p>
                  </div>
                </header>
                <ul>
                  {job.highlights.map((h) => (
                    <li key={h.slice(0, 48)}>{h}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="entry" id="projects">
          <div className="margin-col">
            <p className="margin-note fade-in">{marginNotes.projects}</p>
            <p className="margin-note small fade-in delay-2">preserve &amp; cite</p>
          </div>
          <div className="entry-body">
            <h2>
              Specimens
              <span className="pen-underline short" aria-hidden="true" />
            </h2>
            <p className="section-lede">
              Independent builds catalogued as field specimens — trading systems
              and algorithm visualizers.
            </p>

            {projects.map((project, idx) => (
              <article key={project.name} className="project specimen">
                <p className="specimen-id">P-{String(idx + 1).padStart(2, '0')}</p>
                <h3>
                  {project.name}
                  {project.subtitle ? <span> — {project.subtitle}</span> : null}
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

            <div className="oss-block">
              <p className="entry-label">
                <span className="entry-num">OSS</span> Field contributions
              </p>
              <ul className="oss-list">
                {openSource.map((item) => (
                  <li key={item.name}>
                    <a href={item.link} target="_blank" rel="noreferrer">
                      {item.name}
                    </a>
                    <span> — {item.about}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="entry" id="skills">
          <div className="margin-col">
            <p className="margin-note fade-in">{marginNotes.skills}</p>
          </div>
          <div className="entry-body">
            <h2>
              Field kit
              <span className="pen-underline short" aria-hidden="true" />
            </h2>
            <dl className="kit">
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
                <dt>Data stores</dt>
                <dd>{skills.databases.join(' · ')}</dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>{skills.cicd.join(' · ')}</dd>
              </div>
            </dl>
            <p className="edu">
              {education.degree} · {education.school} ({education.start} –{' '}
              {education.end})
            </p>
          </div>
        </section>

        <section className="entry contact" id="contact">
          <div className="margin-col">
            <p className="margin-note fade-in">{marginNotes.contact}</p>
            <svg className="margin-arrow flipped" viewBox="0 0 80 40" aria-hidden="true">
              <path d="M8 12 C 28 32, 48 32, 72 22" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M64 16 L72 22 L64 28" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
          <div className="entry-body">
            <h2>
              Request a briefing
              <span className="pen-underline short" aria-hidden="true" />
            </h2>
            <p className="section-lede">{cta.consultingNote}</p>
            <p className="contact-line">
              <a href={`mailto:${person.email}`}>{person.email}</a>
              {' · '}
              <a href={person.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              {' · '}
              <a href={person.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              {' · '}
              {person.location}
            </p>
            <a className="cta" href={`mailto:${person.email}`}>
              Request briefing
            </a>
          </div>
        </section>

        <footer className="colophon">
          <p>
            End of volume · {person.name} · Field Research Notes
          </p>
        </footer>
      </div>
    </div>
  )
}
