import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  },
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 3000
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 3000
  }
});
