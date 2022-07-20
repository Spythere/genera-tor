<template>
  <section class="sidebar">
    <div class="sidebar_content">
      <button
        v-for="orderType in orderTypeList"
        :key="orderType.id"
        @click="selectOrderType(orderType.id)"
        :data-selected="store.chosenOrderType == orderType.id"
      >
        {{ orderType.name }}

        <div class="bar"></div>
      </button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '../store/store';

export default defineComponent({
  data() {
    return {
      orderTypeList: [
        {
          id: 'OrderN',
          name: 'N',
        },
        {
          id: 'OrderS',
          name: 'S',
        },
        {
          id: 'OrderO',
          name: 'O',
        },
      ],
    };
  },
  setup() {
    return {
      store: useStore(),
    };
  },

  methods: {
    selectOrderType(type: string) {
      this.store.chosenOrderType = type;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../styles/global.scss';

.sidebar {
  position: absolute;
  top: 50%;
  left: 0;

  transform: translateY(-50%);
  width: 50px;
  max-height: 250px;
  height: 95vh;
}

.sidebar_content {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  gap: 0.25em;

  font-size: 1.5em;
  font-weight: bold;
  height: 100%;

  & > button {
    position: relative;
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: center;

    color: white;
    background-color: #000000aa;


    .bar {
      position: absolute;
      top: 0;
      right: 0;

      height: 100%;
      width: 4px;

      transform: translateX(100%);
      transition: all 200ms ease-in-out;
    }

    &[data-selected='true'] .bar {
      transform: translateX(0);

      background-color: $accentCol;
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
