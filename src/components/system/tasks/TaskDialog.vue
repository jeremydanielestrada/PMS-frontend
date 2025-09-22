<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTaskStore } from '@/stores/task'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/project'
import SubtaskList from './SubtaskList.vue'

const props = defineProps(['visible', 'task', 'projectId'])
const emit = defineEmits(['update:visible', 'saved'])

const taskStore = useTaskStore()
const authStore = useAuthStore()
const projectStore = useProjectStore()

const isLoading = ref(false)
const projectMembers = ref([])

const modal = computed({
  get: () => props.visible,
  set: (newValue) => emit('update:visible', newValue),
})

const isUpdate = computed(() => !!props.task?.id)

const formDataDefault = {
  title: '',
  description: '',
  project_id: null,
  assigned_to: null,
  priority: 'medium',
  status: 'todo',
  due_date: null,
}

const formData = ref({ ...formDataDefault })

// Watch for task changes
watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      formData.value = { ...formDataDefault, ...newTask }
    } else {
      formData.value = { ...formDataDefault }
    }
  },
  { immediate: true },
)

// Get project members for assignment
onMounted(async () => {
  if (props.projectId) {
    formData.value.project_id = props.projectId
    // Get project members for assignment dropdown
    const project = await projectStore.getSingleProject(props.projectId)
    projectMembers.value = project.project_members || []
  }
})

const memberOptions = computed(() =>
  projectMembers.value.map((member) => ({
    title: `${member.user.first_name} ${member.user.last_name}`,
    value: member.user.id,
  })),
)

const canAssignTasks = computed(() => {
  return authStore.isAdmin || isProjectLeader.value
})

const isProjectLeader = computed(() => {
  return projectMembers.value.some(
    (member) => member.user_id === authStore.userData?.id && member.role === 'leader',
  )
})

const handleSubmit = async () => {
  isLoading.value = true
  try {
    // Format the data before sending
    const submitData = { ...formData.value }

    // Format date to MySQL format (YYYY-MM-DD)
    if (submitData.due_date) {
      submitData.due_date = new Date(submitData.due_date).toISOString().split('T')[0]
    }

    if (isUpdate.value) {
      await taskStore.updateTask(props.task.id, submitData)
    } else {
      await taskStore.createTask(submitData)
    }

    formData.value = { ...formDataDefault }
    modal.value = false
    emit('saved')
  } catch (error) {
    console.error('Error saving task:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-dialog v-model="modal" width="600" persistent>
    <v-card>
      <v-card-title>
        {{ isUpdate ? 'Edit Task' : 'Create New Task' }}
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.title"
                label="Task Title"
                required
                variant="outlined"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="formData.description"
                label="Description"
                variant="outlined"
                rows="3"
              />
            </v-col>

            <v-col cols="6">
              <v-select
                v-model="formData.assigned_to"
                label="Assign To"
                :items="memberOptions"
                variant="outlined"
                clearable
                :disabled="!canAssignTasks"
              />
            </v-col>

            <v-col cols="6">
              <v-select
                v-model="formData.priority"
                label="Priority"
                :items="[
                  { title: 'Low', value: 'low' },
                  { title: 'Medium', value: 'medium' },
                  { title: 'High', value: 'high' },
                ]"
                variant="outlined"
              />
            </v-col>

            <v-col cols="6">
              <v-select
                v-model="formData.status"
                label="Status"
                :items="[
                  { title: 'To Do', value: 'todo' },
                  { title: 'In Progress', value: 'in_progress' },
                  { title: 'Done', value: 'done' },
                ]"
                variant="outlined"
              />
            </v-col>

            <v-col cols="6">
              <v-date-input v-model="formData.due_date" label="Due Date" variant="outlined" />
            </v-col>
          </v-row>
        </v-form>
        <div v-if="isUpdate && props.task?.id">
          <SubtaskList :task-id="props.task.id" :task="props.task" />
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="modal = false">Cancel</v-btn>
        <v-btn @click="handleSubmit" :loading="isLoading" color="primary">
          {{ isUpdate ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
      <v-divider class="my-4" />
    </v-card>
  </v-dialog>
</template>
