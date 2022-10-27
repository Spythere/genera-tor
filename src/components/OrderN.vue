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
                <input type="checkbox" id="row-enabled-1" v-model="order.rows[0].enabled" />
              </div>
            </td>
            <td ref="row-1">
              Od <input type="text" v-model="order.rows[0].from" holder="stacja / post." /> do
              <input type="text" v-model="order.rows[0].to" holder="stacja / post." /> tor nr
              <input type="text" v-model="order.rows[0].trackNo" holder="nr toru" /> jest zamknięty, ruch jednotorowy
              dwukierunkowy wprowadzono po torze nr
              <input type="text" v-model="order.rows[0].trackNo2" holder="nr toru" />
            </td>
          </tr>
          <tr>
            <td>
              <label for="row-enabled-2">2</label>
              <div>
                <input type="checkbox" id="row-enabled-2" v-model="order.rows[1].enabled" />
              </div>
            </td>
            <td ref="row-2">
              <strong>ZEZWALAM</strong> po otrzymaniu
              <select id="select-2a" v-model="order.rows[1].option1">
                <option :value="`sygnału &quot;Nakaz Jazdy&quot;`">sygnału "Nakaz Jazdy"</option>
                <option value="tylko tego rozkazu pisemnego">tylko tego rozkazu pisemnego</option>
              </select>
              <div style="margin-top: 0.5rem">
                <input
                  type="radio"
                  name="section-2"
                  id="checkbox-2a"
                  value="checkbox-2a"
                  v-model="order.rows[1].checkbox"
                  :checked="order.rows[1].checkbox == 'checkbox-2a'"
                  @change="handleRowCheckboxChange(2)"
                />
                <label for="checkbox-2a">
                  przejechać obok wskazującego sygnał "Stój" semafora
                  <div style="margin-left: 1rem">
                    <input
                      type="radio"
                      name="section-2a"
                      id="radio-2a-1"
                      value="wyjazdowego"
                      v-model="order.rows[1].signalType"
                      @change="handleRowCheckboxChange(2)"
                    />
                    <label for="radio-2a-1">
                      wyjazdowego
                      <input
                        type="text"
                        v-model="order.rows[1].signal1"
                        holder="nazwa sem."
                        :radio-checked="
                          order.rows[1].checkbox == 'checkbox-2a' && order.rows[1].signalType == 'wyjazdowego'
                        "
                      />
                    </label>
                    <br />
                    <input
                      type="radio"
                      name="section-2a"
                      id="radio-2a-2"
                      value="drogowskazowego"
                      v-model="order.rows[1].signalType"
                      @change="handleRowCheckboxChange(2)"
                    />
                    <label for="radio-2a-2">
                      drogowskazowego
                      <input
                        type="text"
                        v-model="order.rows[1].signal2"
                        holder="nazwa sem."
                        :radio-checked="
                          order.rows[1].checkbox == 'checkbox-2a' && order.rows[1].signalType == 'drogowskazowego'
                        "
                      />
                      (odnoszącego się do wyjazdu pociągu)
                    </label>
                    <br />
                    <input
                      type="radio"
                      name="section-2a"
                      id="radio-2a-3"
                      value="wjazdowego"
                      v-model="order.rows[1].signalType"
                      @change="handleRowCheckboxChange(2)"
                    />
                    <label for="radio-2a-3">
                      wjazdowego
                      <input
                        type="text"
                        v-model="order.rows[1].signal3"
                        holder="nazwa sem."
                        :radio-checked="
                          order.rows[1].checkbox == 'checkbox-2a' && order.rows[1].signalType == 'wjazdowego'
                        "
                      />
                      na post. odg. bez sem. wyjazdowego
                    </label>
                  </div>
                  i wyjechać w kierunku
                  <input
                    type="text"
                    v-model="order.rows[1].direction1"
                    holder="stacja / post."
                    :radio-checked="order.rows[1].checkbox == 'checkbox-2a'"
                  />
                  na tor szlakowy
                  <select v-model="order.rows[1].option2">
                    <option value="lewy">lewy</option>
                    <option value="prawy">prawy</option>
                  </select>
                  nr
                  <input
                    type="text"
                    v-model="order.rows[1].trackNoTo1"
                    holder="nr toru"
                    :radio-checked="order.rows[1].checkbox == 'checkbox-2a'"
                  />
                </label>
              </div>
              <div style="margin-top: 0.5rem">
                <input
                  type="radio"
                  name="section-2"
                  id="checkbox-2b"
                  value="checkbox-2b"
                  v-model="order.rows[1].checkbox"
                  :checked="order.rows[1].checkbox == 'checkbox-2b'"
                  @change="handleRowCheckboxChange(2)"
                />
                <label for="checkbox-2b">
                  z toru nr
                  <input
                    type="text"
                    v-model="order.rows[1].trackNoFrom"
                    holder="nr toru"
                    :radio-checked="order.rows[1].checkbox == 'checkbox-2b'"
                  />
                  nie posiadającego semafora wyjazdowego wyjechać w kierunku
                  <input
                    type="text"
                    v-model="order.rows[1].direction2"
                    holder="stacja / post."
                    :radio-checked="order.rows[1].checkbox == 'checkbox-2b'"
                  />
                  na tor szlakowy
                  <select v-model="order.rows[1].option3">
                    <option value="lewy">lewy</option>
                    <option value="prawy">prawy</option>
                  </select>
                  nr
                  <input
                    type="text"
                    v-model="order.rows[1].trackNoTo2"
                    holder="nr toru"
                    :radio-checked="order.rows[1].checkbox == 'checkbox-2b'"
                  />
                </label>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <label for="row-enabled-3">3</label>
              <div>
                <input type="checkbox" id="row-enabled-3" v-model="order.rows[2].enabled" />
              </div>
            </td>
            <td ref="row-3">
              <select v-model="order.rows[2].option1">
                <option value="Jazda">Jazda</option>
                <option value="Popychanie">Popychanie</option>
              </select>
              pociągu odbędzie się w kierunku:
              <input type="text" v-model="order.rows[2].direction" holder="stacja / post." /> do km
              <input type="text" v-model="order.rows[2].toKilometer" holder="kilometry" /> skąd
              <select v-model="order.rows[2].option2">
                <option value="pociąg">pociąg</option>
                <option value="popychacz">popychacz</option>
              </select>
              ma wrócić po torze lewym nr
              <input type="text" v-model="order.rows[2].trackNo" holder="nr toru" /> najpóźniej o godz.
              <input type="text" v-model="order.rows[2].untilHour" holder="godzina" /> min.
              <input type="text" v-model="order.rows[2].untilMin" holder="minuta" />
            </td>
          </tr>
          <tr>
            <td>
              <label for="row-enabled-4">4</label>
              <div>
                <input type="checkbox" id="row-enabled-4" v-model="order.rows[3].enabled" />
              </div>
            </td>
            <td ref="row-4">
              <strong>WJAZD</strong> z toru szlakowego nr
              <input type="text" v-model="order.rows[3].trackNo" holder="nr toru" /> na
              <select v-model="order.rows[3].optionStation">
                <option value="stację">stację</option>
                <option value="posterunek odgałęźny">posterunek odgałęźny</option>
              </select>
              <input type="text" v-model="order.rows[3].stationName" holder="stacja / post." /> odbędzie się po
              otrzymaniu:
              <div style="margin-top: 0.5rem">
                <input
                  type="radio"
                  name="section-4"
                  id="checkbox-4a"
                  value="checkbox-4a"
                  v-model="order.rows[3].checkbox"
                />
                <label for="checkbox-4a">
                  sygnału zastępczego "Sz" na osobnym urządzeniu ustawionym z
                  <select v-model="order.rows[3].side">
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
                  v-model="order.rows[3].checkbox"
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
                <input type="checkbox" id="row-enabled-5" v-model="order.rows[4].enabled" />
              </div>
            </td>
            <td ref="row-5">
              <strong>ZEZWALAM</strong> wjechać z toru szlakowego nr
              <input type="text" v-model="order.rows[4].trackNo" holder="nr toru" /> z kierunku
              <input type="text" v-model="order.rows[4].direction" holder="stacja / post." /> na
              <select v-model="order.rows[4].stationType">
                <option value="stację">stację</option>
                <option value="posterunek odgałęźny">posterunek odgałęźny</option>
              </select>
              <input type="text" v-model="order.rows[4].stationName" holder="stacja / post." />
              i przejechać obok sygnału "Stój" na
              <input type="text" v-model="order.rows[4].on" holder="nazwa sygnału" />
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
import { handleOrderPlaceholders } from '../handlers/orderPlaceholderHandler';

