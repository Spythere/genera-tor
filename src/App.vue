<template>
  <div>
    <transition name="slide-anim">
      <UpdateCard />
    </transition>

    <transition name="slide-anim">
      <UpdatePrompt />
    </transition>

    <div class="app-body">
      <AppNavbar />

      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import UpdateCard from './components/Global/UpdateCard.vue';

import { defineComponent } from 'vue';
import packageInfo from '../package.json';
import { useStore } from './store/store';
import orderStorageMixin from './mixins/orderStorageMixin';
import StorageManager from './managers/storageManager';
import axios from 'axios';
import UpdatePrompt from './components/Global/UpdatePrompt.vue';
import AppFooter from './components/App/AppFooter.vue';
import AppNavbar from './components/App/AppNavbar.vue';

const STORAGE_VERSION_KEY = 'app_version';

export default defineComponent({
  components: { UpdateCard, UpdatePrompt, AppFooter, AppNavbar },

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
        this.store.orderMode = 'OrderTrainPicker';
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

    

    loadLang() {
      const storageLang = StorageManager.getStringValue('lang');

      if (storageLang) {
        this.store.changeLang(storageLang);
        return;
      }

      if (!window.navigator.language) return;

      const naviLanguage = window.navigator.language.toString();

      if (!naviLanguage.startsWith('pl')) {
        this.store.changeLang('en');
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

.update-prompt {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0.5em;

  font-weight: bold;

  text-align: center;

  width: 100%;
  background-color: colors.$accentCol;

  cursor: pointer;
}

footer {
  text-align: center;
  padding: 0.5em 0;
}

@media screen and (max-width: 500px) {
  #app {
    font-size: calc(1vw + 0.65rem);
  }
}
</style>
