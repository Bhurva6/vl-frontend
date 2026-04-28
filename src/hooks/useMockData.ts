import { useQuery } from '@tanstack/react-query'
import { alertRecords } from '@/mock/data'

const payload = { alertRecords }

export const useMockData = () =>
  useQuery({
    queryKey: ['factory-mock-data'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 350))
      return payload
    },
    staleTime: Infinity,
  })
