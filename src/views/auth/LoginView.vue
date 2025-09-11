<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row class="mt-16">
        <v-col cols="auto" md="4" class="mx-auto">
          <v-card>
            <v-card-title>
              <h3 class="text-center">Log In</h3>
            </v-card-title>
            <v-card-text>
              <LoginForm />
            </v-card-text>
            <v-card-actions></v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
