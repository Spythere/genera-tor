<template>
  <div class="update-card" v-if="store.updateCardOpen">
    <div class="card-background"></div>
    <div class="card-content">
      <h1 style="margin-bottom: 0.5em">
        <TriangleAlertIcon :size="35" style="vertical-align: text-bottom" />&nbsp;{{
          $t('update.title')
        }}
      </h1>

      <div class="content-info">
        <div v-html="$t('update.contentHTML')"></div>
        <div style="margin-top: 1em" v-html="$t('update.disclaimerHTML')"></div>
        <div style="margin-top: 1em" v-html="$t('update.linkHTML')"></div>
      </div>

      <button class="g-button action btn-confirm" ref="confirmButtonEl" @click="confirm">
        {{ $t('update.confirm') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useStore } from '../../store/store';
import { TriangleAlertIcon } from 'lucide-vue-next';
import StorageManager from '../../managers/storageManager';

const store = useStore();
const confirmButtonEl = ref<HTMLButtonElement | null>(null);

watch(
  computed(() => store.updateCardOpen),
  (val) => {
    if (val) {
      confirmButtonEl.value?.focus();
    }
  }
);

function confirm() {
  store.updateCardOpen = false;
  StorageManager.setBooleanValue('archiveInfoSeen', true);
}
</script>

<style lang="scss" scoped>
.update-card {
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  z-index: 200;

  display: flex;
  justify-content: center;
  align-items: center;
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 250;

  cursor: pointer;

  background-color: rgba(0, 0, 0, 0.55);
}

.card-content {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1em;

  margin: 1em;

  max-height: 95vh;
  max-height: 95dvh;

  background-color: #1a1a1a;
  box-shadow: 0 0 15px 10px #0e0e0e;
  border-radius: 1em;

  overflow: auto;

  padding: 1em;
  overflow: auto;
  max-width: 700px;

  text-align: center;

  z-index: 300;
}

.content-info {
  font-size: 1.1em;
}

::v-deep(a) {
  text-decoration: underline;
}
</style>
