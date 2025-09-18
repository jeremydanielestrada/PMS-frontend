<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useRoute } from 'vue-router'

//Load Variables
const projectStore = useProjectStore()
const route = useRoute()
const isLoading = ref(true)

const project = computed(() => projectStore.getProject || {})

onMounted(() => {
  projectStore.getSingleProject(route.params.id)
  isLoading.value = false
})
</script>

<template>
  <div class="d-flex flex-column align-center" v-if="isLoading">
    <v-progress-circular color="primary" indeterminate width="15" size="100"></v-progress-circular>
    <span>Loading project</span>
  </div>
  <v-card :title="project.name" v-else>
    <v-card-text>
      <p>
        <strong>{{ project.description }}</strong>
      </p>
      <small>{{ project.due_date }}</small>
    </v-card-text>
  </v-card>
</template>
