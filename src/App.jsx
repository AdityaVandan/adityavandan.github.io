import {
  person,
  positioning,
  experience,
  projects,
  skills,
  nav,
  cta,
} from './data/content.js'

function SessionClock() {
  const now = new Date()
  const stamp = now.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return <span className="session-clock">{stamp} IST</span>
}

export default function App() {
  const [featured, ...rest] = projects

  return (
    <div className="desk">
      <div className="scanlines" aria-hidden="true" />

      <header className="topbar">
        <div className="topbar-left">
          <span className="session-dot" aria-hidden="true" />
          <span className="session-label">SESSION LIVE</span>
          <SessionClock />
        </div>
        <nav className="desk-nav" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="topbar-right">
          <span className="venue">{person.location}</span>
        </div>
      </header>

      <main className="board">
        <section className="hero" id="top">
          <div className="ticker-rail" aria-hidden="true">
            <div className="ticker-track">
              <span>{person.name}</span>
              <span>{person.headline}</span>
              <span>AI SYSTEMS · PRODUCTION</span>
              <span>{person.name}</span>
              <span>{person.headline}</span>
              <span>AI SYSTEMS · PRODUCTION</span>
            </div>
          </div>

          <p className="brand-symbol">AVS</p>
          <h1 className="brand">{person.name}</h1>
          <p className="instrument">{person.headline}</p>
          <p className="thesis">{positioning.thesis}</p>
          <p className="lede">{person.tagline}</p>

          <div className="cta-row">
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
        </section>

        <section className="tape" aria-label="Market-moving metrics">
          <header className="panel-head">
            <h2>Tape</h2>
            <span className="panel-meta">PROOF · LAST PRINT</span>
          </header>
          <div className="tape-rows">
            {positioning.proofPoints.map((p, i) => (
              <article key={p.label} className="tape-row">
                <span className="tape-sym">P{String(i + 1).padStart(2, '0')}</span>
                <div className="tape-body">
                  <p className="tape-label">{p.label}</p>
                  <p className="tape-detail">{p.detail}</p>
                </div>
                <strong className="tape-print">{p.value}</strong>
                <span className="tape-tick" aria-hidden="true">
                  ▲
                </span>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="positions">
          <header className="panel-head">
            <h2>Work</h2>
            <span className="panel-meta">OPEN POSITIONS · CAREER BOOK</span>
          </header>
          <div className="position-list">
            {experience.map((job, idx) => (
              <article
                key={`${job.company}-${job.start}`}
                className="position"
              >
                <div className="position-rail">
                  <span className="pos-idx">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="pos-status">
                    {job.end === 'Present' ? 'LONG' : 'CLOSED'}
                  </span>
                </div>
                <div className="position-main">
                  <header>
                    <h3>
                      <span className="pos-company">{job.company}</span>
                      <span className="pos-sep">/</span>
                      <span className="pos-role">{job.role}</span>
                    </h3>
                    <p className="pos-meta">
                      {job.start} – {job.end}
                      <span className="meta-dot">·</span>
                      {job.location}
                    </p>
                  </header>
                  <ul>
                    {job.highlights.map((h) => (
                      <li key={h.slice(0, 48)}>{h}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="book">
          <header className="panel-head">
            <h2>Projects</h2>
            <span className="panel-meta">INSTRUMENTS · FEATURED FIRST</span>
          </header>

          {featured ? (
            <article className="instrument-card featured">
              <div className="feat-badge">FEATURED · ATLAS DESK</div>
              <h3>
                {featured.name}
                {featured.subtitle ? (
                  <span className="instr-sub"> — {featured.subtitle}</span>
                ) : null}
              </h3>
              <p>{featured.about}</p>
              <p className="stack">{featured.stack.join(' · ')}</p>
            </article>
          ) : null}

          <div className="book-grid">
            {rest.map((project) => (
              <article key={project.name} className="instrument-card">
                <h3>
                  {project.name}
                  {project.subtitle ? (
                    <span className="instr-sub"> — {project.subtitle}</span>
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
          </div>
        </section>

        <section id="skills" className="capabilities">
          <header className="panel-head">
            <h2>Capabilities</h2>
            <span className="panel-meta">STACK · READOUT</span>
          </header>
          <dl className="cap-grid">
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
              <dt>CI/CD</dt>
              <dd>{skills.cicd.join(' · ')}</dd>
            </div>
          </dl>
        </section>

        <section id="contact" className="desk-contact">
          <header className="panel-head">
            <h2>Contact</h2>
            <span className="panel-meta">OPEN FOR CONSULTING</span>
          </header>
          <p className="consult-note">{cta.consultingNote}</p>
          <div className="contact-row">
            <a className="cta" href={`mailto:${person.email}`}>
              {person.email}
            </a>
            <a href={person.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={person.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <span className="venue">{person.location}</span>
          </div>
        </section>
      </main>

      <footer className="desk-foot">
        <span>AVS · MARKET SYSTEMS</span>
        <a href="#top">Back to tape</a>
      </footer>
    </div>
  )
}
