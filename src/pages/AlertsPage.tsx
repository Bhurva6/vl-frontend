import { useMemo, useState } from 'react'
import AlertBadge from '@/components/ui/AlertBadge'
import AlertDetailModal from '@/components/ui/AlertDetailModal'
import DataTable from '@/components/ui/DataTable'
import SectionHeader from '@/components/ui/SectionHeader'
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
  const [selected, setSelected] = useState<AlertRecord | null>(null)

  const filtered = useMemo(() => {
    const source = data?.alertRecords ?? []
    if (category === 'ALL') return source
    return source.filter((row) => row.category === category)
  }, [category, data])

  const categorySelect = (
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value as AlertCategory | 'ALL')}
      className="border-0 border-b-2 border-[#D1D5DB] bg-transparent pb-[9px] font-mono text-[12px] text-[#0A0A0A] outline-none focus:border-[#0066FF]"
    >
      {CATEGORY_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )

  if (isLoading) {
    return <SkeletonTable />
  }

  return (
    <div className="page-fade-in space-y-6">
      <section className="space-y-3">
        <SectionHeader title="Alert Queue" />
        <DataTable
          rows={filtered}
          rowKey={(row) => row.id}
          onRowClick={(row) => setSelected(row)}
          headerExtra={categorySelect}
          columns={[
            { key: 'id', label: '#', sortable: true },
            {
              key: 'date_time',
              label: 'DATETIME',
              sortable: true,
              render: (row) => <span className="font-mono">{row.date_time}</span>,
            },
            { key: 'store_code', label: 'STORE', sortable: true },
            { key: 'camera', label: 'CAMERA PORT_CHANNEL', sortable: true },
            {
              key: 'alert_type',
              label: 'TYPE',
              sortable: true,
              render: (row) => <AlertBadge label={row.alert_type} />,
            },
          ]}
        />
      </section>

      <AlertDetailModal selected={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

export default AlertsPage
