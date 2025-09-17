<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/project'

//Load props and emitters
const props = defineProps(['isDialogVisible', 'projectData'])
const emit = defineEmits(['update:isDialogVisible'])

//Initialize Stores
const authStore = useAuthStore()
const projectStore = useProjectStore()

//get all users
onMounted(async () => {
  await authStore.getAllUsers()
})

const dialog = computed({
  get: () => props.isDialogVisible,
  set: (status) => emit('update:isDialogVisible', status),
})

// Computed property for user options
const userOptions = computed(() =>
  authStore.allUsers.map((user) => ({
    title: user.first_name + ' ' + user.last_name,
    value: user.id,
  })),
)

const isUpdate = ref(false)
const isLoading = ref(false)

const formDataDefault = {
  name: null,
  description: null,
  owner_id: null,
  due_date: null,
}

const formData = ref({
  ...formDataDefault,
})

watch(
  () => props.projectData,
  () => {
    isUpdate.value = props.projectData ? true : false
    formData.value = props.projectData ? { ...props.projectData } : { ...formDataDefault }
  },
)

const resetForm = () => {
  formData.value = { ...formDataDefault }
}

const handleSubmit = async () => {
  isLoading.value = true
  try {
    if (formData.value.due_date) {
      formData.value.due_date = new Date(formData.value.due_date).toISOString().split('T')[0]
    }

    isUpdate.value
      ? await projectStore.updateProject(formData.value.id, formData.value)
      : await projectStore.addProjects(formData.value)

    resetForm()
    dialog.value = false //for closing the dialog
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-dialog v-model="dialog" width="500" persistent>
    <v-card>
      <v-card-text>
        <v-form fast-fail @submit.prevent="handleSubmit">
          <v-text-field label="Project Name" v-model="formData.name" type="text"></v-text-field>
          <v-select
            v-model="formData.owner_id"
            label="Select Owner"
            :items="userOptions"
          ></v-select>
          <v-textarea label="Description" v-model="formData.description"></v-textarea>
          <v-date-input
            label="Select Date"
            variant="underlined"
            v-model="formData.due_date"
          ></v-date-input>
          <v-btn type="submit" :loading="isLoading" block>{{
            isUpdate ? 'Update' : 'Submit'
          }}</v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
