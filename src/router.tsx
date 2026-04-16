import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import AlertsPage from '@/pages/AlertsPage'
import ANPRPage from '@/pages/ANPRPage'
import FootfallPage from '@/pages/FootfallPage'
import GateActivityPage from '@/pages/GateActivityPage'
import LoginPage from '@/pages/LoginPage'
import MachineActivityPage from '@/pages/MachineActivityPage'
import OverviewPage from '@/pages/OverviewPage'
import PackingEfficiencyPage from '@/pages/PackingEfficiencyPage'
import PPECompliancePage from '@/pages/PPECompliancePage'
import TobaccoDetectionPage from '@/pages/TobaccoDetectionPage'
import UnauthorizedPage from '@/pages/UnauthorizedPage'
import WorkerClassificationPage from '@/pages/WorkerClassificationPage'

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
        path: '/footfall',
        element: (
          <ProtectedRoute allow={['ADMIN']}>
            <FootfallPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/worker-classification',
        element: (
          <ProtectedRoute allow={['ADMIN']}>
            <WorkerClassificationPage />
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
            <TobaccoDetectionPage />
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
