import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  label: string
  type?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  pulse?: boolean
}

const styles: Record<NonNullable<StatusBadgeProps['type']>, string> = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-gray-100 text-gray-700',
}

const StatusBadge = ({ label, type = 'neutral', pulse = false }: StatusBadgeProps) => {
  return <Badge className={`${styles[type]} ${pulse ? 'animate-pulse' : ''}`}>{label}</Badge>
}

export default StatusBadge
