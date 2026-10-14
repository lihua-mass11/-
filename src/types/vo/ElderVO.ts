import type { RiskLevel } from '../type'

/** 老人档案信息 */
export interface ElderVO {
  id: string
  name: string
  age: number
  gender: 'male' | 'female'
  address: string
  emergencyContact: string
  emergencyPhone: string
  riskLevel: RiskLevel
  lastActiveAt: string
  avatar?: string
}

/** 家属-老人绑定关系 */
export interface BindingVO {
  id: string
  userId: string
  elderId: string
}
