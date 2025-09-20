<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useProjectStore } from '@/stores/project'
import { debounce } from 'lodash'
import ProjectsDialog from './ProjectsDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import PaginationLinks from '@/components/common/PaginationLinks.vue'

//Load variables
const projectStore = useProjectStore()
const isDialogVisible = ref(false)
const isConfirmVisible = ref(false)
const selectedProjectId = ref(null)
const projectData = ref(null)
const isLoading = ref(false)
const currentPage = ref(1)
const searchQuery = ref('')

onMounted(() => {
  projectStore.getProjects()
})

// Get total pages from store
const totalPages = computed(() => projectStore.pagination?.last_page || 1)

// Watch for page changes
watch(currentPage, (newPage) => {
  projectStore.getProjects({ page: newPage, search: searchQuery.value })
})

//Debounced serach functions
const debouncedSearch = debounce((value) => {
  currentPage.value = 1
  projectStore.getProjects({ page: 1, search: value })
}, 500)

watch(searchQuery, (newSearch) => {
  debouncedSearch(newSearch)
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
  <v-row>
    <v-col cols="12" sm="4">
      <h1>Projects</h1>
    </v-col>
    <v-spacer></v-spacer>
    <v-col cols="12" md="4" class="d-flex ga-2">
      <v-text-field
        v-model="searchQuery"
        label="Search"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        clearable
      ></v-text-field>
      <v-btn icon class="mb-5" @click="addProject">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" v-if="projectStore.projects?.length > 0">
      <v-table>
        <thead>
          <tr class="bg-blue-darken-2">
            <th class="text-left">Project Name</th>
            <th class="text-left">Owner</th>
            <th class="text-left">Due Date</th>
            <th class="text-left">View</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr cols="12" v-for="project in projectStore.projects" :key="project.id">
            <td>{{ project.name }}</td>
            <td>{{ project.user.first_name + ' ' + project.user.last_name }}</td>
            <td>{{ project.due_date }}</td>
            <td>
              <v-btn icon size="30" :to="`/projects/${project.id}`"><v-icon>mdi-eye</v-icon></v-btn>
            </td>
            <td>
              <v-btn icon size="30" class="mx-2" @click="deleteDialog(project.id)">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
              <v-btn icon size="30" @click="handleUpdate(project)">
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <ConfirmDialog
        title="Delete Project?"
        text="Confirm to delete"
        :isLoading="isLoading"
        subject="Deleting Projec"
        @confirm="handleDelete"
        v-model:isConfirmVisible="isConfirmVisible"
      />
    </v-col>
    <v-col cols="12" v-else-if="projectStore.projects?.length === 0">
      <h3 class="text-center">There is no project</h3>
    </v-col>
    <v-col cols="12" class="text-center" v-else>
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
  <PaginationLinks
    v-model="currentPage"
    :totalPage="totalPages"
    v-if="projectStore.projects?.length > 0"
  />
</template>
