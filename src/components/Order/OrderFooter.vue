<template>
  <table class="order-table">
    <tbody>
      <tr>
        <td width="50%">
          <div>
            <input
              type="text"
              class="order-input"
              id="footer-V"
              v-model="store.orderData.footer.V"
              :placeholder="t('order.footer.V-placeholder')"
            />
            <label class="order-input-label" for="footer-V">{{ t('order.footer.V') }}</label>
          </div>
        </td>
        <td>
          <div>
            <input
              type="text"
              class="order-input"
              id="footer-W"
              v-model="store.orderData.footer.W"
              :placeholder="t('order.footer.W-placeholder')"
            />
            <label class="order-input-label" for="footer-W">{{ t('order.footer.W') }}</label>
          </div>
        </td>
      </tr>

      <tr>
        <td>
          <div>
            <input
              type="text"
              class="order-input"
              id="footer-Y"
              v-model="store.orderData.footer.Y"
              :placeholder="t('order.footer.Y-placeholder')"
            />
            <label class="order-input-label" for="footer-Y">{{ t('order.footer.Y') }}</label>
          </div>
        </td>
        <td>
          <div>
            <input
              type="text"
              class="order-input"
              id="footer-Z"
              v-model="store.orderData.footer.Z"
              :placeholder="t('order.footer.Z-placeholder')"
            />
            <label class="order-input-label" for="footer-Z">{{ t('order.footer.Z') }}</label>
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
.order-input {
  max-width: 100%;
  width: 100%;
  text-align: left;
}

.order-table > tbody > tr > td > div {
  width: 100%;
  padding: 0.5em 1rem;
}
</style>
