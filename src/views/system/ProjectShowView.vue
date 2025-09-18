<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import ProjectShow from '@/components/system/projects/ProjectShow.vue'
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <v-col cols="12" sm="6" md="8">
          <ProjectShow />
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
