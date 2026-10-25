/**
 * Crawl and answer-engine metadata. Rendered into <head> and into
 * robots.txt, sitemap.xml, and llms.txt. Visible page copy stays in the
 * React tree.
 */
import writingSnapshot from '../data/writing.json' with { type: 'json' }
import {
  cta,
  experience,
  person,
  positioning,
  projects,
  skills,
} from '../data/content.js'

export const HOME_TITLE = 'Aditya Vandan Sharma — Full-stack AI Software Engineer'
export const HOME_CANONICAL = 'https://adityavandan.github.io/'
export const MISSING_TITLE = 'Essay not found — Aditya Vandan Sharma'
export const MISSING_DESCRIPTION = 'This essay is not in the snapshot.'

const SITE = HOME_CANONICAL.replace(/\/$/, '')
const PERSON_ID = `${SITE}/#aditya`
const SEO_START = '<!-- seo:portfolio -->'
const SEO_END = '<!-- /seo:portfolio -->'
const FALLBACK_ID = 'seo-fallback'

const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
]

function joinList(items) {
  if (items.length <= 1) return items[0] || ''
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

function unique(values) {
  const seen = new Set()
  const result = []
  for (const value of values) {
    if (!value || seen.has(value)) continue
    seen.add(value)
    result.push(value)
  }
  return result
}

function currentJob() {
  return experience.find((job) => /present/i.test(job.end)) || null
}

function previousEmployers() {
  const current = currentJob()
  return unique(
    experience
      .filter((job) => !current || job.company !== current.company)
      .map((job) => job.company),
  )
}

export function quotableIntro() {
  const role = `${person.headline.charAt(0).toLowerCase()}${person.headline.slice(1)}`
  const current = currentJob()
  const earlier = previousEmployers()
  const working = current ? `, working at ${current.company}` : ''
  const before = earlier.length ? `, with earlier work at ${joinList(earlier)}` : ''
  return `${person.name} is a ${role} in ${person.location}${working}${before}.`
}

export function homeDescription() {
  return quotableIntro()
}

function absoluteUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE}${path.startsWith('/') ? path : `/${path}`}`
}

export function essayPageUrl(post) {
  return `${SITE}/writing/${post.slug}/`
}

function identityUrls() {
  return unique([person.github, person.linkedin, writingSnapshot.source])
}

function skillNames() {
  return unique([
    ...skills.languages,
    ...skills.frameworks,
    ...skills.ai,
    ...skills.databases,
    ...skills.cicd,
  ])
}

function postalAddress() {
  const [locality, region] = person.location.split(',').map((part) => part.trim())
  const address = { '@type': 'PostalAddress', addressLocality: locality }
  if (region === 'India') address.addressCountry = 'IN'
  else if (region) address.addressRegion = region
  return address
}

function personNode() {
  const current = currentJob()
  const node = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: person.name,
    givenName: person.firstName,
    familyName: person.lastName,
    alternateName: ['Aditya Vandan'],
    url: HOME_CANONICAL,
    image: absoluteUrl(person.profileImage),
    jobTitle: person.headline,
    description: person.tagline,
    email: `mailto:${person.email}`,
    homeLocation: {
      '@type': 'Place',
      name: person.location,
      address: postalAddress(),
    },
    sameAs: identityUrls(),
    knowsAbout: skillNames(),
    affiliation: unique(experience.map((job) => job.company)).map((name) => ({
      '@type': 'Organization',
      name,
    })),
    subjectOf: {
      '@type': 'DigitalDocument',
      name: `${person.name} resume`,
      url: absoluteUrl(person.resume),
    },
  }
  if (current) {
    node.worksFor = { '@type': 'Organization', name: current.company }
  }
  return node
}

function writingNodes() {
  return writingSnapshot.posts.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    url: essayPageUrl(post),
    sameAs: post.url,
    datePublished: post.publishedAt,
    description: post.excerpt || post.title,
    author: { '@id': PERSON_ID },
  }))
}

export function homeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${SITE}/#profile`,
        url: HOME_CANONICAL,
        name: person.name,
        description: quotableIntro(),
        inLanguage: 'en',
        mainEntity: { '@id': PERSON_ID },
      },
      personNode(),
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: HOME_CANONICAL,
        name: person.name,
        description: quotableIntro(),
        inLanguage: 'en',
        publisher: { '@id': PERSON_ID },
      },
      {
        '@type': 'Blog',
        '@id': `${SITE}/#writing`,
        name: `Writing by ${person.name}`,
        url: `${HOME_CANONICAL}#writing`,
        author: { '@id': PERSON_ID },
        blogPost: writingNodes(),
      },
    ],
  }
}

