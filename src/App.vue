<template>
  <div id="app_wrapper">
    <UpdateCard />

    <router-view />

    <transition name="slide-anim">
      <div v-if="needRefresh" class="update-prompt" @click="updateServiceWorker(true)">
        {{ $t('update.update-available-text') }}
        <u>{{ $t('update.update-available-underline') }}</u>
      </div>
    </transition>

    <footer>
      &copy; <a href="https://td2.info.pl/profile/?u=20777">Spythere</a>
      {{ new Date().getUTCFullYear() }} |
      <button class="g-button text" @click="store.updateCardOpen = true">v.{{ appVersion }}</button>
    </footer>
  </div>
</template>

<script lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { defineComponent } from 'vue';
import packageInfo from '../package.json';
import { useStore } from './store/store';
import orderStorageMixin from './mixins/orderStorageMixin';
import StorageManager from './managers/storageManager';
import axios from 'axios';
import UpdateCard from './components/UpdateCard.vue';

const STORAGE_VERSION_KEY = 'app_version';

export default defineComponent({
  components: { UpdateCard },

  mixins: [orderStorageMixin],

  setup() {
    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({ immediate: true });

    return { offlineReady, needRefresh, updateServiceWorker };
  },

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
