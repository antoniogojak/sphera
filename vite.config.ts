import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), cesium(), svgr()],
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium'),
  },
  build: {
    target: 'esnext'
  },
  server: {
    host: true
  }
});
