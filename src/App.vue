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
import axios from 'axios';
import StorageManager from './managers/storageManager';
import Navbar from './components/App/Navbar.vue';
import UpdatePrompt from './components/Global/UpdatePrompt.vue';

const STORAGE_VERSION_KEY = 'app_version';

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
      this.loadSettings();
      this.checkAppVersion();
      this.handleQueries();
    },

    loadSettings() {
      document.title = `GeneraTOR ${this.appVersion}`;
      this.store.orderDarkMode = this.getOrderSetting('dark-mode') === 'true';
    },

    handleQueries() {
      const query = new URLSearchParams(window.location.search);

      const id = query.get('sceneryId');

      if (id != null) {
        this.store.panelMode = 'OrderTrainPickerPanel';
      }
    },

    async checkAppVersion() {
      const storageVersion = StorageManager.getStringValue(STORAGE_VERSION_KEY);

      try {
        const releaseData = await (
          await axios.get('https://api.github.com/repos/Spythere/genera-tor/releases/latest')
        ).data;

        if (!releaseData) return;

        this.store.appUpdateData.version = this.appVersion;
        this.store.appUpdateData.changelog = releaseData.body;
        this.store.appUpdateData.releaseURL = releaseData.html_url;

        this.store.updateCardOpen =
          (storageVersion != '' && storageVersion != this.appVersion) ||
          import.meta.env.VITE_UPDATE_TEST === 'test';
      } catch (error) {
        console.error(`Wystąpił błąd podczas pobierania danych z API GitHuba: ${error}`);
      }

      StorageManager.setStringValue(STORAGE_VERSION_KEY, this.appVersion);
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
