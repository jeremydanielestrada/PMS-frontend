<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSubTaskStore } from '@/stores/subtask'
import { useAuthStore } from '@/stores/auth'
import SubtaskDialog from './SubtaskDialog.vue'

const props = defineProps(['task', 'taskId'])

const authStore = useAuthStore()
const subtaskStore = useSubTaskStore()
const showEditDialog = ref(false)
const subtaskData = ref(null)

const canManageSubtasks = computed(() => {
  return (
    authStore.isAdmin || props.task?.assigned_to === authStore.userData?.id || isProjectLeader.value
  )
})

const isProjectLeader = computed(() => {
  return authStore.userData?.projectMembers?.some(
    (member) => member.project_id === props.task?.project_id && member.role === 'leader',
  )
})

// Add completion percentage computed
const completionPercentage = computed(() => {
  if (!subtaskStore.subtasks?.length) return 0
  const completed = subtaskStore.subtasks.filter((s) => s.is_completed).length
  return Math.round((completed / subtaskStore.subtasks.length) * 100)
})

onMounted(async () => {
  if (props.taskId) {
    await subtaskStore.getSubTasksByTask(props.taskId)
  }
})

const editSubtask = (subtask) => {
  showEditDialog.value = true
  subtaskData.value = subtask
}

// Add missing delete function
const deleteSubtask = async (subtaskId) => {
  if (confirm('Delete this subtask?')) {
    await subtaskStore.deleteSubTask(subtaskId)
    // Refresh the list
    await subtaskStore.getSubTasksByTask(props.taskId || props.task.id)
  }
}

// Fix toggle function
const toggleSubtask = async (subtaskId) => {
  await subtaskStore.toggleSubTaskComplete(subtaskId)
  // Refresh the list
  await subtaskStore.getSubTasksByTask(props.taskId || props.task.id)
}
</script>

<template>
  <div class="subtask-list">
    <!-- Progress Bar -->
    <v-progress-linear
      v-if="subtaskStore.subtasks?.length > 0"
      :model-value="completionPercentage"
      color="success"
      height="6"
      class="mb-3"
    />

    <!-- Subtasks List -->
    <div class="subtasks">
      <v-card
        v-for="subtask in subtaskStore.subtasks"
        :key="subtask.id"
        class="mb-2 pa-2"
        variant="outlined"
      >
        <div class="d-flex align-center">
          <v-checkbox
            :model-value="subtask.is_completed"
            @update:model-value="toggleSubtask(subtask.id)"
            density="compact"
            hide-details
            :disabled="!canManageSubtasks"
          />

          <div class="flex-grow-1 ml-2">
            <div
              :class="{ 'text-decoration-line-through text-grey': subtask.is_completed }"
              class="font-weight-medium"
            >
              {{ subtask.title }}
            </div>
            <div v-if="subtask.description" class="text-caption text-grey">
              {{ subtask.description }}
            </div>
          </div>

          <v-menu v-if="canManageSubtasks">
            <template v-slot:activator="{ props }">
              <v-btn icon size="small" v-bind="props">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="editSubtask(subtask)">
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteSubtask(subtask.id)">
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-card>
    </div>
  </div>

  <SubtaskDialog
    v-model:showForm="showEditDialog"
    :subtaskData="subtaskData"
    :taskId="props.taskId || props.task?.id"
  />
</template>
