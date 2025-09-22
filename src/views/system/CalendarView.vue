<script setup>
import { ref, onMounted, computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useTaskStore } from '@/stores/task'

const taskStore = useTaskStore()
const selectedDate = ref(new Date())

onMounted(() => {
  taskStore.fetchTasks()
})

const calendarEvents = computed(() => {
  return taskStore.tasks.map((task) => ({
    title: task.title,
    start: task.due_date,
    color: task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green',
    task: task,
  }))
})
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Task Calendar</v-card-title>
            <v-card-text>
              <v-calendar
                v-model="selectedDate"
                :events="calendarEvents"
                event-color="primary"
                type="month"
              >
                <template #event="{ event }">
                  <div class="text-caption">
                    {{ event.title }}
                    {{ event.start }}
                  </div>
                </template>
              </v-calendar>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
