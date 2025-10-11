<template>
  <div class="home">
    <div class="home-container">
      <div class="order-container">
        <Order />
      </div>

      <div class="panel-container">
        <div class="panel-nav">
          <button
            key="OrderMessagePanel"
            class="g-button"
            :data-active="store.panelMode == 'OrderMessagePanel'"
            @click="selectOrderMode('OrderMessagePanel')"
          >
            <MessageSquareTextIcon :size="20" />
            {{ t(`navbar.OrderMessagePanel`) }}
          </button>

          <button
            key="OrderListPanel"
            class="g-button"
            :data-active="store.panelMode == 'OrderListPanel'"
            @click="selectOrderMode('OrderListPanel')"
          >
            <BookMarkedIcon :size="20" />
            {{ t(`navbar.OrderListPanel`) }}
          </button>

          <button
            key="OrderTrainPickerPanel"
            class="g-button"
            :data-active="store.panelMode == 'OrderTrainPickerPanel'"
            @click="selectOrderMode('OrderTrainPickerPanel')"
          >
            <TrainFrontIcon :size="20" />
            {{ t(`navbar.OrderTrainPickerPanel`) }}
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
import { BookMarkedIcon, MessageSquareTextIcon, TrainFrontIcon } from 'lucide-vue-next';

const { t } = useI18n();
const store = useStore();

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
  display: grid;
  grid-template-columns: 800px 500px;
  justify-content: center;
  gap: 2em 1em;
  padding: 1em;
  width: 100%;

  & > div {
    height: calc(100vh - 5em);
    overflow: auto;
  }

  @media screen and (max-width: 1350px) {
    grid-template-columns: auto;
    padding: 1em 0.5em;
  }
}

.order-container {
  display: flex;
  align-items: start;
  max-width: 800px;

  @media screen and (max-width: 650px) {
    flex-direction: column;
  }
}

.panel-container {
  padding: 2px;
  max-width: 800px;

  display: grid;
  grid-template-rows: auto auto 1fr;
}

.panel-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25em;
  flex-wrap: wrap;

  margin-bottom: 1.5em;
}

.panel-nav > button {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
  min-width: 8em;
  padding: 0.25em 0.5em;

  &:focus-visible {
    outline: 1px solid white;
  }

  &::before {
    position: absolute;
    content: '';
    bottom: -3px;
    left: 50%;
    transform: translateX(-50%);

    width: 0;
    height: 3px;

    transition: all 0.25s;

    background-color: colors.$accentCol;
  }

  &[data-active='true'] {
    color: colors.$accentCol;
  }

  &[data-active='true']::before {
    width: 100%;
  }
}
</style>
