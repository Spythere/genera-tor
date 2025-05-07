<template>
  <div id="app_wrapper">
    <router-view />

    <transition name="slide-anim">
      <div v-if="needRefresh" class="update-prompt" @click="updateServiceWorker(true)">
        Nowa wersja GeneraTORa dostępna!
        <u>Kliknij, aby odświeżyć aplikację!</u>
      </div>
    </transition>

    <footer>
      &copy; <a href="https://td2.info.pl/profile/?u=20777">Spythere</a>
      {{ new Date().getUTCFullYear() }} | v.{{ appVersion }}
    </footer>
  </div>
</template>

<script lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { defineComponent } from 'vue';
import packageInfo from '../package.json';
import { useStore } from './store/store';
import orderStorageMixin from './mixins/orderStorageMixin';

export default defineComponent({
  mixins: [orderStorageMixin],

  setup() {
    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({ immediate: true });

    return { offlineReady, needRefresh, updateServiceWorker };
  },
  data() {
    return { appVersion: packageInfo.version, store: useStore() };
  },

  created() {
    document.title = `GeneraTOR ${this.appVersion}`;
    this.store.orderDarkMode = this.getOrderSetting('dark-mode') === 'true';

    const query = new URLSearchParams(window.location.search);

    const id = query.get('sceneryId');

    if (id != null) {
      this.store.orderMode = 'OrderTrainPicker';
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
