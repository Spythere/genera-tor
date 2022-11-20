import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    port: 8081,
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'prompt',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,img}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/stacjownik-api-b9mrc\.ondigitalocean\.app\/api\/getSceneries/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'sceneries-data-cache',
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
        enabled: true,
      },
    }),
  ],
});

