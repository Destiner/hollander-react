/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
