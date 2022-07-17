<template>
  <section class="header" ref="header">
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
          <td>
            <label for="row-enabled-1">1</label>
            <div>
              <input type="checkbox" id="row-enabled-1" v-model="order.row1.enabled" />
            </div>
          </td>
          <td>
            Od <input type="text" v-model="order.row1.from" /> do <input type="text" v-model="order.row1.to" /> tor nr
            <input type="text" v-model="order.row1.trackNo" /> jest zamknięty, ruch jednotorowy dwukierunkowy
            wprowadzono po torze nr <input type="text" v-model="order.row1.trackNo2" />
          </td>
        </tr>

        <tr>
          <td>
            <label for="row-enabled-2">2</label>
            <div>
              <input type="checkbox" id="row-enabled-2" v-model="order.row2.enabled" />
            </div>
          </td>
          <td>
            <strong>ZEZWALAM</strong> po otrzymaniu
            <select id="select-2a" v-model="order.row2.option1">
              <option value='sygnału "Nakaz Jazdy"'>sygnału "Nakaz Jazdy"</option>
              <option value="tylko tego rozkazu pisemnego">tylko tego rozkazu pisemnego</option>
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
                przejechać obok wskazującego sygnał "Stój" semafora

                <div style="margin-left: 1rem">
                  <input
                    type="radio"
                    name="section-2a"
                    id="radio-2a-1"
                    value="wyjazdowego"
                    v-model="order.row2.signalType"
                  />
                  <label for="radio-2a-1">wyjazdowego <input type="text" v-model="order.row2.signal1" /> </label>
                  <br />
                  <input
                    type="radio"
                    name="section-2a"
                    id="radio-2a-2"
                    value="drogowskazowego"
                    v-model="order.row2.signalType"
                  />
                  <label for="radio-2a-2"
                    >drogowskazowego <input type="text" v-model="order.row2.signal2" /> (odnoszącego się do wyjazdu
                    pociągu)
                  </label>
                  <br />
                  <input
                    type="radio"
                    name="section-2a"
                    id="radio-2a-3"
                    value="wjazdowego"
                    v-model="order.row2.signalType"
                  />
                  <label for="radio-2a-3"
                    >wjazdowego <input type="text" v-model="order.row2.signal3" /> na post. odg. bez sem.
                    wyjazdowego</label
                  >
                </div>

                i wyjechać w kierunku <input type="text" v-model="order.row2.direction" /> na tor szlakowy
                <select v-model="order.row2.option2">
                  <option value="lewy">lewy</option>
                  <option value="prawy">prawy</option>
                </select>
                nr <input type="text" v-model="order.row2.trackNoTo1" />
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
                z toru nr <input type="text" v-model="order.row2.trackNoFrom" /> nie posiadającego semafora wyjazdowego
                wyjechać w kierunku <input type="text" /> na tor szlakowy
                <select v-model="order.row2.option3">
                  <option value="lewy">lewy</option>
                  <option value="prawy">prawy</option>
                </select>
                nr <input type="text" v-model="order.row2.trackNoTo2" />
              </label>
            </div>
          </td>
        </tr>

        <tr>
          <td>
            <label for="row-enabled-3">3</label>
            <div>
              <input type="checkbox" id="row-enabled-3" v-model="order.row3.enabled" />
            </div>
          </td>
          <td>
            <select v-model="order.row3.option1">
              <option value="Jazda">Jazda</option>
              <option value="Popychanie">Popychanie</option>
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
          <td>
            <label for="row-enabled-4">4</label>
            <div>
              <input type="checkbox" id="row-enabled-4" v-model="order.row4.enabled" />
            </div>
          </td>
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
                <select v-model="order.row4.side">
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
          <td>
            <label for="row-enabled-5">5</label>
            <div>
              <input type="checkbox" id="row-enabled-5" v-model="order.row5.enabled" />
            </div>
          </td>
          <td>
            <strong>ZEZWALAM</strong> wjechać z toru szlakowego nr <input type="text" v-model="order.row5.trackNo" /> z
            kierunku <input type="text" v-model="order.row5.direction" /> na
            <select v-model="order.row5.stationType">
              <option value="stację">stację</option>
              <option value="posterunek odgałęźny">posterunek odgałęźny</option>
            </select>
            <input type="text" v-model="order.row5.stationName" />
            i przejechać obok sygnału "Stój" na <input type="text" v-model="order.row5.on" />
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import { useStore } from '@/store/store';
import { defineComponent, watch } from 'vue';

