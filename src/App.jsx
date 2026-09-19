import { useEffect } from 'react'
import {
  person,
  positioning,
  experience,
  projects,
  skills,
  cta,
  nav,
  openSource,
  education,
} from './data/content.js'

function useGalleryMotion() {
  useEffect(() => {
    const labels = document.querySelectorAll('.fade-up')
    const rooms = document.querySelectorAll('.gallery-room')

    // Reveal anything already on screen immediately (hero), then observe the rest.
    labels.forEach((node) => {
      const rect = node.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        node.classList.add('is-visible')
      }
    })

    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            reveal.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
    )

    labels.forEach((node) => {
      if (!node.classList.contains('is-visible')) reveal.observe(node)
    })

    const onScroll = () => {
      const vh = window.innerHeight || 1
      rooms.forEach((room) => {
        const rect = room.getBoundingClientRect()
        const mid = rect.top + rect.height * 0.35
        const dist = Math.abs(mid - vh * 0.42) / vh
        const opacity = Math.max(0.55, 1 - dist * 0.55)
        room.style.setProperty('--room-opacity', String(opacity))
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      reveal.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}

function roomNumber(index) {
  return String(index + 1).padStart(2, '0')
}

export default function App() {
  useGalleryMotion()

  return (
    <div className="page">
      <nav className="gallery-nav" aria-label="Primary">
        <a className="nav-mark brass-link" href="#top">
          Gallery
        </a>
        <ul>
          {nav.map((item) => (
            <li key={item.id}>
              <a className="brass-link" href={`#${item.id}`}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <header className="hero" id="top">
        <div className="wall-texture" aria-hidden="true" />
        <div className="hero-ceiling">
          <p className="exhibition-kicker fade-up">Current exhibition</p>
          <h1 className="brand fade-up">{person.name}</h1>
        </div>

        <div className="hero-hang">
          <figure className="wall-work fade-up">
            <div className="work-plane">
              <img
                src={person.profileImage}
                alt={`${person.name}`}
                width="720"
                height="900"
              />
            </div>
            <figcaption className="work-caption">
              Portrait · {person.location}
            </figcaption>
          </figure>

          <aside className="wall-label fade-up" aria-label="Exhibition label">
            <p className="label-acc">Acc. 2025.01</p>
            <h2 className="label-title">{person.headline}</h2>
            <p className="label-lede">{person.tagline}</p>
            <div className="label-cta">
              <a className="brass-link cta-primary" href={`mailto:${person.email}`}>
                {cta.primary}
              </a>
              <a
                className="brass-link"
                href={person.github}
                target="_blank"
                rel="noreferrer"
              >
                {cta.secondary}
              </a>
            </div>
          </aside>
        </div>
      </header>

      <section className="didactic gallery-room" aria-labelledby="thesis-heading">
        <div className="room-inner fade-up">
          <p className="room-sign">Wall text</p>
          <h2 id="thesis-heading">On view</h2>
          <p className="thesis">{positioning.thesis}</p>
          <p className="audience">{positioning.audience}</p>

          <div className="didactic-flow">
            {positioning.proofPoints.map((point, i) => (
              <p key={point.label} className="didactic-line fade-up">
                <span className="didactic-marker" aria-hidden="true">
                  {roomNumber(i)}
                </span>
                Across the gallery, one panel notes{' '}
                <strong className="metric">{point.value}</strong>
                {' — '}
                {point.detail.toLowerCase()}
                <span className="didactic-aside"> ({point.label})</span>.
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="work-wing">
        <header className="wing-head fade-up">
          <p className="room-sign">East wing</p>
          <h2>Exhibition rooms</h2>
          <p className="wing-lede">{positioning.thesis}</p>
        </header>

        {experience.map((job, i) => (
          <article
            key={`${job.company}-${job.start}`}
            className="gallery-room room fade-up"
            style={{ '--room-i': i }}
          >
            <div className="room-plaque">
              <p className="plaque-no">Room {roomNumber(i)}</p>
              <h3>
                {job.role}
                <span className="plaque-venue"> · {job.company}</span>
              </h3>
              <p className="plaque-meta">
                {job.start} – {job.end} · {job.location}
              </p>
            </div>
            <ul className="room-notes">
              {job.highlights.map((h) => (
                <li key={h.slice(0, 48)}>{h}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section id="projects" className="catalog gallery-room">
        <header className="wing-head fade-up">
          <p className="room-sign">Catalog</p>
          <h2>Selected works</h2>
        </header>

        <ol className="catalog-list">
          {projects.map((project, i) => (
            <li key={project.name} className="catalog-entry fade-up">
              <div className="catalog-head">
                <span className="cat-no">{roomNumber(i + 4)}</span>
                <h3>
                  {project.name}
                  {project.subtitle ? (
                    <span className="cat-sub"> — {project.subtitle}</span>
                  ) : null}
                </h3>
              </div>
              <p className="cat-about">{project.about}</p>
              <p className="cat-medium">{project.stack.join(' · ')}</p>
              <p className="cat-links">
                {project.link ? (
                  <a
                    className="brass-link"
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Live
                  </a>
                ) : null}
                {project.github ? (
                  <a
                    className="brass-link"
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                ) : null}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section id="skills" className="materials gallery-room">
        <header className="wing-head fade-up">
          <p className="room-sign">Materials</p>
          <h2>Capabilities</h2>
        </header>
        <dl className="material-board fade-up">
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

      <section className="loan gallery-room" aria-label="Open source and education">
        <div className="loan-grid fade-up">
          <div>
            <p className="room-sign">On loan</p>
            <h2>Open source</h2>
            <ul className="loan-list">
              {openSource.map((item) => (
                <li key={item.name}>
                  <a className="brass-link" href={item.link} target="_blank" rel="noreferrer">
                    {item.name}
                  </a>
                  <span> — {item.about}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="room-sign">Provenance</p>
            <h2>Education</h2>
            <p className="edu">
              {education.degree}
              <br />
              {education.school}
              <br />
              <span>
                {education.start} – {education.end}
              </span>
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="vestibule gallery-room">
        <div className="vestibule-inner fade-up">
          <p className="room-sign">Vestibule</p>
          <h2>Visit / inquire</h2>
          <p className="consult">{cta.consultingNote}</p>
          <p className="contact-line">
            <a className="brass-link" href={`mailto:${person.email}`}>
              {person.email}
            </a>
            {' · '}
            <a
              className="brass-link"
              href={person.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            {' · '}
            <a
              className="brass-link"
              href={person.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            {' · '}
            {person.location}
          </p>
        </div>
      </section>

      <footer className="colophon">
        <p>
          {person.name} · Permanent collection · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
