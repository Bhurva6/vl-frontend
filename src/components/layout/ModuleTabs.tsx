import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const adminTabs = [
  { label: 'OVERVIEW', path: '/dashboard' },
  { label: 'HEADCOUNT', path: '/headcount' },
  { label: 'PPE', path: '/ppe-compliance' },
  { label: 'TOBACCO', path: '/tobacco-detection' },
  { label: 'MACHINES', path: '/machine-activity' },
  { label: 'PACKING', path: '/packing-efficiency' },
  { label: 'GATE', path: '/gate-activity' },
  { label: 'ANPR', path: '/anpr' },
  { label: 'ALERTS', path: '/alerts' },
]

const factoryTabs = [
  { label: 'PPE', path: '/ppe-compliance' },
  { label: 'TOBACCO', path: '/tobacco-detection' },
  { label: 'MACHINES', path: '/machine-activity' },
  { label: 'PACKING', path: '/packing-efficiency' },
  { label: 'GATE', path: '/gate-activity' },
  { label: 'ANPR', path: '/anpr' },
  { label: 'ALERTS', path: '/alerts' },
]

const ModuleTabs = () => {
  const role = useAuthStore((state) => state.role)
  const tabs = role === 'ADMIN' ? adminTabs : factoryTabs

  return (
    <nav className="sticky top-[144px] z-30 border-b border-[#F3F4F6] bg-white px-6">
      <div className="flex gap-6 overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `border-b-2 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                isActive
                  ? 'border-[#0066FF] text-[#0066FF]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0A0A0A]'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default ModuleTabs
