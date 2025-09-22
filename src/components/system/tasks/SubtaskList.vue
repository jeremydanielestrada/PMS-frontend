<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSubTaskStore } from '@/stores/subtask'
import { useAuthStore } from '@/stores/auth'

const props = defineProps(['taskId', 'task'])

console.log('SubtaskList props:', props) // Add debug

const subtaskStore = useSubTaskStore()
const authStore = useAuthStore()

const subtasks = ref([])
const showAddForm = ref(false)
const showEditDialog = ref(false)
const editingSubtask = ref({})

const newSubtask = ref({
  title: '',
  description: '',
  task_id: props.taskId,
  is_completed: false,
})

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

const completionPercentage = computed(() => {
  if (subtasks.value.length === 0) return 0
  const completed = subtasks.value.filter((s) => s.is_completed).length
  return Math.round((completed / subtasks.value.length) * 100)
})

onMounted(async () => {
  if (props.taskId) {
    subtasks.value = await subtaskStore.getSubTasksByTask(props.taskId)
  }
})

const addSubtask = async () => {
  if (!newSubtask.value.title.trim()) return

  try {
    await subtaskStore.createSubTask(newSubtask.value)
    subtasks.value = await subtaskStore.getSubTasksByTask(props.taskId)
    newSubtask.value = { title: '', description: '', task_id: props.taskId }
    showAddForm.value = false
  } catch (error) {
    console.error('Error adding subtask:', error)
  }
}

const cancelAdd = () => {
  newSubtask.value = { title: '', description: '', task_id: props.taskId }
  showAddForm.value = false
}

const toggleComplete = async (subtaskId) => {
  try {
    await subtaskStore.toggleSubTaskComplete(subtaskId)
    subtasks.value = await subtaskStore.getSubTasksByTask(props.taskId)
  } catch (error) {
    console.error('Error toggling subtask:', error)
  }
}

const editSubtask = (subtask) => {
  editingSubtask.value = { ...subtask }
  showEditDialog.value = true
}

const updateSubtask = async () => {
  try {
    await subtaskStore.updateSubTask(editingSubtask.value.id, editingSubtask.value)
    subtasks.value = await subtaskStore.getSubTasksByTask(props.taskId)
    showEditDialog.value = false
  } catch (error) {
    console.error('Error updating subtask:', error)
  }
}

const deleteSubtask = async (subtaskId) => {
  if (confirm('Are you sure you want to delete this subtask?')) {
    try {
      await subtaskStore.deleteSubTask(subtaskId)
      subtasks.value = await subtaskStore.getSubTasksByTask(props.taskId)
    } catch (error) {
      console.error('Error deleting subtask:', error)
    }
  }
}
</script>

<template>
  <div class="subtask-list">
    <div class="d-flex justify-space-between align-center mb-3">
      <h4>Subtasks</h4>
      <v-btn size="small" @click="showAddForm = !showAddForm" v-if="canManageSubtasks">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>

    <!-- Add Subtask Form -->
    <v-card v-if="showAddForm" class="mb-3 pa-3">
      <v-text-field
        v-model="newSubtask.title"
        label="Subtask Title"
        variant="outlined"
        density="compact"
        @keyup.enter="addSubtask"
      />
      <v-textarea
        v-model="newSubtask.description"
        label="Description (optional)"
        variant="outlined"
        density="compact"
        rows="2"
      />
      <div class="d-flex gap-2 mt-2">
        <v-btn @click="addSubtask" color="primary" size="small">Add</v-btn>
        <v-btn @click="cancelAdd" size="small">Cancel</v-btn>
      </div>
    </v-card>

    <!-- Progress Bar -->
    <v-progress-linear
      v-if="subtasks.length > 0"
      :model-value="completionPercentage"
      color="success"
      height="6"
      class="mb-3"
    />

    <!-- Subtasks List -->
    <div class="subtasks">
      <v-card v-for="subtask in subtasks" :key="subtask.id" class="mb-2 pa-2" variant="outlined">
        <div class="d-flex align-center">
          <v-checkbox
            :model-value="subtask.is_completed"
            @update:model-value="toggleComplete(subtask.id)"
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

    <!-- Edit Dialog -->
    <v-dialog v-model="showEditDialog" width="400">
      <v-card>
        <v-card-title>Edit Subtask</v-card-title>
        <v-card-text>
          <v-text-field v-model="editingSubtask.title" label="Title" variant="outlined" />
          <v-textarea
            v-model="editingSubtask.description"
            label="Description"
            variant="outlined"
            rows="2"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showEditDialog = false">Cancel</v-btn>
          <v-btn @click="updateSubtask" color="primary">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
