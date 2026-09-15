import { defineConfig } from 'vite';
export default defineConfig({
  server: { port: Number(process.env.PORT) || 3002, host: true },
  preview: { port: Number(process.env.PORT) || 3000, host: true, strictPort: true, allowedHosts: ['.trycloudflare.com'] },
  build: { outDir: 'dist', sourcemap: false }
});
