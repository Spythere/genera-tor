import { defineComponent } from 'vue';
import { useStore } from '../store/store';
import { LocalStorageOrder } from '../types/orderTypes';

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
        createdAt: Date.now()
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
        updatedAt: Date.now()
      };

      window.localStorage.setItem(this.store.chosenLocalOrderId, JSON.stringify(orderObj));

      return 1;
    },

    removeLocalOrder(order: LocalStorageOrder) {
      localStorage.removeItem(order.id);

      if (this.store.chosenLocalOrderId == order.id) this.store.chosenLocalOrderId = '';
      // localStorage.setItem('orderCount', (Number(localStorage.getItem('orderCount')) - 1).toString());
    },

    selectLocalOrder(order: LocalStorageOrder) {
      this.store.chosenOrderType = order.orderType;
      this.store.chosenLocalOrderId = order.id;

      const localOrder = JSON.parse(JSON.stringify(order));
      const localOrderBody = localOrder['orderBody'];
      const localOrderFooter = localOrder['orderFooter'];

      let storeOrderObj;

      switch (order.orderType) {
        case 'orderN':
        case 'orderS':
          storeOrderObj = this.store[order.orderType];
          for (const orderKey in storeOrderObj) {
            for (const propKey in (storeOrderObj as any)[orderKey]) {
              (storeOrderObj as any)[orderKey][propKey] = localOrderBody[orderKey][propKey];
            }
          }

          break;
        case 'orderO':
          storeOrderObj = this.store[order.orderType];

          storeOrderObj['other'] = localOrderBody['other'];
          storeOrderObj['header']['date'] = localOrderBody['header']['date'];
          storeOrderObj['header']['orderNo'] = localOrderBody['header']['orderNo'];
          storeOrderObj['header']['trainNo'] = localOrderBody['header']['trainNo'];

          for (let i = 0; i < storeOrderObj['orderList'].length; i++) {
            const orderItem = storeOrderObj['orderList'][i];

            for (const prop in orderItem) {
              (storeOrderObj['orderList'][i] as any)[prop] = localOrderBody['orderList'][i][prop];
            }
          }

          break;
      }

      for (const key in this.store.orderFooter) {
        (this.store.orderFooter as any)[key] = localOrderFooter[key];
      }

      this.store.orderMode = 'OrderMessage';
    }
  }
});
