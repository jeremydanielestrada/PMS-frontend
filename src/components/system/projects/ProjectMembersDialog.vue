<script setup>
import { useProjectStore } from '@/stores/project'
import { useAuthStore } from '@/stores/auth'
import { ref, computed, onMounted } from 'vue'

//Load variables
const projectStore = useProjectStore()
const authStore = useAuthStore()
const isLoading = ref(false)

const props = defineProps(['isDialogVisible', 'projectId'])
const emit = defineEmits(['update:isDialogVisible'])

//get all users
onMounted(async () => {
  await authStore.getAllUsers()
})

const modal = computed({
  get: () => props.isDialogVisible,
  set: (newVal) => emit('update:isDialogVisible', newVal),
})

const memberOptions = computed(() =>
  authStore.allUsers.map((user) => {
    return {
      title: user.first_name + '' + user.last_name,
      value: user.id,
    }
  }),
)

const formDataDefault = {
  project_id: null,
  user_id: null,
  role: 'member',
}

const formData = ref({
  ...formDataDefault,
})

const addMember = async () => {
  isLoading.value = true
  try {
    formData.value.project_id = props.projectId
    await projectStore.addProjectMembers(formData.value)
    formData.value = { ...formDataDefault }
    modal.value = false // Close dialog on success
  } catch (error) {
    console.error('Error adding member:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-dialog v-model="modal" persistent width="500">
    <v-card>
      <v-card-text>
        <v-form fast-fail @submit.prevent="addMember">
          <v-select v-model="formData.user_id" label="Select Member" :items="memberOptions" />
          <v-select
            v-model="formData.role"
            label="Role"
            :items="[
              { title: 'Member', value: 'member' },
              { title: 'Leader', value: 'leader' },
            ]"
          />
          <v-btn block type="submit" :loading="isLoading">Add Member</v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="modal = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
