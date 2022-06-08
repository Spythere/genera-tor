<template>
  <div class="rozkaz rozkaz-n">
    <section class="header">
      <h2 class="flex-center">
        Rozkaz pisemny "N" nr
        <input type="text" v-model="orderNo" />
      </h2>

      <div class="flex-row">
        dla pociągu nr <input type="text" v-model="trainNo" /> dnia <input type="text" v-model="date" />
        {{ new Date().getUTCFullYear() }}r.
      </div>
    </section>

    <section class="table-section">
      <table class="options-table">
        <tbody>
          <tr>
            <td>1</td>
            <td>
              Od <input type="text" v-model="row1.from" /> do <input type="text" v-model="row1.to" /> tor nr
              <input type="text" v-model="row1.trackNo" /> jest zamknięty, ruch jednotorowy dwukierunkowy wprowadzono po
              torze nr <input type="text" v-model="row1.trackNo2" />
            </td>
          </tr>

          <tr>
            <td>2</td>
            <td>
              <strong>ZEZWALAM</strong> po otrzymaniu
              <select id="select-2a" v-model="row2.choice1">
                <option value="option-2a-1" :checked="row2.choice1 == 'option-2a-1'">sygnału "Nakaz Jazdy"</option>
                <option value="option-2a-2" :checked="row2.choice1 == 'option-2a-2'">tylko tego rozkazu pisemnego</option>
              </select>

              {{ row2.choice1 }}

              <div style="margin-top: 0.5rem">
                <input type="radio" name="section-2" id="checkbox-2a" />
                <label for="checkbox-2a">
                  przejechać obok wskazującego sygnał "Stój" semafora wyjazdowego <input type="text" /> i wyjechać w
                  kierunku <input type="text" /> na tor szlakowy
                  <select>
                    <option value="lewy">lewy</option>
                    <option value="prawy">prawy</option>
                  </select>
                  nr <input type="text" />
                </label>
              </div>

              <div style="margin-top: 0.5rem">
                <input type="radio" name="section-2" id="checkbox-2b" />
                <label for="checkbox-2b">
                  z toru nr <input type="text" /> nie posiadającego semafora wyjazdowego wyjechać w kierunku
                  <input type="text" /> na tor szlakowy
                  <select>
                    <option value="lewy">lewy</option>
                    <option value="prawy">prawy</option>
                  </select>
                  nr <input type="text" />
                </label>
              </div>
            </td>
          </tr>

          <tr>
            <td>3</td>
            <td>
              <select>
                <option value="jazda">Jazda</option>
                <option value="popychanie">Popychanie</option>
              </select>
              pociągu odbędzie się w kierunku: <input type="text" /> do km <input type="text" /> skąd
              <select>
                <option value="pociąg">pociąg</option>
                <option value="popychacz">popychacz</option>
              </select>
              ma wrócić po torze lewym nr <input type="text" /> najpóźniej o godz. <input type="text" /> min.
              <input type="text" />
            </td>
          </tr>

          <tr>
            <td>4</td>
            <td>
              <strong>WJAZD</strong> z toru szlakowego nr <input type="text" /> na
              <select>
                <option value="stację">stację</option>
                <option value="posterunek odgałęźny">posterunek odgałęźny</option>
              </select>
              <input type="text" /> odbędzie się po otrzymaniu:

              <div style="margin-top: 0.5rem">
                <input type="radio" name="section-4" id="checkbox-4a" />
                <label for="checkbox-4a">
                  sygnału zastępczego "Sz" na osobnym urządzeniu ustawionym z
                  <select>
                    <option value="lewej">lewej</option>
                    <option value="prawej">prawej</option>
                  </select>
                  strony toru
                </label>
              </div>

              <div style="margin-top: 0.5rem">
                <input type="radio" name="section-4" id="checkbox-4b" />
                <label for="checkbox-4b">
                  rozkazu pisemnego "N" (doręczonego lub przekazanego przez urządzenia łączności)
                </label>
              </div>
            </td>
          </tr>

          <tr>
            <td>5</td>
            <td>
              <strong>ZEZWALAM</strong> wjechać z toru szlakowego nr <input type="text" /> z kierunku
              <input type="text" /> na
              <select>
                <option value="stację">stację</option>
                <option value="posterunek odgałęźny">posterunek odgałęźny</option>
              </select>
              i przejechać obok sygnału "Stój" na <input type="text" />
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
  data() {
    return {
      orderNo: '',
      trainNo: '',
      date: '',

      row1: {
        from: '',
        to: '',
        trackNo: '',
        trackNo2: '',
      },

      row2: {
        choice1: 'option-2a-1',
        choice2: '',

      }
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../styles/rozkaz.scss';
</style>
