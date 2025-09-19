<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useRoute } from 'vue-router'
import ProjectsDialog from './ProjectsDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

//Load Variables
const projectStore = useProjectStore()
const route = useRoute()
const isLoading = ref(true)
const projectMembers = ref([])
const isDialogVisible = ref(false)
const isConfirmVisible = ref(false)
const selectedProjectId = ref(null)
const projectData = ref(null)

const project = computed(() => projectStore.getProject || {})

onMounted(async () => {
  await projectStore.getSingleProject(route.params.id)
  projectMembers.value = await projectStore.getProjectMembersByProject(route.params.id)
  isLoading.value = false
})

const handleUpdate = async (project) => {
  isDialogVisible.value = true
  projectData.value = project
}

const handleDelete = async () => {
  isLoading.value = true
  if (selectedProjectId.value !== null) {
    await projectStore.deleteProject(selectedProjectId.value)
    isConfirmVisible.value = false
    selectedProjectId.value = null
    isLoading.value = false
  }
}

const deleteDialog = (id) => {
  isConfirmVisible.value = true
  selectedProjectId.value = id
}
</script>

<template>
  <div class="d-flex flex-column align-center" v-if="isLoading">
    <v-progress-circular color="primary" indeterminate width="15" size="100"></v-progress-circular>
    <span>Loading project</span>
  </div>

  <div v-else>
    <v-card class="mx-auto pa-4">
      <!-- Header Section -->
      <v-row>
        <v-col cols="12" sm="3" md="9" class="pb-4">
          <v-card-title class="text-h4">{{ project.name }}</v-card-title>
        </v-col>
        <v-col cols="12" sm="3" md="3" class="d-flex justify-space-between align-center pb-4">
          <div class="d-flex ga-2">
            <v-btn icon variant="outlined">
              <v-icon>mdi-account-multiple-plus-outline</v-icon>
              <v-tooltip activator="parent" location="bottom">Add Members</v-tooltip>
            </v-btn>
            <v-btn icon variant="outlined" @click="handleUpdate(project)">
              <v-icon>mdi-pencil-outline</v-icon>
              <v-tooltip activator="parent" location="bottom">Edit Project</v-tooltip>
            </v-btn>
            <v-btn icon variant="outlined" color="error" @click="deleteDialog(project.id)">
              <v-icon>mdi-trash-can-outline</v-icon>
              <v-tooltip activator="parent" location="bottom">Delete Project</v-tooltip>
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <!-- Content Section -->
      <v-card-text class="mt-4">
        <v-row>
          <!-- Project Details -->
          <v-col cols="12" md="6">
            <h3 class="text-h6 mb-4">Project Details</h3>
            <div class="mb-4">
              <div class="text-subtitle-1 font-weight-bold mb-2">Description</div>
              <p class="text-body-1">{{ project.description }}</p>
            </div>
            <v-row>
              <v-col cols="6">
                <div class="text-subtitle-1 font-weight-bold">Project Owner</div>
                <p class="text-body-1">
                  {{ project.user.first_name + ' ' + project.user.last_name }}
                </p>
              </v-col>
              <v-col cols="6">
                <div class="text-subtitle-1 font-weight-bold">Due Date</div>
                <p class="text-body-1">{{ new Date(project.due_date).toLocaleDateString() }}</p>
              </v-col>
            </v-row>
          </v-col>

          <!-- Project Members -->
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="pa-4">
              <h3 class="text-h6 mb-4">Project Members</h3>
              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="member in project.project_members"
                  :key="member.id"
                  :color="member.role === 'leader' ? 'primary' : 'default'"
                  :variant="member.role === 'leader' ? 'elevated' : 'outlined'"
                  class="mb-2"
                >
                  <template v-slot:prepend>
                    <v-avatar size="small">
                      <v-icon>{{ member.role === 'leader' ? 'mdi-star' : 'mdi-account' }}</v-icon>
                    </v-avatar>
                  </template>
                  {{ member.user.first_name + ' ' + member.user.last_name }}
                  <span class="text-caption ms-2">({{ member.role }})</span>
                </v-chip>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <ConfirmDialog
      title="Delete Project?"
      text="Confirm to delete"
      :isLoading="isLoading"
      subject="Deleting Projec"
      @confirm="handleDelete"
      v-model:isConfirmVisible="isConfirmVisible"
    />
  </div>
  <ProjectsDialog v-model:isDialogVisible="isDialogVisible" :projectData="projectData" />
</template>
