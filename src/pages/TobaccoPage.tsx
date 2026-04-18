import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
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

const tooltip = {
  background: '#FFFFFF',
  borderRadius: 2,
  border: '1px solid #E5E7EB',
  boxShadow: '0 16px 36px -20px rgba(10,10,10,0.24)',
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: 11,
}

const kpis: KPIItem[] = [
  { label: 'DETECTIONS TODAY', value: '8', delta: '▲ 1 NEW', deltaTone: 'down', borderTone: 'red' },
  { label: 'UNIQUE WORKERS', value: '6', delta: '—', deltaTone: 'neutral', borderTone: 'blue' },
  { label: 'REPEAT OFFENDERS', value: '2', delta: 'HIGH RISK', deltaTone: 'down', borderTone: 'rose' },
  { label: 'CAMERAS ACTIVE', value: '6', delta: '100% ONLINE', deltaTone: 'up', borderTone: 'green' },
]

const TobaccoPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const applyVersion = useFilterStore((state) => state.applyVersion)

  const detections = data?.tobaccoDetections ?? []

  const hourly = Array.from({ length: 12 }, (_, index) => {
    const hour = `${String(7 + index).padStart(2, '0')}:00`
    return {
      hour,
      byHour: detections.filter((item) => item.dateTime.slice(11, 13) === String(7 + index).padStart(2, '0')).length,
      byZone: detections.filter((item) => item.zone === (index % 2 === 0 ? 'Production Floor' : 'Machine Line')).length,
    }
  })

  const tableRows = detections.map((item) => ({
    id: item.id,
    datetime: item.dateTime,
    zone: item.zone,
    camera: item.camera,
    confidence: `${item.confidenceScore}%`,
    status: item.status,
  }))

  if (isLoading) {
    return (
      <div className="space-y-8" key={applyVersion}>
        <div className="border-t-2 border-[#E5000A] pt-2" />
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
    <div className="page-fade-in space-y-8 border-t-2 border-[#E5000A] pt-3" key={applyVersion}>
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#E5000A]">ZERO TOLERANCE POLICY ACTIVE</p>

      <KPIStrip items={kpis} />

      <ChartContainer title="Detection Trend by Hour and Zone">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={hourly}>
            <CartesianGrid vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="hour" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
            <YAxis tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
            <Tooltip contentStyle={tooltip} />
            <Legend
              align="left"
              verticalAlign="bottom"
              wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }}
            />
            <Bar dataKey="byHour" name="HOURLY" fill="#E5000A" radius={0} animationDuration={800} />
            <Bar dataKey="byZone" name="ZONE CLUSTER" fill="#FF6B00" radius={0} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <section className="space-y-3">
        <SectionHeader title="Detection Log" />
        <DataTable
          rows={tableRows}
          rowKey={(row) => row.id}
          columns={[
            { key: 'id', label: '#', sortable: true },
            { key: 'datetime', label: 'DATETIME', sortable: true, render: (row) => <span className="font-mono">{row.datetime}</span> },
            { key: 'zone', label: 'ZONE', sortable: true },
            { key: 'camera', label: 'CAMERA', sortable: true, render: (row) => <span className="font-mono">{row.camera}</span> },
            { key: 'confidence', label: 'CONFIDENCE SCORE', sortable: true, render: (row) => <span className="font-mono">{row.confidence}</span> },
            {
              key: 'status',
              label: 'STATUS',
              sortable: true,
              render: (row) =>
                row.status === 'New' ? (
                  <StatusBadge label="NEW" type="danger" pulse />
                ) : row.status === 'Reviewed' ? (
                  <StatusBadge label="REVIEWED" type="warning" />
                ) : (
                  <StatusBadge label="ACTIONED" type="success" />
                ),
            },
          ]}
        />
      </section>
    </div>
  )
}

export default TobaccoPage