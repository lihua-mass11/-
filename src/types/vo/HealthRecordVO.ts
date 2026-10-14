/** 健康打卡记录 */
export interface HealthRecordVO {
  id: string
  elderId: string
  date: string
  mood: string
  remark?: string
  createdAt: string
}
