import { format, subDays } from 'date-fns'
import type {
  AlertRecord,
  DailyHeadcount,
  GateEvent,
  HourlyCompliance,
  MachineActivityRecord,
  PackingEfficiencyRecord,
  TobaccoDetectionRecord,
  TruckLogRecord,
  WorkerByHelmet,
  ZoneMetric,
} from '@/types'

const zones = ['Production Floor', 'Packaging Bay', 'Entry Gate', 'Machine Line', 'Back Office']

export const dailyHeadcount: DailyHeadcount[] = Array.from({ length: 30 }, (_, index) => {
  const date = subDays(new Date(), 29 - index)
  const morning = 90 + (index % 7) * 3 + Math.round(Math.sin(index / 2) * 6)
  const afternoon = 120 + (index % 5) * 4 + Math.round(Math.cos(index / 3) * 5)
  const night = 78 + (index % 6) * 2 + Math.round(Math.sin(index / 4) * 4)

  return {
    date: format(date, 'MMM dd'),
    morning,
    afternoon,
    night,
    total: morning + afternoon + night,
  }
})

export const hourlyCompliance: HourlyCompliance[] = Array.from({ length: 17 }, (_, index) => {
  const hour = 6 + index
  const label = `${hour.toString().padStart(2, '0')}:00`
  return {
    hour: label,
    helmetPct: Number((82 + (index % 6) * 2.1 + Math.sin(index / 3) * 3.2).toFixed(1)),
    vestPct: Number((79 + (index % 5) * 2.4 + Math.cos(index / 4) * 2.8).toFixed(1)),
    zone: zones[index % zones.length],
  }
})

export const machineActivity: MachineActivityRecord[] = [
  { machine: 'Mixer 1', activeMin: 330, idleMin: 70, offMin: 80 },
  { machine: 'Mixer 2', activeMin: 308, idleMin: 85, offMin: 87 },
  { machine: 'Press A', activeMin: 352, idleMin: 54, offMin: 74 },
  { machine: 'Press B', activeMin: 341, idleMin: 61, offMin: 78 },
  { machine: 'Cutter Line', activeMin: 302, idleMin: 96, offMin: 82 },
  { machine: 'Packaging Machine', activeMin: 366, idleMin: 53, offMin: 61 },
]

const alertTypes = [
  { type: 'PPE Violation', category: 'PPE' as const },
  { type: 'Machine Idle', category: 'Machine' as const },
  { type: 'Tobacco Detected', category: 'Tobacco' as const },
  { type: 'Tailgating', category: 'Gate' as const },
  { type: 'Unrecognized Truck', category: 'ANPR' as const },
  { type: 'Packing Zone Idle', category: 'Packing' as const },
  { type: 'Blocked Pathway', category: 'PPE' as const },
]

const severities: AlertRecord['severity'][] = ['HIGH', 'MEDIUM', 'LOW']
const statuses: AlertRecord['status'][] = ['Open', 'Reviewed', 'Closed']

export const alertRecords: AlertRecord[] = Array.from({ length: 30 }, (_, index) => {
  const d = subDays(new Date(), Math.floor(index / 4))
  const item = alertTypes[index % alertTypes.length]
  return {
    id: index + 1,
    dateTime: `${format(d, 'yyyy-MM-dd')} ${String(6 + (index % 16)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}`,
    cameraZone: `${zones[index % zones.length]} / Camera ${1 + (index % 6)}`,
    category: item.category,
    alertType: item.type,
    severity: severities[index % severities.length],
    status: statuses[index % statuses.length],
    image: `factory_alert_${String(index + 1).padStart(3, '0')}.jpg`,
  }
})

