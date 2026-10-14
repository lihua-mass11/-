import type { NotificationType, RiskLevel } from '@/types'

/** 风险等级展示配置 */
export const RISK_LEVEL_META: Record<
  RiskLevel,
  { label: string; color: string; bg: string; tagType: 'success' | 'warning' | 'danger' }
> = {
  normal: { label: '正常', color: '#52a06e', bg: '#edf6f0', tagType: 'success' },
  watch: { label: '关注', color: '#e09a3f', bg: '#fbf3e6', tagType: 'warning' },
  alert: { label: '预警', color: '#d9534f', bg: '#fbecec', tagType: 'danger' },
}

/** 通知类型展示配置 */
export const NOTIFICATION_TYPE_META: Record<
  NotificationType,
  { label: string; color: string; icon: string }
> = {
  medication: { label: '未按时服药', color: '#e09a3f', icon: 'Clock' },
  inactive: { label: '长时间未活跃', color: '#8a9890', icon: 'Warning' },
  sos: { label: '紧急求助', color: '#d9534f', icon: 'BellFilled' },
}

/** 健康打卡心情选项 */
export const MOOD_OPTIONS = ['良好', '一般', '疲惫', '不适'] as const

/** 用药频率选项 */
export const FREQUENCY_OPTIONS = ['每日一次', '每日两次', '每日三次', '隔日一次'] as const

/** 本地 mock 数据根路径 */
export const MOCK_BASE_URL = '/mock'

/** 演示场景中的"今天"（与 mock 数据日期对齐） */
export const TODAY = '2026-10-12'
