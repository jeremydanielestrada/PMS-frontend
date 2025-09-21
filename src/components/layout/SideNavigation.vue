<script setup>
import { computed, ref } from 'vue'
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

const adminGroupOpen = ref(['Admin'])

const admin = [
  ['Projects', 'mdi-package-variant', '/projects'],
  ['Dashboard', 'mdi-view-dashboard-outline', '/dashboard'],
  ['Manage Users', 'mdi-account-multiple-outline', '/manage-users'],
]

const users = [['Tasks', 'mdi-clipboard-list-outline', '/tasks']]
</script>

<template>
  <v-navigation-drawer v-model="drawer">
    <v-list v-model:opened="adminGroupOpen">
      <v-list-group value="Admin" v-if="isAdmin" base-color="primary" class="border-b-thin">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Admin"></v-list-item>
        </template>

        <v-list-item
          v-for="([title, icon, routes], i) in admin"
          :key="i"
          :prepend-icon="icon"
          :title="title"
          :value="title"
          :to="routes"
          ripple
          color="primary"
        ></v-list-item>
      </v-list-group>

      <v-list-item
        v-for="([title, icon, routes], i) in users"
        :key="i"
        :prepend-icon="icon"
        :title="title"
        :value="title"
        :to="routes"
        ripple
        color="primary"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
