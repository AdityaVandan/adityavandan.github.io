import {
  person,
  positioning,
  experience,
  projects,
  skills,
  cta,
  nav,
} from './data/content.js'

const sheetMeta = {
  drawing: 'AVS-PORTFOLIO-001',
  rev: 'A',
  scale: '1:1',
  discipline: 'AI / FULL-STACK',
}

function TitleBlock({ sheet }) {
  return (
    <aside className="title-block" aria-label="Drawing title block">
      <div className="tb-cell tb-drawing">
        <span className="tb-key">DWG NO.</span>
        <span className="tb-val mono">{sheet.drawing}</span>
      </div>
      <div className="tb-cell">
        <span className="tb-key">REV</span>
        <span className="tb-val mono">{sheet.rev}</span>
      </div>
      <div className="tb-cell">
        <span className="tb-key">SCALE</span>
        <span className="tb-val mono">{sheet.scale}</span>
      </div>
      <div className="tb-cell tb-disc">
        <span className="tb-key">DISCIPLINE</span>
        <span className="tb-val mono">{sheet.discipline}</span>
      </div>
      <div className="tb-cell tb-loc">
        <span className="tb-key">ORIGIN</span>
        <span className="tb-val mono">{person.location}</span>
      </div>
    </aside>
  )
}

function DimensionCallout({ point, index }) {
  return (
    <li className="dim-item" style={{ '--i': index }}>
      <div className="dim-ticks" aria-hidden="true">
        <span className="tick tick-l" />
        <span className="dim-line" />
        <span className="tick tick-r" />
      </div>
      <p className="dim-value mono">{point.value}</p>
      <p className="dim-label">{point.label}</p>
      <p className="dim-detail">{point.detail}</p>
    </li>
  )
}

