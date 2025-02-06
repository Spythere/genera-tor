<template>
  <section class="order-list">
    <h3>Zapisane rozkazy pisemne ({{ localOrderList.length }})</h3>

    <transition-group name="list" tag="ul">
      <li class="no-orders-warning" v-if="sortedOrderList.length == 0" :key="-1">
        Brak zapisanych rozkazów!
      </li>

      <li
        v-for="order in sortedOrderList"
        :selected="order.id == store.chosenLocalOrderId"
        :key="order.id"
      >
        <b class="text--accent">#{{ order.id.split('-')[1] }}&nbsp;</b>
        <b>
          {{ getOrderName(order.orderType) }} nr {{ order.orderBody['header']['orderNo'] }} dla
          pociągu nr {{ order.orderBody['header']['trainNo'] }}
        </b>
        <span
          v-if="!order.orderVersion || order.orderVersion != ORDER_VERSION"
          class="wrong-order-indicator"
          tabindex="0"
          data-tooltip="Przestarzała wersja rozkazu! Może generować złe informacje!"
          >&#9888;
        </span>
        <br />
        {{ order.createdAt ? 'Dodano: ' : 'Zaktualizowano: ' }}
        {{ new Date(order.createdAt || order.updatedAt || 0).toLocaleString('pl-PL') }}

        <hr />

        <div class="buttons">
          <button class="g-button action" @click="selectLocalOrder(order)">Wybierz</button>
          <button class="g-button action" @click="removeOrder(order)">Usuń</button>
        </div>
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
      ORDER_VERSION: import.meta.env['VITE_APP_ORDER_VERSION']
    };
  },

  setup() {
    return {
      store: useStore(),
      localStorage: window.localStorage
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

      if (this.localOrderList.length == 0) this.saveOrderSetting('orderCount', 0);
    }
  },

  computed: {
    sortedOrderList() {
      return this.localOrderList
        .slice()
        .sort((a, b) => (b.createdAt || b.updatedAt!) - (a.createdAt || a.updatedAt!));
    }
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
  }
});
</script>

<style lang="scss" scoped>
@import '../styles/global.scss';

.list {
  &-move,
  &-enter-active,
  &-leave-active {
    transition: all 250ms ease;
  }
  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  &-leave-active {
    position: absolute;
  }
}

.order-list {
  overflow: auto;
}

hr {
  border: 1px solid #aaa;
  height: 0;
}

ul {
  overflow: hidden;
}

h3 {
  position: sticky;
  top: 0;
  z-index: 100;

  margin: 0;
  margin-bottom: 1em;
  text-align: center;

  background-color: $bgColDarker;
  padding: 1em;
  margin-bottom: 0.5em;
}

li {
  text-align: left;
  padding: 1em;
  margin: 0.5em;
  background-color: $bgColDarker;

  cursor: pointer;

  &[selected='true'] {
    outline: 1px solid $accentCol;
  }

  &.no-orders-warning {
    text-align: center;
    font-size: 1.2em;
    cursor: default;
  }
}

.wrong-order-indicator {
  color: $accentCol;
  padding: 0 0.25em;
}

.buttons {
  display: flex;
  gap: 0.5em;
}
</style>
