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
            <div class="id-input-box">
              <span>RD-</span>

              <input
                type="number"
                class="order-input"
                id="footer-Z"
                v-model="store.orderData.footer.orderNo"
                min="0"
              />

              <span>-</span>

              <input
                type="text"
                class="order-input"
                id="footer-Z"
                v-model="store.orderData.footer.sceneryId"
                :placeholder="t('order.footer.Z-placeholder')"
              />

              <span>-</span>

              <input
                type="number"
                class="order-input"
                id="footer-Z"
                v-model="store.orderData.footer.orderYear"
                min="26"
              />
            </div>

            <label class="order-input-label" for="footer-Z">
              {{ t('order.footer.Z') }}

              <span :title="t('order.footer.Z-help-tooltip')">(?)</span>
            </label>
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
.order-input[type='text'] {
  max-width: 100%;
  width: 100%;
  text-align: left;
}

.order-input[type='number'] {
  max-width: 50px;
}

.order-table > tbody > tr > td > div {
  width: 100%;
  padding: 0.5em 1rem;
}

.id-input-box {
  display: flex;
}
</style>
