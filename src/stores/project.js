import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useProjectStore = defineStore('project', () => {
  const projects = ref(null)
  const projectMembers = ref([])

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
    const response = await api.delete(`/projects/${id}`)
    if (response) {
      getProjects()
    } else {
      console.log(response?.error.message)
    }
  }

  async function getProjectMembers() {
    const response = api.get('/project-members')

    if (response) projectMembers.value = response.data

    return response.data
  }

  async function addProjectMembers(formData) {
    try {
      const response = api.post('/project-members', formData)
      if (response.data) getProjectMembers()
    } catch (error) {
      console.log(error, 'Error adding members')
    }
  }

  async function deleteProjectMembers(id) {
    const response = api.post(`/project-members${id}`)
    if (response) getProjectMembers()
  }

  return {
    //States
    projects,
    projectMembers,

    //Actions
    getProjects,
    getProjectMembers,
    addProjects,
    addProjectMembers,
    updateProject,
    deleteProject,
    deleteProjectMembers,
  }
})
