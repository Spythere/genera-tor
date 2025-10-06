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
        :class="{
          'bg-lighter': instruction.key.startsWith('218'),
          dark: store.orderDarkMode
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
                      :id="`order-${instruction.key}-checkbox-${i}`"
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
import OrderRowCheckbox from './OrderRowCheckbox.vue';

const { t } = useI18n();
const store = useStore();

function calculateInputWidthByFieldName(fieldName: string) {
  if (fieldName.startsWith('track')) return '90px';
  else if (fieldName.startsWith('signalbox')) return '130px';
  else if (fieldName.startsWith('signal')) return '150px';
  else if (fieldName.startsWith('train')) return '150px';
  else if (fieldName.startsWith('other2320')) return '100%';
  else if (fieldName.startsWith('other')) return '200px';

  return '100px';
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

  tr.bg-lighter {
    background-color: #eeece1;
  }

  tr.bg-lighter.dark {
    background-color: #111;
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
