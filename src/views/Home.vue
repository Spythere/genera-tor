<template>
  <SideBar />

  <div class="home">
    <div class="home_container">
      <div class="order_container">
        <OrderVue />
      </div>

      <div class="message_container">
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

export default defineComponent({
  components: { OrderVue, SideBar },

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

  .home_container {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    margin-top: 1em;

    @media screen and (max-width: 650px) {
      margin-top: 80px;
    }
  }

  .order_container {
    font-size: 0.9rem;
    margin-right: 0.5em;
    margin-bottom: 1em;

    @media screen and (max-width: 550px) {
      margin: 0.5em;
    }
  }
}
</style>
