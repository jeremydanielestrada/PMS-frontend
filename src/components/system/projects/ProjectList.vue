<script setup>
import { ref, onMounted } from 'vue'
import { useProjectStore } from '@/stores/project'
import ProjectsDialog from './ProjectsDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

//Load variables
const projectStore = useProjectStore()

const isDialogVisible = ref(false)
const isConfirmVisible = ref(false)
const selectedProjectId = ref(null)
const projectData = ref(null)
const isLoading = ref(false)

onMounted(() => {
  projectStore.getProjects()
})

const addProject = () => {
  isDialogVisible.value = true
  projectData.value = null
}

const handleUpdate = async (project) => {
  isDialogVisible.value = true
  projectData.value = project
}

const handleDelete = async () => {
  isLoading.value = true
  if (selectedProjectId.value !== null) await projectStore.deleteProject(selectedProjectId.value)
  isConfirmVisible.value = false
  selectedProjectId.value = null
}

const deleteDialog = (id) => {
  isConfirmVisible.value = true
  selectedProjectId.value = id
}
</script>

<template>
  <v-row>
    <v-col cols="12" sm="4">
      <h1>Projects</h1>
    </v-col>
    <v-spacer></v-spacer>
    <v-col cols="12" md="4" class="d-flex ga-2">
      <v-text-field
        label="Search"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        density="compact"
      ></v-text-field>
      <v-btn icon class="mb-5" @click="addProject">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" v-for="project in projectStore.projects" :key="project.id">
      <v-card v-if="projectStore.projects.length > 0">
        <v-card-title>{{ project.name }}</v-card-title>
        <v-card-text>
          <h3>{{ project.user.first_name }}</h3>
          <p>{{ project.description }}</p>
          <small>{{ project.due_date }}</small>
        </v-card-text>
        <v-card-actions>
          <v-btn icon @click="deleteDialog(project.id)">
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-btn>
          <v-btn icon @click="handleUpdate(project)">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      <ConfirmDialog
        title="Delete Project?"
        text="Confirm to delete"
        :isLoading="isLoading"
        subject="Deleting Projec"
        @confirm="handleDelete"
        v-model:isConfirmVisible="isConfirmVisible"
      />
    </v-col>
    <v-col cols="12" class="text-center" v-if="projectStore.projects == null">
      <v-progress-circular
        color="primary"
        indeterminate
        width="15"
        size="100"
      ></v-progress-circular>
      <p>Loading Projects</p>
    </v-col>
  </v-row>
  <ProjectsDialog v-model:isDialogVisible="isDialogVisible" :projectData="projectData" />
</template>
