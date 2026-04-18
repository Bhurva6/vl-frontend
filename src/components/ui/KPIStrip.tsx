import KPIUnit from '@/components/ui/KPIUnit'

export interface KPIItem {
  label: string
  value: string
  delta?: string
  deltaTone?: 'up' | 'down' | 'neutral'
  borderTone?: 'blue' | 'amber' | 'red' | 'green' | 'rose'
}

interface KPIStripProps {
  items: KPIItem[]
}

const KPIStrip = ({ items }: KPIStripProps) => {
  return (
    <div className="overflow-x-auto border-y border-[#E5E7EB]">
      <div className="flex min-w-[1200px] divide-x divide-[#E5E7EB] bg-white">
        {items.map((item) => (
          <KPIUnit key={item.label} {...item} />
        ))}
      </div>
    </div>
  )
}

export default KPIStrip
