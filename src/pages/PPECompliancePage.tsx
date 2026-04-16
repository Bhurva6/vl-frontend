import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import AlertBadge from '@/components/ui/AlertBadge'
import ChartContainer from '@/components/ui/ChartContainer'
import DataTable from '@/components/ui/DataTable'
import SkeletonCard from '@/components/ui/SkeletonCard'
import SkeletonChart from '@/components/ui/SkeletonChart'
import { Card } from '@/components/ui/card'
import { useMockData } from '@/hooks/useMockData'
import { usePageLoad } from '@/hooks/usePageLoad'
import { useFilterStore } from '@/store/filterStore'

const PPECompliancePage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const applyVersion = useFilterStore((state) => state.applyVersion)

  const zoneRows = (data?.zoneCompliance ?? []).map((z) => ({
    ...z,
    green: z.value > 90 ? z.value : 0,
    orange: z.value >= 70 && z.value <= 90 ? z.value : 0,
    red: z.value < 70 ? z.value : 0,
  }))
  const hourlyRows = data?.hourlyCompliance ?? []
  const sevenDay = (data?.dailyHeadcount ?? []).slice(-7).map((d, idx) => ({ date: d.date, compliance: 82 + (idx % 5) * 2 }))

  const violations = (data?.alertRecords ?? [])
    .filter((a) => a.alertType === 'PPE Violation')
    .slice(0, 12)
    .map((a, idx) => ({
      id: idx + 1,
      time: a.dateTime,
      zone: a.cameraZone.split('/')[0].trim(),
      camera: a.cameraZone.split('/')[1]?.trim() ?? 'Camera 1',
      violationType: idx % 3 === 0 ? 'No Helmet' : idx % 3 === 1 ? 'No Vest' : 'Both Missing',
      image: a.image,
    }))

  return (
    <div className="space-y-6" key={applyVersion}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          [
            ['Helmet Compliance %', '89.1%'],
            ['Vest Compliance %', '87.2%'],
            ['Total Violations Today', '27'],
            ['Most Violated Zone', 'Machine Line'],
          ].map(([label, value]) => (
            <Card key={label}>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="mt-2 text-3xl font-bold text-[#1A1A2E]">{value}</p>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ChartContainer title="Compliance % per Zone">
          {isLoading ? (
            <SkeletonChart height={320} />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={zoneRows}>
                  <XAxis dataKey="zone" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(15,23,42,0.12)', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="green" stackId="a" fill="#22C55E" animationDuration={800} />
                  <Bar dataKey="orange" stackId="a" fill="#F59E0B" animationDuration={800} />
                  <Bar dataKey="red" stackId="a" fill="#EF4444" animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
            </>
          )}
        </ChartContainer>

        <ChartContainer title="Hourly Compliance Trend">
          {isLoading ? (
            <SkeletonChart height={320} />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={hourlyRows}>
                  <XAxis dataKey="hour" />
                  <YAxis domain={[50, 100]} />
                  <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(15,23,42,0.12)', border: '1px solid #e5e7eb' }} />
                  <Line dataKey="helmetPct" stroke="#00C2FF" animationDuration={800} />
                  <Line dataKey="vestPct" stroke="#1A1A2E" animationDuration={800} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
            </>
          )}
        </ChartContainer>
      </div>

      <ChartContainer title="7-day Compliance Trend">
        {isLoading ? (
          <SkeletonChart height={320} />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={sevenDay}>
                <XAxis dataKey="date" />
                <YAxis domain={[60, 100]} />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(15,23,42,0.12)', border: '1px solid #e5e7eb' }} />
                <Area dataKey="compliance" fill="#00C2FF33" stroke="#00C2FF" strokeWidth={2.5} animationDuration={800} />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
          </>
        )}
      </ChartContainer>

      <DataTable
        rows={violations}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        columns={[
          { key: 'id', label: '#', sortable: true },
          { key: 'time', label: 'Time', sortable: true },
          { key: 'zone', label: 'Zone', sortable: true },
          { key: 'camera', label: 'Camera', sortable: true },
          { key: 'violationType', label: 'Violation Type', sortable: true, render: (r) => <AlertBadge label={r.violationType} /> },
          { key: 'image', label: 'Image thumb', sortable: true },
        ]}
      />
    </div>
  )
}

export default PPECompliancePage
