import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // ✅ 절대경로 설정
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
