/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The Django CMS backend serves the countdown config at /api/.
// Proxy it during dev/preview so the browser can call it same-origin.
const apiProxy = {
  '/api': {
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
  },
}

// Inline the (small) production CSS into index.html so mobile first paint does
// not wait on a render-blocking stylesheet round trip.
function inlineCssPlugin() {
  return {
    name: 'inline-critical-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx.bundle
        if (!bundle) return html
        for (const file of Object.values(bundle)) {
          if (!file.fileName || !file.fileName.endsWith('.css') || !file.source) continue
          const href = file.fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const link = new RegExp(`<link[^>]+href="[^"]*${href}"[^>]*>`)
          if (link.test(html)) {
            html = html.replace(link, `<style>${String(file.source)}</style>`)
          }
        }
        return html
      },
    },
  }
}

export default defineConfig({
  // When Django serves the SPA it collects the bundle as static files, so the
  // assets must be requested under /static/. `make frontend` sets VITE_BASE.
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss(), inlineCssPlugin()],
  build: {
    // The single main bundle (React + framer-motion + lucide) is ~500 kB
    // minified. Raise the warning threshold so deploy logs (Render/Fly) stay
    // clean. Split into vendor chunks instead if the bundle grows much more.
    chunkSizeWarningLimit: 1000,
    // Lighthouse's "valid source maps" audit and production debugging both
    // need the map files; they are only fetched by devtools.
    sourcemap: true,
  },
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
})
