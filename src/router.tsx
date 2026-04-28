import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import AlertsPage from '@/pages/AlertsPage'
import IntrusionPage from '@/pages/IntrusionPage'
import LoginPage from '@/pages/LoginPage'
import MachinePage from '@/pages/MachinePage'
import OverviewPage from '@/pages/OverviewPage'
import PhoneUsagePage from '@/pages/PhoneUsagePage'
import TruckANPRPage from '@/pages/TruckANPRPage'
import UnauthorizedPage from '@/pages/UnauthorizedPage'
import WatchmanPage from '@/pages/WatchmanPage'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  {
    element: <Layout />,
    children: [
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <OverviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/watchman',
        element: (
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <WatchmanPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/phone-usage',
        element: (
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <PhoneUsagePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/intrusion',
        element: (
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <IntrusionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/machine',
        element: (
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <MachinePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/anpr',
        element: (
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <TruckANPRPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/alerts',
        element: (
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <AlertsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
])

export default router
