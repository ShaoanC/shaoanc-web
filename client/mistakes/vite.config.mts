import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: fileURLToPath(new URL('.', import.meta.url)),
    base: '/mistakes/',
    plugins: [react()],
    build: {
      outDir: fileURLToPath(new URL('../../public/mistakes', import.meta.url)),
      emptyOutDir: true,
    },
    server: {
      host: '127.0.0.1',
      port: 5173,
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${env.PORT || '3000'}`,
          changeOrigin: true,
        },
      },
    },
  };
});
