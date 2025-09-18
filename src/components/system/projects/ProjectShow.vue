<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useRoute } from 'vue-router'

//Load Variables
const projectStore = useProjectStore()
const route = useRoute()

onMounted(() => {
  projectStore.getSingleProject(route.params.id)
})
</script>

<template>
  <v-card :title="projectStore.getProject?.name">
    <v-card-text>
      <p>
        <strong>{{ projectStore.getProject?.description }}</strong>
      </p>
      <small>{{ projectStore.getProject?.due_date }}</small>
    </v-card-text>
  </v-card>
</template>
