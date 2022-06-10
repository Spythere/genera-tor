<template>
  <div class="rozkaz">
    <OrderN v-if="orderType == 'N'" />
    <OrderS v-if="orderType == 'S'" />

    <section class="info">
      <table class="info-table">
        <tbody>
          <tr>
            <td colspan="4">
              <input type="text" v-model="info.stationName" />
              <br />
              stacja
            </td>

            <td colspan="3">
              <input type="text" v-model="info.checkpointName" />
              <br />
              posterunek
            </td>

            <td colspan="2">
              <input type="text" v-model="info.hour" />
              <br />
              godz.
            </td>

            <td colspan="1">
              <input type="text" v-model="info.minutes" />
              <br />
              min.
            </td>
          </tr>

          <tr>
            <td colspan="5">
              <input type="text" v-model="info.dispatcherName" />
              <br />
              dyżurny ruchu
            </td>

            <td colspan="5">
              <input type="text" v-model="info.secondaryDispatcherName" />
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
import OrderN from '@/components/OrderN.vue';
import OrderS from '@/components/OrderS.vue';
import { useStore } from '@/store/store';

export default defineComponent({
  components: { OrderN, OrderS },

  data() {
    return {
      orderType: 'S',
    };
  },

  setup() {
    const store = useStore();

    return {
      info: store.orderInfo,
    };
  },
});
</script>

<style lang="scss">
@import '../styles/global.scss';

.rozkaz {
  width: 500px;
  background-color: white;
  color: black;

  padding: 0.5em;
  box-shadow: 0 0 15px 2px white;

  h2 {
    margin: 0;
    padding: 0;
  }

  .header {
    padding: 0.5em;
    border: 2px solid black;
    border-bottom: none;
  }
}

.flex-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

input {
  max-width: 100px;
  background-color: transparent;
  outline: none;
  border: none;

  border-bottom: 2px dotted black;
  font-size: 0.9em;
  text-align: center;
  color: black;
}

select {
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  font-size: 0.8rem;
}

.table-section {
  table {
    width: 100%;

    td:first-child {
      width: 10%;

      text-align: center;
      vertical-align: top;

      font-weight: bold;
    }

    td {
      padding: 0.35em;
      text-align: justify;

      line-height: 1.4em;
    }
  }

  table,
  td {
    border: 2px solid black;
    border-collapse: collapse;
  }
}

table.info-table {
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

tr:not(.chosen) > td.row-content {
  opacity: 0.45;
  user-select: none;

  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

tr.row {
  &:not(.chosen) {
    cursor: pointer;
  }

  &.chosen > .row-number {
    color: red;
  }

  &:hover {
    outline: 3px solid red;

    & td.row-number {
      color: red;
    }
  }
}
</style>
