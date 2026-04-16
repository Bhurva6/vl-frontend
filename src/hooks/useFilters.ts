import { useFilterStore } from '@/store/filterStore'

export const cameraOptions = [
  'All Cameras',
  'Entry Gate Cam',
  'Production Floor Cam A',
  'Production Floor Cam B',
  'Packaging Bay Cam',
  'Raw Material Store Cam',
  'Machine Line Cam',
]

export const zoneOptions = ['All Zones', 'Production Floor', 'Entry Gate', 'Packaging Bay', 'Machine Line', 'Back Office']

export const shiftOptions = ['All Shifts', 'Morning (6AM-2PM)', 'Afternoon (2PM-10PM)', 'Night (10PM-6AM)']

export const useFilters = () => {
  const fromDate = useFilterStore((state) => state.fromDate)
  const toDate = useFilterStore((state) => state.toDate)
  const camera = useFilterStore((state) => state.camera)
  const zone = useFilterStore((state) => state.zone)
  const shift = useFilterStore((state) => state.shift)
  const quickRange = useFilterStore((state) => state.quickRange)
  const setFromDate = useFilterStore((state) => state.setFromDate)
  const setToDate = useFilterStore((state) => state.setToDate)
  const setCamera = useFilterStore((state) => state.setCamera)
  const setZone = useFilterStore((state) => state.setZone)
  const setShift = useFilterStore((state) => state.setShift)
  const setQuickRange = useFilterStore((state) => state.setQuickRange)
  const applyFilters = useFilterStore((state) => state.applyFilters)
  const clearFilters = useFilterStore((state) => state.clearFilters)

  return {
    fromDate,
    toDate,
    camera,
    zone,
    shift,
    quickRange,
    setFromDate,
    setToDate,
    setCamera,
    setZone,
    setShift,
    setQuickRange,
    applyFilters,
    clearFilters,
    cameraOptions,
    zoneOptions,
    shiftOptions,
  }
}
