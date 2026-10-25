import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import {
  applySeoBlock,
  homeMeta,
  injectHomeFallback,
  llmsTxt,
  robotsTxt,
  sitemapXml,
  webManifest,
} from './src/seo/metadata.js'

const seoFiles = {
  '/robots.txt': ['text/plain; charset=utf-8', robotsTxt],
  '/sitemap.xml': ['application/xml; charset=utf-8', sitemapXml],
  '/llms.txt': ['text/plain; charset=utf-8', llmsTxt],
  '/site.webmanifest': ['application/manifest+json; charset=utf-8', webManifest],
}

function portfolioSeo() {
  return {
    name: 'portfolio-seo',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return injectHomeFallback(applySeoBlock(html, homeMeta()))
      },
    },
    generateBundle() {
      const files = {
        'robots.txt': robotsTxt(),
        'sitemap.xml': sitemapXml(),
        'llms.txt': llmsTxt(),
        'site.webmanifest': webManifest(),
      }
      for (const [fileName, source] of Object.entries(files)) {
        this.emitFile({ type: 'asset', fileName, source })
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0]
        const hit = seoFiles[path]
        if (!hit) return next()
        res.setHeader('Content-Type', hit[0])
        res.end(hit[1]())
      })
    },
  }
}

// Dev serves index.source.html. The committed index.html is the Pages build.
function serveSourceEntry() {
  return {
    name: 'serve-source-entry',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next()
        const accept = req.headers.accept || ''
        if (!accept.includes('text/html')) return next()
        const path = req.url?.split('?')[0] ?? ''
        if (path.includes('.') && path !== '/index.html') return next()
        const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
        req.url = `/index.source.html${query}`
        next()
      })
    },
  }
}

// User site https://adityavandan.github.io/ — assets from domain root.
export default defineConfig({
  plugins: [react(), serveSourceEntry(), portfolioSeo()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
