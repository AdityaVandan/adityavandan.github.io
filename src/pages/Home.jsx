import { site } from '../data/content.js'
import { PageShell, SiteFooter, SiteNav } from '../components/SiteChrome.jsx'
import WritingSection from '../components/WritingSection.jsx'
import WorkSection from '../components/WorkSection.jsx'
import GithubActivity from '../GithubActivity.jsx'

function ImpactSection() {
  return (
    <section className="section container" aria-label="Impact">
      <div className="impact-grid">
        {site.impact.map((tile) =>
          tile.lead ? (
            <div key={tile.label} className="glass impact-tile impact-tile-lead">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span className="impact-label tint">{tile.label}</span>
                <span className="impact-value-lead grad">{tile.value}</span>
              </div>
              <span className="impact-detail-lead">{tile.detail}</span>
            </div>
          ) : (
            <div key={tile.label} className="glass impact-tile">
              <span className="impact-label tint">{tile.label}</span>
              <span className="impact-value grad">{tile.value}</span>
              <span className="impact-detail">{tile.detail}</span>
            </div>
          ),
        )}
      </div>
    </section>
  )
}

function ProjectsSection() {
  return (
    <section id="projects" className="projects">
      <h2 className="section-title" style={{ textAlign: 'center' }}>
        Projects
      </h2>
      <div className="projects-grid">
        {site.projects.map((project) => (
          <article key={project.name} className="glass project-card">
            {project.art ? (
              <div className="project-art">
                {project.art.map((word, index) => (
                  <span
                    key={word}
                    className={`project-art-word grad${index > 0 ? ' project-art-word-secondary' : ''}`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            ) : (
              <div className="project-art-image">
                {project.image ? (
                  <img
                    src={project.image.src}
                    alt={project.image.alt}
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                ) : null}
              </div>
            )}
            <div className="project-body">
              <span className="project-kicker tint">{project.kicker}</span>
              <h3 className="project-name">{project.name}</h3>
              <p className="project-about">{project.about}</p>
              <p className="project-stack">{project.stack}</p>
              {project.links?.length ? (
                <div className="project-links">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function StackSection() {
  return (
    <section id="stack" className="section container" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <h2 className="section-title" style={{ textAlign: 'center' }}>
        Stack
      </h2>
      <div className="stack-grid">
        {site.stack.map((group) => (
          <div key={group.label} className="glass stack-tile">
            <span className="stack-label tint">{group.label}</span>
            <span className="stack-items">{group.items}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <PageShell>
      <SiteNav onHome />
      <main className="main">
        <section id="top" className="hero">
          <div className="hero-block">
            <img
              src={site.hero.portrait.src}
              alt={site.hero.portrait.alt}
              className="portrait"
              width={152}
              height={152}
              onError={(event) => {
                event.currentTarget.removeAttribute('src')
              }}
            />
            <p className="hero-eyebrow tint">{site.hero.eyebrow}</p>
            <h1 className="hero-name grad">{site.hero.name}</h1>
            <p className="hero-tagline">{site.hero.tagline}</p>
            <div className="cta-row">
              <a href={site.hero.primaryAction.href} className="btn">
                {site.hero.primaryAction.label}
              </a>
              <a
                href={site.hero.secondaryAction.href}
                className="text-link"
                target="_blank"
                rel="me noreferrer"
              >
                {site.hero.secondaryAction.label}
              </a>
            </div>
            <p className="hero-location">{site.hero.location}</p>
          </div>
        </section>

        <section className="statement container-narrow" aria-label="About">
          <p>{site.statement}</p>
        </section>

        <ImpactSection />
        <WritingSection />
        <WorkSection />
        <ProjectsSection />
        <StackSection />
        <GithubActivity />

        <section id="contact" className="contact">
          <p className="contact-statement grad">{site.contact.statement}</p>
          <div className="cta-row" style={{ paddingTop: 0 }}>
            <a href={`mailto:${site.contact.email}`} className="btn">
              {site.contact.email}
            </a>
            <a href={site.contact.resume.href} className="text-link">
              {site.contact.resume.label}
            </a>
          </div>
        </section>

        <SiteFooter />
      </main>
    </PageShell>
  )
}
