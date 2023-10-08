import { defineConfig } from 'vite';
import vuePlugin from '@vitejs/plugin-vue';

export default defineConfig({
  root: './client',
  plugins: [vuePlugin()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
