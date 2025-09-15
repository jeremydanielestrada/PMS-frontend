<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

//Load props and emitters
const props = defineProps(['isDialogVisible', 'projectData'])
const emit = defineEmits(['update:isDialogVisible'])

//Initialize Stores
const authStore = useAuthStore()

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
</script>

<template>
  <v-dialog v-model="dialog" width="500" persistent>
    <v-card>
      <v-card-text>
        <v-form>
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
          <v-btn type="submit" block>submit</v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
