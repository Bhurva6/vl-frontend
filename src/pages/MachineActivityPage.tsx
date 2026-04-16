import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartContainer from '@/components/ui/ChartContainer'
import DataTable from '@/components/ui/DataTable'
import SkeletonCard from '@/components/ui/SkeletonCard'
import SkeletonChart from '@/components/ui/SkeletonChart'
import { Card } from '@/components/ui/card'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'

const MachineActivityPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()

  const rows = data?.machineActivity ?? []

  const downtimes = rows.map((row, idx) => ({
    machine: row.machine,
    start: `${9 + idx}:10`,
    end: `${10 + idx}:05`,
    duration: `${row.offMin} min`,
    zone: idx % 2 === 0 ? 'Machine Line' : 'Production Floor',
    camera: 'Machine Line Cam',
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
          [
            ['Machines Active Now', '4'],
            ['Machines Idle > 10 min', '2'],
            ['Avg Uptime Today', '76.1%'],
            ['Downtime Events', '11'],
          ].map(([label, value]) => (
            <Card key={label}><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-3xl font-bold text-[#1A1A2E]">{value}</p></Card>
          ))
        )}
      </div>

      <ChartContainer title="Machine Activity Timeline (Shift)">
        {isLoading ? <SkeletonChart height={320} /> : (
          <>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={rows} layout="vertical" stackOffset="expand">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="machine" width={120} />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(15,23,42,0.12)', border: '1px solid #e5e7eb' }} />
                <Legend />
                <Bar dataKey="activeMin" stackId="a" fill="#22C55E" animationDuration={800} name="Active" />
                <Bar dataKey="idleMin" stackId="a" fill="#F59E0B" animationDuration={800} name="Idle" />
                <Bar dataKey="offMin" stackId="a" fill="#EF4444" animationDuration={800} name="Off" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
          </>
        )}
      </ChartContainer>

      <DataTable
        rows={downtimes}
        rowKey={(row) => row.machine}
        isLoading={isLoading}
        columns={[
          { key: 'machine', label: 'Machine', sortable: true },
          { key: 'start', label: 'Start Time', sortable: true },
          { key: 'end', label: 'End Time', sortable: true },
          { key: 'duration', label: 'Duration', sortable: true },
          { key: 'zone', label: 'Zone', sortable: true },
          { key: 'camera', label: 'Camera', sortable: true },
        ]}
      />
    </div>
  )
}

export default MachineActivityPage
