<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

//Load variables
const authStore = useAuthStore()

const isLoading = ref(false)

const errorSubmit = ref(null)

const router = useRouter()

const formDataDefault = {
  email: null,
  password: null,
}

const formData = ref({
  ...formDataDefault,
})

const handleSubmit = async () => {
  isLoading.value = true
  errorSubmit.value = null // Clear previous errors

  try {
    await authStore.loginUser(formData.value)
    formData.value = { ...formDataDefault }
    router.replace('/projects')
  } catch (error) {
    // Handle error from store or API
    errorSubmit.value = error.response?.data?.message || 'Invalid email or password.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-form fast-fail @submit.prevent="handleSubmit">
    <v-row dense>
      <v-col cols="12">
        <v-text-field
          v-model="formData.email"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
          :error-messages="errorSubmit"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="formData.password"
          label="Password"
          type="password"
          prepend-inner-icon="mdi-lock-outline"
          :error-messages="errorSubmit"
          required
        ></v-text-field>
      </v-col>
    </v-row>
    <v-btn class="mt-2" type="submit" color="blue" :loading="isLoading" block>Submit</v-btn>
  </v-form>
</template>
