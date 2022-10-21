<template>
  <div class="order-helper g-modal">
    <div class="modal-bg" @click="store.helperModalOpen = false"></div>

    <div class="content modal-content">
      <h2>Rozkazy pisemne - zastosowania w TD2</h2>

      <hr />
      <b>Rozkaz pisemny "S" (dot. semaforów)</b>
      <p>Rozkaz pisemny "S" jest stosowany w następujących sytuacjach:</p>

      <ul>
        <li v-for="data in orderHelperData.orderS">{{ data }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '../store/store';
import orderHelperData from '../data/orderHelperData.json';

export default defineComponent({
  setup() {
    return {
      store: useStore(),
      orderHelperData,
    };
  },
});
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  max-width: 800px;

  height: 100vh;
  max-height: 800px;

  margin: 1em;
  padding: 1em;
  background-color: #2b2b2b;

  text-align: center;
}

ul {
  text-align: left;
  list-style: inside;
}
</style>
