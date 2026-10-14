<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useElderStore, useHealthStore, useMedicationStore, useNotificationStore, useSosStore } from '@/store'
import { NOTIFICATION_TYPE_META, TODAY } from '@/types'
import { fromNow, formatDateTime } from '@/utils/format'
import { useRiskLevel } from '@/hooks/useRiskLevel'
import RiskTag from '@/components/common/RiskTag.vue'
import StatCard from '@/components/common/StatCard.vue'
import type { MedicationRecordVO } from '@/types'

const router = useRouter()
const elderStore = useElderStore()
const medicationStore = useMedicationStore()
const healthStore = useHealthStore()
const sosStore = useSosStore()
const notificationStore = useNotificationStore()

const elder = computed(() => elderStore.currentElder)

/** 今日用药计划（启用的计划 + 今日打卡状态） */
const todayPlans = computed(() => {
  if (!elder.value) return []
  const plans = medicationStore
    .medicationsOf(elder.value.id)
    .filter((m) => m.enabled)
  return plans.map((plan) => {
    const record = medicationStore.records.find(
      (r) => r.medicationId === plan.id && r.date === TODAY,
    )
    return { plan, record }
  })
})

const todayTaken = computed(() => todayPlans.value.filter((p) => p.record?.status === 'taken').length)
const todayTotal = computed(() => todayPlans.value.length)

/** 今日健康打卡 */
const todayHealth = computed(() => {
  if (!elder.value) return null
  return healthStore.recordsOf(elder.value.id).find((r) => r.date === TODAY) ?? null
})

/** 未处理求助 */
const pendingSos = computed(() => {
  if (!elder.value) return 0
  return sosStore.recordsOf(elder.value.id).filter((r) => r.status === 'pending').length
})

/** 未读通知 */
const unreadNotifications = computed(() => {
  if (!elder.value) return 0
  return notificationStore.unreadCount(elder.value.id)
})

/** 最新通知（前 5 条） */
const latestNotifications = computed(() => {
  if (!elder.value) return []
  return notificationStore.listOf(elder.value.id).slice(0, 5)
})

/** 近 7 天日期序列（含今天，倒序展示） */
const weekDays = computed(() => {
  const base = new Date(TODAY)
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(base)
    d.setDate(base.getDate() - i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    days.push(`${y}-${m}-${day}`)
  }
  return days
})

/** 近 7 天每日用药统计（已服用 / 漏服） */
const weekMedicationStats = computed(() => {
  if (!elder.value) return []
  const records = medicationStore.records.filter((r) => r.elderId === elder.value!.id)
  return weekDays.value.map((date) => {
    const dayRecords = records.filter((r) => r.date === date)
    return {
      date,
      label: date.slice(5).replace('-', '/'),
      taken: dayRecords.filter((r) => r.status === 'taken').length,
      missed: dayRecords.filter((r) => r.status === 'missed').length,
    }
  })
})

const weekMax = computed(() => {
  const counts = weekMedicationStats.value.flatMap((d) => [d.taken, d.missed])
  return Math.max(1, ...counts)
})

function barHeight(value: number): string {
  return `${Math.round((value / weekMax.value) * 100)}%`
}

/** 动态风险等级 */
const { riskLevel } = useRiskLevel()

function recordStatus(record: MedicationRecordVO | undefined): 'taken' | 'pending' | 'missed' {
  return record?.status ?? 'pending'
}

function statusMeta(status: 'taken' | 'pending' | 'missed') {
  const map = {
    taken: { label: '已服用', type: 'success' as const },
    pending: { label: '待服用', type: 'info' as const },
    missed: { label: '漏服', type: 'danger' as const },
  }
  return map[status]
}

function goMedication() {
  router.push('/medication')
}
function goNotification() {
  router.push('/notification')
}
</script>

