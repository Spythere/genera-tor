<template>
  <section class="order-message">
    <h3>{{ $t('order-message.title') }}</h3>

    <div class="message_body" v-html="orderMessagePreview"></div>
    <p class="message_info">
      {{ $t('order-message.info') }}
    </p>

    <div class="message_actions">
      <button class="g-button action icon" @click="saveOrder">
        <Save />
        {{ $t('order-message.button-save') }}
      </button>

      <button class="g-button action icon" @click="copyMessage">
        <Copy />
        {{ $t('order-message.button-copy') }}
      </button>

      <button
        class="g-button action icon"
        :data-disabled="!store.chosenLocalOrderId"
        @click="updateOrder"
      >
        <Pencil />
        {{ $t('order-message.button-update') }}
        <span class="text--accent">
          {{ store.chosenLocalOrderId && `#${store.chosenLocalOrderId.split('-')[2]}` }}
        </span>
      </button>

      <button class="g-button action icon" @click="resetOrder">
        <RotateCcw />
        {{ $t('order-message.button-reset') }}
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
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useStore } from '../../store/store';
import { IOrderHeader, IOrderFooter, IStorageOrderData } from '../../types/orderTypes';
import StorageManager from '../../managers/storageManager';
import { createOrderDataObject, getOrderFullId } from '../../utils/orderUtils';
import { usePopupStore } from '../../store/popup';
import { Copy, Pencil, RotateCcw, Save } from '@lucide/vue';

const { t } = useI18n();
const store = useStore();
const popupStore = usePopupStore();

const incrementOnSave = ref(true);
const incrementOnCopy = ref(true);
const updateDate = ref(true);

