<template>
  <div id="app_wrapper">
    <transition name="slide-anim">
      <UpdateCard />
    </transition>

    <transition name="slide-anim">
      <UpdatePrompt />
    </transition>

    <div class="app-body">
      <Navbar />

      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UpdateCard from './components/Global/UpdateCard.vue';
import orderStorageMixin from './mixins/orderStorageMixin';
import { useStore } from './store/store';
import packageInfo from '../package.json';
import StorageManager from './managers/storageManager';
import Navbar from './components/App/Navbar.vue';
import UpdatePrompt from './components/Global/UpdatePrompt.vue';

export default defineComponent({
  components: { UpdateCard, UpdatePrompt, Navbar },

  mixins: [orderStorageMixin],

  data() {
    return { appVersion: packageInfo.version, store: useStore() };
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      this.loadLang();
      this.setupDarkMode();
      this.showArchiveDisclaimer();
      this.handleQueries();
    },

    setupDarkMode() {
      if (this.getOrderSetting('dark-mode') === null) {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        this.saveOrderSetting('dark-mode', prefersDarkMode);
      }

      this.store.orderDarkMode = this.getOrderSetting('dark-mode') === 'true';
      document.documentElement.setAttribute(
        'data-theme',
        this.store.orderDarkMode ? 'dark' : 'light'
      );
    },

    handleQueries() {
      const query = new URLSearchParams(window.location.search);

      const id = query.get('sceneryId');

      if (id != null) {
        this.store.panelMode = 'OrderTrainPickerPanel';
      }
    },

    async showArchiveDisclaimer() {
      const isArchiveInfoSeen = StorageManager.getBooleanValue('archiveInfoSeen');

      this.store.updateCardOpen = !isArchiveInfoSeen || import.meta.env.VITE_ARCHIVE_INFO === '1';
    },

    changeLang(lang: string) {
      this.$i18n.locale = lang;
      this.store.currentAppLocale = lang;

      StorageManager.setStringValue('lang', lang);
    },

    loadLang() {
      const storageLang = StorageManager.getStringValue('lang');

      if (storageLang) {
        this.changeLang(storageLang);
        return;
      }

      if (!window.navigator.language) return;

      const naviLanguage = window.navigator.language.toString();

      if (!naviLanguage.startsWith('pl')) {
        this.changeLang('en');
      }
    }
  }
});
</script>

<style lang="scss">
@use 'styles/anims';
@use 'styles/colors';

#app {
  color: white;
  min-height: 100vh;
}

@media screen and (max-width: 500px) {
  #app {
    font-size: calc(1vw + 0.65rem);
  }
}
</style>
