<template>
  <svg :style="{width, height}">
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  prefix: {
    type: String,
    default: '#icon-'
  },
  color: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '16px'
  },
  height: {
    type: String,
    default: '16px'
  }
})

</script>

<style scoped>

</style>