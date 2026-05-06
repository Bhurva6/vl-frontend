import { useMemo } from 'react'
import { format, subDays } from 'date-fns'
import {
  Bar, CartesianGrid, Cell, ComposedChart,
  Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import ChartContainer from '@/components/ui/ChartContainer'
import KPIStrip from '@/components/ui/KPIStrip'
import SkeletonChart from '@/components/ui/SkeletonChart'
import SkeletonKPI from '@/components/ui/SkeletonKPI'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'

const TT = { fontFamily: 'IBM Plex Mono', fontSize: 11, border: '1px solid #E5E7EB', borderRadius: 0 }

const CATS = ['WATCHMAN', 'PHONE', 'INTRUSION', 'GATE', 'PRESENCE'] as const
const CAT_COLORS: Record<string, string> = {
  WATCHMAN:  '#E5000A',
  PHONE:     '#FF6B00',
  INTRUSION: '#7C3AED',
  GATE:      '#059669',
  PRESENCE:  '#0066FF',
}

function buildDaySlice(records: { date_time: string; category: string }[], dateStr: string) {
  const day = records.filter(r => r.date_time.startsWith(dateStr))
  return {
    WATCHMAN:  day.filter(r => r.category === 'WATCHMAN').length,
    PHONE:     day.filter(r => r.category === 'PHONE').length,
    INTRUSION: day.filter(r => r.category === 'INTRUSION').length,
    GATE:      day.filter(r => r.category === 'GATE').length,
    PRESENCE:  day.filter(r => r.category === 'PRESENCE').length,
    total:     day.length,
  }
}

const AXIS = { fontSize: 11, fontFamily: 'IBM Plex Mono' }

const OverviewPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const records = data?.alertRecords ?? []

  const kpis = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayCount = records.filter(r => r.date_time.startsWith(today)).length
    return [
      { label: 'TOTAL ALERTS',    value: String(records.length),                                          delta: `${todayCount} today`, deltaTone: 'neutral' as const, borderTone: 'blue' as const },
      { label: 'WATCHMAN ALERTS', value: String(records.filter(r => r.category === 'WATCHMAN').length),   borderTone: 'red' as const },
      { label: 'PHONE USAGE',     value: String(records.filter(r => r.category === 'PHONE').length),      borderTone: 'amber' as const },
      { label: 'INTRUSION',       value: String(records.filter(r => r.category === 'INTRUSION').length),  borderTone: 'rose' as const },
      { label: 'GATE EVENTS',     value: String(records.filter(r => r.category === 'GATE').length),       borderTone: 'green' as const },
      { label: 'PRESENCE',        value: String(records.filter(r => r.category === 'PRESENCE').length),   borderTone: 'blue' as const },
    ]
  }, [records])

  // Last 7 days — one point per day
  const weeklyData = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i)
      const dateStr = format(d, 'yyyy-MM-dd')
      return { date: format(d, 'MMM dd'), ...buildDaySlice(records, dateStr) }
    }),
    [records],
  )

  // Today — one point per category
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const todayData = useMemo(() =>
    CATS.map(cat => ({
      name:  cat.charAt(0) + cat.slice(1).toLowerCase(),
      count: records.filter(r => r.date_time.startsWith(todayStr) && r.category === cat).length,
      fill:  CAT_COLORS[cat],
    })),
    [records, todayStr],
  )

  // Hourly for today — one point per hour
  const hourlyData = useMemo(() =>
    Array.from({ length: 24 }, (_, h) => {
      const hh = String(h).padStart(2, '0')
      const slice = records.filter(
        r => r.date_time.startsWith(todayStr) && r.date_time.slice(11, 13) === hh,
      )
      return {
        hour: `${hh}:00`,
        WATCHMAN:  slice.filter(r => r.category === 'WATCHMAN').length,
        PHONE:     slice.filter(r => r.category === 'PHONE').length,
        INTRUSION: slice.filter(r => r.category === 'INTRUSION').length,
        GATE:      slice.filter(r => r.category === 'GATE').length,
        PRESENCE:  slice.filter(r => r.category === 'PRESENCE').length,
        total:     slice.length,
      }
    }),
    [records, todayStr],
  )

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="overflow-x-auto border-y border-[#E5E7EB]">
          <div className="flex min-w-[1000px] divide-x divide-[#E5E7EB]">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonKPI key={i} />)}
          </div>
        </div>
        <div className="grid gap-8 xl:grid-cols-2">
          <SkeletonChart height={320} />
          <SkeletonChart height={320} />
        </div>
        <SkeletonChart height={300} />
      </div>
    )
  }

  return (
    <div className="page-fade-in space-y-8">
      <KPIStrip items={kpis} />

      {/* Row: 7-day chart + today chart side by side */}
      <div className="grid gap-8 xl:grid-cols-2">
        <ChartContainer title="Daily Alerts by Category">
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={weeklyData} barCategoryGap="25%">
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={AXIS} stroke="#9CA3AF" />
              <YAxis yAxisId="left"  tick={AXIS} stroke="#9CA3AF" allowDecimals={false} />
              <YAxis yAxisId="right" orientation="right" tick={AXIS} stroke="#9CA3AF" allowDecimals={false} />
              <Tooltip contentStyle={TT} />
              <Legend iconType="square" wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
              {CATS.map(cat => (
                <Bar key={cat} yAxisId="left" dataKey={cat} fill={CAT_COLORS[cat]}
                  name={cat.charAt(0) + cat.slice(1).toLowerCase()} stackId="a" animationDuration={700} />
              ))}
              <Line yAxisId="right" dataKey="total" stroke="#0A0A0A" strokeWidth={2}
                dot={{ r: 3, fill: '#0A0A0A' }} activeDot={{ r: 4 }} animationDuration={700} name="Total" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title={`Today's Alerts by Category — ${format(new Date(), 'MMM dd')}`}>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={todayData} barCategoryGap="35%">
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="name" tick={AXIS} stroke="#9CA3AF" />
              <YAxis tick={AXIS} stroke="#9CA3AF" allowDecimals={false} />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="count" animationDuration={700}>
                {todayData.map(entry => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Hourly breakdown for today */}
      <ChartContainer title={`Hourly Alerts by Category — Today ${format(new Date(), 'MMM dd')}`}>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={hourlyData} barCategoryGap="20%">
            <CartesianGrid vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="hour" tick={{ ...AXIS, fontSize: 10 }} stroke="#9CA3AF" interval={1} />
            <YAxis yAxisId="left"  tick={AXIS} stroke="#9CA3AF" allowDecimals={false} />
            <YAxis yAxisId="right" orientation="right" tick={AXIS} stroke="#9CA3AF" allowDecimals={false} />
            <Tooltip contentStyle={TT} />
            <Legend iconType="square" wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
            {CATS.map(cat => (
              <Bar key={cat} yAxisId="left" dataKey={cat} fill={CAT_COLORS[cat]}
                name={cat.charAt(0) + cat.slice(1).toLowerCase()} stackId="a" animationDuration={700} />
            ))}
            <Line yAxisId="right" dataKey="total" stroke="#0A0A0A" strokeWidth={2}
              dot={{ r: 2, fill: '#0A0A0A' }} activeDot={{ r: 4 }} animationDuration={700} name="Total" />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

export default OverviewPage
