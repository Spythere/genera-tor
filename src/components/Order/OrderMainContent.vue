<template>
  <table class="order-table">
    <tbody>
      <tr>
        <td width="10%" class="order-instruction-number">
          <label class="order-instruction-checkbox">
            <input type="checkbox" v-model="store.orderData.instructions[0].active" />
            <div class="checkmark"></div>
            <div class="text">22</div>
          </label>
        </td>

        <td>
          <b>
            {{ t('order.22.text') }}
          </b>
        </td>

        <td width="5%" class="order-instruction-number">
          <label class="order-instruction-checkbox">
            <input type="checkbox" v-model="store.orderData.instructions[1].active" />
            <div class="checkmark"></div>
            <div class="text">99</div>
          </label>
        </td>

        <td width="45%">
          <div>
            <b>{{ t('order.99.text') }}</b>
          </div>
          <input
            type="text"
            class="order-input"
            id="input-99-x1"
            v-model="store.orderData.instructions[1].inputFields!.x1"
          />
          <label for="input-99-x1" class="order-input-label">{{ t('order.99.x1') }}</label>
        </td>
      </tr>

      <!-- From 21.10 -->
      <tr v-for="(instruction, i) in store.orderData.instructions.slice(2)">
        <td width="10%" class="order-instruction-number">
          <label class="order-instruction-checkbox">
            <input type="checkbox" v-model="instruction.active" />
            <div class="checkmark"></div>
            <div class="text">{{ instruction.name }}</div>
          </label>
        </td>

        <td colspan="3">
          <i18n-t :keypath="`order.${instruction.key}.text`" tag="div">
            <template v-slot:bold1>
              <b>{{ t(`order.${instruction.key}.bold1`) }}</b>
            </template>

            <template v-slot:bold2>
              <b>{{ t(`order.${instruction.key}.bold2`) }}</b>
            </template>

            <template v-slot:underline1>
              <u>{{ t(`order.${instruction.key}.underline1`) }}</u>
            </template>

            <template v-slot:highlight1>
              <u>
                <b>{{ t(`order.${instruction.key}.highlight1`) }}</b>
              </u>
            </template>

            <template v-slot:highlight2>
              <u>
                <b>{{ t(`order.${instruction.key}.highlight2`) }}</b>
              </u>
            </template>

            <template v-slot:br>
              <br />
            </template>

            <template v-slot:[fieldKey] v-for="(_, fieldKey) in instruction.inputFields">
              <input
                class="order-input"
                :id="`order-${instruction.key}-${fieldKey}`"
                :style="{ width: calculateInputWidthByFieldName(fieldKey) }"
                v-model="instruction.inputFields[fieldKey]"
                :placeholder="t(`order.${instruction.key}.${fieldKey}`)"
              />
            </template>

            <template v-for="(selectField, fieldKey) in instruction.selectFields" v-slot:[fieldKey]>
              <select
                class="order-select"
                :id="`order-${instruction.key}-${fieldKey}`"
                v-model="instruction.inputFields[fieldKey]"
              >
                <option :value="value" v-for="value in selectField.options">
                  {{ t(`order.${instruction.key}.${value}`) }}
                </option>
              </select>
              <!-- <input
                class="order-input"
                :id="`order-${instruction.key}-${fieldKey}`"
                v-model="instruction.optionFields[fieldKey]"
                :placeholder="t(`order.${instruction.key}.${fieldKey}`)"
              /> -->
            </template>
          </i18n-t>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useStore } from '../../store/store';
import { onMounted, watch } from 'vue';

const { t } = useI18n();
const store = useStore();

onMounted(() => {
  generateMessage();
});

watch(
  store.orderData,
  () => {
    generateMessage();
  },
  { deep: true }
);

function calculateInputWidthByFieldName(fieldName: string) {
  if (fieldName.startsWith('track')) return '90px';
  else if (fieldName.startsWith('signalbox')) return '150px';
  else if (fieldName.startsWith('signal')) return '150px';

  return '100px';
}

function generateMessage() {
  let messageHtml = `<b>${t('order.title')}</b><br />`;
  messageHtml += '-------------<br />';

  const headerData = store.orderData['header'];

  Object.entries(headerData).forEach(([key, value]) => {
    messageHtml += `${t('order.header.' + key)}: ${value}<br />`;
  });

  messageHtml += '-------------<br />';

  const instructions = store.orderData['instructions'];

  Object.entries(instructions).forEach(([i, value]) => {
    if (value.active) {
      if (value.inputFields) {
        const localeKey = `order.${value.key}`;

        const messageValues = Object.values(value.inputFields).map((fieldKey: string) => {
          if (fieldKey.startsWith('select')) return t(`order.${value.key}.${fieldKey}`);

          return fieldKey || '---';
        });

        messageHtml += `<b>[${value.name}]</b> ${t(
          localeKey + '.message-html',
          messageValues
        )}<br />`;
      } else {
        messageHtml += `<b>[${i}]</b> ${t('order.' + i + '.message-html')}<br />`;
      }
    }
  });

  store.orderMessage = messageHtml;
}
</script>

<style lang="scss" scoped>
.order-table {
  border-top: none;
  border-bottom: none;

  td {
    padding: 0.25em;
  }

  tr:not(:first-child) td {
    padding: 0.25em 1em;
    line-height: 2em;
    text-align: justify;
  }
}

.order-instruction-number {
  position: relative;
  height: 65px;

  & > label {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    padding: 0.5em;
  }
}
</style>
