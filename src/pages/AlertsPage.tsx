import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import AlertCard from '@/components/ui/AlertCard'
import AlertDetailModal from '@/components/ui/AlertDetailModal'
import SkeletonTable from '@/components/ui/SkeletonTable'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'
import type { AlertCategory, AlertRecord } from '@/types'

const CATEGORY_OPTIONS: { value: AlertCategory | 'ALL'; label: string }[] = [
  { value: 'ALL',       label: 'All Types' },
  { value: 'WATCHMAN',  label: 'Watchman' },
  { value: 'PHONE',     label: 'Phone Usage' },
  { value: 'INTRUSION', label: 'Intrusion' },
  { value: 'GATE',      label: 'Gate' },
  { value: 'PRESENCE',  label: 'Presence' },
]

const AlertsPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const [category, setCategory] = useState<AlertCategory | 'ALL'>('ALL')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<AlertRecord | null>(null)

  const filtered = useMemo(() => {
    const source = data?.alertRecords ?? []
    const byCat  = category === 'ALL' ? source : source.filter(r => r.category === category)
    const q      = query.trim().toLowerCase()
    if (!q) return byCat
    return byCat.filter(r =>
      [r.date_time, r.store_code, r.camera, r.alert_type, r.explanation]
        .some(v => String(v).toLowerCase().includes(q)),
    )
  }, [category, query, data])

  if (isLoading) return <SkeletonTable />

  return (
    <div className="page-fade-in space-y-6">
      {/* Toolbar */}
      <div className="flex items-end gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search alerts…"
            className="w-full border-0 border-b-2 border-[#D1D5DB] bg-transparent pb-2 pl-9 pt-2 font-mono text-[12px] text-[#0A0A0A] outline-none focus:border-[#0066FF]"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value as AlertCategory | 'ALL')}
          className="border-0 border-b-2 border-[#D1D5DB] bg-transparent pb-[9px] font-mono text-[12px] text-[#0A0A0A] outline-none focus:border-[#0066FF]"
        >
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="font-mono text-[11px] text-[#9CA3AF]">{filtered.length} alerts</span>
      </div>

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div className="border border-dashed border-gray-200 p-16 text-center">
          <p className="font-semibold text-gray-700">No alerts found</p>
          <p className="text-sm text-gray-500">Try adjusting the search or filter.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(record => (
            <AlertCard
              key={record.id}
              record={record}
              onClick={() => setSelected(record)}
            />
          ))}
        </div>
      )}

      <AlertDetailModal selected={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

export default AlertsPage
