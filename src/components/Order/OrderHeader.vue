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
            <label class="order-input-label" for="header-A">{{ t('order.header.A') }}</label>
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
            <label class="order-input-label" for="header-B">{{ t('order.header.B') }}</label>
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
            <label class="order-input-label" for="header-C">{{ t('order.header.C') }}</label>
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

<style scoped>
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
</style>
