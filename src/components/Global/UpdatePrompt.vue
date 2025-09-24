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

<style scoped></style>
