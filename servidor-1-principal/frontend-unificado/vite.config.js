import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api/fichas': {
        target: 'http://backend-ficha-medica:3002',
        changeOrigin: true
      },
      '/api': {
        target: 'http://backend-pagos:3001',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://backend-pagos:3001',
        ws: true,
        changeOrigin: true
      }
    }
  }
})
