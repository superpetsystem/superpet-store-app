import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Usa './' para Electron, '/' para deploy web
  const isElectron = process.env.ELECTRON === 'true' || mode === 'electron';
  
  return {
    plugins: [react()],
    base: isElectron ? './' : '/', // Caminhos relativos para Electron, absolutos para web
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      assetsDir: 'assets', // Organiza assets em subdiretório
      rollupOptions: {
        output: {
          manualChunks: undefined,
          // Nomeia arquivos de forma consistente
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
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
  };
});
