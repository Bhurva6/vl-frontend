import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import PageLoader from '@/components/ui/PageLoader'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'))
const OverviewPage = lazy(() => import('@/pages/OverviewPage'))
const WatchmanPage = lazy(() => import('@/pages/WatchmanPage'))
const PhoneUsagePage = lazy(() => import('@/pages/PhoneUsagePage'))
const IntrusionPage = lazy(() => import('@/pages/IntrusionPage'))
const MachinePage = lazy(() => import('@/pages/MachinePage'))
const TruckANPRPage = lazy(() => import('@/pages/TruckANPRPage'))
const AlertsPage = lazy(() => import('@/pages/AlertsPage'))
const GatePage = lazy(() => import('@/pages/GatePage'))
const PresencePage = lazy(() => import('@/pages/PresencePage'))

const wrap = (element: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
)

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: wrap(<LoginPage />) },
  { path: '/unauthorized', element: wrap(<UnauthorizedPage />) },
  {
    element: <Layout />,
    children: [
      {
        path: '/dashboard',
        element: wrap(
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <OverviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/watchman',
        element: wrap(
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <WatchmanPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/phone-usage',
        element: wrap(
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <PhoneUsagePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/intrusion',
        element: wrap(
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <IntrusionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/machine',
        element: wrap(
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <MachinePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/anpr',
        element: wrap(
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <TruckANPRPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/alerts',
        element: wrap(
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <AlertsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/gate',
        element: wrap(
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <GatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/presence',
        element: wrap(
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <PresencePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
])

export default router
