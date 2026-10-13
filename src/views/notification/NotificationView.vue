<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useElderStore, useNotificationStore, useSosStore } from '@/stores'
import { NOTIFICATION_TYPE_META } from '@/constants'
import { formatDateTime } from '@/utils/format'
import type { Notification, NotificationType } from '@/types'

const elderStore = useElderStore()
const notificationStore = useNotificationStore()
const sosStore = useSosStore()

const activeTab = ref<'all' | NotificationType>('all')

const elder = computed(() => elderStore.currentElder)

const allList = computed(() => {
  if (!elder.value) return []
  return notificationStore.listOf(elder.value.id)
})

const filteredList = computed(() => {
  if (activeTab.value === 'all') return allList.value
  return allList.value.filter((n) => n.type === activeTab.value)
})

function typeCount(type: 'all' | NotificationType): number {
  if (type === 'all') return allList.value.length
  return allList.value.filter((n) => n.type === type).length
}

function handleRead(notice: Notification) {
  notificationStore.markRead(notice.id)
}

function handleNotice(notice: Notification) {
  // 处理 SOS 通知时联动处理求助记录
  if (notice.type === 'sos') {
    const pending = sosStore.sosRecords.filter(
      (r) => r.elderId === notice.elderId && r.status === 'pending',
    )
    pending.forEach((r) => sosStore.handleSos(r.id))
  }
  notificationStore.markHandled(notice.id)
  ElMessage.success('已标记处理')
}

function handleMarkAllRead() {
  if (!elder.value) return
  notificationStore.markAllRead(elder.value.id)
  ElMessage.success('已全部标记为已读')
}
</script>

<template>
  <div class="page-container">
    <div class="app-card">
      <div class="flex-between mb-16">
        <div class="app-card__title" style="margin-bottom: 0">通知中心</div>
        <el-button :disabled="!allList.length" @click="handleMarkAllRead">
          <el-icon><Check /></el-icon>
          全部已读
        </el-button>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane :label="`全部 (${typeCount('all')})`" name="all" />
        <el-tab-pane :label="`紧急求助 (${typeCount('sos')})`" name="sos" />
        <el-tab-pane :label="`未按时服药 (${typeCount('medication')})`" name="medication" />
        <el-tab-pane :label="`长时间未活跃 (${typeCount('inactive')})`" name="inactive" />
      </el-tabs>

      <div v-if="filteredList.length" class="notice-list">
        <div
          v-for="notice in filteredList"
          :key="notice.id"
          class="notice-card"
          :class="{ 'is-sos': notice.type === 'sos', 'is-unread': !notice.read }"
          @click="handleRead(notice)"
        >
          <div
            class="notice-icon"
            :style="{
              backgroundColor: `${NOTIFICATION_TYPE_META[notice.type].color}1a`,
              color: NOTIFICATION_TYPE_META[notice.type].color,
            }"
          >
            <el-icon :size="20"><component :is="NOTIFICATION_TYPE_META[notice.type].icon" /></el-icon>
          </div>

          <div class="notice-body">
            <div class="notice-head">
              <span class="notice-title">
                {{ notice.title }}
                <span v-if="!notice.read" class="unread-dot"></span>
              </span>
              <el-tag
                :type="notice.handled ? 'success' : 'warning'"
                effect="light"
                round
                size="small"
              >
                {{ notice.handled ? '已处理' : '待处理' }}
              </el-tag>
            </div>
            <div class="notice-content">{{ notice.content }}</div>
            <div class="notice-meta">
              <span class="type-label" :style="{ color: NOTIFICATION_TYPE_META[notice.type].color }">
                {{ NOTIFICATION_TYPE_META[notice.type].label }}
              </span>
              <span>{{ formatDateTime(notice.createdAt) }}</span>
            </div>
          </div>

          <div class="notice-action">
            <el-button
              v-if="!notice.handled"
              type="primary"
              size="small"
              plain
              @click.stop="handleNotice(notice)"
            >
              标记处理
            </el-button>
          </div>
        </div>
      </div>

      <el-empty v-else description="暂无相关通知" :image-size="100" />
    </div>
  </div>
</template>

<style scoped>
.notice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-card {
  display: flex;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  transition: box-shadow 0.2s, background-color 0.2s;
  cursor: pointer;
  background: #fff;
}

.notice-card:hover {
  box-shadow: 0 4px 14px rgba(45, 60, 53, 0.08);
}

.notice-card.is-sos {
  border-left: 4px solid #d9534f;
  background: var(--risk-alert-bg);
}

.notice-card.is-unread .notice-title {
  font-weight: 600;
}

.notice-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notice-body {
  flex: 1;
  min-width: 0;
}

.notice-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}

.notice-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: var(--text-primary);
}

.unread-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d9534f;
  display: inline-block;
}

.notice-content {
  font-size: 13px;
  color: var(--text-regular);
  margin-bottom: 8px;
}

.notice-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--text-secondary);
}

.type-label {
  font-weight: 500;
}

.notice-action {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
</style>
