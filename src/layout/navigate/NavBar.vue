<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/store'

defineProps<{ collapse: boolean }>()
const emit = defineEmits<{ (e: 'toggle-collapse'): void }>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

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

// 模型设置弹窗
const modelSettingVisible = ref(false)
const modelSetting = reactive({
  sensitivity: 'standard',
  remindMissed: true,
  inactiveHours: 12,
})

function saveModelSetting() {
  modelSettingVisible.value = false
  ElMessage.success('模型设置已保存')
}
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <el-icon class="collapse-btn" @click="emit('toggle-collapse')">
        <Expand v-if="collapse" />
        <Fold v-else />
      </el-icon>
      <span class="header-title">{{ title }}</span>
    </div>

    <div class="header-right">
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
            <el-dropdown-item @click="modelSettingVisible = true">
              <el-icon><Setting /></el-icon>
              模型设置
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

  <!-- 模型设置弹窗 -->
  <el-dialog v-model="modelSettingVisible" title="模型设置" width="440px">
    <el-form label-width="130px">
      <el-form-item label="风险模型灵敏度">
        <el-radio-group v-model="modelSetting.sensitivity">
          <el-radio-button value="conservative">保守</el-radio-button>
          <el-radio-button value="standard">标准</el-radio-button>
          <el-radio-button value="sensitive">灵敏</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="漏服提醒">
        <el-switch v-model="modelSetting.remindMissed" />
      </el-form-item>
      <el-form-item label="未活跃预警阈值">
        <el-input-number v-model="modelSetting.inactiveHours" :min="1" :max="72" />
        <span class="form-unit">小时</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="modelSettingVisible = false">取消</el-button>
      <el-button type="primary" @click="saveModelSetting">保存</el-button>
    </template>
  </el-dialog>
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

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.collapse-btn {
  font-size: 18px;
  cursor: pointer;
  color: var(--text-regular);
}

.collapse-btn:hover {
  color: var(--brand-primary);
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

.form-unit {
  margin-left: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
