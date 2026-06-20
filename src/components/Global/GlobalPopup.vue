<template>
  <transition name="popup-anim">
    <button
      v-if="popupStore.isVisible"
      class="g-popup"
      :data-type="popupStore.popupType"
      @click="popupStore.hidePopup()"
    >
      <span v-html="popupStore.htmlContent"></span>
    </button>
  </transition>
</template>

<script setup lang="ts">
import { usePopupStore } from '../../store/popup';

const popupStore = usePopupStore();
</script>

<style lang="scss" scoped>
.g-popup {
  position: fixed;
  bottom: 1em;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 100;

  width: 95%;
  max-width: 400px;

  padding: 0.5em;
  border-radius: 0.5em;

  font-size: 1.2em;
  text-align: center;
  user-select: none;
  -moz-user-select: none;

  &[data-type='info'] {
    color: white;
    background-color: rgba(9, 166, 229, 0.9);
  }

  &[data-type='warning'] {
    background-color: rgba(240, 157, 3, 0.9);
  }

  &[data-type='success'] {
    background-color: rgba(0, 195, 42, 0.9);
  }
}

button.popup-exit {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1.2em;

  padding: 0;
}

.popup-anim {
  &-enter-active,
  &-leave-active {
    transition: all 100ms ease-out;
  }

  &-enter-from,
  &-leave-to {
    transform: translate(-50%, 100%);
  }
}
</style>