type TOrderRows = 1 | 2 | 3 | 4 | 5;

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
        const row = order.rows[0];

        const message = `Od ${row.from || '_'} do ${row.to || '_'} tor nr ${
          row.trackNo || '_'
        } jest zamknięty, ruch jednotorowy dwukierunkowy wprowadzono po torze nr ${row.trackNo2 || '_'}`;

        return message;
      },

      () => {
        const row = order.rows[1];

        let message = `ZEZWALAM po otrzymaniu ${row.option1 || '_'}`;

        if (row.checkbox == 'checkbox-2a') {
          message += ` przejechać obok wskazującego sygnał "Stój" semafora ${row.signalType || '_'} `;

          if (row.signalType == 'wyjazdowego') message += row.signal1 || '_';
          if (row.signalType == 'drogowskazowego')
            message += `${row.signal2 || '_'} (odnoszącego się do wyjazdu pociągu)`;
          if (row.signalType == 'wjazdowego') message += `${row.signal3 || '_'} na post. odg. bez sem. wyjazdowego`;

          message += ` i wyjechać w kierunku ${row.direction1 || '_'} na tor szlakowy ${row.option2 || '_'} nr ${
            row.trackNoTo1 || '_'
          }`;
        }

        if (row.checkbox == 'checkbox-2b') {
          message += ` z toru nr ${row.trackNoFrom || '_'} nie posiadającego semafora wyjazdowego wyjechać w kierunku ${
            row.direction2 || '_'
          } na tor szlakowy ${row.option3 || '_'} nr ${row.trackNoTo2 || '_'}`;
        }

        return message;
      },

      () => {
        const row = order.rows[2];

        let message = `${row.option1 || '_'} pociągu odbędzie się w kierunku: ${row.direction || '_'} do km ${
          row.toKilometer || '_'
        } skąd ${row.option2 || '_'} ma wrócić po torze lewym nr ${row.trackNo || '_'} najpóźniej o godz. ${
          row.untilHour || '_'
        } min. ${row.untilMin || '_'}`;

        return message;
      },

      () => {
        const row = order.rows[3];

        let message = `WJAZD z toru szlakowego nr ${row.trackNo || '_'} na ${row.optionStation || '_'} ${
          row.stationName || '_'
        } odbędzie się po otrzymaniu: `;

        if (row.checkbox == 'checkbox-4a')
          message += `sygnału zastępczego "Sz" na osobnym urządzeniu ustawionym z ${row.side || '_'} strony toru`;

        if (row.checkbox == 'checkbox-4b')
          message += 'rozkazu pisemnego "N" (doręczonego lub przekazanego przez urządzenia łączności)';

        return message;
      },

      () => {
        const row = order.rows[4];

        const message = `ZEZWALAM wjechać z toru szlakowego nr ${row.trackNo || '_'} z kierunku ${
          row.direction || '_'
        } na ${row.stationType || '_'} ${row.stationName || '_'} i przejechać obok sygnału "Stój" na ${row.on || '_'} `;

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
    'order.rows': {
      deep: true,
      handler() {
        this.updatePlaceholders();
      },
    },
  },

  mounted() {
    this.updatePlaceholders();
  },

  activated() {
    this.generateMessage();
  },

  methods: {
    updatePlaceholders() {
      this.order.rows.forEach((_, i) => {
        this.handleRowCheckboxChange((i + 1) as TOrderRows);
      });
    },

    handleRowCheckboxChange(rowIndex: TOrderRows) {
      const isRowEnabled = this.order.rows[rowIndex - 1].enabled;
      const rowRef = this.$refs[`row-${rowIndex}`] as HTMLTableElement;

      this.$nextTick(() => {
        handleOrderPlaceholders(isRowEnabled, rowRef);
      });
    },

    generateMessage() {
      let message = this.rowMethods[0]();

      for (let i = 0; i < 5; i++) {
        if (!this.order.rows[i].enabled) continue;

        message += ` <b> [ ${i + 1} ] </b> ${this.rowMethods[i + 1]()}`;
      }

      this.store.orderMessage = message;
    },
  },
});
</script>

