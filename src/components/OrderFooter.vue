<template>
  <section class="order_info">
    <table>
      <tbody>
        <tr>
          <td colspan="4">
            <input type="text" v-model="footerInfo.stationName" placeholder="nazwa stacji" />
            <br />
            stacja
          </td>

          <td colspan="3">
            <input type="text" v-model="footerInfo.checkpointName" placeholder="skrót posterunku" />
            <br />
            posterunek
          </td>

          <td colspan="2">
            <input type="text" v-model="footerInfo.hour" placeholder="godzina" />
            <br />
            godz.
          </td>

          <td colspan="1">
            <input type="text" v-model="footerInfo.minutes" placeholder="minuta" />
            <br />
            min.
          </td>
        </tr>

        <tr>
          <td colspan="5">
            <input type="text" v-model="footerInfo.dispatcherName" placeholder="dyżurny" />
            <br />
            dyżurny ruchu
          </td>

          <td colspan="5">
            <input
              type="text"
              v-model="footerInfo.secondaryDispatcherName"
              placeholder="dyżurny (wypełnić jedno)"
            />
            <br />
            z polecenia dyżurnego ruchu
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import orderFooterMixin from '../mixins/orderFooterMixin';
import { useStore } from '../store/store';

export default defineComponent({
  mixins: [orderFooterMixin],

  setup() {
    const store = useStore();

    return {
      store,
      footerInfo: store.orderFooter
    };
  },

  watch: {
    footerInfo: {
      deep: true,
      handler() {
        this.generateFooter();
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.order_info {
  table {
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed;

    td {
      border: 2px solid black;
      border-collapse: collapse;
      padding: 0.35em;
    }

    input {
      max-width: 95%;
    }

    text-align: center;
  }
}
</style>
