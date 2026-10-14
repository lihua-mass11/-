import type { MedicationRecordVO, RiskLevel, SosRecordVO } from '@/types'

/**
 * 自动风险评估规则（初赛简化版）：
 * - 预警：存在未处理的 SOS，或连续多日未打卡，或长时间无活跃
 * - 关注：出现一次未按时吃药，或当日未健康打卡
 * - 正常：按时打卡，无异常通知
 */
export function evaluateRiskLevel(input: {
  missedMedicationCount: number
  hasUnhandledSos: boolean
  missedHealthDays: number
  inactiveDays: number
}): RiskLevel {
  if (input.hasUnhandledSos || input.inactiveDays >= 2 || input.missedHealthDays >= 3) {
    return 'alert'
  }
  if (input.missedMedicationCount >= 1 || input.missedHealthDays >= 1) {
    return 'watch'
  }
  return 'normal'
}

/** 从用药打卡记录统计今日/近期漏服情况 */
export function countMissedMedication(records: MedicationRecordVO[]): number {
  return records.filter((r) => r.status === 'missed').length
}

/** 统计未处理的求助记录 */
export function hasUnhandledSos(records: SosRecordVO[]): boolean {
  return records.some((r) => r.status === 'pending')
}
