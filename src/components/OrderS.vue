<template>
  <section class="order-s">
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
            <td>
              <label for="row-enabled-2">1</label>
              <div>
                <input type="checkbox" id="row-enabled-1" v-model="order.row1.enabled" />
              </div>
            </td>
            <td>
              zezwalam po otrzymaniu
              <select id="select-1a" v-model="order.row1.option1">
                <option value='sygnału "nakaz jazdy"'>sygnału "nakaz jazdy"</option>
                <option value="tylko tego rozkazu pisemnego">tylko tego rozkazu pisemnego</option>
              </select>
              <div style="margin-top: 0.5rem">
                <input type="radio" name="section-1a" id="radio-1a-1" value="radio-1a-1" v-model="order.row1.radio1" />
                <label for="radio-1a-1">
                  przejechać obok wskazującego sygnał "Stój" semafora
                  <select id="select-signal" v-model="order.row1.optionSignal">
                    <option value="wyjazdowego">wyjazdowego</option>
                    <option value="drogowskazowego">drogowskazowego</option>
                  </select>
                  <input type="text" v-model="order.row1.signal1" />
                  <br />
                </label>
                <hr />
                <input type="radio" name="section-1a" id="radio-1a-2" value="radio-1a-2" v-model="order.row1.radio1" />
                <label for="radio-1a-2">
                  wyjechać z toru nr <input type="text" v-model="order.row1.trackNo" /> nie posiadającego semafora
                  wyjazdowego
                </label>
              </div>
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
              zezwalam przejechać obok wskazującego sygnał "Stój" semafora:
              <div>
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
                  value="odstępowego"
                  v-model="order.row2.signalType"
                />
                <label for="radio-2a-3">odstępowego <input type="text" v-model="order.row2.signal3" /></label>
                <br />
                <input type="radio" name="section-2a" id="radio-2a-4" value="toru" v-model="order.row2.signalType" />
                <label for="radio-2a-4">
                  wjechać z zamkniętego toru nr <input type="text" v-model="order.row2.trackNo" /> nie posiadającego
                  semafora wjazdowego
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
              Od <input type="text" v-model="order.row3.from" /> do <input type="text" v-model="order.row3.to" /> po
              torze nr <input type="text" v-model="order.row3.trackNo" /> ruch pociągów prowadzony jest w odstępie
              posterunków następczych. Wskazania semaforów sbl są nieważne. Zachować ostrożność od ostatniego semafora
              ze wskaźnikiem "W18". Szlak wolny, ostatni pociąg nr
              <input type="text" v-model="order.row3.trainNo" /> przybył do
              <input type="text" v-model="order.row3.arrivedTo" /> o godzinie
              <input type="text" v-model="order.row3.hour" />
            </td>
          </tr>
          <tr style="height: 255px">
            <td>
              <label for="row-enabled-4">4</label>
              <div>
                <input type="checkbox" id="row-enabled-4" v-model="order.row4.enabled" />
              </div>
            </td>
            <td>
              Inne:
              <br />
              <textarea id="" cols="30" rows="10" v-model="order.row4.content"></textarea>
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

type OrderRowRange = 1 | 2 | 3 | 4;

export default defineComponent({
  name: 'OrderS',

  setup() {
    const store = useStore();
    const order = reactive(store.orderS);

    const rowMethods = [
      () => {
        const { header } = order;

        return `<i>Rozkaz pisemny "S" nr ${header.orderNo || '_'} dla ${header.for || '_'} nr ${
          header.trainNo || '_'
        } dnia ${header.date || '_'} ${new Date().getUTCFullYear()}r.</i>`;
      },

      () => {
        const { row1 } = order;

        let message = `zezwalam po otrzymaniu ${row1.option1 || '_'}`;

        if (row1.radio1 == 'radio-1a-1')
          message += ` przejechać obok wskazującego sygnał "Stój" semafora ${row1.optionSignal || '_'} ${
            row1.signal1 || '_'
          }`;
        else message += ` wyjechać z toru nr ${row1.trackNo || '_'} nie posiadającego semafora wyjazdowego`;

        return message;
      },

      () => {
        const { row2 } = order;

        let message = `zezwalam przejechać obok wskazującego sygnał "Stój" semafora `;

        switch (row2.signalType) {
          case 'wyjazdowego':
            message += `wyjazdowego ${row2.signal1 || '_'}`;
            break;
          case 'drogowskazowego':
            message += `drogowskazowego ${row2.signal2 || '_'}`;
            break;
          case 'odstępowego':
            message += `odstępowego ${row2.signal3 || '_'}`;
            break;
          case 'toru':
            message += `wjechać z zamkniętego toru nr ${row2.trackNo || '_'} nie posiadającego semafora wjazdowego`;
            break;

          default:
            break;
        }

        return message;
      },
      () => {
        const { row3 } = order;

        return `Od ${row3.from || '_'} do ${row3.to || '_'} po torze nr ${
          row3.trackNo || '_'
        } ruch pociągów prowadzony jest w odstępie posterunków następczych. Wskazania semaforów sbl są nieważne. Zachować ostrożność od ostatniego semafora ze wskaźnikiem "W18". Szlak wolny, ostatni pociąg nr ${
          row3.trainNo || '_'
        } przybył do ${row3.arrivedTo || '_'} o godzinie ${row3.hour || '_'}`;
      },

      () => {
        const { row4 } = order;

        return `Inne: ${row4.content}`;
      },
    ];

    return {
      store,
      order: store.orderS,
      rowMethods,
    };
  },

  activated() {
    this.generateMessage();
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
      let message = this.rowMethods[0]();

      for (let i = 1; i <= 4; i++) {
        if (!this.order[`row${i as OrderRowRange}`].enabled) continue;

        message += ` <b> [ ${i} ] </b> ${this.rowMethods[i]()}`;
      }

      this.store.orderMessage = message;
    },
  },
});
</script>

<style lang="scss">
textarea {
  width: 95%;
  height: 200px;
  resize: none;
}
</style>
