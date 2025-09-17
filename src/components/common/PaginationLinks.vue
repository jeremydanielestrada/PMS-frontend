<script setup>
const model = defineModel()
const props = defineProps(['totalPage'])
</script>

<template>
  <div class="text-center">
    <v-pagination v-model="model" :length="props.totalPage" rounded="circle"></v-pagination>
    <small v-if="props.totalPage > 0"> Showing {{ model }} of {{ props.totalPage }} items </small>
  </div>
</template>
