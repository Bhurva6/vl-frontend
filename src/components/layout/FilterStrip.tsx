import { quickRangeOptions, useFilters } from '@/hooks/useFilters'

const shifts = ['Morning', 'Afternoon', 'Night'] as const

const inputClassName = 'border-0 border-b-2 border-[#D1D5DB] bg-transparent px-0 py-1 font-mono text-[12px] text-[#0A0A0A] outline-none focus:border-[#0066FF] focus:ring-0'

const FilterStrip = () => {
  const {
    fromDate,
    toDate,
    camera,
    zone,
    shift,
    quickRange,
    cameraOptions,
    zoneOptions,
    setFromDate,
    setToDate,
    setCamera,
    setZone,
    setShift,
    setQuickRange,
    applyFilters,
  } = useFilters()

  return (
    <section className="sticky top-[82px] z-40 border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <label className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
            <span>FROM</span>
            <input className={inputClassName} type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </label>
          <label className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
            <span>TO</span>
            <input className={inputClassName} type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </label>
          <label className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
            <span>CAMERA</span>
            <select className={inputClassName} value={camera} onChange={(e) => setCamera(e.target.value)}>
              {cameraOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
            <span>ZONE</span>
            <select className={inputClassName} value={zone} onChange={(e) => setZone(e.target.value)}>
              {zoneOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <div className="flex items-center gap-2">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">SHIFT</span>
            <div className="flex items-center gap-1">
              {shifts.map((label) => {
                const active = shift === label
                return (
                  <button
                    key={label}
                    type="button"
                    className={`border px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] ${active ? 'border-black bg-black text-white' : 'border-[#E5E7EB] text-[#6B7280]'}`}
                    onClick={() => setShift(label)}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {quickRangeOptions.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`font-sans text-[11px] font-semibold uppercase tracking-[0.18em] ${quickRange === item.key ? 'text-[#0066FF]' : 'text-[#6B7280]'}`}
                onClick={() => setQuickRange(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="border border-[#0066FF] bg-[#0066FF] px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#0052CC]"
            onClick={applyFilters}
          >
            Apply
          </button>
        </div>
      </div>
    </section>
  )
}

export default FilterStrip
