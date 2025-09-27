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

      this.store.chosenOrderType = localOrder.orderType;
      this.store.chosenLocalOrderId = localOrder.id;
      this.store.panelMode = 'OrderMessage';
    }
  }
});
