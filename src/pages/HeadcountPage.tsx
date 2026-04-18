import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
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

const tooltip = {
  background: '#FFFFFF',
  borderRadius: 2,
  border: '1px solid #E5E7EB',
  boxShadow: '0 16px 36px -20px rgba(10,10,10,0.24)',
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: 11,
}

const HeadcountPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const applyVersion = useFilterStore((state) => state.applyVersion)

  const daily = data?.dailyHeadcount ?? []
  const latest = daily[daily.length - 1]
  const previous = daily[daily.length - 2]
  const delta = latest && previous ? (((latest.total - previous.total) / previous.total) * 100).toFixed(1) : '0.0'
  const workers = data?.workerByHelmet ?? []

  const kpis: KPIItem[] = [
    { label: 'TOTAL ON SITE', value: String(latest?.total ?? 0), delta: `▲ ${delta}%`, deltaTone: 'up', borderTone: 'blue' },
    { label: 'MORNING SHIFT', value: String(latest?.morning ?? 0), delta: '▲ 1.9%', deltaTone: 'up', borderTone: 'green' },
    { label: 'AFTERNOON SHIFT', value: String(latest?.afternoon ?? 0), delta: '▼ 0.6%', deltaTone: 'down', borderTone: 'amber' },
    { label: 'NIGHT SHIFT', value: String(latest?.night ?? 0), delta: '▲ 0.9%', deltaTone: 'up', borderTone: 'blue' },
  ]

  const byZone = workers.reduce<Record<string, number>>((acc, row) => {
    acc[row.zone] = (acc[row.zone] ?? 0) + row.count
    return acc
  }, {})

  const zoneRows = Object.entries(byZone).map(([zone, count]) => ({ zone, count }))
  const tableRows = workers.map((worker, index) => ({
    id: index + 1,
    timestamp: worker.timeStamp,
    zone: worker.zone,
    role: worker.role,
    helmet: worker.color,
    count: worker.count,
    camera: worker.camera,
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
        <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
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

      <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
        <ChartContainer title="Shift Headcount Trend">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={daily}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <Tooltip contentStyle={tooltip} />
              <Line dataKey="total" stroke="#0066FF" strokeWidth={2} dot={false} activeDot={{ r: 3 }} animationDuration={800} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Worker Distribution by Zone">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={zoneRows}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="zone" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <Tooltip contentStyle={tooltip} />
              <Bar dataKey="count" fill="#0066FF" radius={0} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <section className="space-y-3">
        <SectionHeader title="Worker Presence Log" />
        <DataTable
          rows={tableRows}
          rowKey={(row) => row.id}
          columns={[
            { key: 'id', label: '#', sortable: true },
            { key: 'timestamp', label: 'TIME', sortable: true, render: (row) => <span className="font-mono">{row.timestamp}</span> },
            { key: 'zone', label: 'ZONE', sortable: true },
            { key: 'role', label: 'ROLE', sortable: true },
            { key: 'helmet', label: 'HELMET', sortable: true },
            { key: 'count', label: 'COUNT', sortable: true, render: (row) => <span className="font-mono">{row.count}</span> },
            { key: 'camera', label: 'CAMERA', sortable: true, render: (row) => <span className="font-mono">{row.camera}</span> },
          ]}
        />
      </section>
    </div>
  )
}

export default HeadcountPage