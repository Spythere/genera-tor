<template>
  <div class="home">
    <Order />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Order from "@/components/Order.vue";


export default defineComponent({
  components: { Order },
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

