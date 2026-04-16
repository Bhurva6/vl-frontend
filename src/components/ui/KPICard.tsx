import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import StatusBadge from '@/components/ui/StatusBadge'

interface KPICardProps {
  title: string
  value: string
  subtext: string
  icon: LucideIcon
  iconColor: string
  trend?: number
  riskLabel?: string
}

const KPICard = ({ title, value, subtext, icon: Icon, iconColor, trend, riskLabel }: KPICardProps) => {
  const positive = (trend ?? 0) >= 0

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-gray-500">{title}</p>
          <p className="mt-1 text-xl font-bold text-gray-800">{value}</p>
          <p className="mt-0.5 text-xs text-gray-500">{subtext}</p>
        </div>
        <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconColor}`}>
          <Icon className="h-4 w-4 text-white" />
        </span>
      </div>

      {typeof trend === 'number' && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          {positive ? <TrendingUp className="h-3 w-3 text-emerald-600" /> : <TrendingDown className="h-3 w-3 text-red-500" />}
          <span className={positive ? 'text-emerald-600' : 'text-red-500'}>{positive ? '▲' : '▼'} {Math.abs(trend).toFixed(1)}%</span>
          <span className="text-gray-400">vs yesterday</span>
        </div>
      )}

      {riskLabel && <div className="mt-2"><StatusBadge label={riskLabel} type="danger" /></div>}
    </Card>
  )
}

export default KPICard
