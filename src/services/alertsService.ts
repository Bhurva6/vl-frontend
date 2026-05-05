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
  phone_detected:      'PHONE',
  // intrusion
  intrusion:           'INTRUSION',
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
  if (t.includes('gate')     || t.includes('entry')  || t.includes('door'))    return 'GATE'
  if (t.includes('presence') || t.includes('person') || t.includes('crowd') || t.includes('count')) return 'PRESENCE'
  if (t.includes('phone')    || t.includes('mobile'))                           return 'PHONE'
  if (t.includes('intrusion')|| t.includes('trespass'))                         return 'INTRUSION'
  if (t.includes('watchman') || t.includes('asleep') || t.includes('absent') || t.includes('guard')) return 'WATCHMAN'
  console.warn(`[resolveCategory] unknown alert_type: "${rawType}" — defaulting to INTRUSION`)
  return 'INTRUSION'
}

function str(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return JSON.stringify(value)
}

function toRawString(value: unknown): string {
  return str(value).replace(/^Gemini\s+/i, '')
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

  // Sort newest first
  allItems.sort((a, b) =>
    str(b['date_time'] ?? b['synced_at']).localeCompare(
      str(a['date_time'] ?? a['synced_at']),
    ),
  )

  // ── DEBUG ──────────────────────────────────────────────────────────────
  console.group('%c[fetchAlerts] DEBUG REPORT', 'color:#0066FF;font-weight:bold')
  console.log('Table scanned:', table)
  console.log('Total items fetched:', allItems.length)

  // 1. All unique alert_types in the table
  const typeCounts: Record<string, number> = {}
  for (const item of allItems) {
    const t = str(item['alert_type']) || '(empty)'
    typeCounts[t] = (typeCounts[t] ?? 0) + 1
  }
  console.log('All alert_types found:', typeCounts)

  // 2. Items that have image_byte_str (new gate/presence format)
  const withImage = allItems.filter(i => i['image_byte_str'])
  console.log(`Items with image_byte_str: ${withImage.length}`)
  if (withImage.length > 0) {
    console.log('Sample image_byte_str item:', JSON.stringify({ ...withImage[0], image_byte_str: '(truncated)' }, null, 2))
  }

  // 3. Category resolution per item
  const categoryCounts: Record<string, number> = {}
  for (const item of allItems) {
    const cat = resolveCategory(str(item['alert_type']))
    categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1
  }
  console.log('Items per resolved category:', categoryCounts)

  // 4. Full raw dump of first item for each alert_type
  const seen = new Set<string>()
  for (const item of allItems) {
    const t = str(item['alert_type']) || '(empty)'
    if (!seen.has(t)) {
      seen.add(t)
      const display = { ...item }
      if (display['image_byte_str']) display['image_byte_str'] = '(base64 truncated)'
      console.log(`Raw item for alert_type="${t}":`, JSON.stringify(display, null, 2))
    }
  }
  console.groupEnd()
  // ── END DEBUG ───────────────────────────────────────────────────────────

  return allItems.map((item, idx) => {
    const rawType      = str(item['alert_type'])
    const imageByteStr = str(item['image_byte_str']) || undefined
    return {
      id:             idx + 1,
      date_time:      str(item['date_time']  ?? item['synced_at']),
      store_code:     str(item['store_code']),
      camera:         str(item['camera_port'] ?? item['camera'] ?? item['nvr_ip']),
      explanation:    toRawString(item['explanation']),
      alert_type:     rawType,
      image_id:       str(item['s3_key']     ?? item['image_id']),
      image_byte_str: imageByteStr,
      category:       resolveCategory(rawType),
      status:         'Open' as const,
    }
  })
}
