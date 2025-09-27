<template>
  <nav class="app-navbar">
    <div class="navbar-brand">
      <img src="/favicon.ico" alt="generator logo" width="30" />
      <b>
        GeneraTOR <sup>v{{ version }}</sup>
      </b>
    </div>

    <div class="navbar-actions">
      <button class="g-button action icon">
        <LucideGlobe :size="20" />
        <span>POL</span>
      </button>

      <button class="g-button action icon">
        <LucideMoon :size="20" />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { LucideGlobe, LucideMoon } from 'lucide-vue-next';
import { version } from '../../../package.json';
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
