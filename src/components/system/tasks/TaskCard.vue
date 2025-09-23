<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps(['task'])
defineEmits(['edit', 'delete'])

const authStore = useAuthStore()

const canManageTask = computed(() => {
  return authStore.isAdmin || props.task.assigned_to === authStore.userData?.id
})

const canDeleteTask = computed(() => {
  return (
    authStore.isAdmin ||
    authStore.authorizedUser?.project_members?.some(
      (member) => member.project_id === props.task.project_id && member.role === 'leader',
    )
  )
})

onMounted(() => {
  authStore.getAuthorizedUser()
})

const priorityColor = computed(() => {
  const colors = {
    low: 'green',
    medium: 'orange',
    high: 'red',
  }
  return colors[props.task.priority] || 'grey'
})

const subtaskProgress = computed(() => {
  if (!props.task.subtasks || props.task.subtasks.length === 0) return 0
  const completed = props.task.subtasks.filter((s) => s.is_completed).length
  return Math.round((completed / props.task.subtasks.length) * 100)
})

const completedSubtasks = computed(() => {
  return props.task.subtasks?.filter((s) => s.is_completed).length || 0
})
</script>

<template>
  <v-card class="task-card" elevation="2">
    <div class="mt-2" v-if="task.subtasks && task.subtasks.length > 0">
      <v-progress-linear :model-value="subtaskProgress" color="success" height="4" />
      <div class="text-caption text-grey mt-1">
        {{ completedSubtasks }}/{{ task.subtasks.length }} subtasks completed
      </div>
    </div>

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
