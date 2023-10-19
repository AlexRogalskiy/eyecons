import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'

export default defineConfig({
  vite: {
    css: {
      transformer: 'lightningcss',
    },
  },
  server: {
    open: true,
    port: 3000,
  },
  publicDir: './docs/public',
  integrations: [svelte()],
  compressHTML: true,
  srcDir: './docs',
})
