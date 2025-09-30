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
      <div
        class="action_monit"
        v-if="actionMonit.content"
        v-html="actionMonit.content"
        :class="{
          'text--warn': actionMonit.type == 'warning'
        }"
      ></div>
    </transition>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, Reactive, reactive, ref, watch } from 'vue';
import { useStore } from '../store/store';
import { useI18n } from 'vue-i18n';

import StorageManager from '../managers/storageManager';
import { currentFormattedHours, currentFormattedMinutes } from '../utils/dateUtils';
import { IStorageOrderData } from '../types/orderTypes';

type TActionMonitType = 'warning' | 'info' | 'success';

interface IActionMonit {
  type: TActionMonitType;
  content: string;
  timeoutId: number | null;
}

const { t } = useI18n();
const store = useStore();

const actionMonit: Reactive<IActionMonit> = reactive({
  visible: false,
  type: 'info',
  content: '',
  timeoutId: null
});

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
    store.orderData.header.B = new Date().toISOString().split('T')[0];

    store.orderData.footer.Y = new Date().toLocaleTimeString('pl-PL', {
      hour: 'numeric',
      minute: '2-digit'
    });
  }
});

function onCheckboxChange(e: Event) {
  const checkbox = e.target as HTMLInputElement;
  StorageManager.setBooleanValue(checkbox.id, checkbox.checked);
}

function showActionMonit(content: string, type: TActionMonitType) {
  if (actionMonit.timeoutId != null) {
    actionMonit.content = '';

    clearTimeout(actionMonit.timeoutId);

    setTimeout(() => {
      actionMonit.content = content;
      actionMonit.type = type;

      actionMonit.timeoutId = window.setTimeout(() => {
        actionMonit.content = '';
        actionMonit.timeoutId = null;
      }, 5000);
    }, 100);

    return;
  }

  actionMonit.content = content;
  actionMonit.type = type;

  actionMonit.timeoutId = window.setTimeout(() => {
    actionMonit.content = '';
    actionMonit.timeoutId = null;
  }, 5000);
}

function verifyOrderFields() {
  const { header, footer } = store.orderData;

  const fieldsToCorrect: string[] = [];

  Object.entries(header).forEach(([k, v]) => {
    if (v.trim().length == 0) {
      fieldsToCorrect.push(k);
    }
  });

  Object.entries(footer).forEach(([k, v]) => {
    if (v.trim().length == 0) {
      fieldsToCorrect.push(k);
    }
  });

  return fieldsToCorrect;
}

// TODO
function incrementOrderNo() {
  // store.orderData. = (Number(order.header.orderNo) + 1).toString();
}

function copyMessage() {
  if (!navigator.clipboard)
    return showActionMonit(t('order-message.warning-outdated-clipboard'), 'warning');

  // const hasAtLeastOneRow = /(\[ \d \])/g.test(orderMessagePreview.value);
  // const hasAllInputsFilled = !/_/g.test(store.orderMessage);

  // if (!hasAllInputsFilled)
  //   return showActionMonit(
  //     `${t('order-message.warning-fill-inputs')}`
  //   );
  // if (!hasAtLeastOneRow)
  //   return showActionMonit(
  //     `${t('order-message.warning-add-rows')}`
  //   );

  const fieldsToCorrect = verifyOrderFields();

  if (fieldsToCorrect.length > 0)
    return showActionMonit(t('order-message.warning-fill-missing'), 'warning');

  navigator.clipboard.writeText(orderMessagePreview.value);

  if (incrementOnCopy) incrementOrderNo();

  showActionMonit(t('order-message.success-copy-html'), 'success');
}

function saveOrder() {
  const noHeaderInfo = Object.values(store.orderData.header).some((v) => {
    return v.trim().length == 0;
  });

  if (noHeaderInfo) {
    showActionMonit(`${t('order-message.warning-fill-top')}`, 'warning');
    return;
  }

  const orderDataToSave: IStorageOrderData = {
    id: '',
    createdAt: Date.now(),
    orderVersion: import.meta.env['VITE_APP_ORDER_VERSION'] || '3',
    orderData: store.orderData
  };

  const localOrderCount = StorageManager.getNumericValue('orderCount') || 0;

  if (localOrderCount == 0) StorageManager.setNumericValue('orderCount', 0);

  const prevLocalOrder = StorageManager.getValue(`order-${Number(localOrderCount)}`);

  if (prevLocalOrder && prevLocalOrder == JSON.stringify(orderDataToSave)) {
    showActionMonit(t('order-message.warning-order-identical'), 'warning');
    return;
  }

  const nextOrderCount = localOrderCount + 1;
  const nextOrderId = `order-${nextOrderCount}`;
  orderDataToSave['id'] = nextOrderId;

  StorageManager.setNumericValue('orderCount', nextOrderCount);
  StorageManager.setValue(nextOrderId, JSON.stringify(orderDataToSave));

  store.chosenLocalOrderId = nextOrderId;
  showActionMonit(t('order-message.success-save-html'), 'success');

  if (incrementOnSave) incrementOrderNo();
}

function updateOrder() {
  if (!store.chosenLocalOrderId) {
    showActionMonit(`${t('order-message.warning-no-order-selected')}`, 'warning');

    return;
  }

  const localOrder = window.localStorage.getItem(store.chosenLocalOrderId);

  if (!localOrder) {
    showActionMonit(`${t('order-message.error-update')}`, 'warning');
    return;
  }

  const orderDataToUpdate: IStorageOrderData = {
    id: store.chosenLocalOrderId,
    orderData: store.orderData,
    updatedAt: Date.now(),
    orderVersion: import.meta.env['VITE_APP_ORDER_VERSION'] || '3'
  };

  window.localStorage.setItem(store.chosenLocalOrderId, JSON.stringify(orderDataToUpdate));
  showActionMonit(t('order-message.success-update-html'), 'success');
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
