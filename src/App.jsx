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

function usePressReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.press-reveal')
    if (!nodes.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-pressed')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

export default function App() {
  usePressReveal()

  return (
    <div className="page">
      <div className="paper-grain" aria-hidden="true" />

      <nav className="masthead" aria-label="Primary">
        <a className="masthead-mark press-link" href="#top">
          A.V.S.
        </a>
        <ul>
          {nav.map((item) => (
            <li key={item.id}>
              <a className="press-link" href={`#${item.id}`}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <header className="hero" id="top">
        <div className="hero-copy">
          <p className="brand ink-bleed">{person.name}</p>
          <h1 className="ink-bleed delay-1">{person.headline}</h1>
          <p className="lede ink-bleed delay-2">{person.tagline}</p>
          <div className="cta-row ink-bleed delay-3">
            <a className="cta press-link" href={`mailto:${person.email}`}>
              {cta.primary}
            </a>
            <a
              className="cta secondary press-link"
              href={person.resume}
              download="Aditya-Vandan-Sharma.pdf"
            >
              {cta.resume}
            </a>
            <a
              className="cta secondary press-link"
              href={person.github}
              target="_blank"
              rel="noreferrer"
            >
              {cta.secondary}
            </a>
          </div>
          <p className="folio ink-bleed delay-4" aria-hidden="true">
            Bangalore · Impression 01
          </p>
        </div>
        <figure className="hero-plate ink-bleed delay-2">
          <img
            src={person.profileImage}
            alt={`${person.name}, full-stack AI software engineer`}
            width={800}
            height={800}
          />
          <figcaption>Plate 01 · Portrait</figcaption>
        </figure>
      </header>

      <section className="imprint press-reveal" aria-label="Proof points">
        <p className="kicker">From the press</p>
        <div className="imprint-row">
          {positioning.proofPoints.map((p) => (
            <figure key={p.label}>
              <strong>{p.value}</strong>
              <figcaption>
                <span>{p.label}</span>
                <em>{p.detail}</em>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="work" className="press-reveal">
        <h2>Work</h2>
        <p className="section-lede">{positioning.thesis}</p>
        {experience.map((job) => (
          <article key={`${job.company}-${job.start}`} className="job">
            <header>
              <h3>
                {job.role}
                <span className="sep"> · </span>
                {job.company}
              </h3>
              <p className="meta">
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

      <section id="projects" className="press-reveal">
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
                <a className="press-link" href={project.link} target="_blank" rel="noreferrer">
                  Live
                </a>
              ) : null}
              {project.github ? (
                <a
                  className="press-link"
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              ) : null}
            </p>
          </article>
        ))}
      </section>

      <section id="skills" className="press-reveal">
        <h2>Capabilities</h2>
        <dl className="type-drawer">
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

      <section id="contact" className="press-reveal">
        <h2>Contact</h2>
        <p className="section-lede">{cta.consultingNote}</p>
        <p className="contact-line">
          <a className="press-link" href={`mailto:${person.email}`}>
            {person.email}
          </a>
          <span className="sep"> · </span>
          <a
            className="press-link"
            href={person.resume}
            download="Aditya-Vandan-Sharma.pdf"
          >
            Resume (PDF)
          </a>
          <span className="sep"> · </span>
          <a className="press-link" href={person.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <span className="sep"> · </span>
          <a className="press-link" href={person.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span className="sep"> · </span>
          {person.location}
        </p>
      </section>

      <footer className="colophon">
        <p>Set in Playfair Display & Libre Franklin · Printed on screen stock</p>
      </footer>
    </div>
  )
}
