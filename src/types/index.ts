export type UserRole = 'ADMIN' | 'FACTORY_MANAGER'

export type AlertCategory = 'PPE' | 'Machine' | 'Tobacco' | 'Gate' | 'ANPR' | 'Packing'

export type AlertSeverity = 'HIGH' | 'MEDIUM' | 'LOW'

export type AlertStatus = 'Open' | 'Reviewed' | 'Closed'

export interface DailyHeadcount {
  date: string
  morning: number
  afternoon: number
  night: number
  total: number
}

export interface HourlyCompliance {
  hour: string
  helmetPct: number
  vestPct: number
  zone: string
}

export interface MachineActivityRecord {
  machine: string
  activeMin: number
  idleMin: number
  offMin: number
}

export interface AlertRecord extends Record<string, unknown> {
  id: number
  dateTime: string
  cameraZone: string
  category: AlertCategory
  alertType: string
  severity: AlertSeverity
  status: AlertStatus
  image: string
}

export interface TruckLogRecord extends Record<string, unknown> {
  id: number
  dateTime: string
  plateNumber: string
  verified: boolean
  entryTime: string
  exitTime: string
  duration: string
  weightKg: number
  status: 'Cleared' | 'Pending' | 'Flagged'
}

export interface TobaccoDetectionRecord extends Record<string, unknown> {
  id: number
  dateTime: string
  zone: string
  camera: string
  confidenceScore: number
  status: 'New' | 'Reviewed' | 'Actioned'
}

export interface PackingEfficiencyRecord extends Record<string, unknown> {
  hour: string
  workersPresent: number
  efficiencyPct: number
  status: 'Excellent' | 'Good' | 'Needs Attention'
  notes: string
}

export interface GateEvent extends Record<string, unknown> {
  id: number
  dateTime: string
  direction: 'IN' | 'OUT'
  count: number
  camera: string
  tailgating: boolean
}

export interface WorkerByHelmet extends Record<string, unknown> {
  color: 'White' | 'Yellow' | 'Blue' | 'Red' | 'Green'
  role: 'Supervisor' | 'General Worker' | 'Maintenance' | 'Safety Officer' | 'Visitor/Contractor'
  count: number
  zone: string
  timeStamp: string
  camera: string
}

export interface ZoneMetric {
  zone: string
  value: number
}
