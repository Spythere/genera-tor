<template>
  <section class="order-n">
    <section class="header" ref="header">
      <h2 class="flex-center">
        Rozkaz pisemny "N" nr
        <input type="text" v-model="order.header.orderNo" placeholder="nr rozkazu" />
      </h2>
      <div class="flex-row">
        dla pociągu nr <input type="text" v-model="order.header.trainNo" placeholder="nr pociągu" /> dnia
        <input type="text" v-model="order.header.date" placeholder="data" /> {{ new Date().getUTCFullYear() }}r.
      </div>
    </section>
    <section class="table-section">
      <table class="options-table">
        <tbody>
          <tr>
            <td>
              <label for="row-enabled-1">1</label>
              <div>
                <input
                  type="checkbox"
                  id="row-enabled-1"
                  v-model="order.row1.enabled"
                  @change="handleRowCheckboxChange(1)"
                />
              </div>
            </td>
            <td ref="row-1">
              Od <input type="text" v-model="order.row1.from" holder="stacja / post." /> do
              <input type="text" v-model="order.row1.to" holder="stacja / post." /> tor nr
              <input type="text" v-model="order.row1.trackNo" holder="nr toru" /> jest zamknięty, ruch jednotorowy
              dwukierunkowy wprowadzono po torze nr
              <input type="text" v-model="order.row1.trackNo2" holder="nr toru" />
            </td>
          </tr>
          <tr>
            <td>
              <label for="row-enabled-2">2</label>
              <div>
                <input
                  type="checkbox"
                  id="row-enabled-2"
                  v-model="order.row2.enabled"
                  @change="handleRowCheckboxChange(2)"
                />
              </div>
            </td>
            <td ref="row-2">
              <strong>ZEZWALAM</strong> po otrzymaniu
              <select id="select-2a" v-model="order.row2.option1">
                <option :value="`sygnału &quot;Nakaz Jazdy&quot;`">sygnału "Nakaz Jazdy"</option>
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
                    <label for="radio-2a-1">
                      wyjazdowego <input type="text" v-model="order.row2.signal1" holder="nazwa sem." />
                    </label>
                    <br />
                    <input
                      type="radio"
                      name="section-2a"
                      id="radio-2a-2"
                      value="drogowskazowego"
                      v-model="order.row2.signalType"
                    />
                    <label for="radio-2a-2">
                      drogowskazowego
                      <input type="text" v-model="order.row2.signal2" holder="nazwa sem." /> (odnoszącego się do
                      wyjazdu pociągu)
                    </label>
                    <br />
                    <input
                      type="radio"
                      name="section-2a"
                      id="radio-2a-3"
                      value="wjazdowego"
                      v-model="order.row2.signalType"
                    />
                    <label for="radio-2a-3">
                      wjazdowego <input type="text" v-model="order.row2.signal3" holder="nazwa sem." /> na post.
                      odg. bez sem. wyjazdowego
                    </label>
                  </div>
                  i wyjechać w kierunku
                  <input type="text" v-model="order.row2.direction1" holder="stacja / post." /> na tor szlakowy
                  <select v-model="order.row2.option2">
                    <option value="lewy">lewy</option>
                    <option value="prawy">prawy</option>
                  </select>
                  nr <input type="text" v-model="order.row2.trackNoTo1" holder="nr toru" />
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
                  z toru nr <input type="text" v-model="order.row2.trackNoFrom" holder="nr toru" /> nie
                  posiadającego semafora wyjazdowego wyjechać w kierunku
                  <input type="text" v-model="order.row2.direction2" holder="stacja / post." /> na tor szlakowy
                  <select v-model="order.row2.option3">
                    <option value="lewy">lewy</option>
                    <option value="prawy">prawy</option>
                  </select>
                  nr <input type="text" v-model="order.row2.trackNoTo2" holder="nr toru" />
                </label>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <label for="row-enabled-3">3</label>
              <div>
                <input
                  type="checkbox"
                  id="row-enabled-3"
                  v-model="order.row3.enabled"
                  @change="handleRowCheckboxChange(3)"
                />
              </div>
            </td>
            <td ref="row-3">
              <select v-model="order.row3.option1">
                <option value="Jazda">Jazda</option>
                <option value="Popychanie">Popychanie</option>
              </select>
              pociągu odbędzie się w kierunku:
              <input type="text" v-model="order.row3.direction" holder="stacja / post." /> do km
              <input type="text" v-model="order.row3.toKilometer" holder="kilometry" /> skąd
              <select v-model="order.row3.option2">
                <option value="pociąg">pociąg</option>
                <option value="popychacz">popychacz</option>
              </select>
              ma wrócić po torze lewym nr
              <input type="text" v-model="order.row3.trackNo" holder="nr toru" /> najpóźniej o godz.
              <input type="text" v-model="order.row3.untilHour" holder="godzina" /> min.
              <input type="text" v-model="order.row3.untilMin" holder="minuta" />
            </td>
          </tr>
          <tr>
            <td>
              <label for="row-enabled-4">4</label>
              <div>
                <input
                  type="checkbox"
                  id="row-enabled-4"
                  v-model="order.row4.enabled"
                  @change="handleRowCheckboxChange(4)"
                />
              </div>
            </td>
            <td ref="row-4">
              <strong>WJAZD</strong> z toru szlakowego nr
              <input type="text" v-model="order.row4.trackNo" holder="nr toru" /> na
              <select v-model="order.row4.optionStation">
                <option value="stację">stację</option>
                <option value="posterunek odgałęźny">posterunek odgałęźny</option>
              </select>
              <input type="text" v-model="order.row4.stationName" holder="stacja / post." /> odbędzie się po
              otrzymaniu:
              <div style="margin-top: 0.5rem">
                <input
                  type="radio"
                  name="section-4"
                  id="checkbox-4a"
                  value="checkbox-4a"
                  v-model="order.row4.checkbox"
                />
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
                <input
                  type="radio"
                  name="section-4"
                  id="checkbox-4b"
                  value="checkbox-4b"
                  v-model="order.row4.checkbox"
                />
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
                <input
                  type="checkbox"
                  id="row-enabled-5"
                  v-model="order.row5.enabled"
                  @change="handleRowCheckboxChange(5)"
                />
              </div>
            </td>
            <td ref="row-5">
              <strong>ZEZWALAM</strong> wjechać z toru szlakowego nr
              <input type="text" v-model="order.row5.trackNo" holder="nr toru" /> z kierunku
              <input type="text" v-model="order.row5.direction" holder="stacja / post." /> na
              <select v-model="order.row5.stationType">
                <option value="stację">stację</option>
                <option value="posterunek odgałęźny">posterunek odgałęźny</option>
              </select>
              <input type="text" v-model="order.row5.stationName" holder="stacja / post." />
              i przejechać obok sygnału "Stój" na
              <input type="text" v-model="order.row5.on" holder="nazwa sygnału" />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useStore } from '../store/store';

