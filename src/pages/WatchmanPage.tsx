import { useMemo, useState } from 'react'
import { format, subDays } from 'date-fns'
import {
  Bar, CartesianGrid, Cell, ComposedChart,
  Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import AlertDetailModal from '@/components/ui/AlertDetailModal'
import ChartContainer from '@/components/ui/ChartContainer'
import DataTable from '@/components/ui/DataTable'
import KPIStrip from '@/components/ui/KPIStrip'
import SectionHeader from '@/components/ui/SectionHeader'
import SkeletonChart from '@/components/ui/SkeletonChart'
import SkeletonKPI from '@/components/ui/SkeletonKPI'
import SkeletonTable from '@/components/ui/SkeletonTable'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'
import type { AlertRecord } from '@/types'

const TT   = { fontFamily: 'IBM Plex Mono', fontSize: 11, border: '1px solid #E5E7EB', borderRadius: 0 }
const AXIS = { fontSize: 11, fontFamily: 'IBM Plex Mono' }

const WatchmanPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const [selected, setSelected] = useState<AlertRecord | null>(null)

  const records = data?.alertRecords ?? []
  const asleep  = records.filter(r => r.alert_type === 'watchman_asleep')
  const absent  = records.filter(r => r.alert_type === 'watchman_absent')
  const all     = [...asleep, ...absent]

  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const kpis = useMemo(() => {
    const asleepToday = asleep.filter(r => r.date_time.startsWith(todayStr)).length
    const absentToday = absent.filter(r => r.date_time.startsWith(todayStr)).length
    return [
      { label: 'ASLEEP ALERTS', value: String(asleep.length), delta: `${asleepToday} today`, deltaTone: 'down' as const, borderTone: 'red' as const },
      { label: 'ABSENT ALERTS', value: String(absent.length), delta: `${absentToday} today`, deltaTone: 'down' as const, borderTone: 'amber' as const },
    ]
  }, [asleep, absent, todayStr])

  const weeklyData = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i)
      const ds = format(d, 'yyyy-MM-dd')
      return {
        date:   format(d, 'MMM dd'),
        asleep: asleep.filter(r => r.date_time.startsWith(ds)).length,
        absent: absent.filter(r => r.date_time.startsWith(ds)).length,
        total:  all.filter(r => r.date_time.startsWith(ds)).length,
      }
    }),
    [asleep, absent, all],
  )

  const todayData = useMemo(() => [
    { name: 'Asleep', count: asleep.filter(r => r.date_time.startsWith(todayStr)).length, fill: '#E5000A' },
    { name: 'Absent', count: absent.filter(r => r.date_time.startsWith(todayStr)).length, fill: '#FF6B00' },
  ], [asleep, absent, todayStr])

  const hourlyData = useMemo(() =>
    Array.from({ length: 24 }, (_, h) => {
      const hh = String(h).padStart(2, '0')
      return {
        hour:   `${hh}:00`,
        asleep: asleep.filter(r => r.date_time.startsWith(todayStr) && r.date_time.slice(11, 13) === hh).length,
        absent: absent.filter(r => r.date_time.startsWith(todayStr) && r.date_time.slice(11, 13) === hh).length,
        total:  all.filter(r => r.date_time.startsWith(todayStr) && r.date_time.slice(11, 13) === hh).length,
      }
    }),
    [asleep, absent, all, todayStr],
  )

  const tableRows = [...all].sort((a, b) => b.date_time.localeCompare(a.date_time))

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="overflow-x-auto border-y border-[#E5E7EB]">
          <div className="flex min-w-[600px] divide-x divide-[#E5E7EB]">
            {Array.from({ length: 2 }).map((_, i) => <SkeletonKPI key={i} />)}
          </div>
        </div>
        <div className="grid gap-8 xl:grid-cols-2">
          <SkeletonChart height={300} />
          <SkeletonChart height={300} />
        </div>
        <SkeletonChart height={300} />
        <SkeletonTable />
      </div>
    )
  }

  return (
    <div className="page-fade-in space-y-8">
      <KPIStrip items={kpis} />

      <div className="grid gap-8 xl:grid-cols-2">
        <ChartContainer title="Watchman Alerts — Last 7 Days">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={weeklyData} barCategoryGap="25%">
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={AXIS} stroke="#9CA3AF" />
              <YAxis yAxisId="left"  tick={AXIS} stroke="#9CA3AF" allowDecimals={false} />
              <YAxis yAxisId="right" orientation="right" tick={AXIS} stroke="#9CA3AF" allowDecimals={false} />
              <Tooltip contentStyle={TT} />
              <Legend iconType="square" wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="asleep" fill="#E5000A" name="Asleep" stackId="a" animationDuration={700} />
              <Bar yAxisId="left" dataKey="absent" fill="#FF6B00" name="Absent" stackId="a" animationDuration={700} />
              <Line yAxisId="right" dataKey="total" stroke="#0A0A0A" strokeWidth={2} dot={{ r: 3, fill: '#0A0A0A' }} activeDot={{ r: 4 }} animationDuration={700} name="Total" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title={`Today's Watchman Alerts — ${format(new Date(), 'MMM dd')}`}>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={todayData} barCategoryGap="40%">
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="name" tick={AXIS} stroke="#9CA3AF" />
              <YAxis tick={AXIS} stroke="#9CA3AF" allowDecimals={false} />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="count" animationDuration={700}>
                {todayData.map(entry => <Cell key={entry.name} fill={entry.fill} />)}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <ChartContainer title={`Hourly Watchman Alerts — Today ${format(new Date(), 'MMM dd')}`}>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={hourlyData} barCategoryGap="20%">
            <CartesianGrid vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="hour" tick={{ ...AXIS, fontSize: 10 }} stroke="#9CA3AF" interval={1} />
            <YAxis yAxisId="left"  tick={AXIS} stroke="#9CA3AF" allowDecimals={false} />
            <YAxis yAxisId="right" orientation="right" tick={AXIS} stroke="#9CA3AF" allowDecimals={false} />
            <Tooltip contentStyle={TT} />
            <Legend iconType="square" wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="asleep" fill="#E5000A" name="Asleep" stackId="a" animationDuration={700} />
            <Bar yAxisId="left" dataKey="absent" fill="#FF6B00" name="Absent" stackId="a" animationDuration={700} />
            <Line yAxisId="right" dataKey="total" stroke="#0A0A0A" strokeWidth={2} dot={{ r: 2, fill: '#0A0A0A' }} activeDot={{ r: 4 }} animationDuration={700} name="Total" />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>

      <section className="space-y-3">
        <SectionHeader title="Watchman Alerts Log" />
        <DataTable
          rows={tableRows}
          rowKey={r => r.id}
          onRowClick={row => setSelected(row)}
          columns={[
            { key: 'id', label: '#', sortable: true },
            { key: 'date_time', label: 'DATETIME', sortable: true, render: r => <span className="font-mono">{String(r.date_time)}</span> },
            { key: 'store_code', label: 'STORE', sortable: true },
            { key: 'camera', label: 'CAMERA PORT_CHANNEL', sortable: true },
            { key: 'explanation', label: 'DETAILS', render: r => <span className="text-xs text-gray-600">{String(r.explanation)}</span> },
          ]}
        />
      </section>

      <AlertDetailModal selected={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

export default WatchmanPage
