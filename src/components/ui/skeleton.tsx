import { cn } from '@/lib/utils'

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100', className)} />
)
