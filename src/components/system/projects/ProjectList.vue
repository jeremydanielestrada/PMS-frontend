<script setup>
import { ref, onMounted } from 'vue'
import { useProjectStore } from '@/stores/project'

//Load variables
const projectStore = useProjectStore()
onMounted(() => {
  projectStore.getProjects()
})
</script>

<template>
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
</template>
