import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the app from https://omrihaik.github.io/lavi-tracker/
  base: '/lavi-tracker/',
  plugins: [
    react(),
    // Installable to the home screen, and opens without signal (FR-8)
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'LavieTracker',
        short_name: 'לביא',
        lang: 'he',
        dir: 'rtl',
        display: 'standalone',
        start_url: '/lavi-tracker/',
        scope: '/lavi-tracker/',
        background_color: '#121318',
        theme_color: '#121318',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: { maximumFileSizeToCacheInBytes: 3_000_000 },
    }),
  ],
})
