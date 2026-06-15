<template>
  <transition name="popup-anim">
    <div v-if="popupStore.isVisible" class="g-popup" :data-type="popupStore.popupType">
      <span v-html="popupStore.htmlContent"></span>
      <button class="g-button popup-exit" @click="popupStore.hidePopup">
        <X :width="20" />
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { X } from '@lucide/vue';
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

  padding: 0.5em 1.5em 0.5em 0.5em;
  border-radius: 0.5em;

  font-size: 1.2em;

  text-align: center;

  &[data-type='info'] {
    color: white;
    background-color: rgba(9, 166, 229, 0.9);
  }

  &[data-type='warning'] {
    background-color: rgba(240, 157, 3, 0.9);
  }

  &[data-type='success'] {
    background-color: rgba(9, 229, 57, 0.9);
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
