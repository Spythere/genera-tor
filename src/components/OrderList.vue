<template>
  <section class="order-list">
    <h3>Zapisane rozkazy pisemne ({{ localOrderCount }})</h3>

    <ul>
      <li v-for="order in sortedOrderList">
        <b>
          {{ getOrderName(order.orderType) }} nr {{ order.orderBody['header']['orderNo'] }} dla pociągu nr
          {{ order.orderBody['header']['trainNo'] }}
        </b>
        <br />
        Dodano: {{ new Date(order.createdAt).toLocaleString('pl-PL') }}
        <br />
        <button class="g-button action" @click="selectLocalOrder(order)">Wybierz</button>
        <button class="g-button action" @click="removeOrder(order)">Usuń</button>
      </li>
    </ul>
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
      localOrderCount: 0,
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
      this.localOrderCount = this.localOrderCount - 1;
    },
  },

  computed: {
    sortedOrderList() {
      return this.localOrderList.sort((a, b) => b.createdAt - a.createdAt);
    },
  },

  activated() {
    const localStorage = window.localStorage;
    const orderList = [];

    this.localOrderCount = Number(localStorage.getItem('orderCount')) || 0;

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
.order-list {
  padding: 1em;
}

ul {
  overflow: auto;
  height: 60vh;
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

  cursor: pointer;

  button {
    margin: 1em 1em 0 0;
  }
}
</style>
