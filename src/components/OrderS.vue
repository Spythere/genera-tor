<template>
  <div class="rozkaz rozkaz-n">
    <section class="header">
      <h2 class="flex-center">
        Rozkaz pisemny "S" nr
        <input type="text" />
      </h2>

      <div class="flex-row">
        dla
        <select id="select-header">
          <option value="pociągu">pociągu</option>
          <option value="manewru">manewru</option>
        </select>
        nr <input type="text" /> dnia <input type="text" /> {{ new Date().getUTCFullYear() }}r.
      </div>
    </section>

    <section class="table-section">
      <table class="options-table">
        <tbody>
          <tr>
            <td>1</td>
            <td>
              zezwalam po otrzymaniu
              <select id="select-1a">
                <option value="sygnału">sygnału "nakaz jazdy"</option>
                <option value="rozkazu">tylko tego rozkazu pisemnego</option>
              </select>

              <div style="margin-top: 0.5rem">
                <input type="checkbox" name="section-1a" id="checkbox-1a" />
                <label for="checkbox-1a">
                  przejechać obok wskazującego sygnał "Stój" semafora wyjazdowego <input type="text" />
                  <br />
                  drogowskazowego <input type="text" />
                  <br />
                  (odnoszącego się do wyjazdu pociągu)
                </label>
              </div>
              <hr />
              <div style="margin-top: 0.5rem">
                <input type="checkbox" name="section-1b" id="checkbox-1b" />
                <label for="checkbox-1b">
                  wyjechać z toru nr <input type="text" /> nie posiadającego semafora wyjazdowego
                </label>
              </div>
            </td>
          </tr>

          <tr>
            <td>2</td>
            <td>
              zezwalam przejechać obok wskazującego sygnał "Stój" semafora:

              <div>- wjazdowego <input type="text" /></div>
              <div>
                - drogowskazowego <input type="text" />
                <div>&nbsp;&nbsp;(odnoszącego się do wjazdu pociągu)</div>
              </div>
              <div>- odstępowego <input type="text" /></div>
              <div>- wjechać z zamkniętego toru nr <input type="text" /> nie posiadającego semafora wjazdowego</div>
            </td>
          </tr>

          <tr>
            <td>3</td>
            <td>
              Od <input type="text" /> do <input type="text" /> po torze nr <input type="text" /> ruch pociągów
              prowadzony jest w odstępie posterunków następczych. Wskazania semaforów sbl są nieważne. Zachować
              ostrożność od ostatniego semafora ze wskaźnikiem "W18". Szlak wolny, ostatni pociąg nr
              <input type="text" /> przybył do <input type="text" /> o godzinie <input type="text" />
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="info">
      <table class="info-table">
        <tbody>
          <tr>
            <td colspan="4">
              <input type="text" />
              <br />
              stacja
            </td>

            <td colspan="3">
              <input type="text" />
              <br />
              posterunek
            </td>

            <td colspan="2">
              <input type="text" />
              <br />
              godz.
            </td>

            <td colspan="1">
              <input type="text" />
              <br />
              min.
            </td>
          </tr>

          <tr>
            <td colspan="5">
              <input type="text" />
              <br />
              dyżurny ruchu
            </td>

            <td colspan="5">
              <input type="text" />
              <br />
              z polecenia dyżurnego ruchu
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
@import '../styles/rozkaz.scss';
</style>
