<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = computed(() => route.path)

const menus = [
  { path: '/dashboard', label: '首页看板', icon: 'Odometer' },
  { path: '/medication', label: '用药管理', icon: 'FirstAidKit' },
  { path: '/notification', label: '通知中心', icon: 'Bell' },
  { path: '/elder', label: '老人档案', icon: 'User' },
]
</script>

<template>
  <aside class="app-sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">
        <svg viewBox="0 0 64 64" width="30" height="30">
          <circle cx="32" cy="24" r="11" fill="#f5f3ef" />
          <path d="M11 55c0-12 9.5-19.5 21-19.5S53 43 53 55" fill="#f5f3ef" />
          <circle cx="32" cy="45" r="8" fill="#e07a3f" />
        </svg>
      </div>
      <div class="logo-text">
        <span class="logo-title">银龄守护</span>
        <span class="logo-sub">家属端 · 智慧养老</span>
      </div>
    </div>

    <el-menu
      :default-active="activeMenu"
      router
      class="sidebar-menu"
      background-color="transparent"
      text-color="#c4d6cc"
      active-text-color="#ffffff"
    >
      <el-menu-item v-for="menu in menus" :key="menu.path" :index="menu.path">
        <el-icon><component :is="menu.icon" /></el-icon>
        <span>{{ menu.label }}</span>
      </el-menu-item>
    </el-menu>

    <div class="sidebar-footer">
      <span>轻量级智能守护系统</span>
    </div>
  </aside>
</template>

<style scoped>
.app-sidebar {
  width: 220px;
  height: 100%;
  background: linear-gradient(180deg, #274f3d 0%, #1f4232 100%);
  display: flex;
  flex-direction: column;
  color: #fff;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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

.sidebar-footer {
  padding: 16px 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
