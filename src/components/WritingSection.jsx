import { useMemo, useState } from 'react'
import { site } from '../data/content.js'

function localWritingHref(url) {
  try {
    const parsed = new URL(url, site.meta.canonical)
    if (parsed.pathname.startsWith('/writing/')) return parsed.pathname
  } catch {
    /* keep absolute */
  }
  return url
}

export default function WritingSection() {
  const [topic, setTopic] = useState(site.writing.topics[0])

  const shown = useMemo(() => {
    if (topic === 'All') return site.writing.posts
    return site.writing.posts.filter((post) => post.topic === topic)
  }, [topic])

  const liveMessage =
    topic === 'All'
      ? `${shown.length} essays`
      : `${shown.length} ${shown.length === 1 ? 'essay' : 'essays'} on ${topic}`

  return (
    <section id="writing" className="writing">
      <div className="writing-header">
        <h2 className="section-title">{site.writing.title}</h2>
        <p className="section-intro">{site.writing.intro}</p>
        <div
          role="group"
          aria-label="Filter by topic"
          className="glass segmented segmented-filter"
        >
          {site.writing.topics.map((label) => {
            const active = topic === label
            return (
              <button
                key={label}
                type="button"
                className={`seg seg-filter${active ? ' seg-active' : ''}`}
                aria-pressed={active}
                onClick={() => setTopic(label)}
              >
                {label}
              </button>
            )
          })}
        </div>
        <p className="writing-live" aria-live="polite">
          {liveMessage}
        </p>
      </div>

      <div className="scroller">
        {shown.length === 0 ? (
          <div className="glass writing-empty">No essays on this topic yet.</div>
        ) : (
          shown.map((post) => (
            <a
              key={post.url}
              href={localWritingHref(post.url)}
              className="glass writing-card nolink"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span className="writing-card-topic tint">{post.topic}</span>
                <span className="writing-card-title">{post.title}</span>
              </div>
              <span className="writing-card-meta">
                {post.date}, {post.source}
              </span>
            </a>
          ))
        )}
      </div>
    </section>
  )
}
