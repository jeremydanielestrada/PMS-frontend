<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps(['task'])
defineEmits(['edit', 'delete'])

const authStore = useAuthStore()

const canManageTask = computed(() => {
  return authStore.isAdmin || props.task.assigned_to === authStore.userData?.id
})

const canDeleteTask = computed(() => {
  return authStore.isAdmin || props.task.created_by === authStore.userData?.id
})

const priorityColor = computed(() => {
  const colors = {
    low: 'green',
    medium: 'orange',
    high: 'red',
  }
  return colors[props.task.priority] || 'grey'
})
</script>

<template>
  <v-card class="task-card" elevation="2">
    <v-card-text>
      <div class="d-flex justify-space-between align-start mb-2">
        <h4 class="task-title">{{ task.title }}</h4>
        <v-menu v-if="canManageTask">
          <template v-slot:activator="{ props }">
            <v-btn icon size="small" v-bind="props">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="$emit('edit', task)">
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$emit('delete', task.id)" v-if="canDeleteTask">
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <p class="task-description text-caption">{{ task.description }}</p>

      <div class="d-flex justify-space-between align-center mt-2">
        <v-chip size="small" :color="priorityColor">
          {{ task.priority }}
        </v-chip>

        <v-avatar size="24" v-if="task.assigned_user">
          <span class="text-caption">
            {{ task.assigned_user.first_name[0] }}{{ task.assigned_user.last_name[0] }}
          </span>
        </v-avatar>
      </div>

      <div class="text-caption text-grey mt-1" v-if="task.due_date">
        Due: {{ new Date(task.due_date).toLocaleDateString() }}
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.task-card {
  cursor: grab;
  transition: transform 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
}

.task-description {
  color: #666;
  line-height: 1.3;
}
</style>
