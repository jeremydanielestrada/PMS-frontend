import { defineStore } from 'pinia'
import { ref } from 'vue'
import echo from '@/services/echo'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const useRealtimeStore = defineStore('realtime', () => {
  const notifications = ref([])

  const listenToProject = (projectId) => {
    echo.channel(`project.${projectId}`).listen('TaskUpdated', (e) => {
      console.log('Task updated:', e.task)
    })
  }

  const listenToNotifications = () => {
    const authStore = useAuthStore()
    echo.private(`App.Models.User.${authStore.userData.id}`).notification((notification) => {
      notifications.value.unshift(notification)
    })
  }

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications')
      notifications.value = response.data.data
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`)
      const notification = notifications.value.find((n) => n.id === id)
      if (notification) {
        notification.is_read = true
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  return {
    notifications,
    listenToProject,
    listenToNotifications,
    fetchNotifications,
    markAsRead,
  }
})
