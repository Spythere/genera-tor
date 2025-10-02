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
            :key="action"
            class="g-button option"
            :data-active="store.panelMode == action"
            @click="selectOrderMode(action)"
          >
            {{ t(`navbar.${action}`) }}
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
import OrderMessagePanel from '../components/Panels/OrderMessagePanel.vue';
import OrderListPanel from '../components/Panels/OrderListPanel.vue';
import OrderTrainPickerPanel from '../components/Panels/OrderTrainPickerPanel.vue';
import { TPanelMode } from '../types/dataTypes';

const { t } = useI18n();
const store = useStore();

const navActions: TPanelMode[] = ['OrderListPanel', 'OrderMessagePanel', 'OrderTrainPickerPanel'];

function selectOrderMode(mode: TPanelMode) {
  store.panelMode = mode;
}

const panelComponent = computed(() => {
  switch (store.panelMode) {
    case 'OrderListPanel':
      return OrderListPanel;
    case 'OrderTrainPickerPanel':
      return OrderTrainPickerPanel;
    case 'OrderMessagePanel':
    default:
      return OrderMessagePanel;
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
