<template>
  <div class="order-helper g-modal">
    <div class="modal-bg" @click="store.helperModalOpen = false"></div>

    <div class="content modal-content">
      <h2>Rozkazy pisemne - najczęstsze przypadki zastosowań w TD2</h2>

      <hr />

      <ul>
        <li>
          <b>Przetaczanie (manewr) taboru poza wskaźnik W 5 (granicy przetaczania)</b>
          <p>
            Rozkazu <u>nie stosujemy</u> w przypadku wyjazdu taboru na szlak dwutorowy, na którym
            odbywa się ruch w kierunku zasadniczym, tj. "prawostronnym". Dla wszystkich szlaków
            jednotorowych lub dwutorowych w sytuacji innej niż wymieniona wykorzystujemy działkę 4.
            rozkazu pisemnego "S". <br /><br />
            <i
              >Szczegółowe informacje: instrukcja Ir-1 (R-1) § 12 pkt 4 "Manewry na torach
              głównych"</i
            >
          </p>
          <button class="g-button action">Wygeneruj treść rozkazu</button>
        </li>
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
    return { store: useStore(), orderHelperData };
  }
});
</script>

<style lang="scss" scoped>
@use '../styles/colors';

.content {
  width: 100%;
  max-width: 800px;

  height: 100vh;
  max-height: 800px;

  margin: 1em;
  padding: 1em;
  background-color: #2b2b2b;
}

h2 {
  text-align: center;
}

ul {
  text-align: left;

  li b {
    font-size: 1.1em;
    color: colors.$accentCol;
  }
}
</style>