type OrderRowRange = 1 | 2 | 3 | 4 | 5;

export default defineComponent({
  name: 'OrderN',

  setup() {
    const store = useStore();
    const order = reactive(store.orderN);

    const rowMethods = [
      () => {
        const { header } = order;

        const message = `<i>Rozkaz pisemny "N" nr ${header.orderNo || '_'} dla pociągu nr ${
          header.trainNo || '_'
        } dnia ${header.date} ${new Date().getUTCFullYear()}r.</i>`;

        return message;
      },

      () => {
        const { row1 } = order;

        const message = `Od ${row1.from || '_'} do ${row1.to || '_'} tor nr ${
          row1.trackNo || '_'
        } jest zamknięty, ruch jednotorowy dwukierunkowy wprowadzono po torze nr ${row1.trackNo2 || '_'}`;

        return message;
      },

      () => {
        const { row2 } = order;

        let message = `ZEZWALAM po otrzymaniu ${row2.option1 || '_'}`;

        if (row2.checkbox == 'checkbox-2a') {
          message += ` przejechać obok wskazującego sygnał "Stój" semafora ${row2.signalType || '_'} `;

          if (row2.signalType == 'wyjazdowego') message += row2.signal1 || '_';
          if (row2.signalType == 'drogowskazowego')
            message += `${row2.signal2 || '_'} (odnoszącego się do wyjazdu pociągu)`;
          if (row2.signalType == 'wjazdowego') message += `${row2.signal3 || '_'} na post. odg. bez sem. wyjazdowego`;

          message += ` i wyjechać w kierunku ${row2.direction1 || '_'} na tor szlakowy ${row2.option2 || '_'} nr ${
            row2.trackNoTo1 || '_'
          }`;
        }

        if (row2.checkbox == 'checkbox-2b') {
          message += ` z toru nr ${
            row2.trackNoFrom || '_'
          } nie posiadającego semafora wyjazdowego wyjechać w kierunku ${row2.direction2 || '_'} na tor szlakowy ${
            row2.option3 || '_'
          } nr ${row2.trackNoTo2 || '_'}`;
        }

        return message;
      },

      () => {
        const { row3 } = order;

        let message = `${row3.option1 || '_'} pociągu odbędzie się w kierunku: ${row3.direction || '_'} do km ${
          row3.toKilometer || '_'
        } skąd ${row3.option2 || '_'} ma wrócić po torze lewym nr ${row3.trackNo || '_'} najpóźniej o godz. ${
          row3.untilHour || '_'
        } min. ${row3.untilMin || '_'}`;

        return message;
      },

      () => {
        const { row4 } = order;

        let message = `WJAZD z toru szlakowego nr ${row4.trackNo || '_'} na ${row4.optionStation || '_'} ${
          row4.stationName || '_'
        } odbędzie się po otrzymaniu: `;

        if (row4.checkbox == 'checkbox-4a')
          message += `sygnału zastępczego "Sz" na osobnym urządzeniu ustawionym z ${row4.side || '_'} strony toru`;

        if (row4.checkbox == 'checkbox-4b')
          message += 'rozkazu pisemnego "N" (doręczonego lub przekazanego przez urządzenia łączności)';

        return message;
      },

      () => {
        const { row5 } = order;

        const message = `ZEZWALAM wjechać z toru szlakowego nr ${row5.trackNo || '_'} z kierunku ${
          row5.direction || '_'
        } na ${row5.stationType || '_'} ${row5.stationName || '_'} i przejechać obok sygnału "Stój" na ${
          row5.on || '_'
        } `;

        return message;
      },
    ];

    return {
      store,
      order,
      rowMethods,
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

  activated() {
    this.generateMessage();
  },

  methods: {
    handleRowCheckboxChange(rowIndex: 1 | 2 | 3 | 4 | 5) {
      const isRowEnabled = this.order[`row${rowIndex}`].enabled;
      const rowRef = this.$refs[`row-${rowIndex}`] as HTMLTableElement;

      if (!isRowEnabled) {
        rowRef.querySelectorAll('input[type="text"]').forEach((node) => {
          node.setAttribute('holder', node.getAttribute('placeholder') || '');
          node.removeAttribute('placeholder');
        });

        return;
      }

      rowRef.querySelectorAll('input[type="text"]').forEach((node) => {
        if (node.getAttribute('holder')) node.setAttribute('placeholder', node.getAttribute('holder')!);
        node.removeAttribute('holder');
      });
    },

    generateMessage() {
      let message = this.rowMethods[0]();

      for (let i = 1; i <= 5; i++) {
        if (!this.order[`row${i as OrderRowRange}`].enabled) continue;

        message += ` <b> [ ${i} ] </b> ${this.rowMethods[i]()}`;
      }

      this.store.orderMessage = message;
    },
  },
});
</script>

