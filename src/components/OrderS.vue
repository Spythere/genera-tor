<template>
  <section class="order-s">
    <section class="header">
      <h2 class="flex-center">
        Rozkaz pisemny "S" nr
        <input type="text" v-model="order.header.orderNo" placeholder="nr rozkazu" />
      </h2>
      <div class="flex-row">
        dla
        <select id="select-header" v-model="order.header.for">
          <option value="pociągu">pociągu</option>
          <option value="manewru">manewru</option>
        </select>
        nr <input type="text" v-model="order.header.trainNo" :placeholder="`nr ${order.header.for}`" /> dnia
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
                  v-model="order.rows[0].enabled"
                  @change="handleRowCheckboxChange(1)"
                />
              </div>
            </td>
            <td ref="row-1">
              zezwalam po otrzymaniu
              <select id="select-1a" v-model="order.rows[0].option1">
                <option :value="`sygnału &quot;nakaz jazdy&quot;`">sygnału "nakaz jazdy"</option>
                <option value="tylko tego rozkazu pisemnego">tylko tego rozkazu pisemnego</option>
              </select>
              <div style="margin-top: 0.5rem">
                <input
                  type="radio"
                  name="section-1a"
                  id="radio-1a-1"
                  value="radio-1a-1"
                  v-model="order.rows[0].radio1"
                  @change="handleRowCheckboxChange(1)"
                />
                <label for="radio-1a-1">
                  przejechać obok wskazującego sygnał "Stój" semafora
                  <select id="select-signal" v-model="order.rows[0].optionSignal">
                    <option value="wyjazdowego">wyjazdowego</option>
                    <option value="drogowskazowego">drogowskazowego</option>
                  </select>
                  <input
                    type="text"
                    v-model="order.rows[0].signal1"
                    holder="nazwa sem."
                    :radio-checked="order.rows[0].radio1 == 'radio-1a-1'"
                  />
                  <br />
                </label>
                <hr />
                <input
                  type="radio"
                  name="section-1a"
                  id="radio-1a-2"
                  value="radio-1a-2"
                  v-model="order.rows[0].radio1"
                  @change="handleRowCheckboxChange(1)"
                />
                <label for="radio-1a-2">
                  wyjechać z toru nr
                  <input
                    type="text"
                    v-model="order.rows[0].trackNo"
                    holder="nr toru"
                    :radio-checked="order.rows[0].radio1 == 'radio-1a-2'"
                  />
                  nie posiadającego semafora wyjazdowego
                </label>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <label for="row-enabled-2">2</label>
              <div>
                <input
                  type="checkbox"
                  id="row-enabled-2"
                  v-model="order.rows[1].enabled"
                  @change="handleRowCheckboxChange(2)"
                />
              </div>
            </td>
            <td ref="row-2">
              zezwalam przejechać obok wskazującego sygnał "Stój" semafora:
              <div>
                <input
                  type="radio"
                  name="section-2a"
                  id="radio-2a-1"
                  value="wyjazdowego"
                  @change="handleRowCheckboxChange(2)"
                  v-model="order.rows[1].signalType"
                />
                <label for="radio-2a-1">
                  wjazdowego
                  <input
                    type="text"
                    v-model="order.rows[1].signal1"
                    holder="nazwa sem."
                    :radio-checked="order.rows[1].signalType == 'wyjazdowego'"
                  />
                </label>
                <br />
                <input
                  type="radio"
                  name="section-2a"
                  id="radio-2a-2"
                  value="drogowskazowego"
                  @change="handleRowCheckboxChange(2)"
                  v-model="order.rows[1].signalType"
                />
                <label for="radio-2a-2">
                  drogowskazowego
                  <input
                    type="text"
                    v-model="order.rows[1].signal2"
                    holder="nazwa sem."
                    :radio-checked="order.rows[1].signalType == 'drogowskazowego'"
                  />
                  (odnoszącego się do wyjazdu pociągu)
                </label>
                <br />
                <input
                  type="radio"
                  name="section-2a"
                  id="radio-2a-3"
                  value="odstępowego"
                  @change="handleRowCheckboxChange(2)"
                  v-model="order.rows[1].signalType"
                />
                <label for="radio-2a-3">
                  odstępowego
                  <input
                    type="text"
                    v-model="order.rows[1].signal3"
                    holder="nazwa sem."
                    :radio-checked="order.rows[1].signalType == 'odstępowego'"
                /></label>
                <br />
                <input
                  type="radio"
                  name="section-2a"
                  id="radio-2a-4"
                  value="toru"
                  v-model="order.rows[1].signalType"
                  @change="handleRowCheckboxChange(2)"
                />
                <label for="radio-2a-4">
                  wjechać z zamkniętego toru nr
                  <input
                    type="text"
                    v-model="order.rows[1].trackNo"
                    holder="nr toru"
                    :radio-checked="order.rows[1].signalType == 'toru'"
                  />
                  nie posiadającego semafora wjazdowego
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
                  v-model="order.rows[2].enabled"
                  @change="handleRowCheckboxChange(3)"
                />
              </div>
            </td>
            <td ref="row-3">
              Od <input type="text" v-model="order.rows[2].from" holder="stacja / post." /> do
              <input type="text" v-model="order.rows[2].to" holder="stacja / post." /> po torze nr
              <input type="text" v-model="order.rows[2].trackNo" holder="nr toru" /> ruch pociągów prowadzony jest w
              odstępie posterunków następczych. Wskazania semaforów sbl są nieważne. Zachować ostrożność od ostatniego
              semafora ze wskaźnikiem "W18". Szlak wolny, ostatni pociąg nr
              <input type="text" v-model="order.rows[2].trainNo" holder="nr pociągu" /> przybył do
              <input type="text" v-model="order.rows[2].arrivedTo" holder="stacja / post." /> o godzinie
              <input type="text" v-model="order.rows[2].hour" holder="godzina" />
            </td>
          </tr>
          <tr style="height: 255px">
            <td>
              <label for="row-enabled-4">4</label>
              <div>
                <input
                  type="checkbox"
                  id="row-enabled-4"
                  v-model="order.rows[3].enabled"
                  @change="handleRowCheckboxChange(4)"
                />
              </div>
            </td>
            <td ref="row-4">
              Inne:
              <br />
              <textarea id="" cols="30" rows="10" v-model="order.rows[3].content" placeholder="Np.: "></textarea>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { handleOrderPlaceholders } from '../handlers/orderPlaceholderHandler';
