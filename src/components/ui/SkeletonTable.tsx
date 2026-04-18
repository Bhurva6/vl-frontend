import { Skeleton } from '@/components/ui/skeleton'

const SkeletonTable = () => {
  const widths = ['w-full', 'w-11/12', 'w-10/12', 'w-9/12', 'w-full', 'w-8/12', 'w-11/12', 'w-10/12']

  return (
    <div className="bg-white py-2">
      <Skeleton className="mb-6 h-8 w-72 rounded-none bg-gray-100" />
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className={`mb-2 h-8 rounded-none bg-gray-100 ${widths[index]}`} />
      ))}
    </div>
  )
}

export default SkeletonTable
