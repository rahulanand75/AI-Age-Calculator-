
import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // CRITICAL for Capacitor/Android to find assets
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || null),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext'
  },
  server: {
    historyApiFallback: true
  }
});
