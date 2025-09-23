import { defineStore } from 'pinia'
import { ref } from 'vue'
import echo from '@/services/echo'
import api from '@/services/api'
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
      console.log('Making API call to /api/notifications')
      const response = await api.get('/notifications')
      console.log('Making API call to /api/notifications')
      // Check if response has data property (pagination)
      if (response.data.data) {
        notifications.value = response.data.data
      } else {
        notifications.value = response.data
      }

      console.log('Notifications set to:', notifications.value)
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
    markAsRead,
  }
})
