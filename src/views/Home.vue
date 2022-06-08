<template>
  <div class="home">
    <OrderN />
    <OrderS v-if="false" />
  </div>
</template>

<script lang="ts">
import OrderN from '@/components/OrderN.vue';
import OrderS from '@/components/OrderS.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { OrderN, OrderS },
});
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 100vh;

  overflow-x: auto;
}
</style>

