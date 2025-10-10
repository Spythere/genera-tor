<template>
  <section class="order-message">
    <h3>{{ $t('order-message.title') }}</h3>

    <div class="message_body" v-html="orderMessagePreview"></div>
    <p class="message_info">
      {{ $t('order-message.info') }}
    </p>

    <div class="message_actions">
      <button class="g-button action icon" @click="saveOrder">
        <LucideSave />
        {{ $t('order-message.button-save') }}
      </button>

      <button class="g-button action icon" @click="copyMessage">
        <LucideCopy />
        {{ $t('order-message.button-copy') }}
      </button>

      <button
        class="g-button action icon"
        :data-disabled="!store.chosenLocalOrderId"
        @click="updateOrder"
      >
        <LucidePencil />
        {{ $t('order-message.button-update') }}
        <span class="text--accent">
          {{ store.chosenLocalOrderId && `#${store.chosenLocalOrderId.split('-')[1]}` }}
        </span>
      </button>

      <button class="g-button action icon" @click="resetOrder">
        <LucideRotateCcw />
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
import { useI18n } from 'vue-i18n';

import { LucideCopy, LucidePencil, LucideRotateCcw, LucideSave } from 'lucide-vue-next';
import { useStore } from '../../store/store';
import { IOrderHeader, IOrderFooter, IStorageOrderData } from '../../types/orderTypes';
import StorageManager from '../../managers/storageManager';
import { getOrderFullId } from '../../utils/orderUtils';

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

function checkConflicts() {
  if (
    store.orderData.instructions
      .filter((i) => i.key == '2110' || i.key == '2115')
      .every((i) => i.active)
  ) {
    showActionMonit(
      t('order-message.warning-conflicting-instructions', ['21.10', '21.15']),
      'warning'
    );
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
    showActionMonit(t('order-message.warning-fill-missing'), 'warning');
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

          if (fieldValue.trim() == '') {
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
    showActionMonit(t('order-message.warning-add-instruction'), 'warning');
    return false;
  }

  if (!hasAllInputsFilled) {
    showActionMonit(t('order-message.warning-fill-inputs'), 'warning');
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
    return showActionMonit(t('order-message.warning-outdated-clipboard'), 'warning');

  const areFieldsCorrect = areOrderFieldsCorrect();

  if (!areFieldsCorrect) return;

  const simulatorChatMessage = '\n' + orderMessagePreview.value.replace(/<br \/>/g, '\n');

  navigator.clipboard.writeText(simulatorChatMessage);

  if (incrementOnCopy.value) incrementOrderNo();

  showActionMonit(t('order-message.success-copy-html'), 'success');
}

function saveOrder() {
  if (!hasHeaderFieldsComplete()) {
    showActionMonit(`${t('order-message.warning-fill-top-save')}`, 'warning');
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

  const prevLocalOrder = StorageManager.getValue(`order-${localOrderCount}`);

  if (prevLocalOrder) {
    try {
      const prevOrderObj = JSON.parse(prevLocalOrder) as IStorageOrderData;

      if (JSON.stringify(prevOrderObj.orderData) == JSON.stringify(orderDataToSave.orderData)) {
        showActionMonit(t('order-message.warning-order-identical'), 'warning');
        return;
      }
    } catch (error) {
      console.error(
        `Ups! An error occured when trying to parse previous local order (count: ${localOrderCount})`
      );
    }
  }

  const nextOrderCount = localOrderCount + 1;
  const nextOrderId = `order-${nextOrderCount}`;
  orderDataToSave['id'] = nextOrderId;

  StorageManager.setNumericValue('orderCount', nextOrderCount);
  StorageManager.setValue(nextOrderId, JSON.stringify(orderDataToSave));

  store.chosenLocalOrderId = nextOrderId;
  showActionMonit(t('order-message.success-save-html'), 'success');

  if (incrementOnSave.value) incrementOrderNo();
}

function updateOrder() {
  if (!store.chosenLocalOrderId) {
    showActionMonit(t('order-message.warning-no-order-selected'), 'warning');
    return;
  }

  if (!hasHeaderFieldsComplete()) {
    showActionMonit(t('order-message.warning-fill-top-update'), 'warning');
    return;
  }

  const localOrder = window.localStorage.getItem(store.chosenLocalOrderId);

  if (!localOrder) {
    showActionMonit(t('order-message.error-update'), 'warning');
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

function resetOrder() {
  Object.keys(store.orderData.header).forEach((k) => {
    store.orderData['header'][k as keyof IOrderHeader] = '';
  });

  Object.keys(store.orderData.footer).forEach((k) => {
    store.orderData['footer'][k as keyof IOrderFooter] = '';
  });

  store.orderData.instructions.forEach((instruction) => {
    instruction.active = false;

    Object.keys(instruction.inputFields).forEach((k) => {
      instruction.inputFields[k] = '';
    });

    if (instruction.listFields) {
      instruction.listFields.forEach((field) => {
        Object.keys(field.values).forEach((k) => {
          field.active = false;
          field.values[k] = '';
        });
      });
    }
  });
}
</script>

<style lang="scss" scoped>
@use '../../styles/colors';

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
