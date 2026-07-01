<template>
  <nav class="app-navbar">
    <div class="navbar-brand">
      <img src="/favicon.ico" alt="generator logo" width="30" />
      <div>
        <b>
          Genera<span class="text--accent">TOR</span>
          <sup class="text--grayed">Archive</sup>
        </b>

        <b class="brand-author">&nbsp;by Spythere</b>
      </div>
    </div>

    <div class="navbar-actions">
      <button class="g-button action icon" @click="showArchiveDisclaimer">
        <LucideTriangleAlert :size="20" v-if="store.orderDarkMode" />
      </button>

      <button class="g-button action icon" @click="switchDarkMode">
        <LucideMoon :size="20" v-if="store.orderDarkMode" />
        <LucideSun :size="20" v-else />
      </button>

      <button class="g-button action icon" @click="switchLang">
        <LucideGlobe :size="20" />
        <span>{{ store.currentAppLocale == 'pl' ? 'POL' : 'ENG' }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { LucideGlobe, LucideMoon, LucideSun, LucideTriangleAlert } from 'lucide-vue-next';
import { useStore } from '../../store/store';

const store = useStore();

function switchDarkMode() {
  store.orderDarkMode = !store.orderDarkMode;
  window.localStorage.setItem('dark-mode', `${store.orderDarkMode}`);
  document.documentElement.setAttribute('data-theme', store.orderDarkMode ? 'dark' : 'light');
}

function switchLang() {
  store.changeLang(store.currentAppLocale == 'pl' ? 'en' : 'pl');
}

function showArchiveDisclaimer() {
  store.updateCardOpen = true;
}
</script>

<style lang="scss" scoped>
.app-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 40px;
  padding: 0.25em;
  background-color: #1c1c1c;
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
    padding: 0.5em;
    gap: 0.25em;
    border-radius: 0.5em;
  }
}
</style>
