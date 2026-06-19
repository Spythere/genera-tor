<template>
  <div class="order-helper-panel">
    <h2 class="header">
      <HelpCircle :size="30" />
      <span>Pomocnik rozkazów</span>
    </h2>
    <p>Zaznacz instrukcje w rozkazie, aby wyświetlić pomoc w ich wypełnieniu</p>

    <div>
      Zaznaczone instrukcje: <b>{{ selectedInstructions.map((i) => i.key).join(', ') }}</b>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HelpCircle } from '@lucide/vue';
import { useStore } from '../../store/store';
import { computed } from 'vue';

const store = useStore();

const selectedInstructions = computed(() => {
  return store.orderData.instructions.filter((i) => i.active);
});
</script>

<style lang="scss" scoped>
@use '../../styles/colors';

.order-helper-panel {
  text-align: center;
  padding: 0 0.5em;
}

.header {
  margin: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25em;
}
</style>
