<script setup>
import { computed } from 'vue'
const emits = defineEmits(['toggleDrawer'])

const props = defineProps(['isDrawerOpen'])

const drawer = computed({
  get: () => props.isDrawerOpen,
  set: (value) => emits('toggleDrawer', value),
})
</script>

<template>
  <v-navigation-drawer v-model="drawer">
    <v-list>
      <v-list-item title="Navigation drawer"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
