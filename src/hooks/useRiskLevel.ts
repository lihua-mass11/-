import { computed } from 'vue'
import { useElderStore, useHealthStore, useMedicationStore, useSosStore } from '@/stores'
import { TODAY } from '@/constants'
import { evaluateRiskLevel } from '@/utils/risk'
import type { RiskLevel } from '@/types'

/**
 * 动态计算当前老人的风险等级。
 * 依据：漏服次数、未处理求助、当日健康打卡、活跃间隔。
 */
export function useRiskLevel() {
  const elderStore = useElderStore()
  const medicationStore = useMedicationStore()
  const healthStore = useHealthStore()
  const sosStore = useSosStore()

  const riskLevel = computed<RiskLevel>(() => {
    const elder = elderStore.currentElder
    if (!elder) return 'normal'

    const elderId = elder.id
    const missedCount = medicationStore.records.filter(
      (r) => r.elderId === elderId && r.status === 'missed',
    ).length
    const hasSos = sosStore.sosRecords.some(
      (r) => r.elderId === elderId && r.status === 'pending',
    )
    const todayHealth = healthStore.recordsOf(elderId).find((r) => r.date === TODAY)
    const missedHealthDays = todayHealth ? 0 : 1

    const lastActive = new Date(elder.lastActiveAt)
    const inactiveDays = Number.isNaN(lastActive.getTime())
      ? 0
      : Math.floor((Date.now() - lastActive.getTime()) / 86400000)

    return evaluateRiskLevel({
      missedMedicationCount: missedCount,
      hasUnhandledSos: hasSos,
      missedHealthDays,
      inactiveDays,
    })
  })

  return { riskLevel }
}
