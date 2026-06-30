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

  messageHtml += `${t('order.header.A')} ${t('order.header.' + headerData['AType'])}: ${headerData['A'] || '---'}<br />`;
  messageHtml += `${t('order.header.B')}: ${headerDateString || '---'}<br />`;
  messageHtml += `${t('order.header.C')} ${t('order.header.' + headerData['AType'])}: ${headerData['C'] || '---'}<br />`;
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
        messageHtml += `<b>[${value.name}]</b> `;

        const optionalInputsActiveCount = Object.keys(value.inputFields).filter(
          (k) => value.optionalFieldNames.includes(k) && value.inputFields[k].trim() != ''
        ).length;

        if (value.key == '2110' || value.key == '2115') {
          messageHtml += `${t(
            `${localeKey}.message-html${optionalInputsActiveCount ? '-' + optionalInputsActiveCount : ''}`,
            messageValues,
            optionalInputsActiveCount
          )}<br />`;
        } else {
          messageHtml += `${t(
            `${localeKey}.message-html`,
            messageValues,
            optionalInputsActiveCount
          )}<br />`;
        }

        if (value.key == '2310' && value.listFields) {
          messageHtml += '<br />';
          value.listFields.forEach((listItem, i) => {
            if (!listItem.active) return;

            const listItemValues = Object.values(listItem.values).map((itemFieldKey) => {
              return itemFieldKey || '---';
            });

            messageHtml += t(
              `${localeKey}.message-html-list`,
              [i + 1, ...listItemValues],
              Object.keys(listItem.values).filter(
                (k) => listItem.values[k].trim() != '' && k.startsWith('signalbox')
              ).length
            );
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
  messageHtml += `${t('order.footer.V')}: ${footerData['V'] || '---'}<br />`;
  messageHtml += `${t('order.footer.W')}: ${footerData['W'] || '---'}<br />`;
  messageHtml += `${t('order.footer.Y')}: ${footerData['Y'] || '---'}<br />`;
  messageHtml += `${t('order.footer.Z')}: RD-${footerData['orderNo'] ?? '?'}-${footerData['sceneryId'] || '?'}-${footerData['orderYear'] || ' '}<br />`;

  store.orderMessage = messageHtml;
}
</script>

<style lang="scss">
@use '@/styles/colors';

$darkModeTextCol: #eee;

.order {
  width: 100%;
  background-color: white;
  color: black;
  height: 100%;
  overflow: auto;

  &.dark {
    background-color: colors.$bgColDarker;
    color: $darkModeTextCol;
  }

  @media screen and (max-width: 550px) {
    font-size: 0.85em;
  }
}

table.order-table {
  width: 100%;
  overflow: auto;
  table-layout: fixed;
  min-width: 750px;

  border: 2px solid black;
  border-collapse: collapse;

  td {
    border: 2px solid black;
    border-collapse: collapse;

    text-align: justify;
    vertical-align: top;
  }
}

.order-input-box {
  display: inline-block;
  position: relative;
  padding-bottom: 1.25em;

  & > span {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, 2em);
    font-size: 0.8em;
    width: 100%;
    text-align: center;
  }
}

input.order-input {
  max-width: 100%;
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 1em;

  text-align: center;
  border-bottom: 2px dotted black;

  &:focus-visible {
    border-bottom: 2px solid colors.$accentCol;
  }

  &.row-checkbox + input::placeholder {
    color: red;
  }

  &[type='checkbox']:focus-visible,
  &[type='radio']:focus-visible {
    outline: 2px solid colors.$accentCol;
  }

  &[type='checkbox'],
  &[type='radio'] {
    margin-top: 0.5em;
    margin-right: 0.5em;
    font-size: 0.8em;
    color: black;
  }

  &::placeholder {
    font-size: 0.85em;
  }
}

label.order-input-label {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

select.order-select {
  margin-top: 0.5em;
  margin-right: 0.5em;
  font-size: 0.8em;
  color: black;
}

textarea.order-textarea {
  width: 100%;
  min-height: 200px;
  resize: vertical;

  &:focus-visible {
    outline: 2px solid colors.$accentCol;
  }
}

// Dark mode
.order.dark {
  input.order-input {
    border-color: $darkModeTextCol !important;
    color: $darkModeTextCol !important;

    &:focus-visible {
      border-bottom: 2px solid colors.$accentCol !important;
    }

    &::placeholder {
      color: #ccc !important;
    }
  }

  select.order-select {
    color: $darkModeTextCol !important;
    border-color: $darkModeTextCol;

    &:focus-visible {
      border-color: colors.$accentCol;
    }
  }

  select.order-select option,
  textarea.order-textarea {
    color: $darkModeTextCol !important;
    border-color: $darkModeTextCol !important;
    background-color: colors.$bgColDarker !important;
  }

  .horizontal-bar {
    background-color: white;
  }

  .order_header,
  .order_other,
  table.order-table,
  tr,
  td {
    border-color: $darkModeTextCol !important;
  }
}
</style>
