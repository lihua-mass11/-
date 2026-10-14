<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{ collapse: boolean }>()

const route = useRoute()
const activeMenu = computed(() => route.path)

const menus = [
  { path: '/dashboard', label: '首页看板', icon: 'Odometer' },
  { path: '/medication', label: '用药管理', icon: 'FirstAidKit' },
  { path: '/notification', label: '通知中心', icon: 'Bell' },
  { path: '/archive', label: '老人存档', icon: 'User' },
  { path: '/assist', label: '远程协助', icon: 'Monitor' },
]
</script>

<template>
  <aside class="app-sidebar" :class="{ 'is-collapsed': collapse }">
    <div class="sidebar-logo">
      <div class="logo-icon">
        <svg viewBox="0 0 64 64" width="30" height="30">
          <path
            d="M32 55C16 43 9 30 9 20 9 12.5 14.5 7 22 7c5.5 0 9 2.5 10 6 1-3.5 4.5-6 10-6 7.5 0 13 5.5 13 13 0 10-7 23-23 35z"
            fill="#f5f8f8"
          />
          <path
            d="M32 55C16 43 9 30 9 20 9 12.5 14.5 7 22 7c5.5 0 9 2.5 10 6 1-3.5 4.5-6 10-6 7.5 0 13 5.5 13 13 0 10-7 23-23 35z"
            fill="none"
            stroke="#e07a3f"
            stroke-width="3"
          />
        </svg>
      </div>
      <div v-show="!collapse" class="logo-text">
        <span class="logo-title">银龄守护</span>
        <span class="logo-sub">家属端 · 智慧养老</span>
      </div>
    </div>

    <el-menu
      :default-active="activeMenu"
      :collapse="collapse"
      :collapse-transition="false"
      router
      class="sidebar-menu"
      background-color="transparent"
      text-color="#b8dadd"
      active-text-color="#ffffff"
    >
      <el-menu-item v-for="menu in menus" :key="menu.path" :index="menu.path">
        <el-icon><component :is="menu.icon" /></el-icon>
        <template #title><span>{{ menu.label }}</span></template>
      </el-menu-item>
    </el-menu>

    <div v-show="!collapse" class="sidebar-footer">
      <span>轻量级智能守护系统</span>
    </div>
  </aside>
</template>

<style scoped>
.app-sidebar {
  width: 220px;
  height: 100%;
  flex-shrink: 0;
  background: linear-gradient(180deg, #0e6b72 0%, #0a5056 100%);
  display: flex;
  flex-direction: column;
  color: #fff;
  transition: width 0.2s ease;
  overflow: hidden;
}

.app-sidebar.is-collapsed {
  width: 64px;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 84px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;
  overflow: hidden;
}

.app-sidebar.is-collapsed .sidebar-logo {
  justify-content: center;
  padding: 0;
}

.logo-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.logo-title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 1px;
}

.logo-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  padding: 12px 10px;
  overflow-x: hidden;
}

.app-sidebar.is-collapsed .sidebar-menu {
  padding: 12px 0;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 48px;
  margin-bottom: 6px;
  border-radius: 8px;
  font-size: 14px;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.08);
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background-color: rgba(255, 255, 255, 0.14);
  font-weight: 600;
}

/* 折叠时：菜单项铺满、图标真正居中 */
.app-sidebar.is-collapsed .sidebar-menu :deep(.el-menu-item) {
  justify-content: center;
  padding: 0;
}

.app-sidebar.is-collapsed .sidebar-menu :deep(.el-menu-item .el-icon) {
  margin: 0;
}

.sidebar-footer {
  padding: 16px 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;
  overflow: hidden;
}
</style>
