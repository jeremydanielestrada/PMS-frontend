<script setup>
import { ref, onMounted } from 'vue'
import { useProjectStore } from '@/stores/project'
import ProjectsDialog from './ProjectsDialog.vue'

//Load variables
const projectStore = useProjectStore()

const isDialogVisible = ref(false)
onMounted(() => {
  projectStore.getProjects()
})
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
      <v-btn icon class="mb-5" @click="isDialogVisible = !isDialogVisible">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" v-for="project in projectStore.projects" :key="project.id">
      <v-card>
        <v-card-title>{{ project.name }}</v-card-title>
        <v-card-text>
          <h3>{{ project.user.first_name }}</h3>
          <p>{{ project.description }}</p>
          <small>{{ project.due_date }}</small>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <ProjectsDialog v-model:isDialogVisible="isDialogVisible" />
</template>
