import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
// Configured for Cloudflare Pages static deployment.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    cssCodeSplit: true,
    target: 'es2020',
    rollupOptions: {
      output: {
        // Pisahkan chunk library berat (jspdf, pdf-lib, html2canvas)
        // agar tidak ter-load di landing page.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.match(/jspdf|pdf-lib|html2canvas|purify|dompurify/)) {
              return 'pdf-libs';
            }
            if (id.match(/react|react-dom|react-router/)) {
              return 'react-vendor';
            }
            if (id.match(/lucide-react/)) {
              return 'icons';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});