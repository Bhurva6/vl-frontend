import { Activity, AlertTriangle, Ban, BarChart3, Bell, Camera, Factory, Gauge, Menu, Shield, Truck, Users } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/authStore'

interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

const adminItems: { heading: string; items: NavItem[] }[] = [
  { heading: 'ANALYTICS', items: [
    { label: 'Overview', path: '/dashboard', icon: BarChart3 },
    { label: 'Footfall & Headcount', path: '/footfall', icon: Users },
    { label: 'Worker Classification', path: '/worker-classification', icon: Users },
  ]},
  { heading: 'SAFETY & COMPLIANCE', items: [
    { label: 'PPE Compliance', path: '/ppe-compliance', icon: Shield },
    { label: 'Gutka/Tobacco Detection', path: '/tobacco-detection', icon: Ban },
  ]},
  { heading: 'OPERATIONS', items: [
    { label: 'Machine Activity', path: '/machine-activity', icon: Activity },
    { label: 'Packing Efficiency', path: '/packing-efficiency', icon: Factory },
    { label: 'Gate Activity', path: '/gate-activity', icon: Gauge },
    { label: 'ANPR / Truck Log', path: '/anpr', icon: Truck },
    { label: 'Alerts', path: '/alerts', icon: Bell },
  ]},
  { heading: 'SETTINGS', items: [
    { label: 'Camera Config', path: '/dashboard', icon: Camera },
    { label: 'User Management', path: '/dashboard', icon: Users },
  ]},
]

const factoryItems: { heading: string; items: NavItem[] }[] = [
  { heading: 'SAFETY', items: [
    { label: 'PPE Compliance', path: '/ppe-compliance', icon: Shield },
    { label: 'Gutka/Tobacco Detection', path: '/tobacco-detection', icon: Ban },
  ]},
  { heading: 'OPERATIONS', items: [
    { label: 'Machine Activity', path: '/machine-activity', icon: Activity },
    { label: 'Packing Efficiency', path: '/packing-efficiency', icon: Factory },
    { label: 'Gate Activity', path: '/gate-activity', icon: Gauge },
    { label: 'ANPR / Truck Log', path: '/anpr', icon: Truck },
    { label: 'Alerts', path: '/alerts', icon: AlertTriangle },
  ]},
]

const mobileItems = [
  { label: 'PPE', path: '/ppe-compliance', icon: Shield },
  { label: 'Machine', path: '/machine-activity', icon: Activity },
  { label: 'Gate', path: '/gate-activity', icon: Gauge },
  { label: 'ANPR', path: '/anpr', icon: Truck },
  { label: 'Alerts', path: '/alerts', icon: Bell },
]

const Sidebar = () => {
  const role = useAuthStore((state) => state.role)
  const [collapsed, setCollapsed] = useState(false)
  const sections = role === 'ADMIN' ? adminItems : factoryItems

  return (
    <>
      <aside className={`hidden border-r border-gray-100 bg-white md:block ${collapsed ? 'w-20' : 'w-56'}`}>
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          {!collapsed && <span className="text-xs font-semibold text-gray-500">NAVIGATION</span>}
          <button type="button" className="rounded-lg border border-gray-200 p-1.5" onClick={() => setCollapsed((v) => !v)}>
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {role === 'FACTORY_MANAGER' && !collapsed && (
          <div className="px-3 py-2">
            <Badge className="bg-orange-100 text-orange-700">FACTORY VIEW</Badge>
          </div>
        )}

        <div className="space-y-5 px-3 py-3">
          {sections.map((section) => (
            <section key={section.heading}>
              {!collapsed && <h3 className="mb-1 px-2 text-[11px] font-bold tracking-[0.12em] text-gray-500">{section.heading}</h3>}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg border-l-4 px-3 py-2 text-sm ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 font-semibold text-blue-600'
                          : 'border-transparent text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </div>
      </aside>

      <nav className="fixed right-0 bottom-0 left-0 z-30 grid grid-cols-5 border-t border-gray-200 bg-white md:hidden">
        {mobileItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `flex flex-col items-center gap-1 py-2 text-xs ${isActive ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}

export default Sidebar
