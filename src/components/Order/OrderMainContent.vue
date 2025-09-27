<template>
  <table class="order-table">
    <tbody>
      <!-- First row - 22 & 99 instructions -->
      <tr>
        <td width="10%" class="order-instruction-number">
          <OrderRowCheckbox :row-index="0" />
        </td>

        <td>
          <b>
            {{ t('order.22.text') }}
          </b>
        </td>

        <td width="5%" class="order-instruction-number">
          <OrderRowCheckbox :row-index="1" />
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
      <tr
        v-for="(instruction, i) in store.orderData.instructions.slice(2)"
        :style="{
          'background-color': instruction.key.startsWith('218') ? '#eeece1' : 'inherit'
        }"
      >
        <td width="10%" class="order-instruction-number">
          <OrderRowCheckbox :row-index="i + 2" />
        </td>

        <td colspan="3">
          <i18n-t :keypath="`order.${instruction.key}.text`" tag="div" scope="global">
            <!-- For text directives (<b>, <u>, <br> etc.) -->
            <template v-slot:[directive] v-for="directive in instruction.textDirectives">
              <b v-if="directive.startsWith('bold')">
                {{ t(`order.${instruction.key}.${directive}`) }}
              </b>
              <u v-else-if="directive.startsWith('underline')">
                {{ t(`order.${instruction.key}.${directive}`) }}
              </u>
              <u v-else-if="directive.startsWith('highlight')">
                <b>{{ t(`order.${instruction.key}.${directive}`) }}</b>
              </u>
              <br v-if="directive.startsWith('br')" />
            </template>

            <!-- For all instructions with input fields -->
            <template v-slot:[fieldKey] v-for="(_, fieldKey) in instruction.inputFields">
              <textarea
                v-if="fieldKey == 'other2320'"
                v-model="instruction.inputFields[fieldKey]"
                class="order-textarea"
                :id="`order-${instruction.key}-${fieldKey}`"
                :placeholder="t(`order.${instruction.key}.${fieldKey}`)"
                autocomplete="off"
              ></textarea>

              <label class="order-input-box" v-else>
                <input
                  v-model="instruction.inputFields[fieldKey]"
                  class="order-input"
                  :id="`order-${instruction.key}-${fieldKey}`"
                  :style="{ width: calculateInputWidthByFieldName(fieldKey) }"
                  autocomplete="off"
                />
                <span>{{ t(`order.${instruction.key}.${fieldKey}`) }}</span>
              </label>
            </template>

            <!-- For all instructions with select fields -->
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
            </template>

            <!-- For 23.10 only -->
            <template v-slot:text-list v-if="instruction.key == '2310'">
              <i18n-t
                v-for="(listItem, i) in instruction.listFields"
                :keypath="`order.${instruction.key}.text-list`"
                tag="div"
                scope="global"
              >
                <template v-slot:bold>
                  <label>
                    <input
                      v-model="listItem.active"
                      type="checkbox"
                      :id="`order-${instruction.key}-checkbox`"
                    />
                    &nbsp;
                    <b>{{ t(`order.${instruction.key}.bold`, [i + 1]) }}</b>
                  </label>
                </template>

                <template v-slot:v>
                  <br />
                  <span style="font-size: 1.5em">v</span>
                </template>

                <template v-slot:[fieldKey] v-for="(_, fieldKey, j) in listItem.values">
                  <label class="order-input-box">
                    <input
                      v-model="instruction.listFields![i]['values'][fieldKey]"
                      class="order-input"
                      :id="`order-${instruction.key}-${fieldKey}-${i}`"
                      :style="{ width: calculateInputWidthByFieldName(fieldKey) }"
                      autocomplete="off"
                    />
                    <span>{{
                      t(`order.${instruction.key}.${fieldKey}`, [j + 1 + 6 * i, 91 + i])
                    }}</span>
                  </label>
                </template>
              </i18n-t>
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
import OrderRowCheckbox from './OrderRowCheckbox.vue';

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
  else if (fieldName.startsWith('signalbox')) return '130px';
  else if (fieldName.startsWith('signal')) return '150px';
  else if (fieldName.startsWith('train')) return '150px';
  else if (fieldName.startsWith('other2320')) return '100%';
  else if (fieldName.startsWith('other')) return '200px';

  return '100px';
}

function generateMessage() {
  let messageHtml = `<b>${t('order.title')}</b><br />`;
  messageHtml += '-------------<br />';

  const headerData = store.orderData['header'];

  messageHtml += `${t('order.header.A')}: ${headerData['A']}<br />`;
  messageHtml += `${t('order.header.B')}: ${headerData['B']}<br />`;
  messageHtml += `${t('order.header.C')}: ${headerData['C']}<br />`;
  messageHtml += `${t('order.header.D')}: ${headerData['D']}<br />`;

  const instructions = store.orderData['instructions'];

  Object.entries(instructions).forEach(([i, value]) => {
    if (value.active) {
      if (value.inputFields) {
        const localeKey = `order.${value.key}`;

        const messageValues = Object.values(value.inputFields).map((fieldKey: string) => {
          if (fieldKey.startsWith('select')) return t(`order.${value.key}.${fieldKey}`);

          return fieldKey || '---';
        });

        messageHtml += '-------------<br />';

        messageHtml += `<b>[${value.name}]</b> ${t(
          localeKey + '.message-html',
          messageValues
        )}<br />`;

        if (value.key == '2310' && value.listFields) {
          messageHtml += '<br />';
          value.listFields.forEach((listItem, i) => {
            if (!listItem.active) return;

            const listItemValues = Object.values(listItem.values).map((itemFieldKey) => {
              return itemFieldKey || '---';
            });

            messageHtml += t(`${localeKey}.message-html-list`, [i + 1, ...listItemValues]);
            messageHtml += '<br />';
          });
        }
      } else {
        messageHtml += `<b>[${i}]</b> ${t('order.' + i + '.message-html')}<br />`;
      }
    }
  });

  const footerData = store.orderData['footer'];

  messageHtml += '-------------<br />';
  messageHtml += `${t('order.footer.V')}: ${footerData['V'] || '---'} | `;
  messageHtml += `${t('order.footer.W')}: ${footerData['W'] || '---'}<br />`;
  messageHtml += `${t('order.footer.Y')}: ${footerData['Y'] || '---'} | `;
  messageHtml += `${t('order.footer.Z')}: ${footerData['Z'] || '---'}<br />`;

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
  height: 60px;

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
