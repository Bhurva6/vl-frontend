import { format, subDays } from 'date-fns'
import type { AlertRecord } from '@/types'

const storeCodes = ['KK-Essentials', 'KK-Essentials North', 'KK-Essentials South']
const statuses: AlertRecord['status'][] = ['Open', 'Reviewed', 'Closed']
const cameras = ['192.168.1.64', '192.168.1.65', '192.168.1.66', '192.168.1.67']

const watchmanHours = [9, 10, 11, 12, 13, 14, 15, 16, 17]
const phoneHours = [9, 11, 13, 15, 17]
const intrusionHours = [18, 19, 20, 21, 22, 23]
const gateHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

const alertDefs: {
  alert_type: string
  category: AlertRecord['category']
  hours: number[]
  explanation: (cam: string) => string
}[] = [
  { alert_type: 'watchman_asleep',     category: 'WATCHMAN',  hours: watchmanHours,   explanation: (c) => `Watchman appears to be sleeping at ${c}.` },
  { alert_type: 'watchman_absent',     category: 'WATCHMAN',  hours: watchmanHours,   explanation: (c) => `No person detected for 2 consecutive minutes at ${c}.` },
  { alert_type: 'phone_detected',      category: 'PHONE',     hours: phoneHours,      explanation: (c) => `Person using mobile phone detected at ${c}.` },
  { alert_type: 'intrusion',           category: 'INTRUSION', hours: intrusionHours,  explanation: (c) => `Person seen entering restricted area at ${c}.` },
  { alert_type: 'gate_detection',      category: 'GATE',      hours: gateHours,       explanation: (c) => `Person detected at main gate at ${c}.` },
  { alert_type: 'presence_detection',  category: 'PRESENCE',  hours: gateHours,       explanation: (c) => `Person detected near machine area at ${c}.` },
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
