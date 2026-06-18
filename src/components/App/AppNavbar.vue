<template>
  <nav class="app-navbar">
    <div class="navbar-content">
      <div class="navbar-brand">
        <img src="/favicon.ico" alt="generator logo" width="30" />
        <div>
          <b>
            Genera<span class="text--accent">TOR</span>
            <sup>v{{ version }}</sup>
          </b>

          <b class="brand-author">&nbsp;by Spythere</b>
        </div>
      </div>

      <div class="navbar-actions">
        <button class="g-button action icon" @click="switchDarkMode">
          <Moon :size="20" v-if="store.orderDarkMode" />
          <Sun :size="20" v-else />
        </button>

        <button class="g-button action icon" @click="switchLang">
          <Globe :size="20" />
          <span>{{ store.currentAppLocale == 'pl' ? 'POL' : 'ENG' }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Globe, Moon, Sun } from '@lucide/vue';
import { version } from '../../../package.json';
import { useStore } from '../../store/store';
import StorageManager from '../../managers/storageManager';

const store = useStore();

function switchDarkMode() {
  store.orderDarkMode = !store.orderDarkMode;

  const appTheme = store.orderDarkMode ? 'dark' : 'light';

  StorageManager.setStringValue('appTheme', appTheme);
  document.documentElement.setAttribute('data-theme', appTheme);
}

function switchLang() {
  store.changeLang(store.currentAppLocale == 'pl' ? 'en' : 'pl');
}
</script>

<style lang="scss" scoped>
.app-navbar {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 40px;
  padding: 0.25em;
  background-color: #1c1c1c;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1300px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5em;

  sup {
    font-size: 0.75em;
  }
}

.brand-author {
  font-size: 0.8em;
  color: #aaa;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.5em;

  button {
    gap: 0.25em;
    border-radius: 0.5em;
  }
}
</style>
