import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3002', changeOrigin: true,
        configure(proxy) {
          proxy.on('error', (_error, _request, response) => {
            if ('writeHead' in response && !response.headersSent) {
              response.writeHead(503); response.end();
            }
          });
        },
      },
      '/s3': {
        target: 'http://127.0.0.1:9000', changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s3/, ''),
      },
    },
  },
});
