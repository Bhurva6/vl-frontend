import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartContainer from '@/components/ui/ChartContainer'
import DataTable from '@/components/ui/DataTable'
import SkeletonCard from '@/components/ui/SkeletonCard'
import SkeletonChart from '@/components/ui/SkeletonChart'
import StatusBadge from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/card'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'

const PackingEfficiencyPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const rows = data?.packingEfficiency ?? []

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
          [
            ['Efficiency Rate Today', '82.3%'],
            ['Workers Present Avg', '26'],
            ['Idle Time Detected', '74 min'],
            ['Boxes Packed', '1,320'],
          ].map(([label, value]) => (
            <Card key={label}><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-3xl font-bold text-[#1A1A2E]">{value}</p></Card>
          ))
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ChartContainer title="Efficiency % over Time">
          {isLoading ? <SkeletonChart height={320} /> : (
            <>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={rows}>
                  <XAxis dataKey="hour" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(15,23,42,0.12)', border: '1px solid #e5e7eb' }} />
                  <Line dataKey="efficiencyPct" stroke="#00C2FF" strokeWidth={2.5} animationDuration={800} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
            </>
          )}
        </ChartContainer>

        <ChartContainer title="Worker Count by Hour">
          {isLoading ? <SkeletonChart height={320} /> : (
            <>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={rows}>
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(15,23,42,0.12)', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="workersPresent" fill="#1A1A2E" animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
            </>
          )}
        </ChartContainer>
      </div>

      <DataTable
        rows={rows}
        rowKey={(row) => row.hour}
        isLoading={isLoading}
        columns={[
          { key: 'hour', label: 'Time', sortable: true },
          { key: 'workersPresent', label: 'Workers Present', sortable: true },
          { key: 'efficiencyPct', label: 'Efficiency %', sortable: true },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (row) => row.status === 'Excellent' ? <StatusBadge label="Excellent" type="success" /> : row.status === 'Good' ? <StatusBadge label="Good" type="info" /> : <StatusBadge label="Needs Attention" type="warning" />,
          },
          { key: 'notes', label: 'Notes', sortable: true },
        ]}
      />
    </div>
  )
}

export default PackingEfficiencyPage
