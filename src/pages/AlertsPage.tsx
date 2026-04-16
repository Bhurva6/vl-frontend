import { Download } from 'lucide-react'
import { useMemo, useState } from 'react'
import AlertBadge from '@/components/ui/AlertBadge'
import DataTable from '@/components/ui/DataTable'
import Modal from '@/components/ui/Modal'
import SkeletonTable from '@/components/ui/SkeletonTable'
import StatusBadge from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'
import type { AlertRecord } from '@/types'

const tabs = ['All', 'PPE', 'Machine', 'Tobacco', 'Gate', 'ANPR', 'Packing'] as const

const AlertsPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const [active, setActive] = useState<(typeof tabs)[number]>('All')
  const [selected, setSelected] = useState<AlertRecord | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filtered = useMemo(() => {
    const source = data?.alertRecords ?? []
    if (active === 'All') return source
    return source.filter((s) => s.category === active)
  }, [data, active])

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))

  const exportCsv = () => {
    const header = 'Id,DateTime,Camera/Zone,Alert Type,Severity,Status,Image'
    const lines = filtered.map((r) => `${r.id},${r.dateTime},${r.cameraZone},${r.alertType},${r.severity},${r.status},${r.image}`)
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'factory-alerts.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={active} onValueChange={(v) => setActive(v as (typeof tabs)[number])}>
          <TabsList>{tabs.map((tab) => <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>)}</TabsList>
        </Tabs>
        <Button variant="outline" onClick={exportCsv} className="gap-2"><Download className="h-4 w-4" />CSV export</Button>
      </div>

      {isLoading ? (
        <SkeletonTable />
      ) : (
        <DataTable<AlertRecord>
          rows={pageRows}
          rowKey={(row) => row.id}
          onRowClick={(row: AlertRecord) => setSelected(row)}
          columns={[
            { key: 'id', label: '#', sortable: true },
            { key: 'dateTime', label: 'DateTime', sortable: true },
            { key: 'cameraZone', label: 'Camera/Zone', sortable: true },
            { key: 'alertType', label: 'Alert Type', sortable: true, render: (r: AlertRecord) => <AlertBadge label={r.alertType} /> },
            { key: 'severity', label: 'Severity', sortable: true, render: (r: AlertRecord) => r.severity === 'HIGH' ? <StatusBadge label="HIGH" type="danger" /> : r.severity === 'MEDIUM' ? <StatusBadge label="MEDIUM" type="warning" /> : <StatusBadge label="LOW" type="success" /> },
            { key: 'status', label: 'Status', sortable: true, render: (r: AlertRecord) => r.status === 'Open' ? <StatusBadge label="Open" type="danger" /> : r.status === 'Reviewed' ? <StatusBadge label="Reviewed" type="warning" /> : <StatusBadge label="Closed" type="success" /> },
            { key: 'image', label: 'Image', sortable: true },
          ]}
        />
      )}

      <div className="flex items-center justify-end gap-2">
        <Button size="sm" variant="secondary" onClick={() => setPage((v) => Math.max(1, v - 1))}>Previous</Button>
        <span className="text-sm text-gray-500">Page {page} of {pageCount}</span>
        <Button size="sm" variant="secondary" onClick={() => setPage((v) => Math.min(pageCount, v + 1))}>Next</Button>
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Alert Detail">
        {selected && (
          <div className="space-y-3 text-sm">
            <p><span className="font-semibold">DateTime:</span> {selected.dateTime}</p>
            <p><span className="font-semibold">Camera/Zone:</span> {selected.cameraZone}</p>
            <p><span className="font-semibold">Type:</span> {selected.alertType}</p>
            <p><span className="font-semibold">Image:</span> {selected.image}</p>
            <div className="h-52 rounded-xl border border-dashed border-gray-200 bg-gray-50" />
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AlertsPage
