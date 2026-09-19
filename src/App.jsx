import {
  person,
  positioning,
  experience,
  projects,
  skills,
  nav,
  cta,
} from './data/content.js'

/**
 * Intelligence Dossier / Case File variation.
 * Manila folder aesthetic — evidence-first hiring dossier.
 */
export default function App() {
  return (
    <div className="dossier">
      <div className="paper-grain" aria-hidden="true" />

      <nav className="folder-tabs" aria-label="Dossier sections">
        <a className="tab tab-active" href="#top">
          Cover
        </a>
        {nav.map((item) => (
          <a key={item.id} className="tab" href={`#${item.id}`}>
            {item.label}
          </a>
        ))}
      </nav>

      <header className="hero" id="top">
        <div className="stamp stamp-confidential" aria-hidden="true">
          CONFIDENTIAL
        </div>
        <p className="file-meta">
          FILE NO. AVS-FS-AI · {person.location.toUpperCase()} · STATUS: OPEN
        </p>
        <p className="brand">{person.name}</p>
        <h1>{person.headline}</h1>
        <p className="lede">{person.tagline}</p>
        <div className="cta-row">
          <a className="cta" href={`mailto:${person.email}`}>
            {cta.primary}
          </a>
          <a className="cta ghost" href={person.github} target="_blank" rel="noreferrer">
            {cta.secondary}
          </a>
        </div>
        <div className="redact-bar" aria-hidden="true" />
      </header>

      <section className="case-summary" aria-labelledby="summary-heading">
        <p className="section-label">01 · Case summary</p>
        <h2 id="summary-heading">Subject assessment</h2>
        <p className="thesis">{positioning.thesis}</p>
        <p className="audience-note">
          Prepared for: {positioning.audience}
        </p>
      </section>

      <section className="evidence" aria-labelledby="evidence-heading">
        <p className="section-label">02 · Evidence metrics</p>
        <h2 id="evidence-heading">Field results — Tesco AI</h2>
        <div className="evidence-grid">
          {positioning.proofPoints.map((p, i) => (
            <figure key={p.label} className="exhibit">
              <span className="exhibit-id">EXH-{String(i + 1).padStart(2, '0')}</span>
              <strong>{p.value}</strong>
              <figcaption>
                <span>{p.label}</span>
                <em>{p.detail}</em>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="work" className="employment" aria-labelledby="work-heading">
        <p className="section-label">03 · Employment record</p>
        <h2 id="work-heading">Work</h2>
        {experience.map((job, idx) => (
          <article key={`${job.company}-${job.start}`} className="job">
            <header className="job-header">
              <span className="job-index">
                REC-{String(idx + 1).padStart(2, '0')}
              </span>
              <h3>
                {job.role} · {job.company}
              </h3>
              <p className="job-meta">
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
      </section>

      <section id="projects" className="exhibits" aria-labelledby="projects-heading">
        <p className="section-label">04 · Project exhibits</p>
        <h2 id="projects-heading">Projects</h2>
        {projects.map((project, idx) => (
          <article key={project.name} className="project">
            <span className="exhibit-id">
              PROJ-{String(idx + 1).padStart(2, '0')}
            </span>
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
      </section>

      <section className="capabilities" aria-labelledby="skills-heading">
        <p className="section-label">05 · Capability index</p>
        <h2 id="skills-heading">Technical profile</h2>
        <dl className="skill-list">
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

      <section id="contact" className="contact" aria-labelledby="contact-heading">
        <p className="section-label">06 · Clearance to contact</p>
        <h2 id="contact-heading">Contact</h2>
        <div className="stamp stamp-cleared" aria-hidden="true">
          CLEARED
        </div>
        <p className="consulting">{cta.consultingNote}</p>
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
        <p className="file-footer">
          END OF FILE · DO NOT DISTRIBUTE OUTSIDE HIRING CHANNEL
        </p>
      </section>
    </div>
  )
}
