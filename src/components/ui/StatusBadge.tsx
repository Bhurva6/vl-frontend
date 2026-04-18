interface StatusBadgeProps {
  label: string
  type?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  pulse?: boolean
}

const styles: Record<NonNullable<StatusBadgeProps['type']>, string> = {
  success: 'border-l-2 border-[#00B341] bg-green-50 text-[#166534]',
  warning: 'border-l-2 border-[#FF6B00] bg-orange-50 text-[#9A3412]',
  danger: 'border-l-2 border-[#E5000A] bg-red-50 text-[#991B1B]',
  info: 'border-l-2 border-[#0066FF] bg-blue-50 text-[#1E3A8A]',
  neutral: 'border-l-2 border-[#6B7280] bg-gray-50 text-[#374151]',
}

const StatusBadge = ({ label, type = 'neutral', pulse = false }: StatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-none px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${styles[type]} ${pulse ? 'animate-pulse' : ''}`}
    >
      {label}
    </span>
  )
}

export default StatusBadge
