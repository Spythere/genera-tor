import { defineComponent } from 'vue';
import { useStore } from '../store/store';
import { LocalStorageOrder } from '../types/orderTypes';

function alertWrongOrderFormat() {
  alert('Wystąpił błąd podczas przetwarzania rozkazu! Informacje mogą być niepoprawne!');
  console.warn('Zły format zapisanego rozkazu!');
}

export default defineComponent({
  setup() {
    return {
      store: useStore()
    };
  },

  methods: {
    saveOrderSetting(key: string, value: string | number | boolean) {
      window.localStorage.setItem(key, value.toString());
    },

    getOrderSetting(key: string) {
      return window.localStorage.getItem(key);
    },

    removeOrderSetting(key: string) {
      window.localStorage.removeItem(key);
    },

    saveLocalOrder() {
      const orderObj: LocalStorageOrder = {
        id: '',
        orderType: this.store.chosenOrderType,
        orderBody: this.store[this.store.chosenOrderType],
        orderFooter: this.store.orderFooter,
        createdAt: Date.now(),
        orderVersion: import.meta.env['VITE_APP_ORDER_VERSION'] || '1'
      };

      const headerInfo = orderObj['orderBody']['header'];

      if (!headerInfo['orderNo']) return -1;
      if (!headerInfo['trainNo']) return -1;
      if (!headerInfo['date']) return -1;

      const localStorage = window.localStorage;
      const localOrderCount = localStorage.getItem('orderCount') || '0';

      if (localOrderCount == '0') localStorage.setItem('orderCount', '0');

      const prevLocalOrder = localStorage.getItem(`order-${Number(localOrderCount)}`);
      if (prevLocalOrder && prevLocalOrder == JSON.stringify(orderObj)) {
        return 0;
      }

      const nextOrderCount = Number(localOrderCount) + 1;
      const orderId = `order-${nextOrderCount}`;
      orderObj['id'] = orderId;

      localStorage.setItem('orderCount', `${nextOrderCount}`);
      localStorage.setItem(orderId, JSON.stringify(orderObj));

      this.store.chosenLocalOrderId = orderId;
      return 1;
    },

    updateLocalOrder() {
      if (!this.store.chosenLocalOrderId) return 0;
      const localOrder = window.localStorage.getItem(this.store.chosenLocalOrderId);

      if (!localOrder) return -1;

      const orderObj: LocalStorageOrder = {
        id: this.store.chosenLocalOrderId,
        orderType: this.store.chosenOrderType,
        orderBody: this.store[this.store.chosenOrderType],
        orderFooter: this.store.orderFooter,
        updatedAt: Date.now(),
        orderVersion: import.meta.env['VITE_APP_ORDER_VERSION'] || '1'
      };

      window.localStorage.setItem(this.store.chosenLocalOrderId, JSON.stringify(orderObj));

      return 1;
    },

    removeLocalOrder(order: LocalStorageOrder) {
      localStorage.removeItem(order.id);

      if (this.store.chosenLocalOrderId == order.id) this.store.chosenLocalOrderId = '';
      // localStorage.setItem('orderCount', (Number(localStorage.getItem('orderCount')) - 1).toString());
    },

    selectLocalOrder(localOrder: LocalStorageOrder) {
      // const localOrder = JSON.parse(JSON.stringify(order));
      const { orderBody: localOrderBody, orderFooter: localOrderFooter } = localOrder;

      this.store[localOrder.orderType].header.date = localOrderBody.header.date;
      this.store[localOrder.orderType].header.orderNo = localOrderBody.header.orderNo;
      this.store[localOrder.orderType].header.trainNo = localOrderBody.header.trainNo;

      if (localOrder.orderType == 'orderN' || localOrder.orderType == 'orderS') {
        const currentOrder = this.store[localOrder.orderType];

        if (localOrderBody.rows.length != currentOrder.rows.length) {
          alertWrongOrderFormat();
          return;
        }

        for (let rowIndex = 0; rowIndex < currentOrder.rows.length; rowIndex++) {
          const row = currentOrder.rows[rowIndex];

          if (localOrderBody.rows[rowIndex] === undefined) {
            alertWrongOrderFormat();
            continue;
          }

          for (const rowProp in row) {
            if (localOrderBody.rows[rowIndex][rowProp] === undefined) {
              alertWrongOrderFormat();
              continue;
            }

            (currentOrder.rows[rowIndex] as any)[rowProp] = localOrderBody.rows[rowIndex][rowProp];
          }
        }
      }

      if (localOrder.orderType == 'orderO') {
        const currentOrder = this.store[localOrder.orderType];

        for (let rowIndex = 0; rowIndex < currentOrder.orderList.length; rowIndex++) {
          const row = currentOrder.orderList[rowIndex];

          if (localOrderBody.orderList[rowIndex] === undefined) {
            alertWrongOrderFormat();
            continue;
          }

          for (const rowProp in row) {
            if (localOrderBody.orderList[rowIndex][rowProp] === undefined) {
              alertWrongOrderFormat();
              continue;
            }

            (currentOrder.orderList[rowIndex] as any)[rowProp] =
              localOrderBody.orderList[rowIndex][rowProp];
          }
        }

        currentOrder.other = localOrderBody.other;
      }

      for (const key in this.store.orderFooter) {
        (this.store.orderFooter as any)[key] = localOrderFooter[key];
      }

      console.log('loading');

      this.store.chosenOrderType = localOrder.orderType;
      this.store.chosenLocalOrderId = localOrder.id;
      this.store.orderMode = 'OrderMessage';
    }
  }
});
