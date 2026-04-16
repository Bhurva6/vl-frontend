import { Loader2 } from 'lucide-react'

const PageLoader = () => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 text-gray-600">
      <Loader2 className="h-10 w-10 animate-spin text-[#00C2FF]" />
      <p className="text-sm font-semibold">Loading...</p>
    </div>
  )
}

export default PageLoader
