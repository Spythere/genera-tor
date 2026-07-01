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
        <b class="text--accent">#{{ order.id.split('-')[2] }}&nbsp;</b>
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
            t(
              'order-list.order-subtitle',
              [
                order.orderData.instructions
                  .filter((v) => v.active)
                  .map((v) => v.name)
                  .join(', ')
              ],
              order.orderData.instructions.filter((v) => v.active).length
            )
          }}
        </div>

        <div class="order-id">ID: {{ getOrderFullId(order.orderData.footer) }}</div>

        <div class="order-date" v-if="order.createdAt">
          {{ t('order-list.order-added') }}
          {{ new Date(order.createdAt).toLocaleString(locale) }}
        </div>

        <div class="order-date" v-if="order.updatedAt">
          {{ t('order-list.order-updated') }}
          {{ new Date(order.updatedAt).toLocaleString(locale) }}
        </div>

        <hr />

        <div class="buttons">
          <button class="g-button icon" @click="selectLocalOrder(order)">
            <NotebookPen :size="18" />
            {{ t('order-list.button-order-select') }}
          </button>

          <button class="g-button icon" @click="removeOrder(order.id)">
            <Trash :size="18" />
            {{ t('order-list.button-order-remove') }}
          </button>
        </div>
      </li>
    </transition-group>
  </section>
</template>

<script lang="ts" setup>
import { computed, onActivated, Reactive, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '../../store/store';
import { IStorageOrderData, LocalStorageOrderLegacy } from '../../types/orderTypes';
import StorageManager from '../../managers/storageManager';
import { NotebookPen, Trash } from '@lucide/vue';
import { getOrderFullId } from '../../utils/orderUtils';

const { t, locale } = useI18n();
const store = useStore();
const storageOrderList = reactive<Reactive<IStorageOrderData[]>>([]);

const ORDER_VERSION = import.meta.env['VITE_APP_ORDER_VERSION'];

function removeOrder(orderId: string) {
  StorageManager.removeValue(orderId);

  if (store.chosenLocalOrderId == orderId) store.chosenLocalOrderId = '';

  const orderIndex = storageOrderList.findIndex((o) => o.id == orderId);
  if (orderIndex != -1) storageOrderList.splice(orderIndex, 1);

  if (storageOrderList.length == 0) StorageManager.setNumericValue('orderCountV3', 0);
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
  const orderList: IStorageOrderData[] = [];

  let deprecatedOrders: string[] = [];
  for (let key in localStorage) {
    if (!/^order-/g.test(key)) continue;

    const orderObj: IStorageOrderData | LocalStorageOrderLegacy = JSON.parse(localStorage[key]);
    if (!orderObj) continue;

    if (isOrderDeprecated(orderObj)) {
      console.warn(`Deprecated order found with ID: ${orderObj.id}`);
      deprecatedOrders.push(key);
      continue;
    }

    orderList.push(orderObj);
  }

  storageOrderList.length = 0;
  storageOrderList.push(...orderList);

  if (deprecatedOrders.length > 0) {
    window.alert(
      t('order-list.warning-removed-deprecated-orders', { count: deprecatedOrders.length })
    );

    deprecatedOrders.forEach((orderKey) => StorageManager.removeValue(orderKey));
    StorageManager.removeValue('orderCount');
  }
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
    width: 100%;
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
  position: relative;
  list-style: none;
  padding: 0;
  margin: 0;
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

.order-date {
  color: #aaa;
}

.order-id {
  color: #ccc;
  margin-top: 0.5em;
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
    gap: 0.5em;

    &:hover {
      background-color: #666;
    }

    &:focus-visible {
      outline: 2px solid colors.$accentCol;
    }
  }
}
</style>
