import { Skeleton } from '@/components/ui/skeleton'

const SkeletonTable = () => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <Skeleton className="mb-4 h-10 w-full" />
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="mb-2 h-9 w-full" />
      ))}
    </div>
  )
}

export default SkeletonTable
