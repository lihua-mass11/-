import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { title: '登录', public: true },
  },
  {
    path: '/',
    component: () => import('@/layout/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: '首页看板' },
      },
      {
        path: 'medication',
        name: 'medication',
        component: () => import('@/views/medication/MedicationView.vue'),
        meta: { title: '用药管理' },
      },
      {
        path: 'notification',
        name: 'notification',
        component: () => import('@/views/notification/NotificationView.vue'),
        meta: { title: '通知中心' },
      },
      {
        path: 'elder',
        name: 'elder',
        component: () => import('@/views/elder/ElderProfileView.vue'),
        meta: { title: '老人档案' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]
