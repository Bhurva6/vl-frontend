import { AlertTriangle, BarChart3, Bell, Cpu, Menu, Shield, Smartphone, Truck } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

const navSections: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'OVERVIEW',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    ],
  },
  {
    heading: 'MONITORING',
    items: [
      { label: 'Watchman', path: '/watchman', icon: Shield },
      { label: 'Phone Usage', path: '/phone-usage', icon: Smartphone },
      { label: 'Intrusion', path: '/intrusion', icon: AlertTriangle },
      { label: 'Machine Status', path: '/machine', icon: Cpu },
      { label: 'Truck ANPR', path: '/anpr', icon: Truck },
    ],
  },
  {
    heading: 'ALERTS',
    items: [
      { label: 'Alert Queue', path: '/alerts', icon: Bell },
    ],
  },
]

const Sidebar = () => {
  const role = useAuthStore((state) => state.role)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <aside className={`hidden border-r border-gray-100 bg-white md:flex md:flex-col ${collapsed ? 'w-16' : 'w-56'}`}>
        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-3">
          {!collapsed && <span className="text-xs font-semibold text-gray-500">NAVIGATION</span>}
          <button type="button" className="rounded-lg border border-gray-200 p-1.5" onClick={() => setCollapsed(v => !v)}>
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-2 py-3">
          {navSections.map(section => (
            <section key={section.heading}>
              {!collapsed && (
                <h3 className="mb-1 px-2 text-[10px] font-bold tracking-[0.14em] text-gray-400">{section.heading}</h3>
              )}
              <div className="space-y-0.5">
                {section.items.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg border-l-4 px-2 py-2 text-sm transition-colors ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 font-semibold text-blue-600'
                          : 'border-transparent text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </div>

        {!collapsed && (
          <div className="border-t border-gray-100 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
              {role === 'ADMIN' ? 'Admin' : 'Factory Manager'}
            </p>
          </div>
        )}
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed right-0 bottom-0 left-0 z-30 grid grid-cols-7 border-t border-gray-200 bg-white md:hidden">
        {[
          { label: 'Overview', path: '/dashboard', icon: BarChart3 },
          { label: 'Watchman', path: '/watchman', icon: Shield },
          { label: 'Phone', path: '/phone-usage', icon: Smartphone },
          { label: 'Intrusion', path: '/intrusion', icon: AlertTriangle },
          { label: 'Machine', path: '/machine', icon: Cpu },
          { label: 'ANPR', path: '/anpr', icon: Truck },
          { label: 'Alerts', path: '/alerts', icon: Bell },
        ].map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2 text-[9px] ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
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
