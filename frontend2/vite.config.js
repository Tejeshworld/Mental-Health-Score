import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const targetUrl = process.env.VITE_API_URL || 'https://mental-health-score-tejesh-kanta.onrender.com'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/predict': targetUrl,
      '/api':     targetUrl,
      '/auth':    targetUrl,
    },
  },
  build: {
    outDir: '../static',
    emptyOutDir: true,
  },
})
