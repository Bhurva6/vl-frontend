import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
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
  { label: 'EFFICIENCY RATE', value: '82.3%', delta: '▲ 1.8%', deltaTone: 'up', borderTone: 'green' },
  { label: 'AVG WORKERS PRESENT', value: '26', delta: '—', deltaTone: 'neutral', borderTone: 'blue' },
  { label: 'IDLE TIME', value: '74 MIN', delta: '▼ 5%', deltaTone: 'up', borderTone: 'amber' },
  { label: 'SHIFT TARGET MET', value: 'YES', delta: 'ON TRACK', deltaTone: 'up', borderTone: 'green' },
]

const tooltip = {
  background: '#FFFFFF',
  borderRadius: 2,
  border: '1px solid #E5E7EB',
  boxShadow: '0 16px 36px -20px rgba(10,10,10,0.24)',
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: 11,
}

const PackingEfficiencyPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const applyVersion = useFilterStore((state) => state.applyVersion)
  const rows = data?.packingEfficiency ?? []

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
        <ChartContainer title="Efficiency Hourly Trend">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={rows}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <Tooltip contentStyle={tooltip} />
              <Line dataKey="efficiencyPct" stroke="#0066FF" strokeWidth={2} dot={false} activeDot={{ r: 3 }} animationDuration={800} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Packing Bay Worker Count">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={rows}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <Tooltip contentStyle={tooltip} />
              <Bar dataKey="workersPresent" fill="#0A0A0A" radius={0} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <section className="space-y-3">
        <SectionHeader title="Efficiency Log" />
        <DataTable
          rows={rows}
          rowKey={(row) => row.hour}
          columns={[
            { key: 'hour', label: 'TIME', sortable: true, render: (row) => <span className="font-mono">{row.hour}</span> },
            { key: 'workersPresent', label: 'WORKERS', sortable: true, render: (row) => <span className="font-mono">{row.workersPresent}</span> },
            { key: 'efficiencyPct', label: 'EFFICIENCY%', sortable: true, render: (row) => <span className="font-mono">{row.efficiencyPct}</span> },
            {
              key: 'status',
              label: 'STATUS',
              sortable: true,
              render: (row) =>
                row.status === 'Excellent' ? (
                  <StatusBadge label="ON TARGET" type="success" />
                ) : row.status === 'Good' ? (
                  <StatusBadge label="STABLE" type="info" />
                ) : (
                  <StatusBadge label="ATTENTION" type="warning" />
                ),
            },
          ]}
        />
      </section>
    </div>
  )
}

export default PackingEfficiencyPage