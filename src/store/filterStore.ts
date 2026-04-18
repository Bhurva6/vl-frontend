import { format } from 'date-fns'
import { create } from 'zustand'

export interface FilterState {
  fromDate: string
  toDate: string
  camera: string
  zone: string
  shift: string
  quickRange: 'today' | 'last7' | 'last30' | 'custom'
  applyVersion: number
  setFromDate: (value: string) => void
  setToDate: (value: string) => void
  setCamera: (value: string) => void
  setZone: (value: string) => void
  setShift: (value: string) => void
  setQuickRange: (value: 'today' | 'last7' | 'last30') => void
  applyFilters: () => void
  clearFilters: () => void
}

const today = new Date()
const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

const defaults = {
  fromDate: format(monthStart, 'yyyy-MM-dd'),
  toDate: format(today, 'yyyy-MM-dd'),
  camera: 'All Cameras',
  zone: 'All Zones',
  shift: 'Morning',
  quickRange: 'last30' as const,
}

export const useFilterStore = create<FilterState>((set) => ({
  ...defaults,
  applyVersion: 0,
  setFromDate: (fromDate) => set({ fromDate, quickRange: 'custom' }),
  setToDate: (toDate) => set({ toDate, quickRange: 'custom' }),
  setCamera: (camera) => set({ camera }),
  setZone: (zone) => set({ zone }),
  setShift: (shift) => set({ shift }),
  setQuickRange: (quickRange) => {
    const now = new Date()
    if (quickRange === 'today') {
      const value = format(now, 'yyyy-MM-dd')
      set({ fromDate: value, toDate: value, quickRange })
      return
    }

    if (quickRange === 'last7') {
      const d = new Date(now)
      d.setDate(now.getDate() - 6)
      set({ fromDate: format(d, 'yyyy-MM-dd'), toDate: format(now, 'yyyy-MM-dd'), quickRange })
      return
    }

    const d = new Date(now)
    d.setDate(now.getDate() - 29)
    set({ fromDate: format(d, 'yyyy-MM-dd'), toDate: format(now, 'yyyy-MM-dd'), quickRange })
  },
  applyFilters: () => set((state) => ({ applyVersion: state.applyVersion + 1 })),
  clearFilters: () => set((state) => ({ ...defaults, applyVersion: state.applyVersion + 1 })),
}))
