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
      const records = hasAwsConfig ? await fetchAlerts() : mockAlerts
      return { alertRecords: records }
    },
    staleTime: 60_000, // re-fetch every 60 s
    retry: 1,
  })
