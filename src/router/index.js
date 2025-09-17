import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import ProjectsView from '@/views/system/admin/ProjectsView.vue'
import DashboardView from '@/views/system/admin/DashboardView.vue'
import ManageUsersView from '@/views/system/admin/ManageUsersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },

    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView,
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },

    {
      path: '/manage-users',
      name: 'manage-users',
      component: ManageUsersView,
    },
  ],
})

export default router
