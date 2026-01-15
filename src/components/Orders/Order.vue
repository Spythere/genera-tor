<template>
  <div class="order-container">
    <OrderSideBar />

    <div class="order" :class="{ dark: store.orderDarkMode }">
      <div class="order_content">
        <transition name="order-anim" mode="out-in">
          <keep-alive>
            <component :is="chosenOrderComponent" :key="chosenOrderComponent.name"></component>
          </keep-alive>
        </transition>
        <OrderFooter />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '../../store/store';
import OrderN from './OrderN.vue';
import OrderS from './OrderS.vue';
import OrderO from './OrderO.vue';
import OrderFooter from './OrderFooter.vue';
import OrderSideBar from './OrderSideBar.vue';

const orderComponents = { orderN: OrderN, orderS: OrderS, orderO: OrderO };

export default defineComponent({
  components: { OrderN, OrderO, OrderS, OrderFooter, OrderSideBar },

  setup() {
    const store = useStore();

    return { store };
  },

  computed: {
    chosenOrderComponent() {
      return orderComponents[this.store.chosenOrderType];
    }
  }
});
</script>

<style lang="scss">
@use '../../styles/colors';

$darkModeTextCol: #eee;

.order-container {
  display: flex;
  align-items: start;
  max-width: 800px;

  @media screen and (max-width: 650px) {
    flex-direction: column;
  }
}

.order {
  background-color: white;
  color: black;

  height: calc(100vh - 5em);
  overflow: auto;

  &.dark {
    background-color: colors.$bgColDarker;
    color: $darkModeTextCol;
  }

  font-size: 15px;

  h2 {
    margin: 0;
    padding: 0;
  }

  textarea:focus-visible {
    outline: 2px solid colors.$accentCol;
  }

  input[type='checkbox']:focus-visible,
  input[type='radio']:focus-visible {
    outline: 2px solid colors.$accentCol;
  }

  input[type='checkbox'],
  input[type='radio'],
  select {
    margin-top: 0.5em;
    margin-right: 0.5em;
    font-size: 0.8em;
    color: black;
  }

  textarea.others {
    width: 100%;
    min-height: 200px;
    resize: vertical;
  }

  @media screen and (max-width: 550px) {
    font-size: 3vw;
  }
}

.order_header {
  padding: 0.5em;
  border: 2px solid black;
  border-bottom: none;
}

.order_content {
  padding: 0.5em;
}

.flex-row {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;

  margin-top: 0.5em;

  input {
    max-width: 10em;
  }
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.horizontal-bar {
  width: 100%;
  height: 2px;

  background-color: black;
  margin: 0.5em 0;
}

.order input {
  max-width: 100px;
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 1em;

  text-align: center;
  border-bottom: 2px dotted black;

  &:focus-visible {
    border-bottom: 2px solid colors.$accentCol;
  }

  &.row-checkbox + input::placeholder {
    color: red;
  }
}

/* Dark mode */
.order.dark {
  input {
    border-color: $darkModeTextCol !important;
    color: $darkModeTextCol !important;

    &:focus-visible {
      border-bottom: 2px solid colors.$accentCol !important;
    }

    &::placeholder {
      color: #ccc !important;
    }
  }

  select {
    color: $darkModeTextCol !important;
    border-color: $darkModeTextCol;

    &:focus-visible {
      border-color: colors.$accentCol;
    }
  }

  option,
  textarea {
    color: $darkModeTextCol !important;
    border-color: $darkModeTextCol !important;
    background-color: colors.$bgColDarker !important;
  }

  .horizontal-bar {
    background-color: white;
  }

  .order_header,
  .order_other,
  table,
  tr,
  td {
    border-color: $darkModeTextCol !important;
  }
}

.order_table-container {
  table {
    width: 100%;

    td:first-child {
      width: 10%;

      text-align: center;

      font-weight: bold;
    }

    td {
      padding: 0.35em;
      text-align: justify;
      vertical-align: top;

      line-height: 1.5em;
    }
  }

  table,
  td {
    border: 2px solid black;
    border-collapse: collapse;
  }
}

.order-anim {
  &-enter-active,
  &-leave-active {
    transition: opacity 150ms ease-in-out;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}
</style>