onMounted(() => {
  loadCheckboxSettings();
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

function loadCheckboxSettings() {
  if (StorageManager.isRegistered('save-increment')) {
    incrementOnSave.value = StorageManager.getBooleanValue('save-increment');
  }

  if (StorageManager.isRegistered('copy-increment')) {
    incrementOnCopy.value = StorageManager.getBooleanValue('copy-increment');
  }

  if (StorageManager.isRegistered('update-date')) {
    updateDate.value = StorageManager.getBooleanValue('update-date');
  }
}

function onCheckboxChange(e: Event) {
  const checkbox = e.target as HTMLInputElement;
  StorageManager.setBooleanValue(checkbox.id, checkbox.checked);
}

function checkConflicts() {
  const activeInstructionKeys = store.orderData.instructions
    .filter((i) => i.active)
    .map((i) => i.key);

  if (
    activeInstructionKeys.includes('22') &&
    !activeInstructionKeys.some((k) => k == '2110' || k == '2115' || k == '2135')
  ) {
    popupStore.showPopup(t('order-message.warning-instruction-22'), 'warning');
    return true;
  }

  if (activeInstructionKeys.includes('2110') && activeInstructionKeys.includes('2115')) {
    popupStore.showPopup(
      t('order-message.warning-conflicting-instructions', ['21.10', '21.15']),
      'warning'
    );
    return true;
  }

  if (activeInstructionKeys.includes('2181') && activeInstructionKeys.includes('2182')) {
    popupStore.showPopup(
      t('order-message.warning-conflicting-instructions', ['21.81', '21.82']),
      'warning'
    );
    return true;
  }

  if (
    !activeInstructionKeys.includes('2180') &&
    activeInstructionKeys.some((k) => k == '2181' || k == '2182' || k == '2183' || k == '2185')
  ) {
    popupStore.showPopup(t('order-message.warning-instruction-2180'), 'warning');
    return true;
  }

  return false;
}

function areOrderFieldsCorrect() {
  const fieldsToCorrect: string[] = [];

  for (let headerKey in store.orderData.header) {
    if (store.orderData.header[headerKey as keyof IOrderHeader].trim() == '') {
      fieldsToCorrect.push(headerKey);
    }
  }

  for (let footerKey in store.orderData.footer) {
    if (store.orderData.footer[footerKey as keyof IOrderFooter].trim() == '') {
      fieldsToCorrect.push(footerKey);
    }
  }

  const areConflicting = checkConflicts();

  if (areConflicting) return false;

  // Header & footer fields check
  if (fieldsToCorrect.length > 0) {
    popupStore.showPopup(t('order-message.warning-fill-missing'), 'warning');
    return false;
  }

  // Active instructions' fields check
  let hasAllInputsFilled = true,
    hasNoActiveInstructions = true;

  for (const instructionKey in store.orderData.instructions) {
    const instruction = store.orderData.instructions[instructionKey];

    if (!instruction.active) continue;

    hasNoActiveInstructions = false;

    for (const fieldKey in instruction.inputFields) {
      const fieldValue = instruction.inputFields[fieldKey];

      if (fieldValue.trim() == '' && !instruction.optionalFieldNames.includes(fieldKey)) {
        hasAllInputsFilled = false;
        break;
      }
    }

    if (instruction.listFields) {
      let hasAtLeastOneActive = false;

      for (const listFieldKey in instruction.listFields) {
        const listField = instruction.listFields[listFieldKey];

        if (listField.active == false) continue;

        hasAtLeastOneActive = true;

        for (const fieldKey in listField.values) {
          const fieldValue = listField.values[fieldKey];

          if (fieldValue.trim() == '' && !listField.optionalFieldNames.includes(fieldKey)) {
            hasAllInputsFilled = false;
            break;
          }
        }
      }

      if (!hasAtLeastOneActive) {
        hasAllInputsFilled = false;
        break;
      }
    }
  }

  // Active instructions check
  if (hasNoActiveInstructions) {
    popupStore.showPopup(t('order-message.warning-add-instruction'), 'warning');
    return false;
  }

  if (!hasAllInputsFilled) {
    popupStore.showPopup(t('order-message.warning-fill-inputs'), 'warning');
    return false;
  }

  return true;
}

function hasHeaderFieldsComplete() {
  return Object.values(store.orderData.header).every((v) => {
    return v.trim().length != 0;
  });
}

function incrementOrderNo() {
  const idData = store.orderData.footer.Z.split('-');

  if (idData.length == 4) {
    const sceneryHash = idData[2];
    let orderNumber = Number(idData[1]) || 0;

    store.orderData.footer.Z = getOrderFullId(++orderNumber, sceneryHash);
  }
}

function copyMessage() {
  if (!navigator.clipboard)
    return popupStore.showPopup(t('order-message.warning-outdated-clipboard'), 'warning');

  const areFieldsCorrect = areOrderFieldsCorrect();

  if (!areFieldsCorrect) return;

  const simulatorChatMessage = '\n' + orderMessagePreview.value.replace(/<br \/>/g, '\n');

  navigator.clipboard.writeText(simulatorChatMessage);

  if (incrementOnCopy.value) incrementOrderNo();

  popupStore.showPopup(t('order-message.success-copy-html', [store.orderData.footer.Z]), 'success');
}

function saveOrder() {
  if (!hasHeaderFieldsComplete()) {
    popupStore.showPopup(`${t('order-message.warning-fill-top-save')}`, 'warning');
    return;
  }

  const orderDataToSave: IStorageOrderData = {
    id: '',
    createdAt: Date.now(),
    orderVersion: import.meta.env['VITE_APP_ORDER_VERSION'] || '3',
    orderData: store.orderData
  };

  const localOrderCount = StorageManager.getNumericValue('orderCountV3') || 0;

  if (localOrderCount == 0) StorageManager.setNumericValue('orderCountV3', 0);

  const prevLocalOrder = StorageManager.getValue(`order-v3-${localOrderCount}`);

  const nextOrderCount = localOrderCount + 1;
  const nextOrderId = `order-v3-${nextOrderCount}`;
  orderDataToSave['id'] = nextOrderId;

  if (prevLocalOrder) {
    try {
      const prevOrderObj = JSON.parse(prevLocalOrder) as IStorageOrderData;

      if (JSON.stringify(prevOrderObj.orderData) == JSON.stringify(orderDataToSave.orderData)) {
        popupStore.showPopup(t('order-message.warning-order-identical'), 'warning');
        return;
      }
    } catch (error) {
      console.error(
        `Ups! An error occured when trying to parse previous local order (count: ${localOrderCount})`
      );
    }
  }

  StorageManager.setNumericValue('orderCountV3', nextOrderCount);
  StorageManager.setValue(nextOrderId, JSON.stringify(orderDataToSave));

  store.chosenLocalOrderId = nextOrderId;
  popupStore.showPopup(t('order-message.success-save-html', [store.orderData.footer.Z]), 'success');

  if (incrementOnSave.value) incrementOrderNo();
}

function updateOrder() {
  if (!store.chosenLocalOrderId) {
    popupStore.showPopup(t('order-message.warning-no-order-selected'), 'warning');
    return;
  }

  if (!hasHeaderFieldsComplete()) {
    popupStore.showPopup(t('order-message.warning-fill-top-update'), 'warning');
    return;
  }

  const localOrder = window.localStorage.getItem(store.chosenLocalOrderId);

  if (!localOrder) {
    popupStore.showPopup(t('order-message.error-update'), 'warning');
    return;
  }

  const orderDataToUpdate: IStorageOrderData = {
    id: store.chosenLocalOrderId,
    orderData: store.orderData,
    updatedAt: Date.now(),
    orderVersion: import.meta.env['VITE_APP_ORDER_VERSION'] || '3'
  };

  window.localStorage.setItem(store.chosenLocalOrderId, JSON.stringify(orderDataToUpdate));

  popupStore.showPopup(
    t('order-message.success-update-html', [store.orderData.footer.Z]),
    'success'
  );
}

function resetOrder() {
  const initOrderObject = createOrderDataObject();

  Object.keys(store.orderData.header).forEach((k) => {
    store.orderData['header'][k as keyof IOrderHeader] =
      initOrderObject.header[k as keyof IOrderHeader];
  });

  Object.keys(store.orderData.footer).forEach((k) => {
    store.orderData['footer'][k as keyof IOrderFooter] =
      initOrderObject.footer[k as keyof IOrderFooter];
  });

  store.orderData.instructions.forEach((instruction, i) => {
    instruction.active = false;

    Object.keys(instruction.inputFields).forEach((k) => {
      instruction.inputFields[k] = initOrderObject.instructions[i].inputFields[k];
    });

    if (instruction.listFields) {
      instruction.listFields.forEach((field, j) => {
        field.active = false;

        Object.keys(field.values).forEach((k) => {
          field.values[k] = initOrderObject.instructions[i].listFields![j].values[k];
        });
      });
    }
  });
}
</script>

<style lang="scss" scoped>
@use '../../styles/colors';

.order-message {
  overflow: auto;

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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5em;

  button.icon {
    gap: 0.5em;
  }

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
