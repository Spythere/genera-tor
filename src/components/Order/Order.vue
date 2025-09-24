<template>
  <div class="order" :class="{ dark: store.orderDarkMode }">
    <OrderHeader />
    <OrderMainContent />
    <OrderFooter />
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../../store/store';
import OrderHeader from './OrderHeader.vue';
import OrderMainContent from './OrderMainContent.vue';
import OrderFooter from './OrderFooter.vue';

const store = useStore();
</script>

<style lang="scss">
@use '../../styles/order';
</style>
