import type { SosStatus } from './common'

/** 紧急求助记录 */
export interface SosRecord {
  id: string
  elderId: string
  triggeredAt: string
  status: SosStatus
  handledAt: string | null
  note?: string
}
