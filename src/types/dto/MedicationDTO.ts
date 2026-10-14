/** 新增 / 编辑用药计划表单 */
export interface MedicationDTO {
  elderId: string
  name: string
  dosage: string
  frequency: string
  time: string
  note?: string
  image?: string
  enabled: boolean
}
