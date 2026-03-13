import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout/Layout.vue'
import { hasAccessToken } from '@/utils/auth'

function resolveRedirectTarget(rawValue: unknown): string {
  if (typeof rawValue !== 'string') {
    return '/'
  }

  const value = rawValue.trim()
  if (!value) {
    return '/'
  }

  if (value.startsWith('/') && !value.startsWith('//')) {
    return value
  }

  try {
    const decoded = decodeURIComponent(value)
    if (decoded.startsWith('/') && !decoded.startsWith('//')) {
      return decoded
    }
  } catch {
    // ignore invalid url-encoded value
  }

  return '/'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Auth/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/Dashboard/DashboardView.vue'),
        },
        {
          path: 'clinical-cases',
          name: 'ClinicalCases',
          component: () => import('@/views/ClinicalCases/ClinicalCasesView.vue'),
        },
        {
          path: 'performance',
          name: 'Performance',
          component: () => import('@/views/Performance/PerformanceView.vue'),
        },
        {
          path: 'library',
          name: 'Library',
          component: () => import('@/views/Library/LibraryView.vue'),
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('@/views/Settings/SettingsView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const isAuthenticated = hasAccessToken()

  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      name: 'Login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return resolveRedirectTarget(to.query.redirect)
  }

  return true
})

export default router
