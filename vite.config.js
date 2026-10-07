import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
  },
  server: {
    host: true,
    port: 3002,
  },
})
