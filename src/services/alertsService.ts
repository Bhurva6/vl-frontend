import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import type { AlertRecord } from '@/types'
import { dynamoDocClient } from './aws'

const CATEGORY_MAP: Record<string, AlertRecord['category']> = {
  truck_anpr:        'ANPR',
  watchman_sleeping: 'WATCHMAN',
  watchman_present:  'WATCHMAN',
  phone_usage:       'PHONE',
  intrusion:         'INTRUSION',
  machine_status:    'MACHINE',
}

export async function fetchAlerts(limit = 200): Promise<AlertRecord[]> {
  const command = new QueryCommand({
    TableName: import.meta.env.VITE_DYNAMODB_TABLE as string,
    KeyConditionExpression: 'store_code = :store',
    ExpressionAttributeValues: { ':store': import.meta.env.VITE_STORE_CODE as string },
    ScanIndexForward: false, // newest first
    Limit: limit,
  })

  const result = await dynamoDocClient.send(command)

  return (result.Items ?? []).map((item, idx) => ({
    id: idx + 1,
    // support both writer field names (date_time / image_id) and test script names (synced_at / s3_key)
    date_time:   String(item['date_time']  ?? item['synced_at'] ?? ''),
    store_code:  String(item['store_code'] ?? ''),
    camera:      String(item['camera']     ?? ''),
    explanation: String(item['explanation'] ?? ''),
    alert_type:  String(item['alert_type'] ?? ''),
    image_id:    String(item['s3_key']     ?? item['image_id'] ?? ''),
    category:    CATEGORY_MAP[String(item['alert_type'])] ?? 'MACHINE',
    status:      'Open' as const,
  }))
}
