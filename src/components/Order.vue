<template>
  <div class="order">
    <div class="order_content">
      <transition name="order-anim" mode="out-in">
        <keep-alive>
          <component :is="chosenOrderComponent" :key="chosenOrderComponent.name"></component>
        </keep-alive>
      </transition>
      <OrderFooter />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '../store/store';
import OrderNVue from './OrderN.vue';
import OrderSVue from './OrderS.vue';
import OrderFooter from './OrderFooter.vue';
import OrderOVue from './OrderO.vue';

const orderComponents = {
  orderN: OrderNVue,
  orderS: OrderSVue,
  orderO: OrderOVue
};

export default defineComponent({
  components: { OrderNVue, OrderSVue, OrderFooter },

  setup() {
    const store = useStore();

    return {
      store
    };
  },

  computed: {
    chosenOrderComponent() {
      return orderComponents[this.store.chosenOrderType];
    }
  }
});
</script>

<style lang="scss">
@import '../styles/global.scss';

// Order scrollbar
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #fff;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
}

::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

.order {
  background-color: white;
  color: black;

  height: 925px;
  max-height: 95vh;
  overflow: auto;

  font-size: 15px;

  h2 {
    margin: 0;
    padding: 0;
  }

  .header {
    padding: 0.5em;
    border: 2px solid black;
    border-bottom: none;
  }

  @media screen and (max-width: 550px) {
    font-size: 3vw;
  }
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

input {
  max-width: 100px;
  background-color: transparent;
  outline: none;
  border: none;

  border-bottom: 2px dotted black;
  font-size: 0.9em;
  text-align: center;
  color: black;

  &:focus-visible {
    border-bottom: 2px solid $accentCol;
  }

  &.row-checkbox + input::placeholder {
    color: red;
  }
}

input[type='checkbox'],
input[type='radio'],
textarea,
select {
  &:focus-visible {
    outline: 2px solid $accentCol;
  }
}

select {
  margin-top: 0.5em;
  margin-right: 0.5em;
  font-size: 0.8em;
}

.table-section {
  table.options-table {
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

textarea.others {
  width: 100%;
  min-height: 200px;
  resize: vertical;
}
</style>
