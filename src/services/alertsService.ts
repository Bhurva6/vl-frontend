import { ScanCommand } from '@aws-sdk/lib-dynamodb'
import type { AlertRecord } from '@/types'
import { dynamoDocClient } from './aws'

const CATEGORY_MAP: Record<string, AlertRecord['category']> = {
  // watchman
  watchman_asleep:     'WATCHMAN',
  watchman_absent:     'WATCHMAN',
  watchman_sleeping:   'WATCHMAN',
  watchman_present:    'WATCHMAN',
  // phone
  phone_usage:         'PHONE',
  // intrusion
  intrusion:           'INTRUSION',
  // machine
  machine_status:      'MACHINE',
  // truck / ANPR
  truck_anpr:          'ANPR',
  anpr:                'ANPR',
  // gate
  gate:                'GATE',
  gate_detection:      'GATE',
  // presence
  presence:            'PRESENCE',
  presence_detection:  'PRESENCE',
}

function resolveCategory(rawType: string): AlertRecord['category'] {
  const t = rawType.toLowerCase().trim()
  if (CATEGORY_MAP[t]) return CATEGORY_MAP[t]
  if (t.includes('anpr') || t.includes('truck'))                              return 'ANPR'
  if (t.includes('gate'))                                                     return 'GATE'
  if (t.includes('presence'))                                                 return 'PRESENCE'
  if (t.includes('phone'))                                                    return 'PHONE'
  if (t.includes('intrusion'))                                                return 'INTRUSION'
  if (t.includes('watchman') || t.includes('asleep') || t.includes('absent')) return 'WATCHMAN'
  if (t.includes('machine'))                                                  return 'MACHINE'
  return 'MACHINE'
}

function toRawString(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

export async function fetchAlerts(): Promise<AlertRecord[]> {
  const table = import.meta.env.VITE_DYNAMODB_TABLE as string

  const allItems: Record<string, unknown>[] = []
  let lastKey: Record<string, unknown> | undefined = undefined

  // Full table scan so gate/presence detectors (potentially different store_code) are included
  do {
    const command = new ScanCommand({
      TableName: table,
      ...(lastKey ? { ExclusiveStartKey: lastKey } : {}),
    })
    const result = await dynamoDocClient.send(command)
    allItems.push(...(result.Items ?? []))
    lastKey = result.LastEvaluatedKey as Record<string, unknown> | undefined
  } while (lastKey)

  // Sort newest first (date_time field)
  allItems.sort((a, b) =>
    String(b['date_time'] ?? b['synced_at'] ?? '').localeCompare(
      String(a['date_time'] ?? a['synced_at'] ?? ''),
    ),
  )

  console.log('[fetchAlerts] total items:', allItems.length)
  const seen = new Set<string>()
  for (const item of allItems) {
    const t = String(item['alert_type'] ?? '')
    if (!seen.has(t)) {
      seen.add(t)
      console.log(`[fetchAlerts] sample for alert_type="${t}":`, JSON.stringify(item, null, 2))
    }
  }

  return allItems.map((item, idx) => {
    const rawType = String(item['alert_type'] ?? '')
    return {
      id:          idx + 1,
      date_time:   String(item['date_time']   ?? item['synced_at'] ?? ''),
      store_code:  String(item['store_code']  ?? ''),
      camera:      String(item['camera']      ?? item['nvr_ip']    ?? ''),
      explanation: toRawString(item['explanation']),
      alert_type:  rawType,
      image_id:    String(item['s3_key']      ?? item['image_id']  ?? ''),
      category:    resolveCategory(rawType),
      status:      'Open' as const,
    }
  })
}
