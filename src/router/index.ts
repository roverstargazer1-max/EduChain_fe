import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout/Layout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
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

export default router
