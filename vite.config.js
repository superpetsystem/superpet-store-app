import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Necessário para Electron carregar assets corretamente
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true, // Permite acesso de outras interfaces (mobile webview)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
