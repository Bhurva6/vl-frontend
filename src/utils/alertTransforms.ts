import type { AlertRecord } from '@/types'

const EXPLANATION: Record<string, (cam: string) => string> = {
  phone_usage:        (c) => `Person using mobile phone detected at ${c}.`,
  intrusion:          (c) => `Unauthorized person detected at ${c}.`,
  watchman_sleeping:  (c) => `Watchman appears to be sleeping at ${c}.`,
  watchman_present:   (c) => `Watchman confirmed present at ${c}.`,
  truck_anpr:         (c) => `Unregistered truck detected at ${c}.`,
  machine_status:     (c) => `Machine status anomaly detected at ${c}.`,
  gate_detection:     (c) => `Person detected at main gate at ${c}.`,
  presence_detection: (c) => `Person detected near machine area at ${c}.`,
}

export function transformAlert(record: AlertRecord): AlertRecord {
  const explanation = EXPLANATION[record.alert_type]?.(record.camera) ?? record.explanation
  return { ...record, explanation }
}