export default function App() {
  return (
    <div className="sheet">
      <div className="sheet-frame" aria-hidden="true">
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
      </div>

      <nav className="sheet-nav" aria-label="Primary">
        <a className="nav-home mono" href="#top">
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
        <div className="hero-grid" aria-hidden="true" />
        <svg className="hero-guides" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line className="guide-line draw" x1="8" y1="12" x2="8" y2="88" />
          <line className="guide-line draw delay-1" x1="8" y1="88" x2="72" y2="88" />
          <line className="guide-line draw delay-2" x1="72" y1="18" x2="92" y2="18" />
          <line className="guide-line faint" x1="0" y1="50" x2="100" y2="50" />
          <line className="guide-line faint" x1="50" y1="0" x2="50" y2="100" />
        </svg>

        <div className="hero-copy">
          <p className="sheet-mark mono">SHEET 01 · CAREER ASSEMBLY</p>
          <h1 className="brand">{person.name}</h1>
          <p className="headline">{person.headline}</p>
          <p className="lede">{person.tagline}</p>
          <div className="cta-row">
            <a className="cta" href={`mailto:${person.email}`}>
              {cta.primary}
            </a>
            <a className="cta ghost" href={person.github} target="_blank" rel="noreferrer">
              {cta.secondary}
            </a>
          </div>
        </div>

        <div className="hero-detail">
          <figure className="detail-view">
            <div className="detail-frame">
              <img src={person.profileImage} alt="" width="280" height="280" />
              <span className="detail-crosshair h" aria-hidden="true" />
              <span className="detail-crosshair v" aria-hidden="true" />
            </div>
            <figcaption className="mono">
              <span>REF · PROFILE</span>
              <span>DET A</span>
            </figcaption>
            <span className="dim-arrow top mono" aria-hidden="true">
              ↑ 280
            </span>
            <span className="dim-arrow side mono" aria-hidden="true">
              280 →
            </span>
          </figure>
          <TitleBlock sheet={sheetMeta} />
        </div>
      </header>

      <section className="thesis" aria-labelledby="thesis-heading">
        <div className="sec-head">
          <span className="sec-no mono">02</span>
          <h2 id="thesis-heading">Thesis</h2>
        </div>
        <p className="thesis-body">{positioning.thesis}</p>
        <p className="audience mono">{positioning.audience}</p>
      </section>

      <section className="dimensions" aria-labelledby="dims-heading">
        <div className="sec-head">
          <span className="sec-no mono">03</span>
          <h2 id="dims-heading">Critical dimensions</h2>
        </div>
        <p className="sec-note">
          Measured outcomes from production AI systems at Tesco — callouts on the drawing, not marketing stats.
        </p>
        <ol className="dim-list">
          {positioning.proofPoints.map((point, i) => (
            <DimensionCallout key={point.label} point={point} index={i} />
          ))}
        </ol>
      </section>

      <section id="work" className="work" aria-labelledby="work-heading">
        <div className="sec-head">
          <span className="sec-no mono">04</span>
          <h2 id="work-heading">Work</h2>
        </div>
        <p className="sec-note">Chronology of roles — read bottom-up like a revision history, or top-down as built.</p>

        <ol className="timeline">
          {experience.map((job, i) => (
            <li key={`${job.company}-${job.start}`} className="job">
              <div className="job-rail" aria-hidden="true">
                <span className="rail-dot" />
                {i < experience.length - 1 ? <span className="rail-line" /> : null}
              </div>
              <article className="job-body">
                <header className="job-head">
                  <div className="job-titles">
                    <h3>
                      {job.role}
                      <span className="job-co"> · {job.company}</span>
                    </h3>
                    <p className="job-meta mono">
                      {job.start} — {job.end} · {job.location}
                    </p>
                  </div>
                  <span className="rev-tag mono">REV {String(experience.length - i).padStart(2, '0')}</span>
                </header>
                <ul className="job-highlights">
                  {job.highlights.map((h) => (
                    <li key={h.slice(0, 48)}>{h}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <section id="projects" className="projects" aria-labelledby="projects-heading">
        <div className="sec-head">
          <span className="sec-no mono">05</span>
          <h2 id="projects-heading">Projects</h2>
        </div>
        <p className="sec-note">Independent assemblies — frameworks and visual tools outside the day job.</p>

        <div className="project-grid">
          {projects.map((project, i) => (
            <article key={project.name} className="project" style={{ '--i': i }}>
              <header className="project-head">
                <span className="mono project-id">P-{String(i + 1).padStart(2, '0')}</span>
                <h3>
                  {project.name}
                  {project.subtitle ? <span className="project-sub"> — {project.subtitle}</span> : null}
                </h3>
              </header>
              <p>{project.about}</p>
              <p className="stack mono">{project.stack.join(' · ')}</p>
              {(project.link || project.github) && (
                <p className="links">
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noreferrer">
                      Live drawing
                    </a>
                  ) : null}
                  {project.github ? (
                    <a href={project.github} target="_blank" rel="noreferrer">
                      Source
                    </a>
                  ) : null}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="capabilities" aria-labelledby="cap-heading">
        <div className="sec-head">
          <span className="sec-no mono">06</span>
          <h2 id="cap-heading">Material schedule</h2>
        </div>
        <dl className="sched">
          <div>
            <dt className="mono">LANG</dt>
            <dd>{skills.languages.join(' · ')}</dd>
          </div>
          <div>
            <dt className="mono">FRAME</dt>
            <dd>{skills.frameworks.join(' · ')}</dd>
          </div>
          <div>
            <dt className="mono">AI</dt>
            <dd>{skills.ai.join(' · ')}</dd>
          </div>
          <div>
            <dt className="mono">DATA</dt>
            <dd>{skills.databases.join(' · ')}</dd>
          </div>
          <div>
            <dt className="mono">CI/CD</dt>
            <dd>{skills.cicd.join(' · ')}</dd>
          </div>
        </dl>
      </section>

      <section id="contact" className="contact" aria-labelledby="contact-heading">
        <div className="sec-head">
          <span className="sec-no mono">07</span>
          <h2 id="contact-heading">Contact</h2>
        </div>
        <p className="contact-note">{cta.consultingNote}</p>
        <div className="contact-block">
          <a className="cta" href={`mailto:${person.email}`}>
            {person.email}
          </a>
          <p className="contact-links mono">
            <a href={person.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <span aria-hidden="true"> · </span>
            <a href={person.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <span aria-hidden="true"> · </span>
            <span>{person.location}</span>
            <span aria-hidden="true"> · </span>
            <a href={person.phone ? `tel:${person.phone}` : '#'}>{person.phone}</a>
          </p>
        </div>
        <footer className="sheet-footer mono">
          <span>{sheetMeta.drawing}</span>
          <span>END OF SHEET</span>
          <a href="#top">RETURN TO TITLE</a>
        </footer>
      </section>
    </div>
  )
}
