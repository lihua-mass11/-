import type { SosStatus } from '../type'

/** 紧急求助记录 */
export interface SosRecordVO {
  id: string
  elderId: string
  triggeredAt: string
  status: SosStatus
  handledAt: string | null
  note?: string
}
