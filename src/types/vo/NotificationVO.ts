import type { NotificationChannel, NotificationType } from '../type'

/** 通知（由 App / 微信 / 邮箱等第三方渠道推送） */
export interface NotificationVO {
  id: string
  elderId: string
  type: NotificationType
  channel: NotificationChannel
  title: string
  content: string
  createdAt: string
  read: boolean
  handled: boolean
}
