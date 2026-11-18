import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: { include: ['react', 'react-dom', 'react-router-dom', 'leaflet', 'react-leaflet'] },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@shared': path.resolve(import.meta.dirname, 'shared'),
    },
  },
  build: { assetsDir: 'static' },
  server: {
    port: 5180,
    strictPort: true,
    proxy: { '/api': 'http://localhost:4000' },
  },
});
