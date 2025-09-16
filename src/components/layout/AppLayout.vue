<script setup>
import { ref, onMounted, watch } from 'vue'
import SideNavigation from './SideNavigation.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

//Load Variables
//Set theme
const isUserLogged = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const theme = ref(localStorage.getItem('theme') ?? 'light')

const isDrawerOpen = ref(false)
const isLoading = ref(false)

localStorage.getItem('theme')

const onclickTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}

//Check if user is logged in
onMounted(() => {
  if (authStore.isAuthenticated) isUserLogged.value = true
})

watch(
  () => isUserLogged.value,
  () => {
    isDrawerOpen.value = isUserLogged.value
  },
)

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

//Sign out a user
const signOut = async () => {
  isLoading.value = true
  try {
    await authStore.logoutUser()
    isUserLogged.value = false // Update local state
    router.replace('/')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <SideNavigation v-model:isDrawerOpen="isDrawerOpen" />
      <v-app-bar>
        <v-app-bar-nav-icon @click="toggleDrawer" v-if="isUserLogged" />
        <v-spacer></v-spacer>
        <v-btn @click="signOut" :loading="isLoading" v-if="isUserLogged">
          sign out
          <v-icon>mdi-logout </v-icon>
        </v-btn>

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
