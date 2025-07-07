<template>
  <!-- <OrderHelper v-if="store.helperModalOpen" /> -->

  <div class="home">
    <div class="home_container">
      <div class="order_container">
        <SideBar />
        <OrderVue />
      </div>

      <div class="message_container">
        <div class="message_nav">
          <button class="g-button icon" @click="switchLanguages">
            <LanguagesIcon :size="18" />
            <span style="margin-left: 0.25em">{{ $t('locale.' + store.currentAppLocale) }}</span>
          </button>

          <button
            v-for="(action, i) in navActions"
            :key="action.mode"
            class="g-button option"
            :data-active="store.orderMode == action.mode"
            @click="selectOrderMode(action.mode)"
          >
            {{ $t(`navbar.${action.value}`) }}
          </button>
        </div>

        <transition name="order-anim" mode="out-in">
          <keep-alive>
            <Component :is="orderModeComponent" />
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OrderVue from '../components/Order.vue';
import SideBar from '../components/SideBar.vue';
import OrderMessage from '../components/OrderMessage.vue';
import OrderList from '../components/OrderList.vue';
import { useStore } from '../store/store';
import OrderHelper from '../components/OrderHelper.vue';
import OrderTrainPicker from '../components/OrderTrainPicker.vue';
import { LanguagesIcon } from 'lucide-vue-next';
import StorageManager from '../managers/storageManager';

export default defineComponent({
  components: { OrderVue, SideBar, OrderHelper, LanguagesIcon },

  data() {
    return {
      navActions: [
        {
          mode: 'OrderMessage',
          value: 'order-message'
        },
        {
          mode: 'OrderList',
          value: 'order-list'
        },
        {
          mode: 'OrderTrainPicker',
          value: 'order-train-picker'
        }
      ]
    };
  },

  methods: {
    selectOrderMode(mode: string) {
      this.store.orderMode = mode;
    },

    switchLanguages() {
      const lang = this.store.currentAppLocale == 'pl' ? 'en' : 'pl';

      this.$i18n.locale = lang;
      this.store.currentAppLocale = lang;

      StorageManager.setStringValue('lang', lang);
    }
  },

  setup() {
    return {
      store: useStore()
    };
  },

  computed: {
    orderModeComponent() {
      switch (this.store.orderMode) {
        case 'OrderMessage':
          return OrderMessage;
        case 'OrderList':
          return OrderList;
        case 'OrderTrainPicker':
          return OrderTrainPicker;
        default:
          return OrderMessage;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  overflow-x: auto;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;

  .home_container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2em 1em;
    padding: 0.5em;

    width: 100%;

    @media screen and (max-width: 650px) {
      padding: 1em 0.5em;
    }
  }

  .order_container {
    width: 100%;
    max-width: 600px;

    display: flex;
    align-items: start;

    @media screen and (max-width: 650px) {
      flex-direction: column;
    }
  }

  .message_container {
    padding: 2px;

    width: 100%;
    max-width: 500px;

    display: grid;
    grid-template-rows: auto auto 1fr;

    height: 95vh;
    overflow: auto;
  }

  .message_nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25em;
    flex-wrap: wrap;

    margin-bottom: 1.5em;
  }
}
</style>
