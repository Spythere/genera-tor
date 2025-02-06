<template>
  <section class="order-o">
    <section class="order_header">
      <h2 class="flex-center" style="padding: 0 0.5em">
        Rozkaz pisemny "O" nr
        <input type="number" v-model="order.header.orderNo" placeholder="nr rozkazu" min="1" />
      </h2>

      <div class="flex-row" style="padding: 0 0.5em">
        dla pociągu nr
        <input type="text" v-model="order.header.trainNo" placeholder="nr pociągu" />
        dnia
        <input type="text" v-model="order.header.date" />
      </div>

      <div class="horizontal-bar"></div>

      <div style="display: flex; padding: 0 0.5em">
        <b>1.</b>

        <div style="margin-left: 1.5em">
          1) zmniejszyć prędkość jazdy i zachować ostrożność <br />2) jechać ostrożnie (j.o.)
        </div>
      </div>
    </section>

    <section class="order_table">
      <table cellborder="1">
        <tbody>
          <tr class="tr-header">
            <td rowspan="2" width="35%">
              Na posterunku, <br />
              na szlaku
            </td>
            <td width="20%">od</td>
            <td width="20%">do</td>
            <td rowspan="2">1) prędkość najwyżej km/h</td>
            <td rowspan="2">2) j.o.</td>
            <td rowspan="2" width="35%">z powodu</td>
          </tr>

          <tr class="tr-header">
            <td colspan="2">kilometra</td>
          </tr>

          <tr v-for="(row, i) in order.orderList" :key="i" class="tr-data">
            <td>
              <textarea v-model="row.name"></textarea>
            </td>
            <td>
              <textarea v-model="row.from"></textarea>
            </td>
            <td>
              <textarea v-model="row.to"></textarea>
            </td>
            <td>
              <input type="text" v-model="row.vmax" />
            </td>
            <td>
              <input type="checkbox" v-model="row.jo" />
            </td>
            <td>
              <textarea v-model="row.reason"></textarea>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <div class="order_other">
      <span><b>2.</b> Inne:</span>
      <br />
      <textarea class="others" cols="30" rows="10" v-model="order.other"></textarea>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useStore } from '../store/store';

export default defineComponent({
  name: 'OrderO',

  setup() {
    const store = useStore();
    const order = reactive(store.orderO);

    const rowMethods = [
      () => {
        const { header } = order;

        return `<i>Rozkaz pisemny "O" nr ${header.orderNo || '_'} dla pociągu nr ${
          header.trainNo || '_'
        } dnia ${header.date || '_'}</i>`;
      }
    ];

    return {
      store,
      order,
      rowMethods
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
      }
    }
  },

  methods: {
    generateMessage() {
      let message = this.rowMethods[0]();

      if (this.order.orderList.some((row) => row.name)) message += `<b> [ 1 ] </b>`;

      const rowsMessageList = [];

      for (let i = 0; i < this.order.orderList.length; i++) {
        const row = this.order.orderList[i];
        if (!row.name) continue;

        let rowMessage = '';
        rowMessage += ` ${row.name || '_'} od ${row.from || '_'} do ${row.to || '_'} kilometra`;

        if (row.vmax) rowMessage += ` prędkość najwyżej ${row.vmax} km/h`;
        if (row.jo) rowMessage += ` jechać ostrożnie`;

        rowMessage += ` z powodu: ${row.reason || '_'}`;

        rowsMessageList.push(rowMessage);
      }

      message += rowsMessageList.join('; ');

      if (this.order.other) message += ` <b> [ 2 ] </b> Inne: ${this.order.other}`;

      this.store.orderMessage = message;
    }
  }
});
</script>

<style lang="scss" scoped>
table,
td,
th {
  border: 2px solid black;
  border-collapse: collapse;
}

.order_header {
  padding: 0.5em 0;
}

.order_table {
  .tr-header td {
    padding: 1em 0.5em;
  }

  .tr-data td {
    padding: 0.5em 0;
  }

  tbody {
    font-weight: normal;
    text-align: center;
    vertical-align: middle;
  }

  input {
    width: 80%;
  }
}

.order_table {
  textarea {
    width: 90%;
    min-height: 50px;
    resize: vertical;
  }
}

.order_other {
  border-left: 2px solid black;
  border-right: 2px solid black;

  display: flex;
  flex-direction: column;

  padding: 0.5em;
}
</style>
