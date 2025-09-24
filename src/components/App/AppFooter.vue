<template>
  <footer>
    &copy; <a href="https://td2.info.pl/profile/?u=20777">Spythere</a>
    {{ new Date().getUTCFullYear() }} |
    <button class="g-button text" @click="store.updateCardOpen = true">v{{ props.version }}</button>
  </footer>
</template>

<script setup lang="ts">
import { useStore } from '../../store/store';

const store = useStore();

const props = defineProps({
  version: {
    type: String,
    required: true
  }
});
</script>

<style scoped></style>
