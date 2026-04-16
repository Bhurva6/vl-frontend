import { Ban, Bell, Box, EyeOff, ShieldCheck, Truck, Users, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartContainer from '@/components/ui/ChartContainer'
import KPICard from '@/components/ui/KPICard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import SkeletonChart from '@/components/ui/SkeletonChart'
import { Button } from '@/components/ui/button'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'
import { useFilterStore } from '@/store/filterStore'

const donutColors = ['#00C2FF', '#1A1A2E', '#22C55E', '#F59E0B', '#6366F1']
type Metric = 'total' | 'helmetPct' | 'machineUptime' | 'packingEfficiency'

const OverviewPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const applyVersion = useFilterStore((state) => state.applyVersion)
  const [metric, setMetric] = useState<Metric>('total')

  const trend = useMemo(
    () =>
      (data?.dailyHeadcount ?? []).map((row, idx) => ({
        date: row.date,
        total: row.total,
        helmetPct: Number((84 + (idx % 6) * 1.5).toFixed(1)),
        machineUptime: Number((72 + (idx % 5) * 1.2).toFixed(1)),
        packingEfficiency: Number((78 + (idx % 4) * 1.8).toFixed(1)),
      })),
    [data],
  )

  const kpiCards = [
    { title: 'TOTAL HEADCOUNT', value: '342', subtext: 'Across all zones today', icon: Users, iconColor: 'bg-blue-500' },
    { title: 'PPE COMPLIANCE', value: '88.4%', subtext: 'Helmet + Vest detected', icon: ShieldCheck, iconColor: 'bg-emerald-500', trend: 3.2 },
    { title: 'MACHINE UPTIME', value: '76.1%', subtext: 'Avg across 6 machines', icon: Wrench, iconColor: 'bg-indigo-500', trend: -4.5 },
    { title: 'PACKING EFFICIENCY', value: '82.3%', subtext: 'Packing Bay Zone', icon: Box, iconColor: 'bg-cyan-600', trend: 1.8 },
    { title: 'ALERTS TODAY', value: '31', subtext: 'Total incidents', icon: Bell, iconColor: 'bg-red-500', trend: -33.3 },
    { title: 'TRUCK ENTRIES', value: '14', subtext: 'ANPR verified', icon: Truck, iconColor: 'bg-slate-700' },
    { title: 'TOBACCO DETECTIONS', value: '3', subtext: 'Flagged today', icon: Ban, iconColor: 'bg-rose-700', riskLabel: 'HIGH RISK' },
    { title: 'UNATTENDED ZONES', value: '5', subtext: 'Open alerts', icon: EyeOff, iconColor: 'bg-amber-500' },
  ]

  const csvExport = () => {
    const header = 'Date,Headcount,PPE Rate,Machine Uptime,Packing Efficiency'
    const lines = trend.map((x) => `${x.date},${x.total},${x.helmetPct},${x.machineUptime},${x.packingEfficiency}`)
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'daily-headcount-trend.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3 transition-opacity duration-500 ease-in">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {isLoading ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />) : kpiCards.map((card) => <KPICard key={card.title} {...card} />)}
      </div>

      <div className="grid gap-4 xl:grid-cols-2" key={applyVersion}>
        <ChartContainer
          title="Daily Headcount Trend"
          action={
            <div className="flex items-center gap-2">
              <select value={metric} onChange={(e) => setMetric(e.target.value as Metric)} className="rounded-lg border border-gray-200 px-2 py-1 text-sm">
                <option value="total">Headcount</option>
                <option value="helmetPct">PPE Rate</option>
                <option value="machineUptime">Machine Uptime</option>
                <option value="packingEfficiency">Packing Efficiency</option>
              </select>
              <Button variant="outline" size="sm" onClick={csvExport}>CSV Export</Button>
            </div>
          }
        >
          {isLoading ? (
            <SkeletonChart height={220} />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trend}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(15,23,42,0.12)', border: '1px solid #e5e7eb' }} />
                  <Line type="monotone" dataKey={metric} stroke="#00C2FF" strokeWidth={3} dot={false} animationDuration={800} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
            </>
          )}
        </ChartContainer>

        <ChartContainer title="Zone Activity Distribution">
          {isLoading ? (
            <SkeletonChart height={220} />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={data?.zoneActivityDistribution ?? []} dataKey="value" nameKey="zone" innerRadius={72} outerRadius={120} label animationDuration={800}>
                    {(data?.zoneActivityDistribution ?? []).map((entry, idx) => (
                      <Cell key={entry.zone} fill={donutColors[idx % donutColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(15,23,42,0.12)', border: '1px solid #e5e7eb' }} />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
            </>
          )}
        </ChartContainer>
      </div>
    </div>
  )
}

export default OverviewPage
