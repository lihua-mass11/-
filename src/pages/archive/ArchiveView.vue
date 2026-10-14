<script setup lang="ts">
import { computed } from 'vue'
import { useElderStore, useHealthStore, useSosStore } from '@/stores'
import { useRiskLevel } from '@/composables/useRiskLevel'
import { RISK_LEVEL_META } from '@/constants'
import { formatDateTime, fromNow } from '@/utils/format'
import RiskTag from '@/components/RiskTag.vue'

const elderStore = useElderStore()
const healthStore = useHealthStore()
const sosStore = useSosStore()

const elder = computed(() => elderStore.currentElder)
const { riskLevel } = useRiskLevel()

const healthList = computed(() => {
  if (!elder.value) return []
  return healthStore.recordsOf(elder.value.id)
})

const sosList = computed(() => {
  if (!elder.value) return []
  return sosStore.recordsOf(elder.value.id)
})

const riskMeta = computed(() => RISK_LEVEL_META[riskLevel.value])
</script>

<template>
  <div class="page-container">
    <!-- 基本信息 -->
    <div class="app-card">
      <div class="profile-head">
        <div class="profile-avatar">{{ elder?.name.charAt(0) }}</div>
        <div class="profile-title">
          <div class="profile-name">{{ elder?.name }}</div>
          <div class="profile-sub">
            {{ elder?.age }}岁 · {{ elder?.gender === 'female' ? '女' : '男' }} · 独居老人
          </div>
        </div>
        <div class="profile-risk">
          <div class="risk-label">当前风险等级</div>
          <RiskTag :level="riskLevel" />
        </div>
      </div>

      <el-descriptions :column="3" border class="profile-desc">
        <el-descriptions-item label="姓名">{{ elder?.name }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ elder?.age }} 岁</el-descriptions-item>
        <el-descriptions-item label="性别">
          {{ elder?.gender === 'female' ? '女' : '男' }}
        </el-descriptions-item>
        <el-descriptions-item label="住址" :span="2">{{ elder?.address }}</el-descriptions-item>
        <el-descriptions-item label="最后活跃">
          {{ elder ? fromNow(elder.lastActiveAt) : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="紧急联系人">{{ elder?.emergencyContact }}</el-descriptions-item>
        <el-descriptions-item label="紧急联系电话" :span="2">
          {{ elder?.emergencyPhone }}
        </el-descriptions-item>
        <el-descriptions-item label="风险等级">
          <span :style="{ color: riskMeta.color, fontWeight: 600 }">{{ riskMeta.label }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 打卡 + 求助 -->
    <el-row :gutter="16" class="mt-16">
      <el-col :span="12">
        <div class="app-card">
          <div class="app-card__title">健康打卡记录</div>
          <el-table :data="healthList" size="default">
            <el-table-column prop="date" label="日期" width="110" />
            <el-table-column prop="mood" label="身体感受" width="100">
              <template #default="{ row }">
                <el-tag effect="plain" round size="small">{{ row.mood }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip>
              <template #default="{ row }">
                <span class="text-secondary">{{ row.remark || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="打卡时间" width="110">
              <template #default="{ row }">{{ formatDateTime(row.createdAt).slice(11) }}</template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="app-card">
          <div class="app-card__title">求助记录</div>
          <el-table :data="sosList" size="default">
            <el-table-column label="触发时间" width="150">
              <template #default="{ row }">{{ formatDateTime(row.triggeredAt) }}</template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'handled' ? 'success' : 'danger'" effect="light" round size="small">
                  {{ row.status === 'handled' ? '已处理' : '待处理' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="备注" min-width="120" show-overflow-tooltip>
              <template #default="{ row }">
                <span class="text-secondary">{{ row.note || '-' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.profile-head {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2d6a4f, #4c8a6b);
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-title {
  flex: 1;
}

.profile-name {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.profile-sub {
  font-size: 14px;
  color: var(--text-secondary);
}

.profile-risk {
  text-align: center;
}

.risk-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.profile-desc :deep(.el-descriptions__label) {
  width: 120px;
}
</style>
