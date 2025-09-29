<template>
  <section class="order-message">
    <h3>{{ $t('order-message.title') }}</h3>

    <div class="message_body" v-html="orderMessagePreview"></div>
    <p class="message_info">
      {{ $t('order-message.info') }}
    </p>

    <div class="message_actions">
      <button class="g-button action" @click="saveOrder">
        {{ $t('order-message.button-save') }}
      </button>
      <button class="g-button action" @click="copyMessage">
        {{ $t('order-message.button-copy') }}
      </button>
      <button
        class="g-button action"
        :data-disabled="!store.chosenLocalOrderId"
        @click="updateOrder"
      >
        {{ $t('order-message.button-update') }}
        <span class="text--accent"
          >{{ store.chosenLocalOrderId && `#${store.chosenLocalOrderId.split('-')[1]}` }}
        </span>
      </button>
    </div>

    <div class="message_checkboxes">
      <label for="copy-increment" class="g-checkbox">
        <input
          type="checkbox"
          name="copy-increment"
          id="copy-increment"
          v-model="incrementOnCopy"
          @change="onCheckboxChange"
        />
        <span>{{ $t('order-options.update-number-on-copy') }}</span>
      </label>

      <label for="save-increment" class="g-checkbox">
        <input
          type="checkbox"
          name="save-increment"
          id="save-increment"
          v-model="incrementOnSave"
          @change="onCheckboxChange"
        />
        <span>{{ $t('order-options.update-number-on-save') }}</span>
      </label>

      <label for="update-date" class="g-checkbox">
        <input
          type="checkbox"
          name="update-date"
          id="update-date"
          v-model="updateDate"
          @change="onCheckboxChange"
        />
        <span>{{ $t('order-options.update-hours') }}</span>
      </label>
    </div>

    <transition name="monit-anim">
      <div class="action_monit" v-if="actionMonit" v-html="actionMonit"></div>
    </transition>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from '../store/store';

import { currentFormattedHours, currentFormattedMinutes } from '../utils/dateUtils';
import StorageManager from '../managers/storageManager';
import { LocalStorageOrderLegacy } from '../types/orderTypes';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useStore();

const actionMonit = ref('');
const monitTimeout = ref(0);

const incrementOnSave = ref(true);
const incrementOnCopy = ref(true);
const updateDate = ref(true);

onMounted(() => {
  incrementOnSave.value = StorageManager.getBooleanValue('save-increment');
  incrementOnCopy.value = StorageManager.getBooleanValue('copy-increment');
  updateDate.value = StorageManager.getBooleanValue('update-date');
});

const orderMessagePreview = computed(() => store.orderMessage);

watch(orderMessagePreview, () => {
  if (updateDate.value == true) {
    store.orderFooter['hour'] = currentFormattedHours();
    store.orderFooter['minutes'] = currentFormattedMinutes();
  }
});

function onCheckboxChange(e: Event) {
  const checkbox = e.target as HTMLInputElement;
  StorageManager.setBooleanValue(checkbox.id, checkbox.checked);
}

function showActionMonit(text: string) {
  if (monitTimeout.value) {
    actionMonit.value = '';
    clearTimeout(monitTimeout.value);

    // setTimeout(() => {
    actionMonit.value = text;

    monitTimeout.value = window.setTimeout(() => {
      actionMonit.value = '';
    }, 5000);
    // }, 300);

    return;
  }

  actionMonit.value = text;

  monitTimeout.value = window.setTimeout(() => {
    actionMonit.value = '';
  }, 5000);
}

// TODO
function incrementOrderNo() {
  // store.orderData.header.
  // order.header.orderNo = (Number(order.header.orderNo) + 1).toString();
}

function copyMessage() {
  if (!navigator.clipboard) return showActionMonit(t('order-message.warning-outdated-clipboard'));

  const hasAtLeastOneRow = /(\[ \d \])/g.test(orderMessagePreview.value);
  const hasAllInputsFilled = !/_/g.test(store.orderMessage);

  if (!hasAllInputsFilled)
    return showActionMonit(
      `<span class="text--warn">${t('order-message.warning-fill-inputs')}</span>`
    );
  if (!hasAtLeastOneRow)
    return showActionMonit(
      `<span class="text--warn">${t('order-message.warning-add-rows')}</span>`
    );

  const fieldsToCorrect = verifyOrderFields();

  if (fieldsToCorrect.length > 0)
    return showActionMonit(
      `<span class="text--warn">${t('order-message.warning-fill-footer')} ${fieldsToCorrect.join(
        ', '
      )}</span>`
    );

  navigator.clipboard.writeText(orderMessagePreview.value);

  if (incrementOnCopy) incrementOrderNo();

  showActionMonit(t('order-message.success-copy-html'));
}

