export type UserRole = 'ADMIN' | 'FACTORY_MANAGER'

export type AlertCategory = 'ANPR' | 'WATCHMAN' | 'PHONE' | 'INTRUSION' | 'MACHINE' | 'GATE' | 'PRESENCE'

export type AlertStatus = 'Open' | 'Reviewed' | 'Closed'

export interface AlertRecord extends Record<string, unknown> {
  id: number
  date_time: string
  store_code: string
  camera: string
  explanation: string
  alert_type: string
  image_id: string
  category: AlertCategory
  status: AlertStatus
}