<template>
  <div class="page-container dashboard">
    <!-- 老人概览 -->
    <div class="app-card elder-overview">
      <div class="elder-avatar">{{ elder?.name.charAt(0) }}</div>
      <div class="elder-info">
        <div class="elder-name-line">
          <span class="elder-name">{{ elder?.name }}</span>
          <span class="elder-badge">{{ elder?.age }}岁 · {{ elder?.gender === 'female' ? '女' : '男' }}</span>
          <RiskTag :level="riskLevel" />
        </div>
        <div class="elder-meta">
          <span>最后活跃：{{ elder ? fromNow(elder.lastActiveAt) : '-' }}</span>
          <span class="dot-sep">·</span>
          <span>住址：{{ elder?.address }}</span>
        </div>
      </div>
      <div class="elder-contact">
        <div class="contact-label">紧急联系人</div>
        <div class="contact-value">{{ elder?.emergencyContact }} · {{ elder?.emergencyPhone }}</div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <StatCard
          title="今日用药"
          :value="`${todayTaken}/${todayTotal}`"
          sub="已服用 / 计划总数"
          icon="FirstAidKit"
          color="#14939e"
        />
      </el-col>
      <el-col :span="6">
        <StatCard
          title="今日健康打卡"
          :value="todayHealth ? '已打卡' : '未打卡'"
          :sub="todayHealth ? `心情：${todayHealth.mood}` : '今日尚未打卡'"
          icon="Sunny"
          :color="todayHealth ? '#52a06e' : '#8a9890'"
        />
      </el-col>
      <el-col :span="6">
        <StatCard
          title="未处理求助"
          :value="pendingSos"
          sub="紧急事件"
          icon="BellFilled"
          :color="pendingSos > 0 ? '#d9534f' : '#8a9890'"
        />
      </el-col>
      <el-col :span="6">
        <StatCard
          title="未读通知"
          :value="unreadNotifications"
          sub="待查看消息"
          icon="Message"
          :color="unreadNotifications > 0 ? '#e09a3f' : '#8a9890'"
        />
      </el-col>
    </el-row>

    <!-- 下方两栏 -->
    <el-row :gutter="16">
      <el-col :span="14">
        <div class="app-card">
          <div class="app-card__title flex-between">
            <span>今日用药计划</span>
            <el-link type="primary" :underline="false" @click="goMedication">
              管理用药
            </el-link>
          </div>

          <div v-if="todayPlans.length" class="plan-list">
            <div v-for="item in todayPlans" :key="item.plan.id" class="plan-item">
              <div class="plan-time">{{ item.plan.time }}</div>
              <div class="plan-main">
                <div class="plan-name">{{ item.plan.name }}</div>
                <div class="plan-sub">{{ item.plan.dosage }} · {{ item.plan.frequency }}</div>
              </div>
              <el-tag :type="statusMeta(recordStatus(item.record)).type" effect="light" round>
                {{ statusMeta(recordStatus(item.record)).label }}
              </el-tag>
            </div>
          </div>
          <el-empty v-else description="今日暂无用药计划" :image-size="80" />
        </div>
      </el-col>

      <el-col :span="10">
        <div class="app-card">
          <div class="app-card__title flex-between">
            <span>最新动态</span>
            <el-link type="primary" :underline="false" @click="goNotification">
              全部通知
            </el-link>
          </div>

          <div v-if="latestNotifications.length" class="notice-list">
            <div
              v-for="notice in latestNotifications"
              :key="notice.id"
              class="notice-item"
              :class="{ 'is-sos': notice.type === 'sos', 'is-unread': !notice.read }"
            >
              <div
                class="notice-icon"
                :style="{ backgroundColor: `${NOTIFICATION_TYPE_META[notice.type].color}1a`, color: NOTIFICATION_TYPE_META[notice.type].color }"
              >
                <el-icon><component :is="NOTIFICATION_TYPE_META[notice.type].icon" /></el-icon>
              </div>
              <div class="notice-main">
                <div class="notice-title">
                  {{ notice.title }}
                  <span v-if="!notice.read" class="unread-dot"></span>
                </div>
                <div class="notice-time">{{ formatDateTime(notice.createdAt) }}</div>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无通知" :image-size="80" />
        </div>
      </el-col>
    </el-row>

    <!-- 近 7 天用药统计 -->
    <el-row :gutter="16" class="mt-16">
      <el-col :span="24">
        <div class="app-card">
          <div class="app-card__title">近 7 天用药统计</div>
          <div class="week-chart">
            <div v-for="day in weekMedicationStats" :key="day.date" class="week-col">
              <div class="week-bars">
                <div
                  class="bar bar-taken"
                  :style="{ height: barHeight(day.taken) }"
                  :title="`已服用 ${day.taken}`"
                ></div>
                <div
                  class="bar bar-missed"
                  :style="{ height: barHeight(day.missed) }"
                  :title="`漏服 ${day.missed}`"
                ></div>
              </div>
              <div class="week-label">{{ day.label }}</div>
            </div>
          </div>
          <div class="week-legend">
            <span class="legend-item"><i class="legend-dot taken"></i>已服用</span>
            <span class="legend-item"><i class="legend-dot missed"></i>漏服</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.elder-overview {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}

.elder-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #14939e, #55b8c2);
  color: #fff;
  font-size: 26px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.elder-info {
  flex: 1;
  min-width: 0;
}

.elder-name-line {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.elder-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.elder-badge {
  font-size: 13px;
  color: var(--text-secondary);
}

.elder-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-regular);
}

.dot-sep {
  color: var(--text-secondary);
}

.elder-contact {
  text-align: right;
  flex-shrink: 0;
}

.contact-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.contact-value {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.stat-row {
  margin-bottom: 16px;
}

.plan-list {
  display: flex;
  flex-direction: column;
}

.plan-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 4px;
  border-bottom: 1px solid var(--border-color);
}

.plan-item:last-child {
  border-bottom: none;
}

.plan-time {
  width: 56px;
  font-size: 16px;
  font-weight: 600;
  color: var(--brand-primary);
}

.plan-main {
  flex: 1;
}

.plan-name {
  font-size: 15px;
  color: var(--text-primary);
  font-weight: 500;
}

.plan-sub {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.notice-list {
  display: flex;
  flex-direction: column;
}

.notice-item {
  display: flex;
  gap: 12px;
  padding: 12px 4px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  border-radius: 6px;
}

.notice-item:last-child {
  border-bottom: none;
}

.notice-item.is-sos {
  background: var(--risk-alert-bg);
  border-radius: 6px;
  padding-left: 8px;
  padding-right: 8px;
}

.notice-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notice-main {
  flex: 1;
  min-width: 0;
}

.notice-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.notice-time {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.unread-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d9534f;
  display: inline-block;
}

.week-chart {
  display: flex;
  align-items: flex-end;
  gap: 24px;
  padding: 8px 4px 0;
}

.week-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.week-bars {
  width: 100%;
  height: 140px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 6px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 4px;
}

.bar {
  width: 22px;
  min-height: 2px;
  border-radius: 4px 4px 0 0;
  transition: height 0.4s ease;
}

.bar-taken {
  background: var(--brand-primary);
}

.bar-missed {
  background: #d9534f;
}

.week-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.week-legend {
  display: flex;
  gap: 20px;
  margin-top: 14px;
  justify-content: flex-end;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-regular);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  display: inline-block;
}

.legend-dot.taken {
  background: var(--brand-primary);
}

.legend-dot.missed {
  background: #d9534f;
}
</style>
