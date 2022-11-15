import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

import { registerSW } from 'virtual:pwa-register';

const intervalMS = 1 * 60 * 1000;

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('Refreshing page...');
  },
  
  onOfflineReady() {
    console.log('Offline ready');
  },
});

createApp(App).use(router).use(createPinia()).mount('#app');

