import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

import { cloudflare } from "@cloudflare/vite-plugin";

// Gitee Pages serves project pages under a subpath (`/<repo>/`), so the build
// targeting Gitee needs a matching base. Vercel/Cloudflare serve at root (`/`).
// Switch via DEPLOY_TARGET=gitee at build time; default stays `/`.
const base = process.env.DEPLOY_TARGET === 'gitee' ? '/mj-portfolio/' : '/'

export default defineConfig({
  base,
  assetsInclude: ['**/*.glb'],
  plugins: [react(), tailwindcss(), cloudflare()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    allowedHosts: true,
  },
  preview: {
    allowedHosts: true,
  },
})