import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
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

const chartTooltip = {
  background: '#FFFFFF',
  borderRadius: 2,
  border: '1px solid #E5E7EB',
  boxShadow: '0 16px 36px -20px rgba(10,10,10,0.24)',
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: 11,
}

const kpis: KPIItem[] = [
  { label: 'HELMET RATE', value: '89.1%', delta: '▲ 1.2%', deltaTone: 'up', borderTone: 'green' },
  { label: 'VEST RATE', value: '87.2%', delta: '▼ 0.8%', deltaTone: 'down', borderTone: 'amber' },
  { label: 'VIOLATIONS TODAY', value: '27', delta: '▼ 12%', deltaTone: 'up', borderTone: 'red' },
  { label: 'WORST ZONE', value: 'MACHINE LINE', delta: '69%', deltaTone: 'down', borderTone: 'red' },
]

const getComplianceColor = (value: number) => {
  if (value > 90) return '#00B341'
  if (value >= 70) return '#FF6B00'
  return '#E5000A'
}

const PPECompliancePage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const applyVersion = useFilterStore((state) => state.applyVersion)

  const zoneRows = data?.zoneCompliance ?? []
  const hourlyRows = data?.hourlyCompliance ?? []
  const sevenDay = useMemo(
    () => (data?.dailyHeadcount ?? []).slice(-7).map((d, index) => ({ date: d.date, compliance: 82 + (index % 5) * 2.4 })),
    [data],
  )

  const violations = (data?.alertRecords ?? [])
    .filter((a) => a.alertType === 'PPE Violation')
    .slice(0, 16)
    .map((a, index) => ({
      id: index + 1,
      time: a.dateTime,
      zone: a.cameraZone.split('/')[0]?.trim() ?? 'Production Floor',
      camera: a.cameraZone.split('/')[1]?.trim() ?? 'Camera 1',
      violation: index % 3 === 0 ? 'No Helmet' : index % 3 === 1 ? 'No Vest' : 'Both Missing',
      status: index % 3 === 0 ? 'OPEN' : index % 3 === 1 ? 'REVIEWED' : 'CLEARED',
      image: a.image,
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
        <SkeletonChart height={320} />
        <SkeletonTable />
      </div>
    )
  }

  return (
    <div className="page-fade-in space-y-8" key={applyVersion}>
      <KPIStrip items={kpis} />

      <div className="grid gap-8 xl:grid-cols-2">
        <ChartContainer title="Compliance by Zone">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={zoneRows} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <YAxis type="category" dataKey="zone" width={120} tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <Tooltip contentStyle={chartTooltip} />
              <Bar dataKey="value" animationDuration={800}>
                {zoneRows.map((entry) => (
                  <Cell key={entry.zone} fill={getComplianceColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Hourly Compliance Today">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={hourlyRows}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <Tooltip contentStyle={chartTooltip} />
              <Line dataKey="helmetPct" stroke="#0066FF" strokeWidth={2} dot={false} activeDot={{ r: 3 }} animationDuration={800} />
              <Line dataKey="vestPct" stroke="#FF6B00" strokeWidth={2} dot={false} activeDot={{ r: 3 }} animationDuration={800} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <ChartContainer title="7-day Compliance Trend">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={sevenDay}>
            <CartesianGrid vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
            <YAxis domain={[60, 100]} tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
            <Tooltip contentStyle={chartTooltip} />
            <Area
              dataKey="compliance"
              fill="#0066FF"
              fillOpacity={0.08}
              stroke="#0066FF"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      <section className="space-y-3">
        <SectionHeader title="Violations Log" />
        <DataTable
          rows={violations}
          rowKey={(row) => row.id}
          columns={[
            { key: 'id', label: '#', sortable: true },
            { key: 'time', label: 'TIME', sortable: true, render: (row) => <span className="font-mono">{row.time}</span> },
            { key: 'zone', label: 'ZONE', sortable: true },
            { key: 'camera', label: 'CAMERA', sortable: true, render: (row) => <span className="font-mono">{row.camera}</span> },
            { key: 'violation', label: 'VIOLATION', sortable: true, render: (row) => <AlertBadge label={row.violation} /> },
            {
              key: 'status',
              label: 'STATUS',
              sortable: true,
              render: (row) => (
                <StatusBadge
                  label={row.status}
                  type={row.status === 'OPEN' ? 'danger' : row.status === 'REVIEWED' ? 'warning' : 'success'}
                />
              ),
            },
            { key: 'image', label: 'IMAGE', sortable: true, render: (row) => <span className="font-mono">{row.image}</span> },
          ]}
        />
      </section>
    </div>
  )
}

export default PPECompliancePage