<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

//Load Variables
const authStore = useAuthStore()
const router = useRouter()

const isLoading = ref(false)
const errorSubmit = ref(null)

const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)

const formDataDefault = {
  first_name: null,
  last_name: null,
  email: null,
  password: null,
  password_confirmation: null,
  role: 'user',
}

const formData = ref({
  ...formDataDefault,
})

const handleSubmit = async () => {
  isLoading.value = true
  try {
    const response = await authStore.registerUser(formData.value)

    if (response) {
      formData.value = { ...formDataDefault }
      router.replace('/projects')
    }
  } catch (error) {
    errorSubmit.value = error.response?.data?.message
    console.log(errorSubmit)
  }
}
</script>

<template>
  <v-form fast-fail @submit.prevent="handleSubmit">
    <v-row dense>
      <v-col cols="12" sm="6">
        <v-text-field v-model="formData.first_name" label="First Name" type="text"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="formData.last_name" label="Last Name" type="text"></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="formData.email"
          label="Email"
          type="email"
          prepend-inner-icon="mdi-email-outline"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="formData.password"
          label="Password"
          :type="isPasswordVisible ? 'text' : 'password'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
          prepend-inner-icon="mdi-lock-outline"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="formData.password_confirmation"
          label="Confirm Password"
          :type="isPasswordConfirmVisible ? 'text' : 'password'"
          @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
          :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye' : 'mdi-eye-off'"
          prepend-inner-icon="mdi-lock-outline"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-btn class="mt-2" type="submit" color="blue" :loading="isLoading" block>Sign In</v-btn>
  </v-form>
</template>
