import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  //Check if user is authenticated
  const token = ref(localStorage.getItem('token'))
  const userData = ref(null)
  const allUsers = ref([])

  //getters
  const isAuthenticated = computed(() => !!token.value)

  //Get all users
  async function getAllUsers() {
    const response = await api.get('/users')
    allUsers.value = response.data
    return response.data
  }

  //Login user
  async function loginUser(formData) {
    try {
      const response = await api.post('/login', formData)

      // Only set data if response is successful
      if (response.data && response.data.token) {
        token.value = response.data.token
        userData.value = response.data.user
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data
      } else {
        throw new Error('Invalid login response')
      }
    } catch (error) {
      // Clear any existing data on failed login
      token.value = null
      userData.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      throw error // Re-throw to be handled by component
    }
  }

  //Register  user
  async function registerUser(formData) {
    const response = await api.post('/register', formData)
    userData.value = response.data.user
    token.value = response.data.token
    localStorage.setItem('token', response.data.token)
    return response.data
  }

  //Log out  user
  async function logoutUser() {
    const response = await api.post('/logout')
    localStorage.removeItem('token') // Clear from localStorage
    token.value = null // Clear reactive ref
    return response.data
  }

  return {
    //Actions
    loginUser,
    logoutUser,
    registerUser,
    getAllUsers,

    //Getters,
    isAuthenticated,

    //States
    token,
    userData,
    allUsers,
  }
})
