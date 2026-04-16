import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartContainer from '@/components/ui/ChartContainer'
import DataTable from '@/components/ui/DataTable'
import SkeletonCard from '@/components/ui/SkeletonCard'
import SkeletonChart from '@/components/ui/SkeletonChart'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'

const colorMap: Record<string, string> = {
  White: 'bg-gray-200 text-gray-800',
  Yellow: 'bg-yellow-100 text-yellow-700',
  Blue: 'bg-blue-100 text-blue-700',
  Red: 'bg-red-100 text-red-700',
  Green: 'bg-emerald-100 text-emerald-700',
}

const WorkerClassificationPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()

  const groups = data?.workerByHelmet ?? []

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          ['White', 'Yellow', 'Blue', 'Red', 'Green'].map((helmet) => {
            const count = groups.filter((g) => g.color === helmet).reduce((acc, item) => acc + item.count, 0)
            return (
              <Card key={helmet}>
                <p className="text-sm text-gray-500">{helmet} Helmet</p>
                <p className="mt-2 text-3xl font-bold text-[#1A1A2E]">{count}</p>
                <Badge className={`mt-2 ${colorMap[helmet]}`}>{helmet}</Badge>
              </Card>
            )
          })
        )}
      </div>

      <ChartContainer title="Distribution Across Zones">
        {isLoading ? (
          <SkeletonChart height={320} />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={groups}>
                <XAxis dataKey="zone" />
                <YAxis />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(15,23,42,0.12)', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="count" fill="#00C2FF" animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
          </>
        )}
      </ChartContainer>

      <DataTable
        rows={groups}
        rowKey={(row) => `${row.zone}-${row.color}-${row.timeStamp}`}
        isLoading={isLoading}
        columns={[
          { key: 'zone', label: 'Zone', sortable: true },
          { key: 'color', label: 'Helmet Colour', sortable: true },
          { key: 'count', label: 'Count', sortable: true },
          { key: 'timeStamp', label: 'Timestamp', sortable: true },
          { key: 'camera', label: 'Camera', sortable: true },
        ]}
      />
    </div>
  )
}

export default WorkerClassificationPage
