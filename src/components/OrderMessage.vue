<template>
  <section class="order-message">
    <h3>Wiadomość do wyświetlenia na czacie symulatora:</h3>

    <div class="message_body" v-html="fullOrderMessage"></div>
    <p class="message_info">
      Po wygenerowaniu rozkazu skopiuj jego treść lub zapisz w pamięci przeglądarki za pomocą przycisków poniżej
    </p>

    <div class="message_actions">
      <button class="g-button action" @click="saveOrder">Zapisz nowy rozkaz</button>
      <button class="g-button action" @click="copyMessage">Kopiuj treść rozkazu</button>
      <button class="g-button action" :data-disabled="!store.chosenLocalOrderId" @click="updateOrder">
        Zaktualizuj rozkaz
        <span class="text--accent">{{ store.chosenLocalOrderId && `#${store.chosenLocalOrderId.split('-')[1]}` }} </span>
      </button>
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

export default defineComponent({
  name: 'OrderMessage',

  mixins: [orderStorageMixin, orderValidationMixin],

  data() {
    return {
      saveIcon,
      actionMonit: '',
      monitTimeout: undefined as number | undefined,
    };
  },

  setup() {
    return {
      store: useStore(),
    };
  },

  computed: {
    fullOrderMessage() {
      return this.store.orderMessage + this.store.footerMessage;
    },
  },

  methods: {
    showActionMonit(text: string) {
      if (this.monitTimeout) {
        this.actionMonit = '';
        clearTimeout(this.monitTimeout);

        setTimeout(() => {
          this.actionMonit = text;

          this.monitTimeout = setTimeout(() => {
            this.actionMonit = '';
          }, 5000);
        }, 300);

        return;
      }

      this.actionMonit = text;

      this.monitTimeout = setTimeout(() => {
        this.actionMonit = '';
      }, 5000);
    },

    copyMessage() {
      if (!navigator.clipboard)
        return this.showActionMonit(
          'Ups! Twoja przeglądarka musi być dosyć przestarzała, ponieważ nie obsługuje zapisu do schowka! :/'
        );

      // const isOrderValid = this.verifyOrder();
      const fieldsToCorrect = this.verifyOrderFields();

      if (fieldsToCorrect.length > 0)
        return this.showActionMonit(
          `<span class="text--warn">Przed skopiowaniem wiadomości uzupełnij rubryki: ${fieldsToCorrect.join(
            ', '
          )}</span>`
        );

      navigator.clipboard.writeText(this.fullOrderMessage);

      this.showActionMonit(
        'Skopiowano do <b class="text--accent">schowka</b>! Możesz teraz wkleić treść rozkazu na czacie symulatora!'
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
          this.showActionMonit('<span class="text--warn">Ostatni zapisany rozkaz jest identyczny z obecnym!</span>');
          break;
        case 1:
          this.showActionMonit('Zapisano treść <b class="text--accent">rozkazu</b> w pamięci przeglądarki!');
          break;

        default:
          break;
      }
    },

    updateOrder() {
      const updatedOrderStatus = this.updateLocalOrder();

      switch (updatedOrderStatus) {
        case -1:
          this.showActionMonit('<span class="text--warn">Wystąpił błąd podczas aktualizowania tego rozkazu! :/</span>');
          break;

        case 0:
          this.showActionMonit('<span class="text--warn">Nie wybrałeś żadnego zapisanego rozkazu!</span>');
          break;

        case 1:
          this.showActionMonit('Zaktualizowano treść <b class="text--accent">rozkazu</b>!');
          break;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.order-message {
  padding: 1em;

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
  text-align: justify;

  background-color: #fff;
  border-radius: 0.5em;
  color: black;
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

