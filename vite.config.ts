import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Public runtime (e.g. cloudflared `--url http://127.0.0.1:3000`):
    // listen on all IPv4 interfaces (default is loopback-only, which the
    // tunnel client cannot dial), keep the fixed port, and allow the
    // tunnel's random *.trycloudflare.com Host header (Vite 6 would 403 it).
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  // @pascal-app/* dist code references Next-style env vars; define them so
  // the browser bundle does not throw `process is not defined`.
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
    'process.env.NEXT_PUBLIC_ASSETS_CDN_URL': JSON.stringify(
      process.env.NEXT_PUBLIC_ASSETS_CDN_URL ?? '',
    ),
    'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    ),
  },
});