export default defineComponent({
  emits: ['generateMessage'],

  setup() {
    const store = useStore();

    return {
      order: store.orderN,
      message: store.orderMessage,
    };
  },

  watch: {
    order: {
      deep: true,
      handler() {
        this.generateMessage();
      },
    },
  },

  methods: {
    generateMessage() {
      let message = this.generateHeaderMessage();

      if (this.order.row1.enabled) message += this.generate1stRowMessage();
      if (this.order.row2.enabled) message += this.generate2ndRowMessage();
      if (this.order.row3.enabled) message += this.generate3rdRowMessage();
      if (this.order.row4.enabled) message += this.generate4thRowMessage();
      if (this.order.row5.enabled) message += this.generate5thRowMessage();

      this.$emit('generateMessage', message);
      // const row1Message = `Od ${header.} do tor nr jest zamknięty, ruch jednotorowy dwukierunkowy wprowadzono po torze nr `
    },

    generateHeaderMessage() {
      const { header } = this.order;

      const message = `<i>Rozkaz pisemny "N" nr ${header.orderNo || '_'} dla pociągu nr ${header.trainNo || '_'} dnia ${
        header.date
      } ${new Date().getUTCFullYear()}r.</i>`;

      return message;
    },

    generate1stRowMessage() {
      const { row1 } = this.order;

      const message = ` <b> [ 1 ] </b> Od ${row1.from || '_'} do ${row1.to || '_'} tor nr ${
        row1.trackNo || '_'
      } jest zamknięty, ruch jednotorowy dwukierunkowy wprowadzono po torze nr ${row1.trackNo2 || '_'}`;

      return message;
    },

    generate2ndRowMessage() {
      const { row2 } = this.order;

      let message = ` <b> [ 2 ] </b> <b>ZEZWALAM</b> po otrzymaniu ${row2.option1 || '_'}`;

      if (row2.checkbox == 'checkbox-2a') {
        message += ` przejechać obok wskazującego sygnał "Stój" semafora ${row2.signalType || '_'} `;

        if (row2.signalType == 'wyjazdowego') message += row2.signal1;
        if (row2.signalType == 'drogowskazowego')
          message += `${row2.signal2 || '_'} (odnoszącego się do wyjazdu pociągu)`;
        if (row2.signalType == 'wjazdowego') message += `${row2.signal3 || '_'} na post. odg. bez sem. wyjazdowego`;

        message += ` i wyjechać w kierunku ${row2.direction || '_'} na tor szlakowy ${row2.option2 || '_'} nr ${
          row2.trackNoTo1 || '_'
        }`;
      }

      if (row2.checkbox == 'checkbox-2b') {
        message += ` z toru nr ${row2.trackNoFrom || '_'} nie posiadającego semafora wyjazdowego wyjechać w kierunku ${
          row2.trackNoTo2 || '_'
        } na tor szlakowy ${row2.option3 || '_'}`;
      }

      return message;
    },

    generate3rdRowMessage() {
      const { row3 } = this.order;

      let message = ` <b> [ 3 ] </b> ${row3.option1} pociągu odbędzie się w kierunku: ${row3.direction} do km ${row3.toKilometer} skąd ${row3.option2} ma wrócić po torze lewym nr ${row3.trackNo} najpóźniej o godz. ${row3.untilHour} min. ${row3.untilMin}`;

      return message;
    },

    generate4thRowMessage() {
      const { row4 } = this.order;

      let message = ` <b> [ 4 ] </b> <b>WJAZD</b> z toru szlakowego nr ${row4.trackNo} na ${row4.optionStation} ${row4.stationName} odbędzie się po otrzymaniu: `;

      if (row4.checkbox == 'checkbox-4a')
        message += `sygnału zastępczego "Sz" na osobnym urządzeniu ustawionym z ${row4.side} strony toru`;

      if (row4.checkbox == 'checkbox-4b')
        message += 'rozkazu pisemnego "N" (doręczonego lub przekazanego przez urządzenia łączności)';

      return message;
    },

    generate5thRowMessage() {
      const { row5 } = this.order;

      const message = ` <b> [ 5 ] </b> <b>ZEZWALAM</b> wjechać z toru szlakowego nr ${row5.trackNo} z kierunku ${row5.direction} na ${row5.stationType} ${row5.stationName} i przejechać obok sygnału "Stój" na ${row5.on} `;

      return message;
    },
  },
});
</script>
