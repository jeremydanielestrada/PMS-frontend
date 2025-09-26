<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import PaginationLinks from '@/components/common/PaginationLinks.vue'

//Load variables
const authStore = useAuthStore()

// Add computed properties for better data handling
const users = computed(() => {
  return (
    authStore.allUsers?.map((user) => ({
      ...user,
      projectCount: user.projects?.length || 0,
      taskCount: user.tasks?.length || 0,
    })) || []
  ) // fallback empty array
})

onMounted(async () => {
  await authStore.getAllUsers()
})

const changePage = async (page) => {
  authStore.currentPage = page
  await authStore.getAllUsers()
}

const onSearch = () => {
  authStore.currentPage = 1
  authStore.getAllUsers()
}
</script>

<template>
  <v-row>
    <v-col cols="12" md="4">
      <v-text-field
        v-model="authStore.search"
        type="text"
        density="compact"
        label="Search User"
        prepend-inner-icon="mdi-magnify"
        @input="onSearch"
        clearable
      ></v-text-field>
    </v-col>
  </v-row>
  <v-divider></v-divider>
  <v-row>
    <v-col cols="12">
      <v-table>
        <thead>
          <tr class="bg-blue-darken-2">
            <th class="text-left">Name</th>
            <th class="text-left">Email</th>
            <th class="text-left">Project</th>
            <th class="text-left">Project Role</th>
            <th class="text-left">Tasks</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr cols="12" v-for="user in users" :key="user.id">
            <!-- User Name -->
            <td>{{ user.first_name + ' ' + user.last_name }}</td>

            <!-- Email -->
            <td>{{ user.email }}</td>

            <!-- Projects -->
            <td>
              {{ user.projects?.map((p) => p.name).join(', ') || 'None' }}
            </td>

            <!-- Project Roles -->
            <td>
              {{ user.project_members?.map((m) => m.role).join(', ') || 'None' }}
            </td>

            <!-- Tasks -->
            <td>{{ user.taskCount }}</td>

            <td>
              <!-- <v-btn icon size="30" class="mx-2" @click="deleteDialog(project.id)">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
              <v-btn icon size="30" @click="handleUpdate(project)">
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn> -->
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
  <PaginationLinks
    :totalPage="authStore.totalPages"
    @update:modelValue="changePage"
    v-if="users?.length > 0"
  />
</template>
