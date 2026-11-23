import { defineConfig } from '@playwright/test';
import chromium from '@sparticuz/chromium';
export default defineConfig({
  testDir: './tests',
  testMatch: '**/browser.spec.js',
  workers: 1,
  use: {
    baseURL: 'http://localhost:5175',
    viewport: { width: 1440, height: 1000 },
    launchOptions: process.env.CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH, args: chromium.args.filter(arg => arg !== '--single-process') } : {},
  },
  // Varsayılan tarayıcı senaryoları cihaz içi panoyu sınamak için sunucu modunu kapatır;
  // arka uç akışı `npm run test:forum` ile taklit edilmiş PostgREST üzerinden sınanır.
  webServer: { command: 'VITE_FORUM_MODE=local npm run dev -- --port 5175 --strictPort', url: 'http://localhost:5175', reuseExistingServer: false },
});
