import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import FilterBar from '@/components/layout/FilterBar'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import PageLoader from '@/components/ui/PageLoader'

const Layout = () => {
  const location = useLocation()
  const [isRouteLoading, setIsRouteLoading] = useState(false)

  useEffect(() => {
    setIsRouteLoading(true)
    const timer = window.setTimeout(() => setIsRouteLoading(false), 500)
    return () => window.clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <Navbar />
      <FilterBar />
      <div className="flex flex-1 overflow-hidden pb-16 md:pb-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-5">
          {isRouteLoading ? <PageLoader /> : <Outlet />}
        </main>
      </div>

      <button type="button" className="fixed right-4 bottom-20 z-40 h-12 w-12 rounded-full bg-[#00C2FF] text-xl font-bold text-white shadow-lg md:bottom-4">
        ?
      </button>
    </div>
  )
}

export default Layout
