<template>
  <label class="order-instruction-checkbox">
    <input type="checkbox" v-model="instructionObject.active" />
    <div class="checkmark"></div>
    <div class="text">{{ instructionObject.name }}</div>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../../store/store';

const store = useStore();

const props = defineProps({
  rowIndex: {
    type: Number,
    required: true
  }
});

const instructionObject = computed(() => store.orderData.instructions[props.rowIndex]);
</script>

<style lang="scss" scoped>
.order-instruction-checkbox {
  display: block;
  position: relative;
  text-align: center;
  cursor: pointer;
  font-weight: bold;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  & > input {
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
    cursor: pointer;

    &:checked ~ .checkmark:after {
      content: '\d7';
    }

    &:focus-visible ~ .text {
      text-decoration: underline;
      outline: 1px solid black;
    }
  }

  .checkmark {
    display: block;
    position: relative;

    margin: 0 auto;

    height: 20px;
    width: 20px;
    background-color: #eee;
    border: 2px solid black;

    background-color: gold;

    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 20px;
      transform: translate(-50%, -50%);
    }
  }

  &:hover input ~ .checkmark {
    background-color: #ffe44b;
  }
}
</style>
