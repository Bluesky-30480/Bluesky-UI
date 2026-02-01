import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@bluesky-ui/ui/styles': resolve(__dirname, '../component-library/src/styles'),
      '@bluesky-ui/ui': resolve(__dirname, '../component-library/src'),
      'component-library': resolve(__dirname, '../component-library/src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
