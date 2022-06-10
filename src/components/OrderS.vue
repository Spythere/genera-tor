<template>
    <section class="header">
      <h2 class="flex-center">
        Rozkaz pisemny "S" nr
        <input type="text" v-model="order.header.orderNo" />
      </h2>

      <div class="flex-row">
        dla
        <select id="select-header" v-model="order.header.for">
          <option value="pociągu">pociągu</option>
          <option value="manewru">manewru</option>
        </select>
        nr <input type="text" v-model="order.header.trainNo" /> dnia <input type="text" v-model="order.header.date" />
        {{ new Date().getUTCFullYear() }}r.
      </div>
    </section>

    <section class="table-section">
      <table class="options-table">
        <tbody>
          <tr>
            <td>1</td>
            <td>
              zezwalam po otrzymaniu
              <select id="select-1a" v-model="order.row1.option1">
                <option value="sygnału">sygnału "nakaz jazdy"</option>
                <option value="rozkazu">tylko tego rozkazu pisemnego</option>
              </select>

              <div style="margin-top: 0.5rem">
                <input type="checkbox" name="section-1a" id="checkbox-1a" v-model="order.row1.checkbox1a" />
                <label for="checkbox-1a">
                  przejechać obok wskazującego sygnał "Stój" semafora wyjazdowego
                  <input type="text" v-model="order.row1.signal1" />
                  <br />
                  drogowskazowego <input type="text" v-model="order.row1.signal2" />
                  <br />
                  (odnoszącego się do wyjazdu pociągu)
                </label>
              </div>
              <hr />
              <div style="margin-top: 0.5rem">
                <input type="checkbox" name="section-1b" id="checkbox-1b" v-model="order.row1.checkbox1b" />
                <label for="checkbox-1b">
                  wyjechać z toru nr <input type="text" v-model="order.row1.trackNo" /> nie posiadającego semafora
                  wyjazdowego
                </label>
              </div>
            </td>
          </tr>

          <tr>
            <td>2</td>
            <td>
              zezwalam przejechać obok wskazującego sygnał "Stój" semafora:

              <div>- wjazdowego <input type="text" v-model="order.row2.signal1" /></div>
              <div>
                - drogowskazowego <input type="text" v-model="order.row2.signal2" />
                <div>&nbsp;&nbsp;(odnoszącego się do wjazdu pociągu)</div>
              </div>
              <div>- odstępowego <input type="text" v-model="order.row2.signal3" /></div>
              <div>
                - wjechać z zamkniętego toru nr <input type="text" v-model="order.row2.trackNo" /> nie posiadającego
                semafora wjazdowego
              </div>
            </td>
          </tr>

          <tr>
            <td>3</td>
            <td>
              Od <input type="text" v-model="order.row3.from" /> do <input type="text" v-model="order.row3.to" /> po torze nr <input type="text" v-model="order.row3.trackNo" /> ruch pociągów
              prowadzony jest w odstępie posterunków następczych. Wskazania semaforów sbl są nieważne. Zachować
              ostrożność od ostatniego semafora ze wskaźnikiem "W18". Szlak wolny, ostatni pociąg nr
              <input type="text" v-model="order.row3.trainNo" /> przybył do <input type="text" v-model="order.row3.arrivedTo" /> o godzinie <input type="text" v-model="order.row3.hour" />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
</template>

<script lang="ts">
import { useStore } from '@/store/store';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const store = useStore();
    return {
      order: store.orderS,
    };
  },
});
</script>
