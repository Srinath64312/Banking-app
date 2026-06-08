import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: (process.env.VERCEL || process.env.NETLIFY) ? '/' : '/Banking-app/',
  plugins: [react()],
  server: {
    allowedHosts: true,
    cors: {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    }
  },
});