export function essayJsonLd(post) {
  const image = absoluteUrl(post.coverImage) || absoluteUrl(person.profileImage)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt || post.title,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        image,
        url: post.url,
        mainEntityOfPage: post.url,
        author: {
          '@type': 'Person',
          '@id': PERSON_ID,
          name: person.name,
          url: HOME_CANONICAL,
          sameAs: identityUrls(),
        },
      },
    ],
  }
}

function missingJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: MISSING_TITLE,
    description: MISSING_DESCRIPTION,
    url: HOME_CANONICAL,
    isPartOf: { '@id': `${SITE}/#website` },
  }
}

export function homeMeta() {
  const description = homeDescription()
  const image = absoluteUrl(person.profileImage)
  return {
    title: HOME_TITLE,
    description,
    canonical: HOME_CANONICAL,
    robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    jsonLd: homeJsonLd(),
    links: [
      ...identityUrls().map((href) => ({ rel: 'me', href })),
      { rel: 'alternate', href: '/llms.txt', type: 'text/plain', title: 'Plain-language summary' },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
    openGraph: {
      'og:type': 'profile',
      'og:site_name': person.name,
      'og:url': HOME_CANONICAL,
      'og:title': HOME_TITLE,
      'og:description': description,
      'og:image': image,
      'og:image:alt': `${person.name}, ${person.headline}`,
      'og:locale': 'en_IN',
      'profile:first_name': person.firstName,
      'profile:last_name': person.lastName,
    },
    twitter: {
      card: 'summary',
      title: HOME_TITLE,
      description,
      image,
      'image:alt': `${person.name}, ${person.headline}`,
    },
  }
}

export function essayMeta(post) {
  const description = post.excerpt || post.title
  const title = `${post.title} — ${person.name}`
  const image = absoluteUrl(post.coverImage) || absoluteUrl(person.profileImage)
  return {
    title,
    description,
    canonical: post.url,
    robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    jsonLd: essayJsonLd(post),
    links: [
      ...identityUrls().map((href) => ({ rel: 'me', href })),
      { rel: 'author', href: HOME_CANONICAL },
      { rel: 'alternate', href: '/llms.txt', type: 'text/plain', title: 'Plain-language summary' },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
    openGraph: {
      'og:type': 'article',
      'og:site_name': person.name,
      'og:url': post.url,
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'og:image:alt': post.title,
      'og:locale': 'en_IN',
      'article:author': HOME_CANONICAL,
      'article:published_time': post.publishedAt,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      image,
      'image:alt': post.title,
    },
  }
}

export function missingMeta() {
  return {
    title: MISSING_TITLE,
    description: MISSING_DESCRIPTION,
    canonical: HOME_CANONICAL,
    robots: 'noindex,follow',
    jsonLd: missingJsonLd(),
    links: [{ rel: 'author', href: HOME_CANONICAL }],
    openGraph: {
      'og:type': 'website',
      'og:site_name': person.name,
      'og:url': HOME_CANONICAL,
      'og:title': MISSING_TITLE,
      'og:description': MISSING_DESCRIPTION,
      'og:locale': 'en_IN',
    },
    twitter: {
      card: 'summary',
      title: MISSING_TITLE,
      description: MISSING_DESCRIPTION,
    },
  }
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function jsonForScript(value) {
  return JSON.stringify(value, null, 2).replaceAll('<', '\\u003c')
}

function renderSeoBlock(meta) {
  const lines = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="author" content="${escapeHtml(person.name)}" />`,
    `<meta name="robots" content="${escapeHtml(meta.robots)}" />`,
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
  ]
  for (const link of meta.links) {
    const type = link.type ? ` type="${escapeHtml(link.type)}"` : ''
    const title = link.title ? ` title="${escapeHtml(link.title)}"` : ''
    lines.push(`<link rel="${escapeHtml(link.rel)}" href="${escapeHtml(link.href)}"${type}${title} />`)
  }
  for (const [property, content] of Object.entries(meta.openGraph)) {
    if (!content) continue
    lines.push(`<meta property="${property}" content="${escapeHtml(content)}" />`)
  }
  for (const [name, content] of Object.entries(meta.twitter)) {
    if (!content) continue
    lines.push(`<meta name="twitter:${name}" content="${escapeHtml(content)}" />`)
  }
  lines.push(`<script id="seo-jsonld" type="application/ld+json">\n${jsonForScript(meta.jsonLd)}\n    </script>`)
  return lines.map((line) => `    ${line}`).join('\n')
}

export function applySeoBlock(html, meta) {
  const block = `${SEO_START}\n${renderSeoBlock(meta)}\n    ${SEO_END}`
  if (html.includes(SEO_START) && html.includes(SEO_END)) {
    return html.replace(/<!-- seo:portfolio -->[\s\S]*?<!-- \/seo:portfolio -->/, block)
  }
  return html.replace('</head>', `    ${block}\n  </head>`)
}

function fallbackHtml() {
  const work = experience
    .map(
      (job) =>
        `<li>${escapeHtml(job.role)}, ${escapeHtml(job.company)} (${escapeHtml(job.start)} – ${escapeHtml(job.end)})</li>`,
    )
    .join('\n')
  const projectItems = projects
    .map((project) => `<li>${escapeHtml(project.name)} — ${escapeHtml(project.about)}</li>`)
    .join('\n')
  const writing = writingSnapshot.posts
    .map(
      (post) =>
        `<li><a href="${escapeHtml(essayPageUrl(post))}">${escapeHtml(post.title)}</a></li>`,
    )
    .join('\n')
  return [
    '<article>',
    `<h1>${escapeHtml(person.name)}</h1>`,
    `<p>${escapeHtml(quotableIntro())} The canonical page is ${escapeHtml(HOME_CANONICAL)}.</p>`,
    `<p>${escapeHtml(person.tagline)}</p>`,
    `<p>${escapeHtml(positioning.thesis)}</p>`,
    '<h2>Work</h2>',
    `<ul>\n${work}\n</ul>`,
    '<h2>Projects</h2>',
    `<ul>\n${projectItems}\n</ul>`,
    '<h2>Writing</h2>',
    `<ul>\n${writing}\n</ul>`,
    '<h2>Contact</h2>',
    `<p><a href="mailto:${escapeHtml(person.email)}">${escapeHtml(person.email)}</a>`,
    ` · <a href="${escapeHtml(absoluteUrl(person.resume))}">Resume</a>`,
    ` · <a href="${escapeHtml(person.linkedin)}">LinkedIn</a>`,
    ` · <a href="${escapeHtml(person.github)}">GitHub</a>`,
    ` · ${escapeHtml(person.location)}</p>`,
    `<p>${escapeHtml(cta.consultingNote)}</p>`,
    '</article>',
  ].join('\n')
}

export function stripHomeFallback(html) {
  return html.replace(new RegExp(`\\s*<noscript id="${FALLBACK_ID}">[\\s\\S]*?</noscript>`), '')
}

export function injectHomeFallback(html) {
  const stripped = stripHomeFallback(html)
  const block = `\n    <noscript id="${FALLBACK_ID}">\n${fallbackHtml()}\n    </noscript>`
  return stripped.replace('</body>', `${block}\n  </body>`)
}

export function robotsTxt() {
  const groups = ['*', ...AI_CRAWLERS].map(
    (agent) => `User-agent: ${agent}\nAllow: /\n`,
  )
  return `# ${person.name}\n# ${HOME_CANONICAL}\n\n${groups.join('\n')}\nSitemap: ${SITE}/sitemap.xml\n`
}

export function sitemapXml() {
  const urls = [
    HOME_CANONICAL,
    absoluteUrl(person.resume),
    `${SITE}/llms.txt`,
    ...writingSnapshot.posts.map((post) => essayPageUrl(post)),
  ]
  const body = urls
    .map((loc) => `  <url><loc>${escapeHtml(loc)}</loc></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

export function llmsTxt() {
  const work = experience.flatMap((job) => {
    const header = `- ${job.role}, ${job.company} (${job.start} – ${job.end}, ${job.location})`
    return [header, ...job.highlights.map((highlight) => `  - ${highlight}`)]
  })
  const projectLines = projects.map(
    (project) => `- ${project.name}${project.subtitle ? ` — ${project.subtitle}` : ''}: ${project.about}`,
  )
  const writing = writingSnapshot.posts.map((post) => {
    const excerpt = post.excerpt ? ` ${post.excerpt}` : ''
    return `- [${post.title}](${essayPageUrl(post)}):${excerpt} First published at ${post.url}.`
  })
  const capabilities = [
    `- Languages: ${skills.languages.join(', ')}`,
    `- Frameworks: ${skills.frameworks.join(', ')}`,
    `- AI: ${skills.ai.join(', ')}`,
    `- Data: ${skills.databases.join(', ')}`,
    `- Delivery: ${skills.cicd.join(', ')}`,
  ]
  return [
    `# ${person.name}`,
    '',
    `> ${quotableIntro()} The canonical page for ${person.name} is ${HOME_CANONICAL}.`,
    '',
    person.tagline,
    '',
    positioning.thesis,
    '',
    '## Identity',
    '',
    `- Name: ${person.name}`,
    `- Role: ${person.headline}`,
    `- Location: ${person.location}`,
    `- Portfolio: ${HOME_CANONICAL}`,
    `- Email: ${person.email}`,
    `- GitHub: ${person.github}`,
    `- LinkedIn: ${person.linkedin}`,
    `- Medium: ${writingSnapshot.source}`,
    `- Resume: ${absoluteUrl(person.resume)}`,
    '',
    '## Work',
    '',
    ...work,
    '',
    '## Projects',
    '',
    ...projectLines,
    '',
    '## Capabilities',
    '',
    ...capabilities,
    '',
    '## Writing',
    '',
    ...writing,
    '',
    '## Answer',
    '',
    `Who is ${person.name}? ${quotableIntro()} Portfolio: ${HOME_CANONICAL}.`,
    '',
  ].join('\n')
}

export function webManifest() {
  return `${JSON.stringify(
    {
      name: person.name,
      short_name: person.name,
      description: homeDescription(),
      start_url: '/',
      lang: 'en',
      icons: [{ src: '/favicon.png', sizes: '192x192', type: 'image/png' }],
    },
    null,
    2,
  )}\n`
}

function upsertMeta(doc, attribute, key, content) {
  const selector = `meta[${attribute}="${key}"]`
  let node = doc.head.querySelector(selector)
  if (!content) {
    node?.remove()
    return
  }
  if (!node) {
    node = doc.createElement('meta')
    node.setAttribute(attribute, key)
    doc.head.append(node)
  }
  node.setAttribute('content', content)
}

function clearManagedProperties(doc) {
  doc.head.querySelectorAll('meta[property]').forEach((node) => {
    const property = node.getAttribute('property') || ''
    if (/^(og:|profile:|article:)/.test(property)) node.remove()
  })
  doc.head.querySelectorAll('meta[name^="twitter:"]').forEach((node) => node.remove())
}

export function applyRouteMeta(meta, doc = document) {
  doc.title = meta.title
  upsertMeta(doc, 'name', 'description', meta.description)
  upsertMeta(doc, 'name', 'author', person.name)
  upsertMeta(doc, 'name', 'robots', meta.robots)
  let canonical = doc.head.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = doc.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    doc.head.append(canonical)
  }
  canonical.setAttribute('href', meta.canonical)
  clearManagedProperties(doc)
  for (const [property, content] of Object.entries(meta.openGraph)) {
    if (content) upsertMeta(doc, 'property', property, content)
  }
  for (const [name, content] of Object.entries(meta.twitter)) {
    if (content) upsertMeta(doc, 'name', `twitter:${name}`, content)
  }
  let script = doc.getElementById('seo-jsonld')
  if (!script) {
    script = doc.createElement('script')
    script.id = 'seo-jsonld'
    script.setAttribute('type', 'application/ld+json')
    doc.head.append(script)
  }
  script.textContent = jsonForScript(meta.jsonLd)
}
