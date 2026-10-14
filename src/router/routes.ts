import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/LoginView.vue'),
    meta: { title: '登录', public: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/register/RegisterView.vue'),
    meta: { title: '注册', public: true },
  },
  {
    path: '/',
    component: () => import('@/layout/Layout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/dashboard/DashboardView.vue'),
        meta: { title: '首页看板' },
      },
      {
        path: 'medication',
        name: 'medication',
        component: () => import('@/pages/medication/MedicationView.vue'),
        meta: { title: '用药管理' },
      },
      {
        path: 'notification',
        name: 'notification',
        component: () => import('@/pages/notification/NotificationView.vue'),
        meta: { title: '通知中心' },
      },
      {
        path: 'archive',
        name: 'archive',
        component: () => import('@/pages/archive/ArchiveView.vue'),
        meta: { title: '老人存档' },
      },
      {
        path: 'assist',
        name: 'assist',
        component: () => import('@/pages/assist/AssistView.vue'),
        meta: { title: '远程协助' },
      },
    ],
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('@/pages/error/ErrorView.vue'),
    meta: { title: '异常' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/error?code=404',
  },
]
