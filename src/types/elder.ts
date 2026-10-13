import type { RiskLevel } from './common'

/** 老人档案 */
export interface Elder {
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

/** 家属与老人绑定关系 */
export interface Binding {
  id: string
  userId: string
  elderId: string
}
