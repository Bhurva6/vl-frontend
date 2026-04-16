import { useQuery } from '@tanstack/react-query'
import {
  alertRecords,
  dailyHeadcount,
  gateEvents,
  hourlyCompliance,
  machineActivity,
  packingEfficiency,
  tobaccoDetections,
  truckLog,
  workerByHelmet,
  zoneActivityDistribution,
  zoneCompliance,
} from '@/mock/data'

const payload = {
  alertRecords,
  dailyHeadcount,
  gateEvents,
  hourlyCompliance,
  machineActivity,
  packingEfficiency,
  tobaccoDetections,
  truckLog,
  workerByHelmet,
  zoneActivityDistribution,
  zoneCompliance,
}

export const useMockData = () =>
  useQuery({
    queryKey: ['factory-mock-data'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 350))
      return payload
    },
    staleTime: Infinity,
  })
