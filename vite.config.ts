
import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Essential for Capacitor/Android to locate assets locally
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  server: {
    host: '0.0.0.0', // Required for Replit to expose the webview
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 443 // Helps with HMR over Replit's proxy
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    target: 'esnext'
  }
});
