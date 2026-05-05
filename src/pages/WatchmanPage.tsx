import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import {
  Bar, BarChart, CartesianGrid, Legend,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import AlertDetailModal from '@/components/ui/AlertDetailModal'
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
import type { AlertRecord } from '@/types'

const TT = { fontFamily: 'IBM Plex Mono', fontSize: 11, border: '1px solid #E5E7EB', borderRadius: 0 }
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17]

const WatchmanPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const [selected, setSelected] = useState<AlertRecord | null>(null)

  const records = data?.alertRecords ?? []
  const asleep = records.filter(r => r.alert_type === 'watchman_asleep')
  const absent = records.filter(r => r.alert_type === 'watchman_absent')

  const kpis = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const asleepToday = asleep.filter(r => r.date_time.startsWith(today)).length
    const absentToday = absent.filter(r => r.date_time.startsWith(today)).length
    return [
      { label: 'ASLEEP ALERTS', value: String(asleep.length), delta: `${asleepToday} today`, deltaTone: 'down' as const, borderTone: 'red' as const },
      { label: 'ABSENT ALERTS', value: String(absent.length), delta: `${absentToday} today`, deltaTone: 'down' as const, borderTone: 'amber' as const },
      { label: 'OPEN ALERTS', value: String([...asleep, ...absent].filter(r => r.status === 'Open').length), borderTone: 'rose' as const },
    ]
  }, [asleep, absent])

  const hourlyData = useMemo(() =>
    HOURS.map(h => {
      const hh = String(h).padStart(2, '0')
      return {
        hour: `${hh}:00`,
        asleep: asleep.filter(r => r.date_time.slice(11, 13) === hh).length,
        absent: absent.filter(r => r.date_time.slice(11, 13) === hh).length,
      }
    }),
    [asleep, absent],
  )

  const tableRows = [...asleep, ...absent].sort((a, b) => b.date_time.localeCompare(a.date_time)).slice(0, 20)

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

      <ChartContainer title="Watchman Alerts — Hourly Distribution (09:00–17:00)">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hourlyData} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="hour" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
            <YAxis tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" allowDecimals={false} />
            <Tooltip contentStyle={TT} />
            <Legend iconType="square" wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
            <Bar dataKey="asleep" fill="#E5000A" name="Asleep" animationDuration={700} />
            <Bar dataKey="absent" fill="#FF6B00" name="Absent" animationDuration={700} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <section className="space-y-3">
        <SectionHeader title="Watchman Alerts Log" />
        <DataTable
          rows={tableRows}
          rowKey={r => r.id}
          onRowClick={(row) => setSelected(row)}
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

      <AlertDetailModal selected={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

export default WatchmanPage
