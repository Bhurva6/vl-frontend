import { useEffect, useMemo, useState } from 'react'
import AlertBadge from '@/components/ui/AlertBadge'
import DataTable from '@/components/ui/DataTable'
import Modal from '@/components/ui/Modal'
import SectionHeader from '@/components/ui/SectionHeader'
import SkeletonTable from '@/components/ui/SkeletonTable'
import StatusBadge from '@/components/ui/StatusBadge'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'
import { fetchPresignedUrl } from '@/services/imageService'
import type { AlertRecord } from '@/types'

const tabs = ['ALL', 'ANPR', 'WATCHMAN', 'PHONE', 'INTRUSION', 'MACHINE'] as const

const TAB_LABEL: Record<(typeof tabs)[number], string> = {
  ALL: 'All',
  ANPR: 'Truck ANPR',
  WATCHMAN: 'Watchman',
  PHONE: 'Phone Usage',
  INTRUSION: 'Intrusion',
  MACHINE: 'Machine',
}

const ALERT_TYPE_LABEL: Record<string, string> = {
  truck_anpr: 'Truck ANPR',
  watchman_sleeping: 'Watchman Sleeping',
  watchman_present: 'Watchman Present',
  phone_usage: 'Phone Usage',
  intrusion: 'Intrusion',
  machine_status: 'Machine Status',
}

const AlertsPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const [active, setActive] = useState<(typeof tabs)[number]>('ALL')
  const [selected, setSelected] = useState<AlertRecord | null>(null)
  const [statusValue, setStatusValue] = useState('OPEN')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)

  const filtered = useMemo(() => {
    const source = data?.alertRecords ?? []
    if (active === 'ALL') return source
    return source.filter((row) => row.category === active)
  }, [active, data])

  useEffect(() => {
    if (!selected) {
      setImageUrl(null)
      return
    }
    setImageLoading(true)
    setImageUrl(null)
    fetchPresignedUrl(selected.image_id).then((url) => {
      setImageUrl(url)
      setImageLoading(false)
    })
  }, [selected])

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
          onRowClick={(row) => {
            setSelected(row)
            setStatusValue(row.status.toUpperCase())
          }}
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

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Alert Detail">
        {selected ? (
          <div className="space-y-4">
            <div className="relative flex h-56 items-center justify-center border border-dashed border-[#E5E7EB] bg-[#F8F9FA] overflow-hidden">
              {imageLoading && (
                <span className="font-mono text-[11px] text-[#6B7280]">Loading image…</span>
              )}
              {!imageLoading && imageUrl && (
                <img
                  src={imageUrl}
                  alt="Alert snapshot"
                  className="h-full w-full object-contain"
                />
              )}
              {!imageLoading && !imageUrl && (
                <span className="font-mono text-[11px] text-[#6B7280]">Image unavailable</span>
              )}
            </div>

            <div className="grid gap-2 font-sans text-sm text-[#0A0A0A]">
              <p><span className="font-semibold">DateTime:</span> <span className="font-mono">{selected.date_time}</span></p>
              <p><span className="font-semibold">Store:</span> {selected.store_code}</p>
              <p><span className="font-semibold">Camera:</span> {selected.camera}</p>
              <p><span className="font-semibold">Type:</span> {ALERT_TYPE_LABEL[selected.alert_type] ?? selected.alert_type}</p>
              <p><span className="font-semibold">Explanation:</span> {selected.explanation}</p>
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="alert-status" className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B7280]">Status</label>
              <select
                id="alert-status"
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
