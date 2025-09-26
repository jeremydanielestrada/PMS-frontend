<script setup>
import { computed, onMounted } from 'vue'
import { useRealtimeStore } from '@/stores/realtime'

const realtimeStore = useRealtimeStore()

const unreadCount = computed(
  () => (realtimeStore.notifications || []).filter((n) => !n.is_read).length,
)

onMounted(async () => {
  await realtimeStore.fetchNotifications()
  console.log('Final notifications:', realtimeStore.notifications)
})
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" class="position-relative">
        <v-icon>mdi-bell-outline</v-icon>
        <v-badge v-if="unreadCount > 0" :content="unreadCount" color="red" />
      </v-btn>
    </template>
    <v-list max-width="300" class="ma-3">
      <v-list-item
        v-for="notification in (realtimeStore.notifications || []).slice(0, 5)"
        :key="notification.id"
        @click="realtimeStore.markAsRead(notification.id)"
        :class="{ 'bg-grey-lighten-4': !notification.is_read }"
      >
        <v-list-item-title class="text-wrap">
          {{ notification.type }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ new Date(notification.created_at).toLocaleString() }}
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item v-if="!realtimeStore.notifications || realtimeStore.notifications.length === 0">
        <v-list-item-title class="text-center text-grey"> No notifications </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
