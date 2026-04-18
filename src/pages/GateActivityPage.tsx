import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartContainer from '@/components/ui/ChartContainer'
import DataTable from '@/components/ui/DataTable'
import KPIStrip, { type KPIItem } from '@/components/ui/KPIStrip'
import SectionHeader from '@/components/ui/SectionHeader'
import SkeletonChart from '@/components/ui/SkeletonChart'
import SkeletonKPI from '@/components/ui/SkeletonKPI'
import SkeletonTable from '@/components/ui/SkeletonTable'
import StatusBadge from '@/components/ui/StatusBadge'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'
import { useFilterStore } from '@/store/filterStore'

const kpis: KPIItem[] = [
  { label: 'TOTAL ENTRIES', value: '432', delta: '▲ 2.3%', deltaTone: 'up', borderTone: 'blue' },
  { label: 'TOTAL EXITS', value: '401', delta: '▲ 1.9%', deltaTone: 'up', borderTone: 'blue' },
  { label: 'PEAK HOUR', value: '09:00', delta: 'SHIFT START', deltaTone: 'neutral', borderTone: 'amber' },
  { label: 'TAILGATING ALERTS', value: '9', delta: '▼ 2', deltaTone: 'up', borderTone: 'red' },
]

const heatColors = [
  'bg-blue-50 text-blue-700',
  'bg-blue-100 text-blue-700',
  'bg-blue-200 text-blue-800',
  'bg-blue-300 text-blue-900',
] as const

const tooltip = {
  background: '#FFFFFF',
  borderRadius: 2,
  border: '1px solid #E5E7EB',
  boxShadow: '0 16px 36px -20px rgba(10,10,10,0.24)',
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: 11,
}

const GateActivityPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const applyVersion = useFilterStore((state) => state.applyVersion)
  const rows = data?.gateEvents ?? []

  const hourly = Array.from({ length: 12 }, (_, index) => {
    const hour = String(7 + index).padStart(2, '0')
    const hourRows = rows.filter((row) => row.dateTime.slice(11, 13) === hour)
    return {
      hour: `${hour}:00`,
      entries: hourRows.filter((row) => row.direction === 'IN').reduce((acc, row) => acc + row.count, 0),
      exits: hourRows.filter((row) => row.direction === 'OUT').reduce((acc, row) => acc + row.count, 0),
    }
  })

  const heatRows = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, rowIndex) => ({
    day,
    values: Array.from({ length: 12 }, (_, col) => (rowIndex + col) % 4),
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
        <div className="grid gap-8 xl:grid-cols-2">
          <SkeletonChart height={320} />
          <SkeletonChart height={320} />
        </div>
        <SkeletonTable />
      </div>
    )
  }

  return (
    <div className="page-fade-in space-y-8" key={applyVersion}>
      <KPIStrip items={kpis} />

      <div className="grid gap-8 xl:grid-cols-2">
        <ChartContainer title="Hourly Entries vs Exits">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={hourly}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <Tooltip contentStyle={tooltip} />
              <Bar dataKey="entries" fill="#0066FF" radius={0} animationDuration={800} />
              <Bar dataKey="exits" fill="#9CA3AF" radius={0} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="7 x 12 Gate Heatmap">
          <div className="grid gap-2">
            {heatRows.map((row) => (
              <div key={row.day} className="grid grid-cols-[48px_repeat(12,minmax(0,1fr))] gap-1">
                <span className="font-mono text-[10px] text-[#6B7280]">{row.day}</span>
                {row.values.map((value, index) => (
                  <div key={`${row.day}-${index}`} className={`h-6 text-center font-mono text-[10px] leading-6 ${heatColors[value]}`}>
                    {value + 1}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>

      <section className="space-y-3">
        <SectionHeader title="Gate Events" />
        <DataTable
          rows={rows}
          rowKey={(row) => row.id}
          columns={[
            { key: 'id', label: '#', sortable: true },
            { key: 'dateTime', label: 'TIME', sortable: true, render: (row) => <span className="font-mono">{row.dateTime}</span> },
            { key: 'direction', label: 'DIRECTION', sortable: true, render: (row) => <span className="font-mono">{row.direction}</span> },
            { key: 'count', label: 'COUNT', sortable: true, render: (row) => <span className="font-mono">{row.count}</span> },
            { key: 'camera', label: 'CAMERA', sortable: true, render: (row) => <span className="font-mono">{row.camera}</span> },
            {
              key: 'tailgating',
              label: 'FLAG',
              sortable: true,
              render: (row) => (row.tailgating ? <StatusBadge label="TAILGATING" type="warning" /> : <StatusBadge label="CLEAR" type="success" />),
            },
          ]}
        />
      </section>
    </div>
  )
}

export default GateActivityPage