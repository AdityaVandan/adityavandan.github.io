import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

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
  plugins: [react(), serveSourceEntry()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
