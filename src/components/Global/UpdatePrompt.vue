<template>
  <div v-if="needRefresh" class="update-prompt" @click="updateServiceWorker(true)">
    {{ $t('update.update-available-text') }}
    <u>{{ $t('update.update-available-underline') }}</u>
  </div>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({ immediate: true });
</script>

<style lang="scss" scoped>
@use '../../styles/colors';

.update-prompt {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0.5em;

  z-index: 200;

  font-weight: bold;

  text-align: center;

  width: 100%;
  background-color: colors.$accentCol;

  cursor: pointer;
}
</style>
