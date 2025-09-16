<script setup>
import { computed } from 'vue'

//Load props and emitters
const props = defineProps(['isDrawerVisible'])
const emit = defineEmits(['update:isDrawerVisible'])

const drawer = computed({
  get: () => props.isDrawerVisible,
  set: (value) => emit('update:isDrawerVisible', value),
})
</script>

<template>
  <v-navigation-drawer v-model="drawer">
    <v-list>
      <v-list-item title="Navigation drawer"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
