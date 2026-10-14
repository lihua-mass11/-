/** 用药计划（日程定义） */
export interface MedicationVO {
  id: string
  elderId: string
  name: string
  dosage: string
  frequency: string
  time: string
  note?: string
  image?: string
  enabled: boolean
}
