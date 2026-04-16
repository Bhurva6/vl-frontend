import { Skeleton } from '@/components/ui/skeleton'

const SkeletonCard = () => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-8 w-32" />
      <Skeleton className="mt-3 h-3 w-40" />
      <Skeleton className="mt-5 h-3 w-28" />
    </div>
  )
}

export default SkeletonCard
