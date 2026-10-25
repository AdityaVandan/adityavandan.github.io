import {
  person,
  positioning,
  experience,
  projects,
  skills,
  cta,
} from '../data/content.js'
import { Colophon, Masthead, Paper } from '../components/SiteChrome.jsx'
import ExperienceTimeline from '../ExperienceTimeline.jsx'
import GithubActivity from '../GithubActivity.jsx'
import { usePressReveal } from '../usePressReveal.js'
import { formatEssayDate, writingPosts } from '../writing.js'

export default function Home() {
  usePressReveal()

  return (
    <>
      <Paper />
      <div className="page">
      <Masthead onHome />

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
              rel="me noreferrer"
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

      <section id="work">
        <h2>Work</h2>
        <p className="section-lede">{positioning.thesis}</p>
        <ExperienceTimeline jobs={experience} />
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

      <section id="github" className="press-reveal" aria-label="GitHub activity">
        <GithubActivity />
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

      <section id="writing" className="press-reveal">
        <h2>Writing</h2>
        <p className="section-lede">
          Essays on production systems, first published on Medium and set here in the same type.
        </p>
        {writingPosts.map((post) => (
          <article key={post.id} className="project">
            <h3>
              <a className="press-link" href={`/writing/${post.slug}`}>
                {post.title}
              </a>
            </h3>
            <p className="meta">
              <time dateTime={post.publishedAt}>{formatEssayDate(post.publishedAt)}</time>
              <span className="sep"> · </span>
              {post.complete ? 'Full text' : 'Preview'}
              {post.publication ? ` · ${post.publication}` : ''}
            </p>
            {post.excerpt ? <p>{post.excerpt}</p> : null}
            <p className="links">
              <a className="press-link" href={`/writing/${post.slug}`}>
                {post.complete ? 'Read' : 'Preview'}
              </a>
              <a className="press-link" href={post.url} target="_blank" rel="noreferrer">
                Medium
              </a>
            </p>
          </article>
        ))}
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
          <a className="press-link" href={person.linkedin} target="_blank" rel="me noreferrer">
            LinkedIn
          </a>
          <span className="sep"> · </span>
          <a className="press-link" href={person.github} target="_blank" rel="me noreferrer">
            GitHub
          </a>
          <span className="sep"> · </span>
          {person.location}
        </p>
      </section>

      <Colophon />
      </div>
    </>
  )
}
