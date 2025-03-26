import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: '/react-image-gallery-task/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})