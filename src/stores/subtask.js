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
    const response = await api.post('/subtasks', subtaskData)
    subtasks.value.push(response.data)
    return response.data
  }

  // Update subtask
  async function updateSubTask(subtaskId, subtaskData) {
    const response = await api.put(`/subtasks/${subtaskId}`, subtaskData)
    const index = subtasks.value.findIndex((s) => s.id === subtaskId)
    if (index !== -1) {
      subtasks.value[index] = response.data
    }
    return response.data
  }

  // Toggle completion
  async function toggleSubTaskComplete(subtaskId) {
    const response = await api.put(`/subtasks/${subtaskId}/toggle`)
    const index = subtasks.value.findIndex((s) => s.id === subtaskId)
    if (index !== -1) {
      subtasks.value[index] = response.data
    }
    return response.data
  }

  // Delete subtask
  async function deleteSubTask(subtaskId) {
    await api.delete(`/subtasks/${subtaskId}`)
    subtasks.value = subtasks.value.filter((s) => s.id !== subtaskId)
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
