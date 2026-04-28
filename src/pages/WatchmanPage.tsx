import { useMemo } from 'react'
import { format } from 'date-fns'
import {
  Bar, BarChart, CartesianGrid, Legend,
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
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17]

const WatchmanPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()

  const records = data?.alertRecords ?? []
  const sleeping = records.filter(r => r.alert_type === 'watchman_sleeping')
  const present = records.filter(r => r.alert_type === 'watchman_present')

  const kpis = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const sleepingToday = sleeping.filter(r => r.date_time.startsWith(today)).length
    const presentToday = present.filter(r => r.date_time.startsWith(today)).length
    const total = sleeping.length + present.length
    const coveragePct = total > 0 ? Math.round((present.length / total) * 100) : 0
    return [
      { label: 'SLEEPING ALERTS', value: String(sleeping.length), delta: `${sleepingToday} today`, deltaTone: 'down' as const, borderTone: 'red' as const },
      { label: 'PRESENT CONFIRMATIONS', value: String(present.length), delta: `${presentToday} today`, deltaTone: 'up' as const, borderTone: 'green' as const },
      { label: 'COVERAGE RATE', value: `${coveragePct}%`, delta: 'present vs total checks', deltaTone: 'neutral' as const, borderTone: 'blue' as const },
      { label: 'OPEN ALERTS', value: String(sleeping.filter(r => r.status === 'Open').length), borderTone: 'amber' as const },
    ]
  }, [sleeping, present])

  const hourlyData = useMemo(() =>
    HOURS.map(h => {
      const hh = String(h).padStart(2, '0')
      return {
        hour: `${hh}:00`,
        sleeping: sleeping.filter(r => r.date_time.slice(11, 13) === hh).length,
        present: present.filter(r => r.date_time.slice(11, 13) === hh).length,
      }
    }),
    [sleeping, present],
  )

  const tableRows = [...sleeping].sort((a, b) => b.date_time.localeCompare(a.date_time)).slice(0, 20)

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="overflow-x-auto border-y border-[#E5E7EB]">
          <div className="flex min-w-[900px] divide-x divide-[#E5E7EB]">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />)}
          </div>
        </div>
        <SkeletonChart height={300} />
        <SkeletonTable />
      </div>
    )
  }

  return (
    <div className="page-fade-in space-y-8">
      <KPIStrip items={kpis} />

      <ChartContainer title="Watchman Check — Hourly Distribution (09:00–17:00)">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hourlyData} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="hour" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
            <YAxis tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" allowDecimals={false} />
            <Tooltip contentStyle={TT} />
            <Legend iconType="square" wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
            <Bar dataKey="sleeping" fill="#E5000A" name="Sleeping" animationDuration={700} />
            <Bar dataKey="present" fill="#00B341" name="Present" animationDuration={700} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <section className="space-y-3">
        <SectionHeader title="Sleeping Alerts Log" />
        <DataTable
          rows={tableRows}
          rowKey={r => r.id}
          columns={[
            { key: 'id', label: '#', sortable: true },
            { key: 'date_time', label: 'DATETIME', sortable: true, render: r => <span className="font-mono">{String(r.date_time)}</span> },
            { key: 'store_code', label: 'STORE', sortable: true },
            { key: 'camera', label: 'CAMERA', sortable: true },
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

export default WatchmanPage
