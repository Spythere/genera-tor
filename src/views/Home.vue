<template>
  <div class="home">
    <OrderVue />

    <div class="generated-message">
      Wygenerowana wiadomość:
      <div v-html="store.orderMessage"></div>
    </div>
    <button @click="copyMessage">Kopiuj wiadomość rozkazu</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OrderVue from '../components/Order.vue';
import { useStore } from '../store/store';
export default defineComponent({
  components: { OrderVue },

  setup() {
    return {
      store: useStore(),
    };
  },

  methods: {
    copyMessage() {
      navigator.clipboard.writeText(this.store.orderMessage);
    },
  },
});
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;

  overflow-x: auto;
}

.container {
  display: flex;
  align-items: start;
}

.generated-message {
  position: sticky;
  top: 0;

  padding: 1em 0.5em;
  text-align: justify;
  margin-left: 1em;
  width: 450px;
  height: auto;

  border: 1px solid white;
  // user-select: none;
}
</style>

