// stores/subtask.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useSubTaskStore = defineStore('subtask', () => {
  const subtasksByTask = ref({}) // Change to object to store by task ID

  // Get subtasks by task
  async function getSubTasksByTask(taskId) {
    try {
      console.log('Fetching subtasks for task ID:', taskId)
      const response = await api.get(`/subtasks?task_id=${taskId}`)
      console.log('Subtasks API response:', response.data)

      // Store subtasks by task ID
      subtasksByTask.value[taskId] = response.data
      console.log('Subtasks stored in state:', subtasksByTask.value[taskId])
      return response.data
    } catch (error) {
      console.error('Error fetching subtasks:', error)
      console.error('Error response:', error.response?.data)
      return []
    }
  }

  // Get subtasks for a specific task
  const getSubtasksForTask = computed(() => (taskId) => {
    return subtasksByTask.value[taskId] || []
  })

  // Create subtask
  async function createSubTask(subtaskData) {
    try {
      const response = await api.post('/subtasks', subtaskData)
      if (response) {
        // Refresh the subtasks for this task
        await getSubTasksByTask(subtaskData.task_id)
        return response.data
      }
    } catch (error) {
      console.log(error.response.data?.message)
    }
  }

  // Update subtask
  async function updateSubTask(subtaskId, subtaskData) {
    try {
      const response = await api.put(`/subtasks/${subtaskId}`, subtaskData)
      if (response) {
        // Refresh the subtasks for this task
        await getSubTasksByTask(subtaskData.task_id)
        return response.data
      }
    } catch (error) {
      console.log(error.response.data?.message)
    }
  }

  // Toggle completion
  async function toggleSubTaskComplete(subtaskId, taskId) {
    try {
      const response = await api.put(`/subtasks/${subtaskId}/toggle`)
      if (response) {
        // Refresh the subtasks for this task
        await getSubTasksByTask(taskId)
        return response.data
      }
    } catch (error) {
      console.log(error.response.data?.message)
    }
  }

  // Delete subtask
  async function deleteSubTask(subtaskId, taskId) {
    try {
      const response = await api.delete(`/subtasks/${subtaskId}`)
      if (response) {
        // Refresh the subtasks for this task
        await getSubTasksByTask(taskId)
        return response.data
      }
    } catch (error) {
      console.log(error.response.data?.message)
    }
  }

  return {
    //States
    subtasksByTask,
    getSubtasksForTask,

    //Action
    getSubTasksByTask,
    createSubTask,
    updateSubTask,
    toggleSubTaskComplete,
    deleteSubTask,
  }
})
