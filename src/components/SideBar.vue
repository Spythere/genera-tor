<template>
  <section class="sidebar">
    <div class="sidebar_content">
      <!-- <button class="option-save" @click="toggleOrderMode" :data-selected="store.orderMode == 'OrderList'">
        <img :src="saveIcon" alt="save icon" />
      </button> -->

      <!-- <button @click="store.helperModalOpen = true">?</button> -->

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
          id: 'orderN',
          name: 'N',
        },
        {
          id: 'orderS',
          name: 'S',
        },
        {
          id: 'orderO',
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
    selectOrderType(type: any) {
      if (type != this.store.chosenOrderType) this.store.chosenLocalOrderId = '';

      this.store.chosenOrderType = type;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../styles/global.scss';

.sidebar {
  position: fixed;
  top: 50%;
  left: 0;

  z-index: 999;

  transform: translateY(-50%);
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
    background-color: #00000073;
    width: 50px;
    height: 85px;

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

button.option-save {
  background-color: #000000aa;

  img {
    width: 80%;
    height: 80%;
  }

  &[data-selected='true'] {
    background-color: $accentCol;
  }
}

@media screen and (max-width: 650px) {
  .sidebar {
    left: 50%;
    top: 0;

    transform: translate(-50%, 0);
  }

  .sidebar_content {
    grid-template-rows: 1fr;
    grid-template-columns: repeat(3, 1fr);

    & > button {
      height: 60px;
      width: 60px;

      .bar {
        width: 100%;
        height: 4px;
      }
    }
  }
}
</style>
