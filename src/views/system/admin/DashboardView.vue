<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useTaskStore } from '@/stores/task'
import { useAuthStore } from '@/stores/auth'

const projectStore = useProjectStore()
const taskStore = useTaskStore()
const authStore = useAuthStore()

const isLoading = ref(true)

// Statistics
const totalProjects = computed(() => projectStore.projects?.length || 0)
const totalTasks = computed(() => taskStore.tasks?.length || 0)

// Task status breakdown
const tasksByStatus = computed(() => {
  const tasks = taskStore.tasks || []
  return {
    todo: tasks.filter((task) => task.status === 'todo').length,
    inProgress: tasks.filter((task) => task.status === 'in_progress').length,
    completed: tasks.filter((task) => task.status === 'completed').length,
  }
})

onMounted(async () => {
  try {
    await Promise.all([projectStore.getProjects(), taskStore.fetchTasks()])
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid>
        <!-- Loading State -->
        <v-row v-if="isLoading" justify="center" align="center" style="height: 400px">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>

        <template v-else>
          <!-- Header -->
          <v-row class="mb-6">
            <v-col cols="12">
              <h1 class="text-h4 font-weight-bold text-primary">Dashboard Overview</h1>
            </v-col>
          </v-row>

          <!-- Statistics Cards -->
          <v-row>
            <!-- Total Projects Card -->
            <v-col cols="12" md="4">
              <v-card class="mx-auto" elevation="2" :color="'blue-lighten-5'">
                <v-card-item>
                  <v-card-title class="text-h6">Total Projects</v-card-title>
                  <div class="text-h3 font-weight-bold text-primary mt-2">
                    {{ totalProjects }}
                  </div>
                </v-card-item>
                <v-card-text>
                  <v-icon color="primary" class="mr-2">mdi-folder-multiple</v-icon>
                  Active Projects
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Total Tasks Card -->
            <v-col cols="12" md="4">
              <v-card class="mx-auto" elevation="2" :color="'blue-lighten-5'">
                <v-card-item>
                  <v-card-title class="text-h6">Total Tasks</v-card-title>
                  <div class="text-h3 font-weight-bold text-primary mt-2">
                    {{ totalTasks }}
                  </div>
                </v-card-item>
                <v-card-text>
                  <v-icon color="primary" class="mr-2">mdi-checkbox-marked-circle</v-icon>
                  All Tasks
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Completion Rate Card -->
            <v-col cols="12" md="4">
              <v-card class="mx-auto" elevation="2" :color="'blue-lighten-5'">
                <v-card-item>
                  <v-card-title class="text-h6">Completion Rate</v-card-title>
                  <div class="text-h3 font-weight-bold text-primary mt-2">
                    {{ totalTasks ? Math.round((tasksByStatus.completed / totalTasks) * 100) : 0 }}%
                  </div>
                </v-card-item>
                <v-card-text>
                  <v-progress-linear
                    :model-value="totalTasks ? (tasksByStatus.completed / totalTasks) * 100 : 0"
                    color="primary"
                    height="10"
                    rounded
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Task Status Breakdown -->
          <v-row class="mt-6">
            <v-col cols="12">
              <v-card elevation="2">
                <v-card-title class="text-h6 pa-4 bg-primary text-white">
                  Task Status Breakdown
                </v-card-title>
                <v-card-text class="pa-4">
                  <v-row>
                    <!-- To Do Tasks -->
                    <v-col cols="12" md="4">
                      <v-card variant="outlined" class="text-center pa-4">
                        <v-icon size="36" color="grey">mdi-format-list-checks</v-icon>
                        <div class="text-h5 mt-2">{{ tasksByStatus.todo }}</div>
                        <div class="text-body-1">To Do</div>
                      </v-card>
                    </v-col>

                    <!-- In Progress Tasks -->
                    <v-col cols="12" md="4">
                      <v-card variant="outlined" class="text-center pa-4">
                        <v-icon size="36" color="orange">mdi-progress-clock</v-icon>
                        <div class="text-h5 mt-2">{{ tasksByStatus.inProgress }}</div>
                        <div class="text-body-1">In Progress</div>
                      </v-card>
                    </v-col>

                    <!-- Completed Tasks -->
                    <v-col cols="12" md="4">
                      <v-card variant="outlined" class="text-center pa-4">
                        <v-icon size="36" color="success">mdi-check-circle</v-icon>
                        <div class="text-h5 mt-2">{{ tasksByStatus.completed }}</div>
                        <div class="text-body-1">Completed</div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-5px);
}
</style>
