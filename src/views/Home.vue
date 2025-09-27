<template>
  <div class="home">
    <div class="home-container">
      <div class="order-container">
        <Order />
      </div>

      <div class="panel-container">
        <div class="panel-nav">
          <button
            v-for="(action, i) in navActions"
            :key="action.mode"
            class="g-button option"
            :data-active="store.panelMode == action.mode"
            @click="selectOrderMode(action.mode)"
          >
            {{ t(`navbar.${action.value}`) }}
          </button>
        </div>

        <transition name="order-anim" mode="out-in">
          <keep-alive>
            <Component :is="panelComponent" />
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from '../store/store';
import { useI18n } from 'vue-i18n';

import Order from '../components/Order/Order.vue';
import OrderMessage from '../components/OrderMessage.vue';
import OrderList from '../components/OrderList.vue';
import OrderTrainPicker from '../components/OrderTrainPicker.vue';

const { t } = useI18n();
const store = useStore();

const navActions = [
  {
    mode: 'OrderMessage',
    value: 'order-message'
  },
  {
    mode: 'OrderList',
    value: 'order-list'
  },
  {
    mode: 'OrderTrainPicker',
    value: 'order-train-picker'
  }
];

function selectOrderMode(mode: string) {
  store.panelMode = mode;
}

const panelComponent = computed(() => {
  switch (store.panelMode) {
    case 'OrderMessage':
      return OrderMessage;
    case 'OrderList':
      return OrderList;
    case 'OrderTrainPicker':
      return OrderTrainPicker;
    default:
      return OrderMessage;
  }
});
</script>

<style lang="scss" scoped>
@use '../styles/colors';

.home {
  overflow-x: auto;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
}

.home-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2em 1em;
  padding: 1em;

  width: 100%;

  & > div {
    max-height: calc(100vh - 5em);
    overflow: auto;
  }

  @media screen and (max-width: 650px) {
    padding: 1em 0.5em;
  }
}

.order-container {
  max-width: 800px;

  display: flex;
  align-items: start;

  @media screen and (max-width: 650px) {
    flex-direction: column;
  }
}

.panel-container {
  width: 500px;
  padding: 2px;

  display: grid;
  grid-template-rows: auto auto 1fr;
}

.panel-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
  flex-wrap: wrap;

  margin-bottom: 1.5em;
}

.panel-nav > button {
  position: relative;

  &::before {
    position: absolute;
    content: '';
    bottom: -3px;
    left: 0;
    width: 0;
    height: 3px;

    transition: all 0.25s;

    background-color: colors.$accentCol;
  }

  &[data-active='true']::before {
    width: 100%;
  }
}
</style>
