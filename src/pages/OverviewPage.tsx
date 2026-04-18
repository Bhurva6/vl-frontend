import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link } from 'react-router-dom'
import AlertBadge from '@/components/ui/AlertBadge'
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

type Metric = 'total' | 'helmetPct' | 'machineUptime' | 'packingEfficiency'

const donutColors = ['#0066FF', '#0A0A0A', '#FF6B00', '#00B341'] as const
const legendColorClasses = ['bg-[#0066FF]', 'bg-[#0A0A0A]', 'bg-[#FF6B00]', 'bg-[#00B341]'] as const

const kpis: KPIItem[] = [
  { label: 'HEADCOUNT', value: '342', delta: '▲ 4.2%', deltaTone: 'up', borderTone: 'blue' },
  { label: 'PPE COMPLIANCE', value: '88.4%', delta: '▼ 2.1%', deltaTone: 'down', borderTone: 'amber' },
  { label: 'MACHINE UPTIME', value: '76.1%', delta: '▼ 4.5%', deltaTone: 'down', borderTone: 'red' },
  { label: 'PACKING EFFICIENCY', value: '82.3%', delta: '▲ 1.8%', deltaTone: 'up', borderTone: 'green' },
  { label: 'ALERTS TODAY', value: '31', delta: '▼ 33%', deltaTone: 'down', borderTone: 'red' },
  { label: 'TRUCK ENTRIES', value: '14', delta: '—', deltaTone: 'neutral', borderTone: 'blue' },
  { label: 'TOBACCO FLAGS', value: '3', delta: 'HIGH RISK', deltaTone: 'down', borderTone: 'rose' },
  { label: 'UNATTENDED ZONES', value: '5', delta: '—', deltaTone: 'neutral', borderTone: 'amber' },
]

const zoneData = [
  { zone: 'Production Floor', value: 42 },
  { zone: 'Packaging Bay', value: 28 },
  { zone: 'Entry Gate', value: 15 },
  { zone: 'Machine Line', value: 15 },
]

const OverviewPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const applyVersion = useFilterStore((state) => state.applyVersion)
  const [metric, setMetric] = useState<Metric>('total')

  const trend = useMemo(
    () =>
      (data?.dailyHeadcount ?? []).map((row, index) => ({
        date: row.date,
        total: row.total,
        helmetPct: Number((84 + (index % 6) * 1.3).toFixed(1)),
        machineUptime: Number((72 + (index % 5) * 1.1).toFixed(1)),
        packingEfficiency: Number((78 + (index % 4) * 1.7).toFixed(1)),
      })),
    [data],
  )

  const chartData = trend.map((row) => ({ ...row, displayValue: row[metric] }))
  const recentAlerts = (data?.alertRecords ?? []).slice(0, 5)

  if (isLoading) {
    return (
      <div className="space-y-8" key={applyVersion}>
        <div className="overflow-x-auto border-y border-[#E5E7EB]">
          <div className="flex min-w-[1200px] divide-x divide-[#E5E7EB]">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonKPI key={index} />
            ))}
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
          <SkeletonChart height={320} />
          <SkeletonChart height={320} />
        </div>

        <section className="space-y-3">
          <SectionHeader title="Recent Alerts" />
          <SkeletonTable />
        </section>
      </div>
    )
  }

  return (
    <div className="page-fade-in space-y-8" key={applyVersion}>
      <KPIStrip items={kpis} />

      <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
        <ChartContainer
          title="Daily Operations Trend"
          action={
            <div className="flex gap-4">
              {[
                ['total', 'Headcount'],
                ['helmetPct', 'PPE Rate'],
                ['machineUptime', 'Machine Uptime'],
                ['packingEfficiency', 'Packing'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`border-b pb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] ${
                    metric === key ? 'border-[#0066FF] text-[#0066FF]' : 'border-transparent text-[#6B7280]'
                  }`}
                  onClick={() => setMetric(key as Metric)}
                >
                  {label}
                </button>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  background: '#FFFFFF',
                  borderRadius: 2,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 16px 36px -20px rgba(10,10,10,0.24)',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: 11,
                }}
              />
              <Line
                dataKey="displayValue"
                stroke="#0066FF"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Zone Distribution">
          <div className="space-y-4">
            <div className="relative">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={zoneData}
                    dataKey="value"
                    nameKey="zone"
                    innerRadius={74}
                    outerRadius={116}
                    paddingAngle={1}
                    animationDuration={800}
                  >
                    {zoneData.map((entry, index) => (
                      <Cell key={entry.zone} fill={donutColors[index % donutColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#FFFFFF',
                      borderRadius: 2,
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 16px 36px -20px rgba(10,10,10,0.24)',
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: 11,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-[40px] font-bold text-[#0A0A0A]">100</span>
                <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#6B7280]">ZONE LOAD</span>
              </div>
            </div>

            <div className="grid gap-2">
              {zoneData.map((item, index) => (
                <div key={item.zone} className="flex items-center justify-between border-b border-[#F3F4F6] pb-2 font-mono text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 ${legendColorClasses[index % legendColorClasses.length]}`} />
                    <span>{item.zone}</span>
                  </div>
                  <span>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartContainer>
      </div>

      <section className="space-y-3">
        <SectionHeader
          title="Recent Alerts"
          action={
            <Link className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0066FF]" to="/alerts">
              View All Alerts -&gt;
            </Link>
          }
        />
        <DataTable
          rows={recentAlerts}
          rowKey={(row) => row.id}
          showSearch={false}
          columns={[
            { key: 'id', label: '#', sortable: true },
            { key: 'dateTime', label: 'DATETIME', sortable: true },
            { key: 'cameraZone', label: 'ZONE', sortable: true },
            { key: 'alertType', label: 'TYPE', sortable: true, render: (row) => <AlertBadge label={row.alertType} /> },
            {
              key: 'severity',
              label: 'SEVERITY',
              sortable: true,
              render: (row) => (
                <StatusBadge
                  label={row.severity}
                  type={row.severity === 'HIGH' ? 'danger' : row.severity === 'MEDIUM' ? 'warning' : 'success'}
                />
              ),
            },
            {
              key: 'status',
              label: 'STATUS',
              sortable: true,
              render: (row) => (
                <StatusBadge
                  label={row.status.toUpperCase()}
                  type={row.status === 'Open' ? 'danger' : row.status === 'Reviewed' ? 'warning' : 'success'}
                />
              ),
            },
          ]}
        />
      </section>
    </div>
  )
}

export default OverviewPage