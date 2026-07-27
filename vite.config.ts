import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  // Le site est publié sur GitHub Pages sous /Interest-Man/.
  // En dev on reste à la racine pour que `npm run dev` marche normalement.
  base: process.env.GITHUB_PAGES === 'true' ? '/Interest-Man/' : '/',
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'icon.svg'],
      manifest: {
        name: 'Interest-Man — Jeu d\'investissement',
        short_name: 'Interest-Man',
        description: 'Investis dans la crypto, l\'or, les actions, l\'immobilier. Vrais chiffres, mécaniques fun.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'fr',
        // Relatif au manifeste : marche à la racine (dev) comme sous /Interest-Man/ (Pages).
        // Un start_url hors du scope empêcherait l'installation.
        start_url: '.',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.coingecko\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'coingecko-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 5 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
