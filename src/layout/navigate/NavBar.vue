<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useAuthStore, useElderStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const elderStore = useElderStore()

const title = computed(() => (route.meta.title as string) ?? '')

function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '退出',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      authStore.logout()
      router.push('/login')
    })
    .catch(() => {})
}
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <span class="header-title">{{ title }}</span>
    </div>

    <div class="header-right">
      <div v-if="elderStore.elders.length > 1" class="elder-switch">
        <el-icon><User /></el-icon>
        <el-select
          :model-value="elderStore.currentElderId"
          size="small"
          style="width: 140px"
          @update:model-value="elderStore.setCurrentElder"
        >
          <el-option
            v-for="elder in elderStore.elders"
            :key="elder.id"
            :label="elder.name"
            :value="elder.id"
          />
        </el-select>
      </div>

      <el-dropdown trigger="click">
        <div class="user-info">
          <el-avatar :size="32" class="user-avatar">
            {{ authStore.displayName.charAt(0) }}
          </el-avatar>
          <span class="user-name">{{ authStore.displayName }}</span>
          <el-icon class="user-caret"><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>
              <el-icon><Phone /></el-icon>
              {{ authStore.user?.phone }}
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--border-color);
}

.header-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.elder-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-regular);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: var(--el-color-primary-light-9);
}

.user-avatar {
  background: var(--brand-primary);
  color: #fff;
  font-weight: 600;
}

.user-name {
  font-size: 14px;
  color: var(--text-primary);
}

.user-caret {
  color: var(--text-secondary);
  font-size: 12px;
}
</style>
