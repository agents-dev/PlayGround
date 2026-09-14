import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  preview: { port: 3000 },
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
