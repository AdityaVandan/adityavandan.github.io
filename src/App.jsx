import {
  person,
  positioning,
  experience,
  projects,
  skills,
  nav,
  cta,
} from './data/content.js'

const CHANNEL_IDS = ['CH1', 'CH2', 'CH3', 'CH4']

function WaveformPlane() {
  return (
    <svg
      className="wave-plane"
      viewBox="0 0 1440 640"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="scope-grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path
            d="M48 0H0V48"
            fill="none"
            stroke="var(--grid)"
            strokeWidth="0.6"
            opacity="0.55"
          />
        </pattern>
        <linearGradient id="phosphor-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--phosphor)" stopOpacity="0.15" />
          <stop offset="35%" stopColor="var(--phosphor)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--phosphor)" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect width="1440" height="640" fill="url(#scope-grid)" />
      {/* quiet baseline */}
      <path
        className="wave-baseline"
        d="M0 320 H1440"
        fill="none"
        stroke="var(--grid)"
        strokeWidth="1"
        opacity="0.7"
      />
      {/* primary clean signal under noise */}
      <path
        className="wave-trace wave-trace--primary"
        d="M0 340
           C60 340, 90 220, 150 250
           S240 420, 300 310
           S390 180, 450 280
           S540 460, 600 300
           S690 140, 750 260
           S840 430, 900 290
           S990 170, 1050 300
           S1140 440, 1200 280
           S1290 200, 1350 310
           S1410 340, 1440 320"
        fill="none"
        stroke="url(#phosphor-fade)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* secondary quieter channel */}
      <path
        className="wave-trace wave-trace--secondary"
        d="M0 380
           C80 360, 120 400, 180 370
           S300 340, 360 390
           S480 420, 540 360
           S660 300, 720 370
           S840 430, 900 350
           S1020 300, 1080 380
           S1200 420, 1260 350
           S1380 320, 1440 360"
        fill="none"
        stroke="var(--grid-bright)"
        strokeWidth="1.2"
        opacity="0.55"
      />
    </svg>
  )
}

export default function App() {
  return (
    <div className="lab">
      <div className="crt-scan" aria-hidden="true" />

      <header className="scope-bar">
        <div className="scope-bar__left">
          <span className="live-dot" aria-hidden="true" />
          <span className="live-label">LIVE</span>
          <span className="scope-meta">SIG · AI / FULLSTACK</span>
        </div>
        <nav className="scope-nav" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="scope-bar__right">
          <span className="scope-meta">{person.location}</span>
          <span className="scope-meta">20 mV/div · 5 ms</span>
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <WaveformPlane />
          <div className="hero-content">
            <p className="signal-id">{person.name}</p>
            <h1 className="channel-label">
              <span className="ch-tag">CH1</span>
              {person.headline}
            </h1>
            <p className="hero-lede">{person.tagline}</p>
            <div className="cta-row">
              <a className="cta" href={`mailto:${person.email}`}>
                open channel
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
        </section>

        <section className="readouts" aria-label="Scope readouts">
          <header className="panel-head">
            <h2>Scope readouts</h2>
            <p className="panel-note">{positioning.thesis}</p>
          </header>
          <p className="noise-line">
            Clean signal under noise — triage agents and retrieval grounded in
            production, not demos.
          </p>
          <div className="readout-grid">
            {positioning.proofPoints.map((p, i) => (
              <article key={p.label} className="readout">
                <div className="readout-top">
                  <span className="readout-ch">{CHANNEL_IDS[i]}</span>
                  <span className="readout-mode">Vpp</span>
                </div>
                <strong className="readout-value">
                  <span className="tick">{p.value}</span>
                </strong>
                <p className="readout-label">{p.label}</p>
                <p className="readout-detail">{p.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="traces">
          <header className="panel-head">
            <h2>Signal traces</h2>
            <span className="panel-meta">CAREER · TIMEBASE</span>
          </header>
          <div className="trace-list">
            {experience.map((job, idx) => (
              <article
                key={`${job.company}-${job.start}`}
                className="trace"
              >
                <div className="trace-rail">
                  <span className="trace-ch">
                    {CHANNEL_IDS[idx] ?? `CH${idx + 1}`}
                  </span>
                  <span className="trace-time">
                    {job.start} – {job.end}
                  </span>
                </div>
                <div className="trace-body">
                  <h3>
                    {job.role}
                    <span className="trace-org"> · {job.company}</span>
                  </h3>
                  <p className="trace-loc">{job.location}</p>
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

        <section id="projects" className="captures">
          <header className="panel-head">
            <h2>Captured waveforms</h2>
            <span className="panel-meta">PROJECTS · HOLD</span>
          </header>
          <div className="capture-list">
            {projects.map((project, idx) => (
              <article key={project.name} className="capture">
                <div className="capture-head">
                  <span className="capture-idx">
                    W{String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3>
                    {project.name}
                    {project.subtitle ? (
                      <span className="capture-sub"> — {project.subtitle}</span>
                    ) : null}
                  </h3>
                </div>
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

        <section id="skills" className="bands">
          <header className="panel-head">
            <h2>Frequency bands</h2>
            <span className="panel-meta">CAPABILITIES · SPECTRUM</span>
          </header>
          <dl className="band-list">
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
              <dt>CI / CD</dt>
              <dd>{skills.cicd.join(' · ')}</dd>
            </div>
          </dl>
        </section>

        <section id="contact" className="channel-open">
          <header className="panel-head">
            <h2>Open channel</h2>
            <span className="panel-meta">CONTACT · TX READY</span>
          </header>
          <p className="channel-note">{cta.consultingNote}</p>
          <p className="channel-links">
            <a href={`mailto:${person.email}`}>{person.email}</a>
            <span className="sep">·</span>
            <a href={person.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <span className="sep">·</span>
            <a href={person.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <span className="sep">·</span>
            <span>{person.location}</span>
          </p>
        </section>
      </main>

      <footer className="scope-foot">
        <span>AVS · SIGNAL LAB</span>
        <span>END OF TRACE</span>
      </footer>
    </div>
  )
}
