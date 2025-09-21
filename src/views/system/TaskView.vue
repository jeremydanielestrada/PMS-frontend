<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import KanbanBoard from '@/components/system/tasks/KanbanBoard.vue'
import { useProjectStore } from '@/stores/project'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const projectStore = useProjectStore()
const router = useRouter()
const authStore = useAuthStore()

const currentProject = ref(null)
const isLoading = ref(true)

onMounted(async () => {

  // Load projects first
  await projectStore.getProjects()

  // Then load the selected project
  const projectId = route.params.projectId || route.query.project_id

  if (projectId) {
    try {
      currentProject.value = await projectStore.getSingleProject(projectId)
    } catch (error) {
      console.error('Error loading project:', error)
    }
  }
  isLoading.value = false
})

// Watch for route changes
watch(
  () => route.query.project_id,
  async (newProjectId) => {
    console.log('Route changed, new project ID:', newProjectId)
    if (newProjectId && newProjectId !== currentProject.value?.id) {
      try {
        currentProject.value = await projectStore.getSingleProject(newProjectId)
      } catch (error) {
        console.error('Error updating project:', error)
      }
    }
  },
)

// Get user's projects for project selector
const userProjects = computed(() => {
  if (authStore.isAdmin) {
    return projectStore.projects || []
  }

  // Filter projects where user is a member
  return (
    projectStore.projects?.filter((project) =>
      project.project_members?.some((member) => member.user_id === authStore.userData?.id),
    ) || []
  )
})

const handleProjectChange = async (projectId) => {
  if (projectId) {
    isLoading.value = true
    try {
      currentProject.value = await projectStore.getSingleProject(projectId)
      router.push({ query: { project_id: projectId } })
    } catch (error) {
      console.error('Error changing project:', error)
    } finally {
      isLoading.value = false
    }
  }
}
</script>

<template>
  <AppLayout>
    <template #content>
      <div v-if="isLoading" class="text-center pa-8">
        <v-progress-circular indeterminate />
        <p class="mt-4">Loading tasks...</p>
      </div>

      <div v-else>
        <!-- Header -->
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <h1 class="text-h4">Tasks</h1>
            <p class="text-subtitle-1" v-if="currentProject">
              {{ currentProject.name }}
            </p>
          </v-col>

          <v-col cols="12" md="6" class="d-flex align-center justify-end">
            <v-select
              :model-value="currentProject?.id"
              @update:model-value="handleProjectChange"
              label="Select Project"
              :items="userProjects"
              item-title="name"
              item-value="id"
              variant="outlined"
              density="compact"
              style="max-width: 300px"
            />
          </v-col>
        </v-row>

        <!-- Kanban Board -->
        <div v-if="currentProject && currentProject.id">
          <KanbanBoard :project-id="currentProject.id" />
        </div>

        <!-- No Project Selected -->
        <v-card v-else class="text-center pa-8">
          <v-card-text>
            <v-icon size="64" color="grey">mdi-clipboard-list-outline</v-icon>
            <h3 class="mt-4 mb-2">Select a Project</h3>
            <p class="text-grey">Choose a project to view and manage its tasks</p>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </AppLayout>
</template>
