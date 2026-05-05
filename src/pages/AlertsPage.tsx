import { useMemo, useState } from 'react'
import AlertBadge from '@/components/ui/AlertBadge'
import AlertDetailModal from '@/components/ui/AlertDetailModal'
import DataTable from '@/components/ui/DataTable'
import SectionHeader from '@/components/ui/SectionHeader'
import SkeletonTable from '@/components/ui/SkeletonTable'
import StatusBadge from '@/components/ui/StatusBadge'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'
import type { AlertRecord } from '@/types'

const tabs = ['ALL', 'ANPR', 'WATCHMAN', 'PHONE', 'INTRUSION', 'MACHINE', 'GATE', 'PRESENCE'] as const

const TAB_LABEL: Record<(typeof tabs)[number], string> = {
  ALL: 'All',
  ANPR: 'Truck ANPR',
  WATCHMAN: 'Watchman',
  PHONE: 'Phone Usage',
  INTRUSION: 'Intrusion',
  MACHINE: 'Machine',
  GATE: 'Gate',
  PRESENCE: 'Presence',
}

const AlertsPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const [active, setActive] = useState<(typeof tabs)[number]>('ALL')
  const [selected, setSelected] = useState<AlertRecord | null>(null)

  const filtered = useMemo(() => {
    const source = data?.alertRecords ?? []
    if (active === 'ALL') return source
    return source.filter((row) => row.category === active)
  }, [active, data])

  if (isLoading) {
    return <SkeletonTable />
  }

  return (
    <div className="page-fade-in space-y-6">
      <div className="flex gap-5 overflow-x-auto border-b border-[#F3F4F6]">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`border-b-2 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] whitespace-nowrap ${
              active === tab ? 'border-[#0066FF] text-[#0066FF]' : 'border-transparent text-[#6B7280]'
            }`}
          >
            {TAB_LABEL[tab]}
          </button>
        ))}
      </div>

      <section className="space-y-3">
        <SectionHeader title="Alert Queue" />
        <DataTable
          rows={filtered}
          rowKey={(row) => row.id}
          onRowClick={(row) => setSelected(row)}
          columns={[
            { key: 'id', label: '#', sortable: true },
            {
              key: 'date_time',
              label: 'DATETIME',
              sortable: true,
              render: (row) => <span className="font-mono">{row.date_time}</span>,
            },
            { key: 'store_code', label: 'STORE', sortable: true },
            { key: 'camera', label: 'CAMERA', sortable: true },
            {
              key: 'alert_type',
              label: 'TYPE',
              sortable: true,
              render: (row) => <AlertBadge label={row.alert_type} />,
            },
            {
              key: 'status',
              label: 'STATUS',
              sortable: true,
              render: (row) => {
                let badgeType: 'danger' | 'warning' | 'success' = 'success'
                if (row.status === 'Open') badgeType = 'danger'
                else if (row.status === 'Reviewed') badgeType = 'warning'
                return <StatusBadge label={row.status.toUpperCase()} type={badgeType} />
              },
            },
          ]}
        />
      </section>

      <AlertDetailModal selected={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

export default AlertsPage
