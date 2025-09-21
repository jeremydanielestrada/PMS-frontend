<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import KanbanBoard from '@/components/system/tasks/KanbanBoard.vue'
</script>

<template>
  <AppLayout>
    <template #content>
      <KanbanBoard :projectId="$route.params.id" />
    </template>
  </AppLayout>
</template>
