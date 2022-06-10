<template>
  <section class="header">
    <h2 class="flex-center">
      Rozkaz pisemny "N" nr
      <input type="text" v-model="order.header.orderNo" />
    </h2>

    <div class="flex-row">
      dla pociągu nr <input type="text" v-model="order.header.trainNo" /> dnia
      <input type="text" v-model="order.header.date" /> {{ new Date().getUTCFullYear() }}r.
    </div>
  </section>

  <section class="table-section">
    <table class="options-table">
      <tbody>
        <tr>
          <td>1</td>
          <td>
            Od <input type="text" v-model="order.row1.from" /> do <input type="text" v-model="order.row1.to" /> tor nr
            <input type="text" v-model="order.row1.trackNo" /> jest zamknięty, ruch jednotorowy dwukierunkowy
            wprowadzono po torze nr <input type="text" v-model="order.row1.trackNo2" />
          </td>
        </tr>

        <tr>
          <td>2</td>
          <td>
            <strong>ZEZWALAM</strong> po otrzymaniu
            <select id="select-2a" v-model="order.row2.option1">
              <option value="signal">sygnału "Nakaz Jazdy"</option>
              <option value="order">tylko tego rozkazu pisemnego</option>
            </select>

            <div style="margin-top: 0.5rem">
              <input
                type="radio"
                name="section-2"
                id="checkbox-2a"
                value="checkbox-2a"
                v-model="order.row2.checkbox"
                :checked="order.row2.checkbox == 'checkbox-2a'"
              />

              <label for="checkbox-2a">
                przejechać obok wskazującego sygnał "Stój" semafora wyjazdowego <input type="text" /> i wyjechać w
                kierunku <input type="text" /> na tor szlakowy
                <select v-model="order.row2.option2">
                  <option value="lewy">lewy</option>
                  <option value="prawy">prawy</option>
                </select>
                nr <input type="text" />
              </label>
            </div>

            <div style="margin-top: 0.5rem">
              <input
                type="radio"
                name="section-2"
                id="checkbox-2b"
                value="checkbox-2b"
                v-model="order.row2.checkbox"
                :checked="order.row2.checkbox == 'checkbox-2b'"
              />

              <label for="checkbox-2b">
                z toru nr <input type="text" /> nie posiadającego semafora wyjazdowego wyjechać w kierunku
                <input type="text" /> na tor szlakowy
                <select v-model="order.row2.option3">
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
            <select v-model="order.row3.option1">
              <option value="jazda">Jazda</option>
              <option value="popychanie">Popychanie</option>
            </select>
            pociągu odbędzie się w kierunku: <input type="text" v-model="order.row3.direction" /> do km
            <input type="text" v-model="order.row3.toKilometer" /> skąd
            <select v-model="order.row3.option2">
              <option value="pociąg">pociąg</option>
              <option value="popychacz">popychacz</option>
            </select>
            ma wrócić po torze lewym nr <input type="text" v-model="order.row3.trackNo" /> najpóźniej o godz.
            <input type="text" v-model="order.row3.untilHour" /> min.
            <input type="text" v-model="order.row3.untilMin" />
          </td>
        </tr>

        <tr>
          <td>4</td>
          <td>
            <strong>WJAZD</strong> z toru szlakowego nr <input type="text" v-model="order.row4.trackNo" /> na
            <select v-model="order.row4.optionStation">
              <option value="stację">stację</option>
              <option value="posterunek odgałęźny">posterunek odgałęźny</option>
            </select>
            <input type="text" v-model="order.row4.stationName" /> odbędzie się po otrzymaniu:

            <div style="margin-top: 0.5rem">
              <input type="radio" name="section-4" id="checkbox-4a" value="checkbox-4a" v-model="order.row4.checkbox" />
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
              <input type="radio" name="section-4" id="checkbox-4b" value="checkbox-4b" v-model="order.row4.checkbox" />
              <label for="checkbox-4b">
                rozkazu pisemnego "N" (doręczonego lub przekazanego przez urządzenia łączności)
              </label>
            </div>
          </td>
        </tr>

        <tr>
          <td>5</td>
          <td>
            <strong>ZEZWALAM</strong> wjechać z toru szlakowego nr <input type="text" v-model="order.row5.trackNo" /> z
            kierunku <input type="text" v-model="order.row5.direction" /> na
            <select v-model="order.row5.stationOption">
              <option value="stację">stację</option>
              <option value="posterunek odgałęźny">posterunek odgałęźny</option>
            </select>
            i przejechać obok sygnału "Stój" na <input type="text" v-model="order.row5.on" />
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
      order: store.orderN,
    };
  },
});
</script>
