<template>
  <!-- <OrderHelper v-if="store.helperModalOpen" /> -->
  <SideBar />

  <div class="home">
    <div class="home_container">
      <div class="order_container">
        <OrderVue />
      </div>

      <div class="message_container">
        <div class="message_nav">
          <span v-for="(action, i) in navActions">
            <b v-if="i > 0">&bull;</b>

            <button
              class="g-button option"
              :data-active="store.orderMode == action.mode"
              @click="selectOrderMode(action.mode)"
            >
              {{ action.value }}
            </button>
          </span>
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

export default defineComponent({
  components: { OrderVue, SideBar, OrderHelper },

  data() {
    return {
      navActions: [
        {
          mode: 'OrderMessage',
          value: 'TREŚĆ ROZKAZU',
        },
        {
          mode: 'OrderList',
          value: 'ZAPISANE ROZKAZY',
        },
      ],
    };
  },

  methods: {
    selectOrderMode(mode: string) {
      this.store.orderMode = mode;
    },
  },

  setup() {
    return {
      store: useStore(),
    };
  },

  computed: {
    orderModeComponent() {
      switch (this.store.orderMode) {
        case 'OrderMessage':
          return OrderMessage;
        case 'OrderList':
          return OrderList;
        default:
          return OrderMessage;
      }
    },
  },
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
      padding-top: 85px;
      padding-bottom: 5em;
    }
  }

  .order_container {
    width: 100%;
    max-width: 550px;
  }

  .message_container {
    width: 500px;
  }

  .message_nav {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
