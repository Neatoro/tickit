import { defineConfig } from 'vite';
import vuePlugin from '@vitejs/plugin-vue';

export default defineConfig({
  root: './client',
  build: {
    outDir: '../dist/client',
    emptyOutDir: true
  },
  plugins: [vuePlugin()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
