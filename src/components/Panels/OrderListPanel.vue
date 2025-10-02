<template>
  <section class="order-list">
    <h3>{{ t('order-list.title') }} ({{ storageOrderList.length }})</h3>

    <transition-group name="list" tag="ul">
      <li class="no-orders-warning" v-if="sortedOrderList.length == 0" :key="-1">
        {{ t('order-list.no-saved-orders') }}
      </li>

      <li
        v-for="order in sortedOrderList"
        :selected="order.id == store.chosenLocalOrderId"
        :key="order.id"
      >
        <b class="text--accent">#{{ order.id.split('-')[1] }}&nbsp;</b>
        <b>
          {{
            t('order-list.order-title', {
              trainNo: order.orderData.header.A
            })
          }}
        </b>
        <span
          v-if="!order.orderVersion || order.orderVersion != ORDER_VERSION"
          class="wrong-order-indicator"
          tabindex="0"
          :data-tooltip="t('order-list.warning-deprecated-version')"
          >&#9888;
        </span>

        <div>
          {{
            t('order-list.order-subtitle', [
              order.orderData.instructions
                .filter((v) => v.active)
                .map((v) => v.name)
                .join(', ')
            ])
          }}
        </div>

        <div>
          {{ t(`order-list.order-${order.createdAt ? 'added' : 'updated'}`) }}
          {{ new Date(order.createdAt || order.updatedAt || 0).toLocaleString('pl-PL') }}
        </div>

        <hr />

        <div class="buttons">
          <button class="g-button" @click="selectLocalOrder(order)">
            {{ t('order-list.button-order-select') }}
          </button>
          <button class="g-button" @click="removeOrder(order.id)">
            {{ t('order-list.button-order-remove') }}
          </button>
        </div>
      </li>
    </transition-group>
  </section>
</template>

<script lang="ts" setup>
import { computed, onActivated, onMounted, Reactive, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '../../store/store';
import { IStorageOrderData, LocalStorageOrderLegacy } from '../../types/orderTypes';
import StorageManager from '../../managers/storageManager';

const { t } = useI18n();
const store = useStore();
const storageOrderList = reactive<Reactive<IStorageOrderData[]>>([]);

const ORDER_VERSION = import.meta.env['VITE_APP_ORDER_VERSION'];

function removeOrder(orderId: string) {
  StorageManager.removeValue(orderId);

  if (store.chosenLocalOrderId == orderId) store.chosenLocalOrderId = '';

  const orderIndex = storageOrderList.findIndex((o) => o.id == orderId);
  if (orderIndex != -1) storageOrderList.splice(orderIndex, 1);

  if (storageOrderList.length == 0) StorageManager.setNumericValue('orderCount', 0);
}

function selectLocalOrder(order: IStorageOrderData) {
  Object.entries(order.orderData.header).forEach(([k, v]) => {
    (store.orderData['header'] as any)[k] = v;
  });

  Object.entries(order.orderData.footer).forEach(([k, v]) => {
    (store.orderData['footer'] as any)[k] = v;
  });

  Object.entries(order.orderData.instructions).forEach(([k, v]) => {
    (store.orderData['instructions'] as any)[k] = v;
  });

  store.panelMode = 'OrderMessagePanel';
  store.chosenLocalOrderId = order.id;
}

function isOrderDeprecated(
  order: IStorageOrderData | LocalStorageOrderLegacy
): order is LocalStorageOrderLegacy {
  return 'orderType' in order;
}

const sortedOrderList = computed(() => {
  return storageOrderList
    .slice()
    .sort((a, b) => (b.createdAt || b.updatedAt || 0) - (a.createdAt || a.updatedAt || 0));
});

onActivated(() => {
  const localStorage = window.localStorage;
  const orderList = [];

  let deprecatedOrders = 0;

  for (let key in localStorage) {
    if (!/^order-/g.test(key)) continue;

    const orderObj: IStorageOrderData | LocalStorageOrderLegacy = JSON.parse(localStorage[key]);
    if (!orderObj) continue;

    if (isOrderDeprecated(orderObj)) {
      console.warn(`Deprecated order found with ID: ${orderObj.id}`);
      continue;
    }

    orderList.push(orderObj);
  }

  if (deprecatedOrders != 0) {
  }

  storageOrderList.length = 0;
  storageOrderList.push(...orderList);
});
</script>

<style lang="scss" scoped>
@use '../../styles/colors';

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

  background-color: colors.$bgColDarker;
  padding: 1em;
  margin-bottom: 0.5em;
}

li {
  text-align: left;
  padding: 1em;
  margin: 0.5em;
  background-color: colors.$bgColDarker;

  cursor: pointer;

  &[selected='true'] {
    outline: 1px solid colors.$accentCol;
  }

  &.no-orders-warning {
    text-align: center;
    font-size: 1.2em;
    cursor: default;
  }
}

.wrong-order-indicator {
  color: colors.$accentCol;
  padding: 0 0.25em;
}

.buttons {
  display: flex;
  gap: 0.5em;

  button {
    padding: 0.5em;
    background-color: colors.$bgColLighter;

    &:hover {
      background-color: #666;
    }

    &:focus-visible {
      outline: 2px solid colors.$accentCol;
    }
  }
}
</style>
