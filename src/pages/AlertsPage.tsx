import { useMemo, useState } from 'react'
import AlertBadge from '@/components/ui/AlertBadge'
import DataTable from '@/components/ui/DataTable'
import Modal from '@/components/ui/Modal'
import SectionHeader from '@/components/ui/SectionHeader'
import SkeletonTable from '@/components/ui/SkeletonTable'
import StatusBadge from '@/components/ui/StatusBadge'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'
import type { AlertRecord } from '@/types'

const tabs = ['ALL', 'PPE', 'MACHINE', 'TOBACCO', 'GATE', 'ANPR', 'PACKING'] as const

const AlertsPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const [active, setActive] = useState<(typeof tabs)[number]>('ALL')
  const [selected, setSelected] = useState<AlertRecord | null>(null)
  const [statusValue, setStatusValue] = useState('OPEN')

  const filtered = useMemo(() => {
    const source = data?.alertRecords ?? []
    if (active === 'ALL') return source

    if (active === 'MACHINE') return source.filter((row) => row.category === 'Machine')
    return source.filter((row) => row.category.toUpperCase() === active)
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
            className={`border-b-2 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] ${
              active === tab ? 'border-[#0066FF] text-[#0066FF]' : 'border-transparent text-[#6B7280]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="space-y-3">
        <SectionHeader title="Alert Queue" />
        <DataTable
          rows={filtered}
          rowKey={(row) => row.id}
          onRowClick={(row) => {
            setSelected(row)
            setStatusValue(row.status.toUpperCase())
          }}
          columns={[
            { key: 'id', label: '#', sortable: true },
            { key: 'dateTime', label: 'DATETIME', sortable: true, render: (row) => <span className="font-mono">{row.dateTime}</span> },
            { key: 'cameraZone', label: 'ZONE', sortable: true },
            { key: 'alertType', label: 'TYPE', sortable: true, render: (row) => <AlertBadge label={row.alertType} /> },
            {
              key: 'severity',
              label: 'SEVERITY',
              sortable: true,
              render: (row) => (
                <StatusBadge
                  label={row.severity}
                  type={row.severity === 'HIGH' ? 'danger' : row.severity === 'MEDIUM' ? 'warning' : 'success'}
                />
              ),
            },
            {
              key: 'status',
              label: 'STATUS',
              sortable: true,
              render: (row) => (
                <StatusBadge
                  label={row.status.toUpperCase()}
                  type={row.status === 'Open' ? 'danger' : row.status === 'Reviewed' ? 'warning' : 'success'}
                />
              ),
            },
            { key: 'image', label: 'IMAGE', sortable: true, render: (row) => <span className="font-mono">{row.image}</span> },
          ]}
        />
      </section>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Alert Detail">
        {selected ? (
          <div className="space-y-4">
            <div className="h-56 border border-dashed border-[#E5E7EB] bg-[#F8F9FA]" />

            <div className="grid gap-2 font-sans text-sm text-[#0A0A0A]">
              <p><span className="font-semibold">DateTime:</span> <span className="font-mono">{selected.dateTime}</span></p>
              <p><span className="font-semibold">Zone:</span> {selected.cameraZone}</p>
              <p><span className="font-semibold">Type:</span> {selected.alertType}</p>
              <p><span className="font-semibold">Severity:</span> {selected.severity}</p>
            </div>

            <div className="flex items-center gap-3">
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B7280]">Status</label>
              <select
                value={statusValue}
                onChange={(event) => setStatusValue(event.target.value)}
                className="border-0 border-b-2 border-[#D1D5DB] bg-transparent px-0 py-1 font-mono text-[12px] outline-none focus:border-[#0066FF]"
              >
                <option>OPEN</option>
                <option>REVIEWED</option>
                <option>CLOSED</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="h-10 border border-[#0066FF] bg-[#0066FF] px-4 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-white"
            >
              Mark as Reviewed
            </button>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

export default AlertsPage