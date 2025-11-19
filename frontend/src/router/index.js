import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/jobs',
      alias: '/buscar-empleos',
      name: 'jobs-search',
      component: () => import('@/views/JobsSearchView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/jobs/:id',
      name: 'job-detail',
      component: () => import('@/views/JobDetailView.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/companies',
      name: 'companies',
      component: () => import('@/views/CompaniesView.vue')
    },
    {
      path: '/resources',
      name: 'resources',
      component: () => import('@/views/ResourcesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/forum',
      name: 'forum',
      component: () => import('@/views/ForumView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/employer',
      redirect: '/dashboard'
    },
    {
      path: '/employer/jobs',
      name: 'employer-jobs',
      component: () => import('@/views/employer/ManageJobs.vue'),
      meta: { requiresAuth: true, requiresRole: 'employer' }
    },
    {
      path: '/employer/applicants',
      name: 'employer-applicants',
      component: () => import('@/views/employer/Applicants.vue'),
      meta: { requiresAuth: true, requiresRole: 'employer' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresGuest: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.fetchCurrentUser()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next({ path: '/dashboard' })
  }

  if (to.meta.requiresRole) {
    const normalizedRole = authStore.user?.role || ''
    if (normalizedRole !== to.meta.requiresRole) {
      return next({ path: '/dashboard' })
    }
  }

  return next()
})

export default router
