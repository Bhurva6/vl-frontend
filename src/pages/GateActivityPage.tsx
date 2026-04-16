import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartContainer from '@/components/ui/ChartContainer'
import DataTable from '@/components/ui/DataTable'
import SkeletonCard from '@/components/ui/SkeletonCard'
import SkeletonChart from '@/components/ui/SkeletonChart'
import StatusBadge from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/card'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'

const GateActivityPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const rows = data?.gateEvents ?? []

  const grouped = rows.reduce<Record<string, { hour: string; in: number; out: number }>>((acc, row) => {
    const hour = row.dateTime.slice(11, 13)
    if (!acc[hour]) acc[hour] = { hour, in: 0, out: 0 }
    if (row.direction === 'IN') acc[hour].in += row.count
    else acc[hour].out += row.count
    return acc
  }, {})

  const chartData = Object.values(grouped).slice(0, 12)

  const heatRows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, rowIdx) => ({
    day,
    values: Array.from({ length: 12 }, (_, col) => 8 + rowIdx * 2 + (col % 6) * 3),
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
          [
            ['Total Entries', '432'],
            ['Total Exits', '401'],
            ['Peak Entry Hour', '09:00'],
            ['Tailgating Alerts', '9'],
          ].map(([label, value]) => (
            <Card key={label}><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-3xl font-bold text-[#1A1A2E]">{value}</p></Card>
          ))
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ChartContainer title="Hourly Entries vs Exits">
          {isLoading ? <SkeletonChart height={320} /> : (
            <>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData}>
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(15,23,42,0.12)', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="in" fill="#00C2FF" animationDuration={800} />
                  <Bar dataKey="out" fill="#1A1A2E" animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
            </>
          )}
        </ChartContainer>

        <ChartContainer title="7 Days x 12 Hours Heatmap">
          {isLoading ? <SkeletonChart height={320} /> : (
            <div className="space-y-2">
              {heatRows.map((row) => (
                <div key={row.day} className="grid grid-cols-[50px_repeat(12,minmax(0,1fr))] gap-1">
                  <span className="text-xs font-semibold text-gray-600">{row.day}</span>
                  {row.values.map((value, idx) => (
                    <div key={idx} className="rounded-sm bg-blue-100 text-center text-[10px] text-blue-700" style={{ opacity: Math.min(1, value / 40) }}>
                      {value}
                    </div>
                  ))}
                </div>
              ))}
              <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
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
          { key: 'direction', label: 'Direction', sortable: true },
          { key: 'count', label: 'Count', sortable: true },
          { key: 'camera', label: 'Camera', sortable: true },
          {
            key: 'tailgating',
            label: 'Flag',
            sortable: true,
            render: (row) => row.tailgating ? <StatusBadge label="Tailgating" type="danger" /> : <StatusBadge label="Clear" type="success" />,
          },
        ]}
      />
    </div>
  )
}

export default GateActivityPage
