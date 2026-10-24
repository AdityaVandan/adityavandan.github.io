import { Colophon, Masthead, Paper } from '../components/SiteChrome.jsx'
import { formatEssayDate } from '../writing.js'

export function Essay({ post }) {
  const published = formatEssayDate(post.publishedAt)

  return (
    <>
      <Paper />
      <div className="page">
        <Masthead onHome={false} />
        <article className="essay">
          <p className="kicker">
            <a className="press-link" href="/#writing">
              Writing
            </a>
            <span className="sep"> · </span>
            <time dateTime={post.publishedAt}>{published}</time>
          </p>
          <h1>{post.title}</h1>
          <p className="meta">
            {post.complete ? 'Full text' : 'Preview'}
            {post.publication ? ` · ${post.publication}` : ''}
            <span className="sep"> · </span>
            <a className="press-link" href={post.url} target="_blank" rel="noreferrer">
              First published on Medium
            </a>
          </p>
          {post.tags.length > 0 ? <p className="stack">{post.tags.join(' · ')}</p> : null}
          {post.html ? <div className="essay-body" dangerouslySetInnerHTML={{ __html: post.html }} /> : null}
          {post.complete ? null : (
            <>
              {post.excerpt ? <p className="section-lede">{post.excerpt}</p> : null}
              <p className="section-lede">
                Medium’s public feed includes the opening of this essay. The rest of it stays on Medium.
              </p>
              <p className="links">
                <a className="press-link" href={post.url} target="_blank" rel="noreferrer">
                  Continue on Medium
                </a>
              </p>
            </>
          )}
        </article>
        <Colophon />
      </div>
    </>
  )
}

export function EssayMissing() {
  return (
    <>
      <Paper />
      <div className="page">
        <Masthead onHome={false} />
        <article className="essay">
          <p className="kicker">Writing</p>
          <h1>This essay is not in the snapshot</h1>
          <p className="section-lede">
            The printed set on this site does not include that piece.
          </p>
          <p className="links">
            <a className="press-link" href="/#writing">
              Back to writing
            </a>
          </p>
        </article>
        <Colophon />
      </div>
    </>
  )
}
