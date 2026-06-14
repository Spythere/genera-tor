<template>
  <transition class="slide-anim">
    <div v-if="popupStore.isVisible" class="g-popup" :data-type="popupStore.popupType">
      <span v-html="popupStore.htmlContent"></span>
      <button class="g-button popup-exit">
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
@use '@/styles/anims';

.g-popup {
  position: fixed;
  bottom: 1em;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;

  width: 95%;
  max-width: 400px;

  padding: 0.5em 1.5em 0.5em 0.5em;
  border-radius: 0.5em;

  text-align: center;

  &[data-type='info'] {
    color: white;
    background-color: rgba(9, 166, 229, 0.75);
  }

  &[data-type='warning'] {
    background-color: rgba(240, 157, 3, 0.75);
  }

  &[data-type='success'] {
    background-color: rgba(9, 229, 57, 0.75);
  }
}

button.popup-exit {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1.2em;

  padding: 0;
}
</style>
