import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/layout/Header'
import ModuleTabs from '@/components/layout/ModuleTabs'
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
    <div className="min-h-screen bg-white text-[#0A0A0A]">
      <Header />
      <div className="pt-[108px]">
        <ModuleTabs />
        <main className="px-8 py-6">
          {isRouteLoading ? <PageLoader /> : <Outlet />}
        </main>
      </div>
    </div>
  )
}

export default Layout
