import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// User site https://adityavandan.github.io/ — assets from domain root.
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
