import { useQuery } from '@tanstack/react-query'
import { alertRecords as mockAlerts } from '@/mock/data'
import { fetchAlerts } from '@/services/alertsService'

const hasAwsConfig = Boolean(
  import.meta.env.VITE_AWS_ACCESS_KEY_ID &&
  import.meta.env.VITE_DYNAMODB_TABLE,
)

export const useMockData = () =>
  useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const raw = hasAwsConfig ? await fetchAlerts() : mockAlerts
      return { alertRecords: raw }
    },
    staleTime: 0,
    retry: 1,
  })
