<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/task'
import { useAuthStore } from '@/stores/auth'
import draggable from 'vuedraggable'
import TaskCard from './TaskCard.vue'
import TaskDialog from './TaskDialog.vue'

const props = defineProps(['projectId'])

const taskStore = useTaskStore()
const authStore = useAuthStore()
const showTaskDialog = ref(false)
const selectedTask = ref(null)

const columns = {
  todo: { title: 'To Do', color: 'grey' },
  in_progress: { title: 'In Progress', color: 'orange' },
  done: { title: 'Done', color: 'green' },
}

const tasksByStatus = computed(() => taskStore.tasksByStatus)

const canCreateTasks = computed(() => {
  return authStore.isAdmin || isProjectMember.value
})

const canDragTasks = computed(() => {
  return authStore.isAdmin || isProjectMember.value
})

const isProjectMember = computed(() => {
  if (!authStore.authorizedUser?.project_members) {
    return false
  }

  const isMember = authStore.authorizedUser.project_members.some((member) => {
    return member.project_id == props.projectId
  })

  return isMember
})
onMounted(async () => {
  await authStore.getAuthorizedUser()
  if (props.projectId) {
    taskStore.getTasksByProject(props.projectId)
  }
})

const onTaskMove = async (event) => {
  if (event.added) {
    const task = event.added.element
    const newStatus = Object.keys(columns).find((status) =>
      tasksByStatus.value[status].includes(task),
    )

    if (newStatus && task.status !== newStatus) {
      await taskStore.updateTaskStatus(task.id, newStatus)
    }
  }
}

const createTask = (status) => {
  selectedTask.value = { status, project_id: props.projectId }
  showTaskDialog.value = true
}

const editTask = (task) => {
  selectedTask.value = { ...task }
  showTaskDialog.value = true
}

const deleteTask = async (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    await taskStore.deleteTask(taskId)
  }
}

const onTaskSaved = () => {
  showTaskDialog.value = false
  selectedTask.value = null
  taskStore.getTasksByProject(props.projectId)
}
</script>

<template>
  <div class="kanban-board">
    <v-row>
      <v-col cols="12" lg="4" md="6" class="mx-auto">
        <v-btn v-if="canCreateTasks" @click="createTask(key)" block class="mt-2" color="blue">
          <v-icon>mdi-plus</v-icon> Add Task
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="4" md="3" v-for="(status, key) in columns" :key="key">
        <v-card class="kanban-column" min-height="500">
          <v-card-title class="text-center">
            {{ status.title }}
            <v-chip :color="status.color" size="small" class="ml-2">
              {{ tasksByStatus[key]?.length || 0 }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <draggable
              v-model="tasksByStatus[key]"
              group="tasks"
              @change="onTaskMove"
              item-key="id"
              class="drag-area"
              :disabled="!canDragTasks"
            >
              <template #item="{ element: task }">
                <TaskCard :task="task" @edit="editTask" @delete="deleteTask" class="mb-2" />
              </template>
            </draggable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <TaskDialog
      v-model:visible="showTaskDialog"
      :task="selectedTask"
      :project-id="projectId"
      @saved="onTaskSaved"
    />
  </div>
</template>

<style scoped>
.kanban-board {
  padding: 20px;
}

.kanban-column {
  margin: 0 8px;
}

.drag-area {
  min-height: 400px;
}
</style>
