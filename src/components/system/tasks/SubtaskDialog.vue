<script setup>
import { ref, computed, watch } from 'vue'
import { useSubTaskStore } from '@/stores/subtask'

const props = defineProps(['showForm', 'taskId', 'subtaskData'])
const emit = defineEmits(['update:showForm'])
const subtaskStore = useSubTaskStore()
const isUpdate = ref(false)
const isLoading = ref(false)

const modal = computed({
  get: () => props.showForm,
  set: (newVal) => emit('update:showForm', newVal),
})

const formDataDefault = {
  title: '',
  description: '',
  task_id: props.taskId,
  is_completed: false,
}

const formData = ref({ ...formDataDefault })

watch(
  () => props.subtaskData,
  () => {
    isUpdate.value = props.subtaskData ? true : false
    formData.value = isUpdate.value ? { ...props.subtaskData } : { ...formDataDefault }
  },
)

const handleSubmit = async () => {
  isLoading.value = true
  try {
    isUpdate.value
      ? await subtaskStore.updateSubTask(formData.value.id, formData.value)
      : await subtaskStore.createSubTask(formData.value)
    modal.value = false
  } catch (error) {
    console.error('Error adding subtask:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-dialog width="500px" v-model="modal" persistent>
    <v-card>
      <v-card-text>
        <v-form fast-fail @submit.prevent="handleSubmit">
          <v-text-field
            v-model="formData.title"
            label="Subtask Title"
            variant="outlined"
            density="compact"
          />
          <v-textarea
            v-model="formData.description"
            label="Description (optional)"
            variant="outlined"
            density="compact"
            rows="2"
          />
          <v-btn type="submit" color="primary" :loading="isLoading" block>Add</v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div class="d-flex gap-2 mt-2">
          <v-btn @click="modal = false" size="small">Cancel</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
