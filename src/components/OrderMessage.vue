<template>
  <section class="order-message">
    <h3>Wiadomość do wyświetlenia na czacie symulatora:</h3>

    <div class="message_body" v-html="orderMessagePreview"></div>
    <p class="message_info">
      Po wygenerowaniu rozkazu skopiuj jego treść lub zapisz w pamięci przeglądarki za pomocą
      przycisków poniżej
    </p>

    <div class="message_actions">
      <button class="g-button action" @click="saveOrder">Zapisz nowy rozkaz</button>
      <button class="g-button action" @click="copyMessage">Kopiuj treść rozkazu</button>
      <button
        class="g-button action"
        :data-disabled="!store.chosenLocalOrderId"
        @click="updateOrder"
      >
        Zaktualizuj rozkaz
        <span class="text--accent"
          >{{ store.chosenLocalOrderId && `#${store.chosenLocalOrderId.split('-')[1]}` }}
        </span>
      </button>
    </div>

    <div class="message_checkboxes">
      <label for="dark-mode" class="g-checkbox">
        <input
          type="checkbox"
          name="dark-mode"
          id="dark-mode"
          v-model="store.orderDarkMode"
          @change="onCheckboxChange"
        />
        <span>Ciemny motyw rozkazu</span>
      </label>

      <label for="copy-increment" class="g-checkbox">
        <input
          type="checkbox"
          name="copy-increment"
          id="copy-increment"
          v-model="incrementOnCopy"
          @change="onCheckboxChange"
        />
        <span>Aktualizuj numer rozkazu po skopiowaniu</span>
      </label>

      <label for="save-increment" class="g-checkbox">
        <input
          type="checkbox"
          name="save-increment"
          id="save-increment"
          v-model="incrementOnSave"
          @change="onCheckboxChange"
        />
        <span>Aktualizuj numer rozkazu po zapisaniu</span>
      </label>

      <label for="update-date" class="g-checkbox">
        <input
          type="checkbox"
          name="update-date"
          id="update-date"
          v-model="updateDate"
          @change="onCheckboxChange"
        />
        <span>Aktualizuj godziny przy edycji</span>
      </label>
    </div>

    <transition name="monit-anim">
      <div class="action_monit" v-if="actionMonit" v-html="actionMonit"></div>
    </transition>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '../store/store';

import saveIcon from '../assets/icon-save.svg';
import orderStorageMixin from '../mixins/orderStorageMixin';
import orderValidationMixin from '../mixins/orderValidationMixin';
import { currentFormattedHours, currentFormattedMinutes } from '../utils/dateUtils';

export default defineComponent({
  name: 'OrderMessage',

  mixins: [orderStorageMixin, orderValidationMixin],

  data() {
    return {
      saveIcon,
      actionMonit: '',
      monitTimeout: undefined as number | undefined,

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
      if (this.monitTimeout) {
        this.actionMonit = '';
        clearTimeout(this.monitTimeout);

        setTimeout(() => {
          this.actionMonit = text;

          this.monitTimeout = window.setTimeout(() => {
            this.actionMonit = '';
          }, 5000);
        }, 300);

        return;
      }

      this.actionMonit = text;

      this.monitTimeout = window.setTimeout(() => {
        this.actionMonit = '';
      }, 5000);
    },

    incrementOrderNo() {
      const order = this.store[this.store.chosenOrderType];

      order.header.orderNo = (Number(order.header.orderNo) + 1).toString();
    },

    copyMessage() {
      if (!navigator.clipboard)
        return this.showActionMonit(
          'Ups! Twoja przeglądarka musi być dosyć przestarzała, ponieważ nie obsługuje zapisu do schowka! :/'
        );

      const hasAtLeastOneRow = /(\[ \d \])/g.test(this.fullOrderMessage);
      const hasAllInputsFilled = !/_/g.test(this.store.orderMessage);

      if (!hasAllInputsFilled)
        return this.showActionMonit(
          `<span class="text--warn">Wypełnij puste rubryki rozkazu przed jego skopiowaniem!</span>`
        );
      if (!hasAtLeastOneRow)
        return this.showActionMonit(
          `<span class="text--warn">Dodaj co najmniej jedną działkę rozkazu przed jego skopiowaniem!</span>`
        );

      const fieldsToCorrect = this.verifyOrderFields();

      if (fieldsToCorrect.length > 0)
        return this.showActionMonit(
          `<span class="text--warn">Uzupełnij następujące rubryki na dole rozkazu przed jego skopiowaniem: ${fieldsToCorrect.join(
            ', '
          )}</span>`
        );

      navigator.clipboard.writeText(this.fullOrderMessage);

      if (this.incrementOnCopy) this.incrementOrderNo();

      this.showActionMonit(
        '<b class="text--accent">Skopiowano!</b> Możesz teraz wkleić treść rozkazu na czacie symulatora!'
      );
    },

    saveOrder() {
      const savedOrderStatus = this.saveLocalOrder();

      switch (savedOrderStatus) {
        case -1:
          this.showActionMonit(
            '<span class="text--warn">Wypełnij numer rozkazu, numer pociągu i datę zanim dodasz rozkaz!</span>'
          );
          break;
        case 0:
          this.showActionMonit(
            '<span class="text--warn">Ostatni zapisany rozkaz jest identyczny z obecnym!</span>'
          );
          break;
        case 1:
          this.showActionMonit(
            'Zapisano treść <b class="text--accent">rozkazu</b> w pamięci przeglądarki!'
          );

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
            '<span class="text--warn">Wystąpił błąd podczas aktualizowania tego rozkazu! :/</span>'
          );
          break;

        case 0:
          this.showActionMonit(
            '<span class="text--warn">Nie wybrałeś żadnego zapisanego rozkazu!</span>'
          );
          break;

        case 1:
          this.showActionMonit('Zaktualizowano treść <b class="text--accent">rozkazu</b>!');
          break;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
@use '../styles/colors';

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
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1em;

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
