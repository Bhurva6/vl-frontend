import { useEffect, useState } from 'react'

export const usePageLoad = (duration = 1200) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), duration)
    return () => window.clearTimeout(timer)
  }, [duration])

  return { isLoading }
}
