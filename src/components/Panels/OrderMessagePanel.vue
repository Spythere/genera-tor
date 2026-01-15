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
        <span class="text--accent" v-if="store.chosenLocalOrderId">#{{ store.chosenLocalOrderId.split('-')[1] }} </span>
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
      <div class="action_monit" v-if="actionMonit" v-html="actionMonit"></div>
    </transition>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import orderStorageMixin from '../../mixins/orderStorageMixin';
import orderValidationMixin from '../../mixins/orderValidationMixin';
import { useStore } from '../../store/store';
import { currentFormattedHours, currentFormattedMinutes } from '../../utils/dateUtils';
import { LucideCopy, LucidePencil, LucideRotateCcw, LucideSave } from 'lucide-vue-next';

export default defineComponent({
  name: 'OrderMessage',
  components: { LucideCopy, LucidePencil, LucideRotateCcw, LucideSave },

  mixins: [orderStorageMixin, orderValidationMixin],

  data() {
    return {
      actionMonit: '',
      monitTimeout: null as number | null,

      incrementOnSave: true,
      incrementOnCopy: true,
      updateDate: true
    };
  },

  setup() {
    return {
      store: useStore()
    };
  },

  mounted() {
    this.incrementOnSave = this.getOrderSetting('save-increment') === 'true';
    this.incrementOnCopy = this.getOrderSetting('copy-increment') === 'true';
    this.updateDate = this.getOrderSetting('update-date') === 'true';
  },

  computed: {
    fullOrderMessage() {
      return this.store.orderMessage + this.store.footerMessage;
    },

    // Replace all new line tags with <br> for preview and get rid of the first one (visible only on simulator's chat)
    orderMessagePreview() {
      return this.fullOrderMessage.replace(/\n/g, '<br>').replace('<br>', '');
    }
  },

  watch: {
    fullOrderMessage() {
      if (this.updateDate) {
        this.store.orderFooter['hour'] = currentFormattedHours();
        this.store.orderFooter['minutes'] = currentFormattedMinutes();
      }
    }
  },

  methods: {
    onCheckboxChange(e: Event) {
      const checkbox = e.target as HTMLInputElement;
      this.saveOrderSetting(checkbox.id, checkbox.checked);
    },

    showActionMonit(text: string) {
      if (this.monitTimeout != null) {
        this.actionMonit = '';
        clearTimeout(this.monitTimeout);

        setTimeout(() => {
          this.actionMonit = text;
        }, 100);
      } else {
        this.actionMonit = text;
      }

      this.monitTimeout = window.setTimeout(() => {
        this.actionMonit = '';
        this.monitTimeout = null;
      }, 5000);
    },

    incrementOrderNo() {
      const order = this.store[this.store.chosenOrderType];

      order.header.orderNo = (Number(order.header.orderNo) + 1).toString();
    },

    copyMessage() {
      if (!navigator.clipboard)
        return this.showActionMonit(this.$t('order-message.warning-outdated-clipboard'));

      const hasAtLeastOneRow = /(\[ \d \])/g.test(this.fullOrderMessage);
      const hasAllInputsFilled = !/_/g.test(this.store.orderMessage);

      if (!hasAllInputsFilled)
        return this.showActionMonit(
          `<span class="text--warn">${this.$t('order-message.warning-fill-inputs')}</span>`
        );
      if (!hasAtLeastOneRow)
        return this.showActionMonit(
          `<span class="text--warn">${this.$t('order-message.warning-add-rows')}</span>`
        );

      const fieldsToCorrect = this.verifyOrderFields();

      if (fieldsToCorrect.length > 0)
        return this.showActionMonit(
          `<span class="text--warn">${this.$t('order-message.warning-fill-footer')} ${fieldsToCorrect.join(
            ', '
          )}</span>`
        );

      navigator.clipboard.writeText(this.fullOrderMessage);

      if (this.incrementOnCopy) this.incrementOrderNo();

      this.showActionMonit(this.$t('order-message.success-copy-html'));
    },

    saveOrder() {
      const savedOrderStatus = this.saveLocalOrder();

      switch (savedOrderStatus) {
        case -1:
          this.showActionMonit(
            `<span class="text--warn">${this.$t('order-message.warning-fill-top')}</span>`
          );
          break;
        case 0:
          this.showActionMonit(
            `<span class="text--warn">${this.$t('order-message.warning-order-identical')}</span>`
          );
          break;
        case 1:
          this.showActionMonit(this.$t('order-message.success-save-html'));

          if (this.incrementOnSave) this.incrementOrderNo();
          break;

        default:
          break;
      }
    },

    updateOrder() {
      const updatedOrderStatus = this.updateLocalOrder();

      switch (updatedOrderStatus) {
        case -1:
          this.showActionMonit(
            `<span class="text--warn">${this.$t('order-message.error-update')}</span>`
          );
          break;

        case 0:
          this.showActionMonit(
            `<span class="text--warn">${this.$t('order-message.warning-no-order-selected')}</span>`
          );
          break;

        case 1:
          this.showActionMonit(this.$t('order-message.success-update-html'));
          break;
      }
    },

    resetOrder() {
      const order = this.store[this.store.chosenOrderType];

      // TODO

      // Object.keys(store.orderData.header).forEach((k) => {
      //   store.orderData['header'][k as keyof IOrderHeader] = '';
      // });

      // Object.keys(store.orderData.footer).forEach((k) => {
      //   store.orderData['footer'][k as keyof IOrderFooter] = '';
      // });

      // store.orderData.instructions.forEach((instruction) => {
      //   instruction.active = false;

      //   Object.keys(instruction.inputFields).forEach((k) => {
      //     instruction.inputFields[k] = '';
      //   });

      //   if (instruction.listFields) {
      //     instruction.listFields.forEach((field) => {
      //       Object.keys(field.values).forEach((k) => {
      //         field.active = false;
      //         field.values[k] = '';
      //       });
      //     });
      //   }
      // });
    }
  }
});
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
  height: 250px;
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
