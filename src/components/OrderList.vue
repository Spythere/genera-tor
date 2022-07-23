<template>
  <section class="order-list">
    <h3>Zapisane rozkazy pisemne ({{ localOrderList.length }})</h3>

    <transition-group name="list" tag="ul">
      <li v-for="order in sortedOrderList" :key="order.id">
        <b>
          {{ getOrderName(order.orderType) }} nr {{ order.orderBody['header']['orderNo'] }} dla pociągu nr
          {{ order.orderBody['header']['trainNo'] }}
        </b>
        <br />
        {{ order.createdAt ? 'Dodano: ' : 'Zaktualizowano: ' }}
        {{ new Date(order.createdAt || order.updatedAt || 0).toLocaleString('pl-PL') }}
        <br />
        <button class="g-button action" @click="selectLocalOrder(order)">Wybierz</button>
        <button class="g-button action" @click="removeOrder(order)">Usuń</button>
      </li>
    </transition-group>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import orderStorageMixin from '../mixins/orderStorageMixin';
import { useStore } from '../store/store';
import { LocalStorageOrder } from '../types/orderTypes';

export default defineComponent({
  name: 'OrderList',
  mixins: [orderStorageMixin],

  data() {
    return {
      localOrderList: [] as LocalStorageOrder[],
    };
  },

  setup() {
    return {
      store: useStore(),
    };
  },

  methods: {
    getOrderName(orderType: string) {
      return `Rozkaz "${orderType.split('order')[1]}"`;
    },

    removeOrder(order: LocalStorageOrder) {
      if (!order) return;

      this.removeLocalOrder(order);

      this.localOrderList = this.localOrderList.filter((o) => o.id != order.id);
    },
  },

  computed: {
    sortedOrderList() {
      return this.localOrderList.sort((a, b) => (b.createdAt || b.updatedAt!) - (a.createdAt || a.updatedAt!));
    },
  },

  activated() {
    const localStorage = window.localStorage;
    const orderList = [];

    for (let key in localStorage) {
      if (!/^order-/g.test(key)) continue;

      const orderObj: LocalStorageOrder = JSON.parse(localStorage[key]);
      if (!orderObj) continue;

      orderList.push(orderObj);
    }

    this.localOrderList = orderList;
  },
});
</script>

<style lang="scss" scoped>
.list {
  &-move,
  &-enter-active,
  &-leave-active {
    transition: all 0.5s ease;
  }
  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  &-leave-active {
    position: absolute;
  }
}

.order-list {
  padding: 1em;
}

ul {
  overflow-y: auto;
  overflow-x: hidden;
  height: 60vh;
  position: relative;
}

h3 {
  margin: 0;
  margin-bottom: 1em;
  text-align: center;
}

li {
  text-align: left;
  padding: 1em;
  margin: 0.5em;
  background-color: #222;
  width: 100%;

  cursor: pointer;

  button {
    margin: 1em 1em 0 0;
  }
}
</style>
