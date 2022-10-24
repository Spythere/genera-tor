<template>
  <section class="order-o">
    <section class="order_header">
      <h2 class="flex-center" style="padding: 0 0.5em">
        Rozkaz pisemny "O" nr
        <input type="text" v-model="order.header.orderNo" />
      </h2>

      <div class="flex-row" style="padding: 0 0.5em">
        dla pociągu nr <input type="text" v-model="order.header.trainNo" /> dnia
        <input type="text" v-model="order.header.date" /> {{ new Date().getUTCFullYear() }}r.
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
            <td width="25%" rowspan="2">
              Na posterunku, <br />
              na szlaku
            </td>
            <td>od</td>
            <td>do</td>
            <td width="10%" rowspan="2">1) prędkość najwyżej km/h</td>
            <td width="10%" rowspan="2">2) jechać ostrożnie</td>
            <td width="35%" rowspan="2">z powodu</td>
          </tr>

          <tr class="tr-header">
            <td colspan="2">kilometra</td>
          </tr>

          <tr v-for="row in order.orderList" class="tr-data">
            <td>
              <input type="text" v-model="row.name" />
            </td>
            <td>
              <input type="text" v-model="row.from" />
            </td>
            <td>
              <input type="text" v-model="row.to" />
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

      <div class="order_other">
        Inne:
        <br />
        <textarea v-model="order.other"></textarea>
      </div>
    </section>
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

        return `<i>Rozkaz pisemny "O" nr ${header.orderNo || '_'} dla pociągu nr ${header.trainNo || '_'} dnia ${
          header.date || '_'
        } ${new Date().getUTCFullYear()}r.</i> <b> [ 1 ] </b> 1) zmniejszyć prędkość jazdy i zachować ostrożność, 2) jechać ostrożnie (j.o.)`;
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

      for (let i = 0; i < this.order.orderList.length; i++) {
        const row = this.order.orderList[i];

        if (row.name) {
          message += `; ${row.name || '_'} od ${row.from || '_'} do ${row.to || '_'} kilometra`;

          if (row.vmax) message += ` prędkość najwyżej ${row.vmax} km/h`;
          if (row.jo) message += ` jechać ostrożnie`;

          message += ` z powodu: ${row.reason || '_'}`;
        }
      }

      if (this.order.other) message += `; ${this.order.other}`;

      this.store.orderMessage = message;
    },
  },
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
  border: 2px solid black;
  border-bottom: none;
}

.horizontal-bar {
  width: 100%;
  height: 2px;

  background-color: black;
  margin: 0.5em 0;
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

  textarea {
    width: 80%;
    height: 40px;
    resize: vertical;
  }
}

.order_other {
  border-left: 2px solid black;
  border-right: 2px solid black;

  display: flex;
  flex-direction: column;
  height: 285px;

  padding: 0.5em;

  textarea {
    resize: vertical;
    height: 220px;
    width: 95%;
  }
}
</style>
