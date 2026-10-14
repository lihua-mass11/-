<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  icon: string
  color?: string
  sub?: string
}>()
</script>

<template>
  <div class="stat-card app-card">
    <div class="stat-icon" :style="{ backgroundColor: `${color}1a`, color }">
      <el-icon :size="22"><component :is="icon" /></el-icon>
    </div>
    <div class="stat-info">
      <div class="stat-value">{{ value }}</div>
      <div class="stat-title">{{ title }}</div>
      <div v-if="sub" class="stat-sub">{{ sub }}</div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-title {
  font-size: 13px;
  color: var(--text-secondary);
}

.stat-sub {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
