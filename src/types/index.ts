export type UserRole = 'ADMIN' | 'FACTORY_MANAGER'

export type AlertCategory = 'WATCHMAN' | 'PHONE' | 'INTRUSION' | 'GATE' | 'PRESENCE'

export type AlertStatus = 'Open' | 'Reviewed' | 'Closed'

export interface AlertRecord extends Record<string, unknown> {
  id: number
  date_time: string
  store_code: string
  camera: string
  explanation: string
  alert_type: string
  image_id: string
  image_byte_str?: string
  category: AlertCategory
  status: AlertStatus
}
