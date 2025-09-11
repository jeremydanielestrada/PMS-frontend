<script setup>
import { ref, onMounted } from 'vue'
import SideNavigation from './SideNavigation.vue'

//Set theme
const theme = ref(localStorage.getItem('theme') ?? 'light')

const isDrawerOpen = ref(false)

localStorage.getItem('theme')

const onclickTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}

//read drawer state
onMounted(() => {
  const savedDrawerState = localStorage.getItem('drawer')
  if (savedDrawerState !== null) {
    isDrawerOpen.value = savedDrawerState === 'true'
  }
})

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
  localStorage.setItem('drawer', isDrawerOpen.value)
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <SideNavigation v-model:isDrawerOpen="isDrawerOpen" />
      <v-app-bar>
        <v-app-bar-nav-icon @click="toggleDrawer" />
        <v-spacer></v-spacer>
        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          slim
          @click="onclickTheme"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <slot name="content"></slot>
        </v-container>
      </v-main>

      <v-footer class="pa-2" border app>All rights reserve 2025</v-footer>
    </v-app>
  </v-responsive>
</template>
