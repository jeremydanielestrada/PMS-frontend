<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

//Load props and emitters
const props = defineProps(['isDrawerVisible'])
const emit = defineEmits(['update:isDrawerVisible'])

const drawer = computed({
  get: () => props.isDrawerVisible,
  set: (value) => emit('update:isDrawerVisible', value),
})
const authStore = useAuthStore()

const isAdmin = computed(() => authStore.isAdmin)

const admins = [
  ['Projects', 'mdi-package-variant', '/projects'],
  ['Dashboard', 'mdi-view-dashboard-outline', '/dashboard'],
  ['Users', 'mdi-account-multiple-outline', '/users'],
]
</script>

<template>
  <v-navigation-drawer v-model="drawer">
    <v-list>
      <v-list-group value="Admin" v-if="isAdmin">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Admin"></v-list-item>
        </template>

        <v-list-item
          v-for="([title, icon, routes], i) in admins"
          :key="i"
          :prepend-icon="icon"
          :title="title"
          :value="title"
          :to="routes"
          ripple
          color="primary"
        ></v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>
