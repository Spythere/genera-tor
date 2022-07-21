<template>
  <section class="order-list">
    <h3>Zapisane rozkazy pisemne ({{ localOrderCount }})</h3>

    <ul>
      <li v-for="order in sortedOrderList" @click="selectLocalOrder(order)">
        <b>
          {{ getOrderName(order.orderType) }} nr {{ order.orderBody['header']['orderNo'] }} dla pociągu nr
          {{ order.orderBody['header']['trainNo'] }}
        </b>
        <br />
        Dodano: {{ new Date(order.createdAt).toLocaleString('pl-PL') }}
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useStore } from '../store/store';
import { LocalStorageOrder } from '../types/orderTypes';

export default defineComponent({
  name: 'OrderList',

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

    selectLocalOrder(order: LocalStorageOrder) {
      this.store.chosenOrderType = order.orderType;
      const orderBody = JSON.parse(JSON.stringify(order.orderBody));

      switch (order.orderType) {
        case 'orderN':
          // for (let key in this.store[order.orderType]) {
          //   (this.store[order.orderType] as any)[key] = orderBody[key];
          // }
          // this.store['orderN']['header'] = orderBody['header'];
          // this.store['orderN']['row1'] = orderBody['row1'];
          // this.store['orderN']['header'] = orderBody['header'];
          // this.store['orderN']['header'] = orderBody['header'];
          // this.store['orderN']['header'] = orderBody['header'];
          break;

        default:
          break;
      }
      this.store[order.orderType] = reactive(JSON.parse(JSON.stringify(order.orderBody)));
    },
  },

  computed: {
    sortedOrderList() {
      return this.localOrderList.sort((a, b) => a.createdAt - b.createdAt);
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
  width: 500px;
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
}
</style>
