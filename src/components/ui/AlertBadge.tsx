import StatusBadge from '@/components/ui/StatusBadge'

const map: Record<string, { type: 'danger' | 'warning' | 'info' | 'neutral'; pulse?: boolean }> = {
  truck_anpr: { type: 'neutral' },
  watchman_sleeping: { type: 'danger', pulse: true },
  watchman_present: { type: 'info' },
  phone_usage: { type: 'warning' },
  intrusion: { type: 'danger', pulse: true },
  machine_status: { type: 'info' },
}

const AlertBadge = ({ label }: { label: string }) => {
  const conf = map[label] ?? { type: 'neutral' as const }
  return <StatusBadge label={label.toUpperCase()} type={conf.type} pulse={conf.pulse} />
}

export default AlertBadge
