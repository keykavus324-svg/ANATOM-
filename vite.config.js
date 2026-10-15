import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/ANATOM-/' : '/',
  server: { host: '0.0.0.0', allowedHosts: ['.e2b.app'] },
  build: {
    rollupOptions: {
      output: {
        // Keep the enlarged, editable course texts separate from application/vendor code.
        manualChunks(id) {
          if (id.includes('/src/content/exam/')) return 'exam-content';
          if (id.includes('/src/content/')) return 'course-content';
          if (id.includes('/node_modules/')) return 'vendor';
        },
      },
    },
  },
});
