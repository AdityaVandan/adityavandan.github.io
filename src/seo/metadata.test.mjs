import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { parseHTML } from 'linkedom'
import { person } from '../data/content.js'
import writingSnapshot from '../data/writing.json' with { type: 'json' }
import {
  HOME_CANONICAL,
  HOME_TITLE,
  MISSING_DESCRIPTION,
  MISSING_TITLE,
  applyRouteMeta,
  applySeoBlock,
  essayMeta,
  essayPageUrl,
  homeDescription,
  homeMeta,
  injectHomeFallback,
  llmsTxt,
  missingMeta,
  quotableIntro,
  robotsTxt,
  sitemapXml,
  stripHomeFallback,
  webManifest,
} from './metadata.js'

const SHELL = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <!-- seo:portfolio -->
    <title>Placeholder</title>
    <!-- /seo:portfolio -->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`

const samplePost = writingSnapshot.posts[0]

function documentFrom(html) {
  return parseHTML(html).document
}

describe('portfolio SEO metadata', () => {
  test('keeps the homepage title and canonical URL', () => {
    const meta = homeMeta()
    assert.equal(meta.title, HOME_TITLE)
    assert.equal(meta.title, 'Aditya Vandan Sharma — Full-stack AI Software Engineer')
    assert.equal(meta.canonical, HOME_CANONICAL)
    assert.equal(meta.canonical, 'https://adityavandan.github.io/')
  })

  test('answers who the page is about without publishing the phone number', () => {
    const description = homeDescription()
    const published = [
      description,
      quotableIntro(),
      JSON.stringify(homeMeta().jsonLd),
      llmsTxt(),
      injectHomeFallback(applySeoBlock(SHELL, homeMeta())),
      robotsTxt(),
      sitemapXml(),
      webManifest(),
    ].join('\n')
    assert.match(description, /Aditya Vandan Sharma/)
    assert.match(description, /Bangalore, India/)
    assert.match(description, /Tesco/)
    assert.match(description, /Rippling/)
    assert.match(description, /Groww/)
    assert.equal(published.includes(person.phone), false)
    assert.equal(published.includes('7566665551'), false)
  })

  test('links the person entity to GitHub, LinkedIn, and Medium', () => {
    const graph = homeMeta().jsonLd['@graph']
    const about = graph.find((node) => node['@type'] === 'Person')
    assert.equal(about.url, HOME_CANONICAL)
    assert.ok(about.sameAs.includes(person.github))
    assert.ok(about.sameAs.includes(person.linkedin))
    assert.ok(about.sameAs.includes(writingSnapshot.source))
    assert.equal(about.worksFor.name, 'Tesco')
  })

  test('writes one head block and a no-JS summary without touching the module script', () => {
    const once = injectHomeFallback(applySeoBlock(SHELL, homeMeta()))
    const twice = injectHomeFallback(applySeoBlock(once, homeMeta()))
    assert.equal(once, twice)
    assert.equal(once.match(/id="seo-jsonld"/g).length, 1)
    assert.equal(once.match(/<noscript id="seo-fallback">/g).length, 1)
    assert.match(once, /src="\/src\/main\.jsx"/)
    assert.match(once, /<h1>Aditya Vandan Sharma<\/h1>/)
    const data = JSON.parse(once.match(/<script id="seo-jsonld"[^>]*>([\s\S]*?)<\/script>/)[1])
    assert.equal(data['@graph'][0]['@type'], 'ProfilePage')
  })

  test('essay shells keep the Medium canonical URL and drop the home fallback', () => {
    const home = injectHomeFallback(applySeoBlock(SHELL, homeMeta()))
    const essay = stripHomeFallback(applySeoBlock(home, essayMeta(samplePost)))
    const meta = essayMeta(samplePost)
    assert.equal(meta.title, `${samplePost.title} — Aditya Vandan Sharma`)
    assert.equal(meta.description, samplePost.excerpt)
    assert.equal(meta.canonical, samplePost.url)
    assert.match(essay, new RegExp(`rel="canonical" href="${samplePost.url.replaceAll('?', '\\?')}"`))
    assert.equal(essay.includes('seo-fallback'), false)
    assert.match(essay, /src="\/src\/main\.jsx"/)
    const data = JSON.parse(essay.match(/<script id="seo-jsonld"[^>]*>([\s\S]*?)<\/script>/)[1])
    assert.equal(data['@graph'][0].author.url, HOME_CANONICAL)
    assert.equal(data['@graph'][0].url, samplePost.url)
  })

  test('client route updates replace the head without duplicating tags', () => {
    const home = applySeoBlock(SHELL, homeMeta())
    const document = documentFrom(home)
    applyRouteMeta(essayMeta(samplePost), document)
    assert.equal(document.title, `${samplePost.title} — Aditya Vandan Sharma`)
    assert.equal(document.querySelectorAll('meta[name="description"]').length, 1)
    assert.equal(document.querySelector('link[rel="canonical"]').getAttribute('href'), samplePost.url)
    assert.equal(document.querySelector('meta[property="og:type"]').getAttribute('content'), 'article')
    assert.equal(document.querySelector('meta[property="profile:first_name"]'), null)
    assert.equal(document.querySelectorAll('#seo-jsonld').length, 1)

    applyRouteMeta(missingMeta(), document)
    assert.equal(document.title, MISSING_TITLE)
    assert.equal(document.querySelector('meta[name="description"]').getAttribute('content'), MISSING_DESCRIPTION)
    assert.equal(document.querySelector('link[rel="canonical"]').getAttribute('href'), HOME_CANONICAL)
    assert.equal(document.querySelector('meta[name="robots"]').getAttribute('content'), 'noindex,follow')
    assert.equal(document.querySelector('meta[property="article:author"]'), null)

    applyRouteMeta(homeMeta(), document)
    assert.equal(document.title, HOME_TITLE)
    assert.equal(document.querySelector('meta[property="og:url"]').getAttribute('content'), HOME_CANONICAL)
    assert.equal(document.querySelectorAll('meta[name="description"]').length, 1)
  })

  test('publishes a sitemap, robots file, manifest, and answer-engine brief', () => {
    const robots = robotsTxt()
    const sitemap = sitemapXml()
    const brief = llmsTxt()
    assert.match(robots, /Sitemap: https:\/\/adityavandan\.github\.io\/sitemap\.xml/)
    assert.match(robots, /User-agent: GPTBot\nAllow: \//)
    assert.match(sitemap, /<loc>https:\/\/adityavandan\.github\.io\/<\/loc>/)
    assert.match(sitemap, /Aditya-Vandan-Sharma\.pdf/)
    assert.match(sitemap, new RegExp(essayPageUrl(samplePost).replaceAll('/', '\\/')))
    assert.match(brief, /The canonical page for Aditya Vandan Sharma is https:\/\/adityavandan\.github\.io\//)
    assert.match(brief, new RegExp(samplePost.title.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    const manifest = JSON.parse(webManifest())
    assert.equal(manifest.name, person.name)
    assert.equal(manifest.start_url, '/')
  })
})
