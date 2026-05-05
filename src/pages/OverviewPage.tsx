import { useMemo } from 'react'
import { format, subDays } from 'date-fns'
import { Link } from 'react-router-dom'
import {
  Bar, BarChart, CartesianGrid, Cell, Legend,
  Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import AlertBadge from '@/components/ui/AlertBadge'
import ChartContainer from '@/components/ui/ChartContainer'
import DataTable from '@/components/ui/DataTable'
import KPIStrip from '@/components/ui/KPIStrip'
import SectionHeader from '@/components/ui/SectionHeader'
import SkeletonChart from '@/components/ui/SkeletonChart'
import SkeletonKPI from '@/components/ui/SkeletonKPI'
import SkeletonTable from '@/components/ui/SkeletonTable'
import StatusBadge from '@/components/ui/StatusBadge'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'

const TT = { fontFamily: 'IBM Plex Mono', fontSize: 11, border: '1px solid #E5E7EB', borderRadius: 0 }

const TYPE_LABELS: Record<string, string> = {
  watchman_asleep:    'Watchman Asleep',
  watchman_absent:    'Watchman Absent',
  phone_usage:        'Phone Usage',
  intrusion:          'Intrusion',
  machine_status:     'Machine Status',
  truck_anpr:         'Truck ANPR',
  gate_detection:     'Gate Detection',
  gate:               'Gate Detection',
  presence_detection: 'Presence',
  presence:           'Presence',
}

const STATUS_COLORS: Record<string, string> = {
  Open: '#E5000A',
  Reviewed: '#FF6B00',
  Closed: '#00B341',
}

const OverviewPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()

  const records = data?.alertRecords ?? []

  const kpis = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayCount = records.filter(r => r.date_time.startsWith(today)).length
    const openCount = records.filter(r => r.status === 'Open').length
    return [
      { label: 'TOTAL ALERTS', value: String(records.length), delta: `${todayCount} today`, deltaTone: 'neutral' as const, borderTone: 'blue' as const },
      { label: 'OPEN', value: String(openCount), delta: `${Math.round((openCount / Math.max(records.length, 1)) * 100)}%`, deltaTone: 'down' as const, borderTone: 'red' as const },
      { label: 'WATCHMAN ALERTS', value: String(records.filter(r => r.category === 'WATCHMAN').length), borderTone: 'red' as const },
      { label: 'PHONE USAGE', value: String(records.filter(r => r.category === 'PHONE').length), borderTone: 'amber' as const },
      { label: 'INTRUSION', value: String(records.filter(r => r.category === 'INTRUSION').length), borderTone: 'rose' as const },
      { label: 'MACHINE ALERTS', value: String(records.filter(r => r.category === 'MACHINE').length), borderTone: 'blue' as const },
      { label: 'TRUCK ANPR', value: String(records.filter(r => r.category === 'ANPR').length), borderTone: 'green' as const },
      { label: 'GATE EVENTS', value: String(records.filter(r => r.category === 'GATE').length), borderTone: 'amber' as const },
      { label: 'PRESENCE', value: String(records.filter(r => r.category === 'PRESENCE').length), borderTone: 'blue' as const },
    ]
  }, [records])

  const typeChartData = useMemo(() =>
    Object.entries(TYPE_LABELS).map(([type, name]) => ({
      name,
      count: records.filter(r => r.alert_type === type).length,
    })),
    [records],
  )

  const statusChartData = useMemo(() =>
    ['Open', 'Reviewed', 'Closed'].map(s => ({
      name: s,
      value: records.filter(r => r.status === s).length,
      fill: STATUS_COLORS[s],
    })),
    [records],
  )

  const dailyTrend = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i)
      const dateStr = format(d, 'yyyy-MM-dd')
      return {
        date: format(d, 'MMM dd'),
        total: records.filter(r => r.date_time.startsWith(dateStr)).length,
        open: records.filter(r => r.date_time.startsWith(dateStr) && r.status === 'Open').length,
      }
    }),
    [records],
  )

  const recentAlerts = records.slice(0, 8)

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="overflow-x-auto border-y border-[#E5E7EB]">
          <div className="flex min-w-[1400px] divide-x divide-[#E5E7EB]">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonKPI key={i} />)}
          </div>
        </div>
        <div className="grid gap-8 xl:grid-cols-2">
          <SkeletonChart height={280} />
          <SkeletonChart height={280} />
        </div>
        <SkeletonChart height={240} />
        <SkeletonTable />
      </div>
    )
  }

  return (
    <div className="page-fade-in space-y-8">
      <KPIStrip items={kpis} />

      <div className="grid gap-8 xl:grid-cols-2">
        <ChartContainer title="Alerts by Type">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={typeChartData} layout="vertical" margin={{ left: 120 }}>
              <CartesianGrid horizontal={false} stroke="#F3F4F6" />
              <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <YAxis type="category" dataKey="name" width={115} tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="count" fill="#0066FF" radius={0} animationDuration={700} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Alert Status">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusChartData} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={2}>
                {statusChartData.map(entry => <Cell key={entry.name} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={TT} formatter={(value, name) => [value, name]} />
              <Legend iconType="square" wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <ChartContainer title="Daily Alert Trend — Last 7 Days">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={dailyTrend}>
            <CartesianGrid vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
            <YAxis tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
            <Tooltip contentStyle={TT} />
            <Legend iconType="square" wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
            <Line dataKey="total" stroke="#0066FF" strokeWidth={2} dot={false} activeDot={{ r: 3 }} animationDuration={700} name="Total" />
            <Line dataKey="open" stroke="#E5000A" strokeWidth={2} dot={false} activeDot={{ r: 3 }} animationDuration={700} name="Open" />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <section className="space-y-3">
        <SectionHeader
          title="Recent Alerts"
          action={<Link to="/alerts" className="font-mono text-[11px] uppercase tracking-widest text-[#0066FF] hover:underline">View all →</Link>}
        />
        <DataTable
          rows={recentAlerts}
          rowKey={r => r.id}
          showSearch={false}
          columns={[
            { key: 'id', label: '#', sortable: true },
            { key: 'date_time', label: 'DATETIME', sortable: true, render: r => <span className="font-mono">{String(r.date_time)}</span> },
            { key: 'store_code', label: 'STORE', sortable: true },
            { key: 'camera', label: 'CAMERA', sortable: true },
            { key: 'alert_type', label: 'TYPE', sortable: true, render: r => <AlertBadge label={String(r.alert_type)} /> },
            {
              key: 'status', label: 'STATUS', sortable: true, render: r => {
                let type: 'danger' | 'warning' | 'success' = 'success'
                if (r.status === 'Open') type = 'danger'
                else if (r.status === 'Reviewed') type = 'warning'
                return <StatusBadge label={String(r.status).toUpperCase()} type={type} />
              },
            },
          ]}
        />
      </section>
    </div>
  )
}

export default OverviewPage
