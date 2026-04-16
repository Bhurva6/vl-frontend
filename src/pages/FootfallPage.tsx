import { useMemo, useState } from 'react'
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartContainer from '@/components/ui/ChartContainer'
import DataTable from '@/components/ui/DataTable'
import SkeletonCard from '@/components/ui/SkeletonCard'
import SkeletonChart from '@/components/ui/SkeletonChart'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'
import { useFilterStore } from '@/store/filterStore'

const shifts = ['Morning', 'Afternoon', 'Night'] as const

const FootfallPage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const [shift, setShift] = useState<(typeof shifts)[number]>('Morning')
  const applyVersion = useFilterStore((state) => state.applyVersion)

  const headcountRows = useMemo(
    () =>
      (data?.dailyHeadcount ?? []).slice(-12).map((d) => ({
        date: d.date,
        ProductionFloor: d.morning,
        PackagingBay: d.afternoon,
        EntryGate: d.night,
        In: d.morning + 20,
        Out: d.night + 10,
      })),
    [data],
  )

  const workerRows = (data?.workerByHelmet ?? []).map((row) => ({
    zone: row.zone,
    helmetColor: row.color,
    count: row.count,
    percent: `${((row.count / 220) * 100).toFixed(1)}%`,
  }))

  return (
    <div className="space-y-6" key={applyVersion}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          [
            ['Total In', '386'],
            ['Total Out', '344'],
            ['Currently Inside', '42'],
            ['Peak Hour', '10:00 AM'],
          ].map(([label, value]) => (
            <Card key={label}>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="mt-2 text-3xl font-bold text-[#1A1A2E]">{value}</p>
            </Card>
          ))
        )}
      </div>

      <ChartContainer
        title="Hourly Headcount by Zone"
        action={
          <Tabs value={shift} onValueChange={(v) => setShift(v as (typeof shifts)[number])}>
            <TabsList>
              {shifts.map((s) => <TabsTrigger key={s} value={s}>{s}</TabsTrigger>)}
            </TabsList>
          </Tabs>
        }
      >
        {isLoading ? (
          <SkeletonChart height={320} />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={headcountRows}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(15,23,42,0.12)', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="ProductionFloor" fill="#00C2FF" animationDuration={800} />
                <Bar dataKey="PackagingBay" fill="#1A1A2E" animationDuration={800} />
                <Bar dataKey="EntryGate" fill="#22C55E" animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
          </>
        )}
      </ChartContainer>

      <ChartContainer title="Entry vs Exit Trend">
        {isLoading ? (
          <SkeletonChart height={320} />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={headcountRows}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(15,23,42,0.12)', border: '1px solid #e5e7eb' }} />
                <Line dataKey="In" stroke="#00C2FF" strokeWidth={2.5} animationDuration={800} />
                <Line dataKey="Out" stroke="#F59E0B" strokeWidth={2.5} animationDuration={800} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
          </>
        )}
      </ChartContainer>

      <DataTable
        rows={workerRows}
        rowKey={(row) => `${row.zone}-${row.helmetColor}`}
        isLoading={isLoading}
        searchPlaceholder="Search classification..."
        columns={[
          { key: 'zone', label: 'Zone', sortable: true },
          { key: 'helmetColor', label: 'Helmet Color', sortable: true },
          { key: 'count', label: 'Count', sortable: true },
          { key: 'percent', label: '% of Zone', sortable: true },
        ]}
      />
    </div>
  )
}

export default FootfallPage
