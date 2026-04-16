import StatusBadge from '@/components/ui/StatusBadge'

const map: Record<string, { type: 'danger' | 'warning' | 'info' | 'neutral'; pulse?: boolean }> = {
  'PPE Violation': { type: 'danger' },
  'Machine Idle': { type: 'info' },
  'Tobacco Detected': { type: 'danger', pulse: true },
  'Blocked Pathway': { type: 'warning' },
  Tailgating: { type: 'warning' },
  'Unrecognized Truck': { type: 'neutral' },
  'Packing Zone Idle': { type: 'info' },
  'No Helmet': { type: 'danger' },
  'No Vest': { type: 'warning' },
  'Both Missing': { type: 'danger' },
}

const AlertBadge = ({ label }: { label: string }) => {
  const conf = map[label] ?? { type: 'neutral' as const }
  return <StatusBadge label={label} type={conf.type} pulse={conf.pulse} />
}

export default AlertBadge
