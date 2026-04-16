import { useFilters } from '@/hooks/useFilters'
import { Button } from '@/components/ui/button'

const quickRanges = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'last7', label: 'Last 7 Days' },
  { key: 'month', label: 'This Month' },
] as const

const FilterBar = () => {
  const {
    fromDate,
    toDate,
    camera,
    zone,
    shift,
    quickRange,
    cameraOptions,
    zoneOptions,
    shiftOptions,
    setFromDate,
    setToDate,
    setCamera,
    setZone,
    setShift,
    setQuickRange,
    applyFilters,
    clearFilters,
  } = useFilters()

  return (
    <section className="z-20 border-b border-gray-200 bg-white px-4 py-2">
      <div className="flex items-center gap-2 overflow-x-auto text-sm">
        <span className="shrink-0 text-gray-500">FROM</span>
        <input value={fromDate} onChange={(e) => setFromDate(e.target.value)} type="date" className="shrink-0 rounded-lg border border-gray-200 px-2 py-1 text-xs" />
        <span className="shrink-0 text-gray-500">TO</span>
        <input value={toDate} onChange={(e) => setToDate(e.target.value)} type="date" className="shrink-0 rounded-lg border border-gray-200 px-2 py-1 text-xs" />

        <select value={camera} onChange={(e) => setCamera(e.target.value)} className="shrink-0 rounded-lg border border-gray-200 px-2 py-1 text-xs">
          {cameraOptions.map((option) => <option key={option}>{option}</option>)}
        </select>

        <select value={zone} onChange={(e) => setZone(e.target.value)} className="shrink-0 rounded-lg border border-gray-200 px-2 py-1 text-xs">
          {zoneOptions.map((option) => <option key={option}>{option}</option>)}
        </select>

        <select value={shift} onChange={(e) => setShift(e.target.value)} className="shrink-0 rounded-lg border border-gray-200 px-2 py-1 text-xs">
          {shiftOptions.map((option) => <option key={option}>{option}</option>)}
        </select>

        <div className="ml-auto flex items-center gap-2">
          {quickRanges.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${quickRange === item.key ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setQuickRange(item.key)}
            >
              {item.label}
            </button>
          ))}
          <Button size="sm" onClick={applyFilters}>Apply</Button>
          <button type="button" className="text-sm text-blue-600" onClick={clearFilters}>Clear</button>
        </div>
      </div>
    </section>
  )
}

export default FilterBar
