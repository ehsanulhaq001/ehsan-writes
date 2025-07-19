import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  // Handle client-side routing for SPAs
  server: {
    fs: {
      strict: false
    }
  }
}) 