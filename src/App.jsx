import {
  person,
  positioning,
  experience,
  projects,
  skills,
  cta,
  nav,
} from './data/content.js'

export default function App() {
  return (
    <div className="page">
      <div className="formwork" aria-hidden="true" />

      <nav className="site-nav" aria-label="Primary">
        <a className="nav-mark" href="#top">
          AVS
        </a>
        <ul>
          {nav.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <header className="hero" id="top">
        <div className="hero-concrete" aria-hidden="true" />
        <div className="hero-slab">
          <p className="brand">
            <span className="brand-line">{person.firstName}</span>
            <span className="brand-line">{person.lastName}</span>
          </p>
          <p className="hero-claim">{person.headline}</p>
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
        </div>
      </header>

      <section className="thesis-slab" id="thesis" aria-labelledby="thesis-heading">
        <p className="slab-index">01 / Thesis</p>
        <h2 id="thesis-heading" className="visually-hidden">
          Thesis
        </h2>
        <p className="thesis-copy">{positioning.thesis}</p>
        <p className="thesis-support">{person.tagline}</p>
      </section>

      <section className="proof" aria-label="Proof points">
        <p className="slab-index">02 / Proof</p>
        <div className="plaque-grid">
          {positioning.proofPoints.map((p, i) => (
            <figure
              key={p.label}
              className="plaque"
              style={{ '--delay': `${0.08 + i * 0.1}s` }}
            >
              <strong>{p.value}</strong>
              <figcaption>
                <span>{p.label}</span>
                <em>{p.detail}</em>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="work" className="work-slab">
        <header className="section-head">
          <p className="slab-index">03 / Work</p>
          <h2>Structure of delivery</h2>
        </header>
        {experience.map((job, i) => (
          <article
            key={`${job.company}-${job.start}`}
            className={`job slab-block ${i % 2 === 1 ? 'slab-offset' : ''}`}
          >
            <header>
              <h3>
                {job.role}
                <span className="job-company"> · {job.company}</span>
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

      <section id="projects" className="projects-slab">
        <header className="section-head">
          <p className="slab-index">04 / Projects</p>
          <h2>Built form</h2>
        </header>
        <div className="project-slabs">
          {projects.map((project, i) => (
            <article
              key={project.name}
              className={`project slab-block ${i % 2 === 1 ? 'slab-offset' : ''}`}
            >
              <h3>
                {project.name}
                {project.subtitle ? (
                  <span className="project-sub"> — {project.subtitle}</span>
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

      <section id="skills" className="skills-slab">
        <header className="section-head">
          <p className="slab-index">05 / Material</p>
          <h2>Capabilities</h2>
        </header>
        <dl className="material-list">
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

      <section id="contact" className="contact-slab">
        <header className="section-head">
          <p className="slab-index">06 / Contact</p>
          <h2>Next pour</h2>
        </header>
        <p className="contact-note">{cta.consultingNote}</p>
        <p className="contact-links">
          <a className="underline-grow" href={`mailto:${person.email}`}>
            {person.email}
          </a>
          <a
            className="underline-grow"
            href={person.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="underline-grow"
            href={person.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <span>{person.location}</span>
        </p>
      </section>
    </div>
  )
}
