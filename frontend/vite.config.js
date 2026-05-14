import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://upgraded-memory-9p75wgr9jqjfjr9-5000.app.github.dev',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})