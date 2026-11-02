import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the app from https://omrihaik.github.io/lavi-tracker/
  base: '/lavi-tracker/',
  plugins: [react()],
})
