<template>
  <table class="order-table">
    <tbody>
      <tr>
        <td style="padding: 0.25em" colspan="2">
          <b>{{ t('order.title') }}</b>
        </td>
      </tr>

      <tr>
        <td width="50%">
          <div class="header-input-box">
            <input
              type="text"
              class="order-input"
              id="header-A"
              v-model="store.orderData.header.A"
              :placeholder="t('order.header.A-placeholder')"
            />
            <label class="order-input-label" for="header-A">
              {{ t('order.header.A') }}
              &nbsp;
              <select
                class="order-select"
                name="header-A"
                id="header-A"
                v-model="store.orderData.header.AType"
              >
                <option value="train">{{ t('order.header.train') }}</option>
                <option value="shunt">{{ t('order.header.shunt') }}</option>
              </select>
            </label>
          </div>
        </td>
        <td>
          <div class="header-input-box">
            <input
              type="date"
              class="order-input"
              id="header-B"
              v-model="store.orderData.header.B"
            />
            <label class="order-input-label" for="header-B" id="header-B">{{
              t('order.header.B')
            }}</label>
          </div>
        </td>
      </tr>

      <tr>
        <td>
          <div class="header-input-box">
            <input
              type="text"
              class="order-input"
              id="header-C"
              v-model="store.orderData.header.C"
              :placeholder="t('order.header.C-placeholder')"
            />
            <label class="order-input-label" for="header-C">
              {{ t('order.header.C-desc') }}
            </label>
          </div>
        </td>
        <td>
          <div class="header-input-box">
            <input
              type="text"
              class="order-input"
              id="header-D"
              v-model="store.orderData.header.D"
              :placeholder="t('order.header.D-placeholder')"
            />
            <label class="order-input-label" for="header-D">{{ t('order.header.D') }}</label>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useStore } from '../../store/store';

const { t } = useI18n();
const store = useStore();
</script>

<style lang="scss" scoped>
@use '../../styles/colors';

.header-input-box {
  width: 100%;
  padding: 0.5em 1em;
}

.order-input {
  max-width: 100%;
  width: 100%;
  text-align: left;
}

.order-table,
.order-table tr:last-child td {
  border-bottom: none;
}

.order-select {
  font-size: 0.95em;
  padding: 0.25em 0.5em;
}
</style>