function verifyOrderFields() {
  // const header = this.store[this.store.chosenOrderType].header;
  const footer = store.orderFooter;

  const fieldsToCorrect = [];

  // if (!header.orderNo) fieldsToCorrect.push('numer rozkazu');
  // if (!header.trainNo) fieldsToCorrect.push('numer pociągu / manewru');
  // if (!header.date) fieldsToCorrect.push('data');

  if (!footer.stationName) fieldsToCorrect.push('stacja');
  if (!footer.checkpointName) fieldsToCorrect.push('posterunek');
  if (!footer.hour) fieldsToCorrect.push('godzina');
  if (!footer.minutes) fieldsToCorrect.push('minuta');
  if (!footer.dispatcherName && !footer.secondaryDispatcherName)
    fieldsToCorrect.push('dyżurny ruchu (lub z polecenia dyżurnego ruchu)');

  return fieldsToCorrect;
}

function saveOrder() {
  const orderObj: LocalStorageOrderLegacy = {
    id: '',
    orderType: store.chosenOrderType,
    orderBody: store[store.chosenOrderType],
    orderFooter: store.orderFooter,
    createdAt: Date.now(),
    orderVersion: import.meta.env['VITE_APP_ORDER_VERSION'] || '3'
  };

  // const headerInfo = orderObj['orderBody']['header'];

  // if (!headerInfo['orderNo']) return -1;
  // if (!headerInfo['trainNo']) return -1;
  // if (!headerInfo['date']) return -1;

  // No header info: -1
  // showActionMonit(`<span class="text--warn">${t('order-message.warning-fill-top')}</span>`)

  const localStorage = window.localStorage;
  const localOrderCount = localStorage.getItem('orderCount') || '0';

  if (localOrderCount == '0') localStorage.setItem('orderCount', '0');

  const prevLocalOrder = localStorage.getItem(`order-${Number(localOrderCount)}`);

  if (prevLocalOrder && prevLocalOrder == JSON.stringify(orderObj)) {
    showActionMonit(
      `<span class="text--warn">${t('order-message.warning-order-identical')}</span>`
    );
    return;
  }

  const nextOrderCount = Number(localOrderCount) + 1;
  const orderId = `order-${nextOrderCount}`;
  orderObj['id'] = orderId;

  localStorage.setItem('orderCount', `${nextOrderCount}`);
  localStorage.setItem(orderId, JSON.stringify(orderObj));

  store.chosenLocalOrderId = orderId;
  showActionMonit(t('order-message.success-save-html'));

  if (incrementOnSave) incrementOrderNo();
}

function updateOrder() {
  if (!store.chosenLocalOrderId) {
    showActionMonit(
      `<span class="text--warn">${t('order-message.warning-no-order-selected')}</span>`
    );

    return;
  }

  const localOrder = window.localStorage.getItem(store.chosenLocalOrderId);

  if (!localOrder) {
    showActionMonit(`<span class="text--warn">${t('order-message.error-update')}</span>`);
    return;
  }

  const orderObj: LocalStorageOrderLegacy = {
    id: store.chosenLocalOrderId,
    orderType: store.chosenOrderType,
    orderBody: store[store.chosenOrderType],
    orderFooter: store.orderFooter,
    updatedAt: Date.now(),
    orderVersion: import.meta.env['VITE_APP_ORDER_VERSION'] || '1'
  };

  window.localStorage.setItem(store.chosenLocalOrderId, JSON.stringify(orderObj));
  showActionMonit(t('order-message.success-update-html'));
}
</script>

<style lang="scss" scoped>
@use '../styles/colors';

.order-message {
  h3 {
    margin: 0;
    margin-bottom: 1em;
    text-align: center;
  }

  button {
    margin: 0 0.5em;
  }
}

.message_body {
  height: 350px;
  overflow: auto;

  background-color: colors.$bgColLighter;
  color: white;
  text-align: justify;

  border-radius: 0.5em;
  padding: 0.5em;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

.message_info {
  text-align: center;
  color: #ccc;
}

.message_actions {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1em;

  button img {
    height: 2ch;
    vertical-align: text-bottom;
    margin-right: 0.5em;
  }

  button[data-disabled='true'] {
    user-select: none;
    color: #aaa;
  }
}

.message_checkboxes {
  display: flex;
  flex-direction: column;
  margin-top: 1em;
}

.action_monit {
  text-align: center;
  padding: 1.5em;
  font-size: 1.15em;
}

.monit-anim {
  &-enter-active,
  &-leave-active {
    transition: all 100ms ease-in-out;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>