import { useStore } from '../store/store';

type TOrderRows = 1 | 2 | 3 | 4;

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
        const row = order.rows[0];

        let message = `zezwalam po otrzymaniu ${row.option1 || '_'}`;

        if (row.radio1 == 'radio-1a-1')
          message += ` przejechać obok wskazującego sygnał "Stój" semafora ${row.optionSignal || '_'} ${
            row.signal1 || '_'
          }`;
        else message += ` wyjechać z toru nr ${row.trackNo || '_'} nie posiadającego semafora wyjazdowego`;

        return message;
      },

      () => {
        const row = order.rows[1];

        let message = `zezwalam przejechać obok wskazującego sygnał "Stój" semafora `;

        switch (row.signalType) {
          case 'wyjazdowego':
            message += `wjazdowego ${row.signal1 || '_'}`;
            break;
          case 'drogowskazowego':
            message += `drogowskazowego ${row.signal2 || '_'}`;
            break;
          case 'odstępowego':
            message += `odstępowego ${row.signal3 || '_'}`;
            break;
          case 'toru':
            message += `wjechać z zamkniętego toru nr ${row.trackNo || '_'} nie posiadającego semafora wjazdowego`;
            break;

          default:
            break;
        }

        return message;
      },
      () => {
        const row = order.rows[2];

        return `Od ${row.from || '_'} do ${row.to || '_'} po torze nr ${
          row.trackNo || '_'
        } ruch pociągów prowadzony jest w odstępie posterunków następczych. Wskazania semaforów sbl są nieważne. Zachować ostrożność od ostatniego semafora ze wskaźnikiem "W18". Szlak wolny, ostatni pociąg nr ${
          row.trainNo || '_'
        } przybył do ${row.arrivedTo || '_'} o godzinie ${row.hour || '_'}`;
      },

      () => {
        const row = order.rows[3];

        return `Inne: ${row.content}`;
      },
    ];

    return {
      store,
      order,
      rowMethods,
    };
  },

  activated() {
    this.generateMessage();
  },

  mounted() {
    this.updatePlaceholders();
  },

  watch: {
    order: {
      deep: true,
      handler() {
        this.generateMessage();
      },
    },

    'order.rows': {
      deep: true,
      handler() {
        this.updatePlaceholders();
      },
    },
  },

  methods: {
    updatePlaceholders() {
      this.order.rows.forEach((_, i) => {
        this.handleRowCheckboxChange((i + 1) as TOrderRows);
      });
    },

    generateMessage() {
      let message = this.rowMethods[0]();

      for (let i = 0; i < 4; i++) {
        if (!this.order.rows[i].enabled) continue;

        message += ` <b> [ ${i + 1} ] </b> ${this.rowMethods[i]()}`;
      }

      this.store.orderMessage = message;
    },

    handleRowCheckboxChange(rowIndex: TOrderRows) {
      const isRowEnabled = this.order.rows[rowIndex - 1].enabled;
      const rowRef = this.$refs[`row-${rowIndex}`] as HTMLTableElement;

      this.$nextTick(() => {
        handleOrderPlaceholders(isRowEnabled, rowRef);
      });
    },
  },
});
</script>

<style lang="scss" scoped>
textarea {
  width: 95%;
  height: 200px;
  resize: none;
}
</style>

