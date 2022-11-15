import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    port: 8081
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'prompt',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,img}'],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
