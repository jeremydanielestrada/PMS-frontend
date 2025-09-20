import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useProjectStore = defineStore('project', () => {
  const projects = ref(null)
  const projectMembers = ref([])
  const getProject = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  })

  //Get Projects with search and pagination
  async function getProjects(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      per_page: params.per_page || 10,
      ...(params.search && { q: params.search }),
    })

    const response = await api.get(`/projects?${queryParams}`)
    projects.value = response.data.data // Laravel pagination wraps data
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total,
    }
    return response.data
  }

  //Get a single project
  async function getSingleProject(id) {
    try {
      const response = await api.get(`/projects/${id}`)
      getProject.value = response.data
    } catch (error) {
      console.log(error)
    }
  }

  //Add Projects
  async function addProjects(formData) {
    const response = await api.post('/projects', formData)
    if (response.data) getProjects()
    return response.data
  }

  //Update Projects
  async function updateProject(id, formData) {
    const response = await api.put(`/projects/${id}`, formData)
    if (response.data) getProjects()
    return response.data
  }

  async function deleteProject(id) {
    const response = await api.delete(`/projects/${id}`)
    if (response) {
      getProjects()
    } else {
      console.log(response?.error.message)
    }
  }

  async function getProjectMembersByProject(projectId) {
    const response = api.get(`/project-members?project_id=${projectId}`)
    return response.data
  }

  async function addProjectMembers(formData) {
    const response = await api.post('/project-members', formData)

    // If we have the current project loaded, refresh it
    if (getProject.value && getProject.value.id == formData.project_id) {
      await getSingleProject(formData.project_id)
    }

    return response.data
  }

  async function deleteProjectMembers(id) {
    const response = api.delete(`/project-members/${id}`)

    // Refresh the current project if it's loaded
    if (getProject.value) {
      await getSingleProject(getProject.value.id)
    }

    return response.data
  }

  return {
    //States
    projects,
    projectMembers,
    pagination,
    getProject,

    //Actions
    getProjects,
    getProjectMembersByProject,
    addProjects,
    addProjectMembers,
    updateProject,
    deleteProject,
    deleteProjectMembers,
    getSingleProject,
  }
})
