import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  //Check if user is authenticated
  const token = ref(localStorage.getItem('token'))
  const isAuthenticated = computed(() => !!token.value)

  //Login user
  async function loginUser(formData) {
    const response = await api.post('/login', formData)
    token.value = response.data.token
    localStorage.setItem('token', response.data.token)
    return response.data
  }

  //Register  user
  async function registerUser(formData) {
    const response = await api.post('/register', formData)
    localStorage.setItem('token', response.data.token)
    token.value = response.data.token
    return response.data
  }

  //Log out a user
  async function logoutUser() {
    const response = await api.post('/logout')
    token.value = null
    return response.message
  }

  return {
    //Actions
    loginUser,
    logoutUser,
    registerUser,

    //Getters,
    isAuthenticated,

    //States
    token,
  }
})
