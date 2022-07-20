<template>
  <SideBar />

  <div class="home">
    <div class="home_container">
      <div class="order_container">
        <OrderVue />
      </div>

      <div class="message_container">
        <h3>Wiadomość do wyświetlenia na czacie symulatora:</h3>

        <div class="message_body" v-html="fullOrderMessage"></div>

        <div class="message_actions">
          <button class="g-button" @click="copyMessage">Zapisz ten rozkaz</button>
          <button class="g-button" @click="copyMessage">Kopiuj wiadomość rozkazu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OrderVue from '../components/Order.vue';
import { useStore } from '../store/store';
import SideBar from '../components/SideBar.vue';
export default defineComponent({
  components: { OrderVue, SideBar },

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
    copyMessage() {
      navigator.clipboard.writeText(this.fullOrderMessage);
    },
  },
});
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  justify-content: center;

  flex-wrap: wrap;

  min-height: 100vh;
  padding: 1em;

  overflow-x: auto;

  .home_container {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    margin-top: 1em;
  }

  .order_container {
    font-size: 0.9rem;
    margin-right: 0.5em;
    margin-bottom: 1em;
  }
}

.message_container {
  padding: 0 1em;
  width: 500px;

  h3 {
    margin: 0;
    margin-bottom: 1em;
    text-align: center;
  }

  button {
    margin: 0 0.5em;
    font-size: 0.85em;
  }

  @media screen and (max-width: 550px) {
    max-width: 100%;
  }
}

.message_actions {
  display: flex;
  justify-content: center;
  margin-top: 1em;
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
</style>
