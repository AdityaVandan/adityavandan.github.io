import {
  person,
  positioning,
  experience,
  projects,
  skills,
  cta,
} from './data/content.js'

/**
 * Base shell — each design-language branch replaces layout + CSS.
 * Keep importing from ./data/content.js so copy stays identical.
 */
export default function App() {
  return (
    <div className="page">
      <header className="hero" id="top">
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
      </header>

      <section className="proof" aria-label="Proof points">
        {positioning.proofPoints.map((p) => (
          <figure key={p.label}>
            <strong>{p.value}</strong>
            <figcaption>
              <span>{p.label}</span>
              <em>{p.detail}</em>
            </figcaption>
          </figure>
        ))}
      </section>

      <section id="work">
        <h2>Work</h2>
        <p className="section-lede">{positioning.thesis}</p>
        {experience.map((job) => (
          <article key={`${job.company}-${job.start}`} className="job">
            <header>
              <h3>
                {job.role} · {job.company}
              </h3>
              <p>
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

      <section id="projects">
        <h2>Projects</h2>
        {projects.map((project) => (
          <article key={project.name} className="project">
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

      <section id="skills">
        <h2>Capabilities</h2>
        <p>{skills.languages.join(' · ')}</p>
        <p>{skills.frameworks.join(' · ')}</p>
        <p>{skills.ai.join(' · ')}</p>
        <p>{skills.databases.join(' · ')}</p>
        <p>{skills.cicd.join(' · ')}</p>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <p>{cta.consultingNote}</p>
        <p>
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
      </section>
    </div>
  )
}
