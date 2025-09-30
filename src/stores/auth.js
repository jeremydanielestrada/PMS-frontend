import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  //Check if user is authenticated
  const token = ref(localStorage.getItem('token'))
  const userData = ref(null)
  const allUsers = ref(null)
  const authorizedUser = ref(null)
  const search = ref(null)
  const currentPage = ref(1)
  const perPage = ref(10)
  const totalPages = ref(1)

  // Initialize user data from localStorage
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    userData.value = JSON.parse(storedUser)
  }

  //getters
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => userData.value?.role === 'admin')

  //Get authorized user
  async function getAuthorizedUser() {
    const response = await api.get('/user')
    if (response) {
      authorizedUser.value = response.data // Direct assignment, not nested
    }
    return response.data
  }

  //Get all users
  async function getAllUsers() {
    try {
      const response = await api.get('/users', {
        params: {
          search: search.value,
          page: currentPage.value,
          per_page: perPage.value,
        },
      })
      totalPages.value = response.data.last_page
      allUsers.value = response.data.data
      return response.data
    } catch (error) {
      console.log(error.response.data?.message)
    }
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
    localStorage.removeItem('user') // Clear from localStorage
    token.value = null // Clear reactive ref
    return response.data
  }

  return {
    //Actions
    loginUser,
    logoutUser,
    registerUser,
    getAllUsers,
    getAuthorizedUser,

    //Getters,
    isAuthenticated,
    isAdmin,

    //States
    token,
    userData,
    allUsers,
    storedUser,
    authorizedUser,
    currentPage,
    totalPages,
    perPage,
    search,
  }
})
