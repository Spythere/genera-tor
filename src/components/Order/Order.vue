<template>
  <div class="order" :class="{ dark: store.orderDarkMode }">
    <OrderHeader />
    <OrderMainContent />
    <OrderFooter />
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../../store/store';
import OrderHeader from './OrderHeader.vue';
import OrderMainContent from './OrderMainContent.vue';
import OrderFooter from './OrderFooter.vue';
import { computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

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

watch(
  computed(() => store.currentAppLocale),
  () => {
    generateMessage();
  }
);

function generateMessage() {
  let messageHtml = `<b>${t('order.title')}</b><br />`;
  messageHtml += '-------------<br />';

  const headerData = store.orderData['header'];
  const headerDateString = headerData['B']
    ? new Date(headerData['B']).toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '';

  messageHtml += `${t('order.header.A')}: ${headerData['A'] || '---'}<br />`;
  messageHtml += `${t('order.header.B')}: ${headerDateString || '---'}<br />`;
  messageHtml += `${t('order.header.C')}: ${headerData['C'] || '---'}<br />`;
  messageHtml += `${t('order.header.D')}: ${headerData['D'] || '---'}<br />`;

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

<style lang="scss">
@use '../../styles/order';
</style>
