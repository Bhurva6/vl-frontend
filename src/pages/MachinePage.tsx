import { useMemo } from 'react'
import { format, subDays } from 'date-fns'
import {
  Bar, BarChart, CartesianGrid,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
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

const MachinePage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()

  const records = (data?.alertRecords ?? []).filter(r => r.category === 'MACHINE')

  const kpis = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayCount = records.filter(r => r.date_time.startsWith(today)).length
    const openCount = records.filter(r => r.status === 'Open').length
    return [
      { label: 'TOTAL ALERTS', value: String(records.length), delta: `${todayCount} today`, deltaTone: 'down' as const, borderTone: 'blue' as const },
      { label: 'OPEN ALERTS', value: String(openCount), borderTone: 'red' as const },
      { label: 'CAMERAS MONITORED', value: String(new Set(records.map(r => r.camera)).size), deltaTone: 'neutral' as const, borderTone: 'green' as const },
    ]
  }, [records])

  const dailyData = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i)
      const dateStr = format(d, 'yyyy-MM-dd')
      return {
        date: format(d, 'MMM dd'),
        alerts: records.filter(r => r.date_time.startsWith(dateStr)).length,
      }
    }),
    [records],
  )

  const tableRows = [...records].sort((a, b) => b.date_time.localeCompare(a.date_time)).slice(0, 20)

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="overflow-x-auto border-y border-[#E5E7EB]">
          <div className="flex min-w-[600px] divide-x divide-[#E5E7EB]">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonKPI key={i} />)}
          </div>
        </div>
        <SkeletonChart height={280} />
        <SkeletonTable />
      </div>
    )
  }

  return (
    <div className="page-fade-in space-y-8">
      <KPIStrip items={kpis} />

      <ChartContainer title="Machine Alerts — Daily Trend (Last 7 Days)">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={dailyData} barCategoryGap="40%">
            <CartesianGrid vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
            <YAxis tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" allowDecimals={false} />
            <Tooltip contentStyle={TT} />
            <Bar dataKey="alerts" fill="#0066FF" name="Alerts" animationDuration={700} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <section className="space-y-3">
        <SectionHeader title="Machine Alert Log" />
        <DataTable
          rows={tableRows}
          rowKey={r => r.id}
          columns={[
            { key: 'id', label: '#', sortable: true },
            { key: 'date_time', label: 'DATETIME', sortable: true, render: r => <span className="font-mono">{String(r.date_time)}</span> },
            { key: 'store_code', label: 'STORE', sortable: true },
            { key: 'camera', label: 'CAMERA', sortable: true },
            { key: 'explanation', label: 'DETAILS', render: r => <span className="text-xs text-gray-600">{String(r.explanation)}</span> },
            {
              key: 'status', label: 'STATUS', render: r => {
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

export default MachinePage
