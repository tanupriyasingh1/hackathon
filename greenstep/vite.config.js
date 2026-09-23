import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' lets the built site work from any sub-path (GitHub Pages, Netlify, etc.)
export default defineConfig({
  base: './',
  plugins: [react()],
})
