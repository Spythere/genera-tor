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

<script lang="ts" setup>
import packageInfo from '../package.json';
import axios from 'axios';
import { useStore } from './store/store';

import UpdateCard from './components/Global/UpdateCard.vue';
import UpdatePrompt from './components/Global/UpdatePrompt.vue';
import AppNavbar from './components/App/AppNavbar.vue';
import StorageManager from './managers/storageManager';
import { onMounted } from 'vue';

const STORAGE_VERSION_KEY = 'app_version';

const store = useStore();
const appVersion = packageInfo.version;

onMounted(() => {
  loadLang();
  loadSettings();
  checkAppVersion();
  handleQueries();
});

function loadSettings() {
  document.title = `GeneraTOR ${appVersion}`;
  store.orderDarkMode = StorageManager.getBooleanValue('dark-mode');
}

function handleQueries() {
  const query = new URLSearchParams(window.location.search);

  const id = query.get('sceneryId');

  if (id != null) {
    store.panelMode = 'OrderTrainPicker';
  }
}

async function checkAppVersion() {
  const storageVersion = StorageManager.getStringValue(STORAGE_VERSION_KEY);

  try {
    const releaseData = await (
      await axios.get('https://api.github.com/repos/Spythere/genera-tor/releases/latest')
    ).data;

    if (!releaseData) return;

    store.appUpdateData.version = appVersion;
    store.appUpdateData.changelog = releaseData.body;
    store.appUpdateData.releaseURL = releaseData.html_url;

    store.updateCardOpen =
      (storageVersion != '' && storageVersion != appVersion) ||
      import.meta.env.VITE_UPDATE_TEST === 'test';
  } catch (error) {
    console.error(`Wystąpił błąd podczas pobierania danych z API GitHuba: ${error}`);
  }

  StorageManager.setStringValue(STORAGE_VERSION_KEY, appVersion);
}

function loadLang() {
  const storageLang = StorageManager.getStringValue('lang');

  if (storageLang) {
    store.changeLang(storageLang);
    return;
  }

  if (!window.navigator.language) return;

  const naviLanguage = window.navigator.language.toString();

  if (!naviLanguage.startsWith('pl')) {
    store.changeLang('en');
  }
}
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