export const truckLog: TruckLogRecord[] = [
  'MH12AB1234','KA05XY9876','GJ01KT5621','TN07AA3412','MH14PQ7642','RJ22LM9087','KA03TR5544','MH10DE1102','UP16GH4411','CG04ME7782',
  'MH20DD1230','KA11PO0088','PB09MN4532','MH22AA7811','GJ27YU2004','TN15OP9321','MH12LK7765','HR26AD6678','KA05BB9090','MH48TR3321',
].map((plateNumber, index) => ({
  id: index + 1,
  dateTime: `${format(subDays(new Date(), Math.floor(index / 3)), 'yyyy-MM-dd')} ${String(5 + (index % 14)).padStart(2, '0')}:${String((index * 11) % 60).padStart(2, '0')}`,
  plateNumber,
  verified: index % 5 !== 0,
  entryTime: `${String(5 + (index % 12)).padStart(2, '0')}:${String((index * 3) % 60).padStart(2, '0')}`,
  exitTime: `${String(6 + (index % 12)).padStart(2, '0')}:${String((index * 3 + 37) % 60).padStart(2, '0')}`,
  duration: `${22 + (index % 8)} min`,
  weightKg: 12400 + index * 220,
  status: (index % 6 === 0 ? 'Flagged' : index % 3 === 0 ? 'Pending' : 'Cleared') as TruckLogRecord['status'],
}))

export const tobaccoDetections: TobaccoDetectionRecord[] = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  dateTime: `${format(subDays(new Date(), Math.floor(index / 2)), 'yyyy-MM-dd')} ${String(8 + index).padStart(2, '0')}:${String((index * 9) % 60).padStart(2, '0')}`,
  zone: zones[index % zones.length],
  camera: `Camera ${1 + (index % 6)}`,
  confidenceScore: Number((84 + (index % 4) * 3.5).toFixed(1)),
  status: (index % 3 === 0 ? 'Actioned' : index % 2 === 0 ? 'Reviewed' : 'New') as TobaccoDetectionRecord['status'],
}))

export const packingEfficiency: PackingEfficiencyRecord[] = Array.from({ length: 24 }, (_, index) => ({
  hour: `${String(index).padStart(2, '0')}:00`,
  workersPresent: 18 + (index % 6) * 2,
  efficiencyPct: Number((72 + (index % 7) * 2.1 + Math.sin(index / 2) * 4).toFixed(1)),
  status: (index % 4 === 0 ? 'Needs Attention' : index % 3 === 0 ? 'Excellent' : 'Good') as PackingEfficiencyRecord['status'],
  notes: index % 5 === 0 ? 'Conveyor speed adjusted' : 'Normal operation',
}))

export const gateEvents: GateEvent[] = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  dateTime: `${format(subDays(new Date(), Math.floor(index / 8)), 'yyyy-MM-dd')} ${String(6 + (index % 14)).padStart(2, '0')}:${String((index * 13) % 60).padStart(2, '0')}`,
  direction: (index % 2 === 0 ? 'IN' : 'OUT') as GateEvent['direction'],
  count: 1 + (index % 5),
  camera: index % 2 === 0 ? 'Entry Gate Cam' : 'Exit Gate Cam',
  tailgating: index % 9 === 0,
}))

export const workerByHelmet: WorkerByHelmet[] = [
  { color: 'White', role: 'Supervisor', count: 22, zone: 'Production Floor', timeStamp: '08:45', camera: 'Production Floor Cam A' },
  { color: 'Yellow', role: 'General Worker', count: 138, zone: 'Production Floor', timeStamp: '09:10', camera: 'Production Floor Cam B' },
  { color: 'Blue', role: 'Maintenance', count: 31, zone: 'Machine Line', timeStamp: '09:35', camera: 'Machine Line Cam' },
  { color: 'Red', role: 'Safety Officer', count: 12, zone: 'Entry Gate', timeStamp: '10:00', camera: 'Entry Gate Cam' },
  { color: 'Green', role: 'Visitor/Contractor', count: 9, zone: 'Back Office', timeStamp: '10:20', camera: 'Back Office Cam' },
  { color: 'Yellow', role: 'General Worker', count: 54, zone: 'Packaging Bay', timeStamp: '11:15', camera: 'Packaging Bay Cam' },
]

export const zoneActivityDistribution: ZoneMetric[] = [
  { zone: 'Production Floor', value: 38 },
  { zone: 'Packaging Bay', value: 22 },
  { zone: 'Entry Gate', value: 17 },
  { zone: 'Machine Line', value: 15 },
  { zone: 'Back Office', value: 8 },
]

export const zoneCompliance: ZoneMetric[] = [
  { zone: 'Production Floor', value: 92 },
  { zone: 'Packaging Bay', value: 87 },
  { zone: 'Gate', value: 78 },
  { zone: 'Machine Line', value: 69 },
]
