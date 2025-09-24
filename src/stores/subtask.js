// stores/subtask.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useSubTaskStore = defineStore('subtask', () => {
  const subtasks = ref([])

  // Get subtasks by task
  async function getSubTasksByTask(taskId) {
    const response = await api.get(`/subtasks?task_id=${taskId}`)
    subtasks.value = response.data
    return response.data
  }

  // Create subtask
  async function createSubTask(subtaskData) {
    try {
      const response = await api.post('/subtasks', subtaskData)
      if (response) return response.data
    } catch (error) {
      console.log(error.response.data?.message)
    }
  }

  // Update subtask
  async function updateSubTask(subtaskId, subtaskData) {
    try {
      const response = await api.put(`/subtasks/${subtaskId}`, subtaskData)
      if (response) return response.data
    } catch (error) {
      console.log(error.response.data?.message)
    }
  }

  // Toggle completion
  async function toggleSubTaskComplete(subtaskId) {
    try {
      const response = await api.put(`/subtasks/${subtaskId}/toggle`)
      if (response) return response.data
    } catch (error) {
      console.log(error.response.data?.message)
    }
  }
  // Delete subtask
  async function deleteSubTask(subtaskId) {
    const response = await api.delete(`/subtasks/${subtaskId}`)
    if (response) return response.data
  }

  // Get completion percentage for a task
  const getTaskProgress = computed(() => (taskSubtasks) => {
    if (!taskSubtasks || taskSubtasks.length === 0) return 0
    const completed = taskSubtasks.filter((s) => s.is_completed).length
    return Math.round((completed / taskSubtasks.length) * 100)
  })

  return {
    //States
    subtasks,
    getTaskProgress,

    //Action
    getSubTasksByTask,
    createSubTask,
    updateSubTask,
    toggleSubTaskComplete,
    deleteSubTask,
  }
})
