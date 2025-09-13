import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useProjectStore = defineStore('project', () => {
  const projects = ref(null)

  //Get Projects
  async function getProjects() {
    const response = await api.get('/projects')
    projects.value = response.data
    return response.data
  }

  //Add Projects
  async function addProjects(formData) {
    try {
      const response = await api.post('/projects', formData)
      if (response.data) getProjects()
    } catch (error) {
      console.log(error.response?.data?.message)
    }
  }

  //Update Projects
  async function updateProject(formData) {
    try {
      const response = await api.put(`projects/${formData.id}`, formData)
      if (response.data) getProjects()
    } catch (error) {
      console.log(error.response?.data?.message)
    }
  }

  async function deleteProject(id) {
    const response = await api.post(`/projects/${id}`)
    if (response.data) {
      getProjects()
    } else {
      console.log(response?.error.message)
    }
  }

  return {
    //States
    projects,

    //Actions
    getProjects,
    addProjects,
    updateProject,
    deleteProject,
  }
})
