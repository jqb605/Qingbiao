import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Important for GitHub Pages: allows assets to be loaded from relative paths
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  define: {
    // Polyfill process.env for the browser so the existing code doesn't crash
    'process.env': {},
  }
});