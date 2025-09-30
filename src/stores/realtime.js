import { defineStore } from 'pinia'
import { ref } from 'vue'
import echo from '@/services/echo'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

export const useRealtimeStore = defineStore('realtime', () => {
  const notifications = ref([])

  const listenToProject = (projectId) => {
    echo.channel(`project.${projectId}`).listen('TaskUpdated', (e) => {})
  }

  const listenToTaskAssigned = (projectId) => {
    echo.channel(`project.${projectId}`).listen('TaskAssigned')
  }

  const listenToNotifications = () => {
    const authStore = useAuthStore()
    echo.private(`App.Models.User.${authStore.userData.id}`).notification((notification) => {
      notifications.value.unshift(notification)
    })
  }

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications')
      // Check if response has data property (pagination)
      if (response.data.data) {
        notifications.value = response.data.data
      } else {
        notifications.value = response.data
      }
    } catch (error) {
      console.error('Error fetching notifications:', error.response.data?.message)
    }
  }

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      const notification = notifications.value.find((n) => n.id === id)
      if (notification) {
        notification.is_read = true
      }
    } catch (error) {
      console.error('Error marking notification as read:', error.response.data.message)
    }
  }

  return {
    notifications,
    listenToProject,
    listenToNotifications,
    fetchNotifications,
    listenToTaskAssigned,
    markAsRead,
  }
})
