<script setup>
import RegisterForm from '@/components/auth/RegisterForm.vue'
import AppLayout from '@/components/layout/AppLayout.vue'

import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row class="mt-16">
        <v-col cols="12" sm="4" class="mx-auto">
          <v-card :width="!mobile ? 500 : undefined">
            <v-card-title>
              <h3 class="text-center">Sign Up</h3>
            </v-card-title>
            <v-card-text>
              <RegisterForm />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn to="/">Sign In</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
