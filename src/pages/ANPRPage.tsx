import { useMemo } from 'react'
import DataTable from '@/components/ui/DataTable'
import KPIStrip, { type KPIItem } from '@/components/ui/KPIStrip'
import SectionHeader from '@/components/ui/SectionHeader'
import SkeletonKPI from '@/components/ui/SkeletonKPI'
import SkeletonTable from '@/components/ui/SkeletonTable'
import StatusBadge from '@/components/ui/StatusBadge'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'
import { useFilterStore } from '@/store/filterStore'

const ANPRPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const applyVersion = useFilterStore((state) => state.applyVersion)
  const rows = data?.truckLog ?? []

  const kpis: KPIItem[] = useMemo(() => {
    const verified = rows.filter((row) => row.verified).length
    return [
      { label: 'TRUCKS TODAY', value: String(rows.length), delta: '▲ 2', deltaTone: 'up', borderTone: 'blue' },
      { label: 'VERIFIED PLATES', value: String(verified), delta: '96% ACCURACY', deltaTone: 'up', borderTone: 'green' },
      { label: 'UNRECOGNIZED', value: String(rows.length - verified), delta: 'NEEDS REVIEW', deltaTone: 'down', borderTone: 'amber' },
      { label: 'AVG TURNAROUND', value: '34 MIN', delta: '▼ 3 MIN', deltaTone: 'up', borderTone: 'blue' },
    ]
  }, [rows])

  if (isLoading) {
    return (
      <div className="space-y-8" key={applyVersion}>
        <div className="overflow-x-auto border-y border-[#E5E7EB]">
          <div className="flex min-w-[900px] divide-x divide-[#E5E7EB]">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonKPI key={index} />
            ))}
          </div>
        </div>
        <SkeletonTable />
      </div>
    )
  }

  return (
    <div className="page-fade-in space-y-8" key={applyVersion}>
      <KPIStrip items={kpis} />

      <section className="space-y-3">
        <SectionHeader title="Truck Log" />
        <DataTable
          rows={rows}
          rowKey={(row) => row.id}
          searchPlaceholder="Search by plate number..."
          columns={[
            { key: 'id', label: '#', sortable: true },
            { key: 'dateTime', label: 'TIME', sortable: true, render: (row) => <span className="font-mono">{row.dateTime}</span> },
            { key: 'plateNumber', label: 'PLATE', sortable: true, render: (row) => <span className="font-mono">{row.plateNumber}</span> },
            { key: 'verified', label: 'VERIFIED', sortable: true, render: (row) => <StatusBadge label={row.verified ? 'YES' : 'NO'} type={row.verified ? 'success' : 'danger'} /> },
            { key: 'entryTime', label: 'ENTRY', sortable: true, render: (row) => <span className="font-mono">{row.entryTime}</span> },
            { key: 'exitTime', label: 'EXIT', sortable: true, render: (row) => <span className="font-mono">{row.exitTime}</span> },
            { key: 'duration', label: 'DURATION', sortable: true, render: (row) => <span className="font-mono">{row.duration}</span> },
            { key: 'weightKg', label: 'WEIGHT', sortable: true, render: (row) => <span className="font-mono">{row.weightKg}</span> },
            {
              key: 'status',
              label: 'STATUS',
              sortable: true,
              render: (row) => (
                <StatusBadge
                  label={row.status.toUpperCase()}
                  type={row.status === 'Cleared' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger'}
                />
              ),
            },
          ]}
        />
      </section>
    </div>
  )
}

export default ANPRPage