// stores/task.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([])
  const currentTask = ref(null)

  // Get tasks by project
  async function getTasksByProject(projectId) {
    const response = await api.get(`/tasks?project_id=${projectId}`)
    tasks.value = response.data
    return response.data
  }

  // Create task
  async function createTask(taskData) {
    const response = await api.post('/tasks', taskData)
    tasks.value.push(response.data)
    return response.data
  }

  // Update task
  async function updateTask(taskId, taskData) {
    const response = await api.put(`/tasks/${taskId}`, taskData)
    const index = tasks.value.findIndex((t) => t.id === taskId)
    if (index !== -1) {
      tasks.value[index] = response.data
    }
    return response.data
  }

  // Update task status (for drag and drop)
  async function updateTaskStatus(taskId, status) {
    const response = await api.put(`/tasks/${taskId}/status`, { status })
    const index = tasks.value.findIndex((t) => t.id === taskId)
    if (index !== -1) {
      tasks.value[index].status = status
    }
    return response.data
  }

  // Delete task
  async function deleteTask(taskId) {
    await api.delete(`/tasks/${taskId}`)
    tasks.value = tasks.value.filter((t) => t.id !== taskId)
  }

  // Group tasks by status for Kanban
  const tasksByStatus = computed(() => {
    return {
      todo: tasks.value.filter((t) => t.status === 'todo'),
      in_progress: tasks.value.filter((t) => t.status === 'in_progress'),
      done: tasks.value.filter((t) => t.status === 'done'),
    }
  })

  return {
    tasks,
    currentTask,
    tasksByStatus,
    getTasksByProject,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  }
})
