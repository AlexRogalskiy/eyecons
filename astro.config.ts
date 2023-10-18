import { defineConfig } from 'astro/config'

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
  compressHTML: true,
  srcDir: './docs',
})
