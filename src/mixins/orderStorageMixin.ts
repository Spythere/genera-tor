import { defineComponent } from 'vue';
import { useStore } from '../store/store';
import { LocalStorageOrder } from '../types/orderTypes';

export default defineComponent({
  setup() {
    return {
      store: useStore(),
    };
  },

  methods: {
    saveOrderToStorage() {
      let orderObj: LocalStorageOrder = {
        id: '',
        orderType: this.store.chosenOrderType,
        orderBody: {},
        orderFooter: this.store.orderFooter,
        createdAt: Date.now(),
      };

      switch (this.store.chosenOrderType) {
        case 'orderN':
          orderObj['orderBody'] = this.store.orderN;
          break;
        case 'orderS':
          orderObj['orderBody'] = this.store.orderS;
          break;
        case 'orderO':
          orderObj['orderBody'] = this.store.orderO;
          break;

        default:
          break;
      }

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
      orderObj['id'] = `order-${nextOrderCount}`;

      localStorage.setItem('orderCount', `${nextOrderCount}`);
      localStorage.setItem(`order-${nextOrderCount}`, JSON.stringify(orderObj));

      return 1;
    },

    removeLocalOrder(order: LocalStorageOrder) {
      localStorage.removeItem(order.id);
      localStorage.setItem('orderCount', (Number(localStorage.getItem('orderCount')) - 1).toString());
    },

    selectLocalOrder(order: LocalStorageOrder) {
      this.store.chosenOrderType = order.orderType;

      const localOrder = JSON.parse(JSON.stringify(order));
      const localOrderBody = localOrder['orderBody'];
      const localOrderFooter = localOrder['orderFooter'];

      let storeOrderObj;

      switch (order.orderType) {
        case 'orderN':
        case 'orderS':
          storeOrderObj = this.store[order.orderType];
          for (let orderKey in storeOrderObj) {
            for (let propKey in (storeOrderObj as any)[orderKey]) {
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

            for (let prop in orderItem) {
              (storeOrderObj['orderList'][i] as any)[prop] = localOrderBody['orderList'][i][prop];
            }
          }

          break;
      }

      for (let key in this.store.orderFooter) {
        (this.store.orderFooter as any)[key] = localOrderFooter[key];
      }

      this.store.orderMode = 'OrderMessage';
    },
  },
});
