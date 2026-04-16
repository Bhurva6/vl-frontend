import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import AlertBadge from '@/components/ui/AlertBadge'
import ChartContainer from '@/components/ui/ChartContainer'
import DataTable from '@/components/ui/DataTable'
import SkeletonCard from '@/components/ui/SkeletonCard'
import SkeletonChart from '@/components/ui/SkeletonChart'
import { Card } from '@/components/ui/card'
import StatusBadge from '@/components/ui/StatusBadge'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'

const TobaccoDetectionPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()

  const rows = data?.tobaccoDetections ?? []
  const byZone = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.zone] = (acc[row.zone] ?? 0) + 1
    return acc
  }, {})

  const zoneData = Object.entries(byZone).map(([zone, count]) => ({ zone, count }))
  const hourData = rows.map((row) => ({ hour: row.dateTime.slice(11, 13), count: 1 }))

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm font-semibold text-red-700">ZERO TOLERANCE</div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
          [
            ['Detections Today', String(rows.length)],
            ['Unique Workers Flagged', '6'],
            ['Repeat Offenders', '2'],
            ['Cameras Active', '7'],
          ].map(([label, value]) => (
            <Card key={label}><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-3xl font-bold text-[#1A1A2E]">{value}</p></Card>
          ))
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ChartContainer title="Detections by Zone">
          {isLoading ? <SkeletonChart height={320} /> : (
            <>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={zoneData}>
                  <XAxis dataKey="zone" />
                  <YAxis />
                  <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(15,23,42,0.12)', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="count" fill="#EF4444" animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
            </>
          )}
        </ChartContainer>

        <ChartContainer title="Detections by Hour">
          {isLoading ? <SkeletonChart height={320} /> : (
            <>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={hourData}>
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(15,23,42,0.12)', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="count" fill="#1A1A2E" animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
            </>
          )}
        </ChartContainer>
      </div>

      <DataTable
        rows={rows}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        columns={[
          { key: 'id', label: '#', sortable: true },
          { key: 'dateTime', label: 'DateTime', sortable: true },
          { key: 'zone', label: 'Zone', sortable: true },
          { key: 'camera', label: 'Camera', sortable: true },
          { key: 'confidenceScore', label: 'Confidence Score', sortable: true },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (row) => row.status === 'New' ? <StatusBadge label="New" type="danger" pulse /> : row.status === 'Reviewed' ? <StatusBadge label="Reviewed" type="warning" /> : <StatusBadge label="Actioned" type="success" />,
          },
          { key: 'alertType', label: 'Type', render: () => <AlertBadge label="Tobacco Detected" /> },
        ]}
      />
    </div>
  )
}

export default TobaccoDetectionPage
