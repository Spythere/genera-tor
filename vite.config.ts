import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  server: {
    port: 8081,
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@use '@/styles/global';`, silenceDeprecations: ['legacy-js-api'] },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'prompt',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,img}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/stacjownik.spythere.eu\/\/api\/getSceneries/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'sceneries-cache',
              expiration: {
                maxEntries: 250,
                maxAgeSeconds: 60 * 60 * 24 * 7, // <== 7 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        // enabled: true,
        suppressWarnings: true
      },
    }),
  ],
});
