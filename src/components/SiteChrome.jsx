import { useRef } from 'react'
import { site } from '../data/content.js'
import { useScrollGlow } from '../hooks/useScrollGlow.js'
import SectionAside from './SectionAside.jsx'

export function PageShell({ children }) {
  const pageRef = useRef(null)
  useScrollGlow(pageRef)

  return (
    <div className="page" ref={pageRef}>
      <div className="aurora" aria-hidden="true" />
      {children}
      <SectionAside />
    </div>
  )
}

export function SiteNav({ onHome = true }) {
  const brandHref = onHome ? '#top' : '/#top'
  const hrefFor = (href) => (onHome ? href : `/${href}`)

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary">
        <a href={brandHref} className="site-nav-brand nolink">
          {site.nav.name}
        </a>
        <div className="site-nav-links">
          {site.nav.links.map((link) => (
            <a key={link.href} href={hrefFor(link.href)}>
              {link.label}
            </a>
          ))}
        </div>
        <a href={site.nav.resume.href} className="btn btn-nav">
          {site.nav.resume.label}
        </a>
      </nav>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer" data-aside="footer">
      <div className="site-footer-inner">
        <span>{site.footer.copyright}</span>
        <div className="site-footer-links">
          {site.footer.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel={link.label === 'GitHub' || link.label === 'LinkedIn' ? 'me noreferrer' : 'noreferrer'}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

/** @deprecated Prefer SiteNav / SiteFooter / PageShell */
export function Paper() {
  return null
}

/** @deprecated Prefer SiteNav */
export function Masthead({ onHome }) {
  return <SiteNav onHome={onHome} />
}

/** @deprecated Prefer SiteFooter */
export function Colophon() {
  return <SiteFooter />
}
