import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// The Pages base path follows the repository slug (the deploy workflow exports
// REPO_SLUG). Renaming the repository to `anatomi` therefore cleans the live URL
// on the very next deploy; local development keeps the domain root.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'ANATOMİ — Akademik Atlas ve Ders Kütüphanesi',
        short_name: 'ANATOMİ',
        description: 'Gerçekçi anatomi plakaları, Latince–Türkçe terim arama, mini testler ve çevrimdışı çalışma.',
        lang: 'tr',
        start_url: '.',
        display: 'standalone',
        background_color: '#f8f7f3',
        theme_color: '#f8f7f3',
        icons: [
          { src: 'brand/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'brand/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'brand/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Application shell precached; heavy plates and atlas art are cached on
        // first use so a lecture hall with no signal still opens every note.
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: ({ sameOrigin, url }) => sameOrigin && /\.(?:png|webp|jpe?g)$/.test(url.pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'anatomi-images',
              expiration: { maxEntries: 160, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ sameOrigin, url }) => sameOrigin && url.pathname.endsWith('.u8'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'anatomi-volumes',
              expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 180 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  base: process.env.GITHUB_PAGES === 'true' ? `/${process.env.REPO_SLUG || 'ANATOM-'}/` : '/',
  server: { host: '0.0.0.0', allowedHosts: ['.e2b.app'] },
  build: {
    rollupOptions: {
      output: {
        // Keep the enlarged, editable course texts separate from application/vendor code.
        manualChunks(id) {
          // Translation packs (en, ar) stay out of the eager chunks so Turkish visitors
          // never download them; Rollup splits each language into its own chunk.
          if (/\/src\/content\/(?:.*\/)?i18n\//.test(id) || id.includes('/src/content/packs/')) return undefined;
          if (id.includes('/src/content/exam/')) return 'exam-content';
          if (id.includes('/src/content/')) return 'course-content';
          if (id.includes('/node_modules/')) return 'vendor';
        },
      },
    },
  },
});
