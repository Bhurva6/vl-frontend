import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import AlertsPage from '@/pages/AlertsPage'
import ANPRPage from '@/pages/ANPRPage'
import GateActivityPage from '@/pages/GateActivityPage'
import HeadcountPage from '@/pages/HeadcountPage'
import LoginPage from '@/pages/LoginPage'
import MachineActivityPage from '@/pages/MachineActivityPage'
import OverviewPage from '@/pages/OverviewPage'
import PackingEfficiencyPage from '@/pages/PackingEfficiencyPage'
import PPECompliancePage from '@/pages/PPECompliancePage'
import TobaccoPage from '@/pages/TobaccoPage'
import UnauthorizedPage from '@/pages/UnauthorizedPage'

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
          <ProtectedRoute allow={['ADMIN']}>
            <OverviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/headcount',
        element: (
          <ProtectedRoute allow={['ADMIN']}>
            <HeadcountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/ppe-compliance',
        element: (
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <PPECompliancePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/tobacco-detection',
        element: (
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <TobaccoPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/machine-activity',
        element: (
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <MachineActivityPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/packing-efficiency',
        element: (
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <PackingEfficiencyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/gate-activity',
        element: (
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <GateActivityPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/anpr',
        element: (
          <ProtectedRoute allow={['ADMIN', 'FACTORY_MANAGER']}>
            <ANPRPage />
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
