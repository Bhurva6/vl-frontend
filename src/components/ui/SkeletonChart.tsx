import { Skeleton } from '@/components/ui/skeleton'

const SkeletonChart = ({ height = 320 }: { height?: number }) => {
  const heightClass = height === 320 ? 'h-[320px]' : 'h-[280px]'

  return (
    <div className={`w-full bg-white py-2 ${heightClass}`}>
      <Skeleton className="h-full w-full rounded-none bg-gray-100" />
    </div>
  )
}

export default SkeletonChart
