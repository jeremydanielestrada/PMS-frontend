<script setup>
import { ref } from 'vue'

const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)

const password = ref('')
</script>

<template>
  <v-form fast-fail @submit.prevent>
    <v-row dense>
      <v-col cols="12" sm="6">
        <v-text-field v-model="first_name" label="First Name" type="text"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="last_name" label="Last Name" type="text"></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          prepend-inner-icon="mdi-email-outline"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="password"
          label="Password"
          :type="isPasswordVisible ? 'text' : 'password'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
          prepend-inner-icon="mdi-lock-outline"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="password_confirmation"
          label="Confirm Password"
          :type="isPasswordConfirmVisible ? 'text' : 'password'"
          @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
          :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye' : 'mdi-eye-off'"
          prepend-inner-icon="mdi-lock-outline"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-btn class="mt-2" type="submit" color="blue" block>Sign In</v-btn>
  </v-form>
</template>
