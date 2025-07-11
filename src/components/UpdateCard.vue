<template>
  <div class="update-card" v-if="store.updateCardOpen" @toggle-card="toggleCard(false)">
    <div class="card-background"></div>
    <div class="card-content">
      <h1 style="margin-bottom: 0.5em">🚀 {{ $t('update.title') }}</h1>

      <div class="changelog" v-if="htmlChangelog != ''" v-html="htmlChangelog"></div>
      <div class="no-features" v-else>{{ $t('update.no-data') }}</div>

      <button class="g-button action btn-confirm" ref="confirmButtonEl" @click="toggleCard(false)">
        {{ $t('update.confirm') }}
      </button>

      <p class="bottom-info">
        {{ $t('update.info-1') }}
        <br />
        <span v-html="$t('update.info-2')"></span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { Converter } from 'showdown';
import { useStore } from '../store/store';

const converter = new Converter();
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

const htmlChangelog = computed(() => {
  if (store.appUpdateData.changelog == '') return '';

  return converter.makeHtml(store.appUpdateData.changelog);
});

function toggleCard(value: boolean) {
  store.updateCardOpen = value;
}
</script>

<style lang="scss" scoped>
// Converter styles
::v-deep(h1) {
  text-align: center;
  color: var(--clr-primary);
}

::v-deep(h2) {
  padding: 0.25em 0;
  border-bottom: 1px solid #aaa;
}

::v-deep(ul) {
  list-style: disc;
  padding: 1em;
  line-height: 1.5em;
  text-align: justify;
}

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
  gap: 0.5em;

  margin: 1em;

  max-height: 95vh;
  max-height: 95dvh;

  background-color: #1a1a1a;
  box-shadow: 0 0 15px 10px #0e0e0e;
  border-radius: 1em;

  overflow: auto;

  padding: 1em;
  min-height: 700px;
  overflow: auto;
  max-width: 700px;

  z-index: 300;
}

.no-features {
  text-align: center;
}

.changelog {
  text-align: left;
}

button.btn-confirm {
  padding: 0.5em 0.75em;
  font-size: 1.1em;
}

p.bottom-info {
  text-align: center;
  color: #ccc;
}

a {
  text-decoration: underline;
}
</style>
