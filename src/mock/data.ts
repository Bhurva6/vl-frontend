import { format, subDays } from 'date-fns'
import type { AlertRecord } from '@/types'

const storeCodes = ['STORE_001', 'STORE_002', 'STORE_003']
const statuses: AlertRecord['status'][] = ['Open', 'Reviewed', 'Closed']
const cameras = ['Camera 1', 'Camera 2', 'Camera 3', 'Camera 4']

const watchmanHours = [9, 10, 11, 12, 13, 14, 15, 16, 17]
const phoneHours = [9, 11, 13, 15, 17]
const intrusionHours = [18, 19, 20, 21, 22, 23]
const machineHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

const alertDefs: {
  alert_type: string
  category: AlertRecord['category']
  hours: number[]
  explanation: (cam: string) => string
}[] = [
  { alert_type: 'truck_anpr', category: 'ANPR', hours: machineHours, explanation: (c) => `Unregistered truck detected at ${c}.` },
  { alert_type: 'watchman_sleeping', category: 'WATCHMAN', hours: watchmanHours, explanation: (c) => `Watchman appears to be sleeping at ${c}.` },
  { alert_type: 'watchman_present', category: 'WATCHMAN', hours: watchmanHours, explanation: (c) => `Watchman confirmed present at ${c}.` },
  { alert_type: 'phone_usage', category: 'PHONE', hours: phoneHours, explanation: (c) => `Phone usage detected at ${c}.` },
  { alert_type: 'intrusion', category: 'INTRUSION', hours: intrusionHours, explanation: (c) => `Unauthorized intrusion detected at ${c} after hours.` },
  { alert_type: 'machine_status', category: 'MACHINE', hours: machineHours, explanation: (c) => `Machine status anomaly detected at ${c}.` },
]

let idSeq = 1
export const alertRecords: AlertRecord[] = []

for (const def of alertDefs) {
  for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
    const d = subDays(new Date(), dayIdx)
    for (let hIdx = 0; hIdx < def.hours.length; hIdx++) {
      // ~25% skip for realistic variation
      if ((dayIdx * 7 + hIdx * 3) % 10 < 3) continue
      const hour = def.hours[hIdx]
      const cam = cameras[idSeq % cameras.length]
      alertRecords.push({
        id: idSeq++,
        date_time: `${format(d, 'yyyy-MM-dd')} ${String(hour).padStart(2, '0')}:00:00`,
        store_code: storeCodes[idSeq % storeCodes.length],
        camera: cam,
        explanation: def.explanation(cam),
        alert_type: def.alert_type,
        image_id: `alerts/${def.alert_type}/${format(d, 'yyyy-MM-dd')}_${String(hour).padStart(2, '0')}00.jpg`,
        category: def.category,
        status: statuses[idSeq % statuses.length],
      })
    }
  }
}
