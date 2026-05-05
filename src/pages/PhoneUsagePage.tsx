import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import {
  Bar, BarChart, CartesianGrid,
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
const CHECK_HOURS = [9, 11, 13, 15, 17]

const PhoneUsagePage = () => {
  const { data } = useMockData()
  const { isLoading } = usePageLoad()
  const [selected, setSelected] = useState<AlertRecord | null>(null)

  const records = (data?.alertRecords ?? []).filter(r => r.category === 'PHONE')

  const kpis = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayCount = records.filter(r => r.date_time.startsWith(today)).length
    const openCount = records.filter(r => r.status === 'Open').length
    const cameras = new Set(records.map(r => r.camera))
    return [
      { label: 'TOTAL INCIDENTS', value: String(records.length), delta: `${todayCount} today`, deltaTone: 'down' as const, borderTone: 'amber' as const },
      { label: 'OPEN', value: String(openCount), borderTone: 'red' as const },
      { label: 'CAMERAS FLAGGED', value: String(cameras.size), delta: 'unique cameras', deltaTone: 'neutral' as const, borderTone: 'blue' as const },
    ]
  }, [records])

  const slotData = useMemo(() =>
    CHECK_HOURS.map(h => ({
      slot: `${String(h).padStart(2, '0')}:00`,
      incidents: records.filter(r => r.date_time.slice(11, 13) === String(h).padStart(2, '0')).length,
    })),
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

      <ChartContainer title="Phone Usage — Check Slot Frequency (09:00–17:00, 2hr gaps)">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={slotData} barCategoryGap="40%">
            <CartesianGrid vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="slot" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" />
            <YAxis tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#9CA3AF" allowDecimals={false} />
            <Tooltip contentStyle={TT} />
            <Bar dataKey="incidents" fill="#FF6B00" name="Incidents" animationDuration={700} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <section className="space-y-3">
        <SectionHeader title="Phone Usage Log" />
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

export default PhoneUsagePage
