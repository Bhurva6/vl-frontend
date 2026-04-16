import { useMemo } from 'react'
import DataTable from '@/components/ui/DataTable'
import SkeletonCard from '@/components/ui/SkeletonCard'
import StatusBadge from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/card'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'

const ANPRPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const rows = data?.truckLog ?? []

  const cards = useMemo(() => {
    const verified = rows.filter((r) => r.verified).length
    return [
      ['Trucks Today', String(rows.length)],
      ['Plates Verified', String(verified)],
      ['Unrecognized Plates', String(rows.length - verified)],
      ['Avg Turnaround Time', '34 min'],
    ]
  }, [rows])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : cards.map(([label, value]) => (
          <Card key={label}><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-3xl font-bold text-[#1A1A2E]">{value}</p></Card>
        ))}
      </div>

      <DataTable
        rows={rows}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        searchPlaceholder="Search by plate number..."
        columns={[
          { key: 'id', label: '#', sortable: true },
          { key: 'dateTime', label: 'DateTime', sortable: true },
          { key: 'plateNumber', label: 'Plate Number', sortable: true },
          { key: 'verified', label: 'Verified', sortable: true, render: (row) => row.verified ? <StatusBadge label="Yes" type="success" /> : <StatusBadge label="No" type="danger" /> },
          { key: 'entryTime', label: 'Entry Time', sortable: true },
          { key: 'exitTime', label: 'Exit Time', sortable: true },
          { key: 'duration', label: 'Duration', sortable: true },
          { key: 'weightKg', label: 'Weight (kg)', sortable: true },
          { key: 'status', label: 'Status', sortable: true, render: (row) => row.status === 'Cleared' ? <StatusBadge label="Cleared" type="success" /> : row.status === 'Pending' ? <StatusBadge label="Pending" type="warning" /> : <StatusBadge label="Flagged" type="danger" /> },
        ]}
      />
    </div>
  )
}

export default ANPRPage
