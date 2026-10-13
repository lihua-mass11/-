/** 风险等级：正常 / 关注 / 预警 */
export type RiskLevel = 'normal' | 'watch' | 'alert'

/** 通知类型：未按时服药 / 长时间未活跃 / 紧急求助 */
export type NotificationType = 'medication' | 'inactive' | 'sos'

/** 用药打卡状态 */
export type MedicationRecordStatus = 'pending' | 'taken' | 'missed'

/** 求助处理状态 */
export type SosStatus = 'pending' | 'handled'
