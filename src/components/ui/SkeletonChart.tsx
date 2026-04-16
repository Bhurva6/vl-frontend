import { Skeleton } from '@/components/ui/skeleton'

const SkeletonChart = ({ height = 320 }: { height?: number }) => {
  return <div style={{ height }} className="w-full"><Skeleton className="w-full h-full rounded-2xl" /></div>
}

export default SkeletonChart
