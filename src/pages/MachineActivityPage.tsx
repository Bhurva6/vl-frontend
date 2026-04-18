import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartContainer from '@/components/ui/ChartContainer'
import DataTable from '@/components/ui/DataTable'
import KPIStrip, { type KPIItem } from '@/components/ui/KPIStrip'
import SectionHeader from '@/components/ui/SectionHeader'
import SkeletonChart from '@/components/ui/SkeletonChart'
import SkeletonKPI from '@/components/ui/SkeletonKPI'
import SkeletonTable from '@/components/ui/SkeletonTable'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'
import { useFilterStore } from '@/store/filterStore'

const kpis: KPIItem[] = [
  { label: 'ACTIVE NOW', value: '4', delta: '—', deltaTone: 'neutral', borderTone: 'blue' },
  { label: 'IDLE >10MIN', value: '2', delta: '▲ 1 EVENT', deltaTone: 'down', borderTone: 'amber' },
  { label: 'AVG UPTIME', value: '76.1%', delta: '▼ 4.5%', deltaTone: 'down', borderTone: 'red' },
  { label: 'DOWNTIME EVENTS', value: '11', delta: '▼ 8%', deltaTone: 'up', borderTone: 'green' },
]

const tooltip = {
  background: '#FFFFFF',
  borderRadius: 2,
  border: '1px solid #E5E7EB',
  boxShadow: '0 16px 36px -20px rgba(10,10,10,0.24)',
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: 11,
}

const MachineActivityPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const applyVersion = useFilterStore((state) => state.applyVersion)

  const machines = data?.machineActivity ?? []
  const downtimeRows = machines.map((row, index) => ({
    id: index + 1,
    machine: row.machine,
    start: `${String(8 + index).padStart(2, '0')}:10`,
    end: `${String(9 + index).padStart(2, '0')}:05`,
    duration: `${row.offMin} MIN`,
    zone: index % 2 === 0 ? 'Machine Line' : 'Production Floor',
    camera: 'Machine Line Cam',
  }))

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
        <SkeletonChart height={320} />
        <SkeletonTable />
      </div>
    )
  }

  return (
    <div className="page-fade-in space-y-8" key={applyVersion}>
      <KPIStrip items={kpis} />

      <ChartContainer title="Shift Machine Timeline">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={machines} layout="vertical" stackOffset="none" margin={{ left: 20 }}>
            <CartesianGrid vertical={false} stroke="#F3F4F6" />
            <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
            <YAxis type="category" dataKey="machine" width={140} tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
            <Tooltip contentStyle={tooltip} />
            <Legend align="left" verticalAlign="bottom" wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
            <Bar dataKey="activeMin" stackId="a" name="ACTIVE" fill="#0066FF" radius={0} animationDuration={800} />
            <Bar dataKey="idleMin" stackId="a" name="IDLE" fill="#FF6B00" radius={0} animationDuration={800} />
            <Bar dataKey="offMin" stackId="a" name="OFF" fill="#9CA3AF" radius={0} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <section className="space-y-3">
        <SectionHeader title="Downtime Events Log" />
        <DataTable
          rows={downtimeRows}
          rowKey={(row) => row.id}
          columns={[
            { key: 'id', label: '#', sortable: true },
            { key: 'machine', label: 'MACHINE', sortable: true },
            { key: 'start', label: 'START', sortable: true, render: (row) => <span className="font-mono">{row.start}</span> },
            { key: 'end', label: 'END', sortable: true, render: (row) => <span className="font-mono">{row.end}</span> },
            { key: 'duration', label: 'DURATION', sortable: true, render: (row) => <span className="font-mono">{row.duration}</span> },
            { key: 'zone', label: 'ZONE', sortable: true },
            { key: 'camera', label: 'CAMERA', sortable: true, render: (row) => <span className="font-mono">{row.camera}</span> },
          ]}
        />
      </section>
    </div>
  )
}

export default MachineActivityPage