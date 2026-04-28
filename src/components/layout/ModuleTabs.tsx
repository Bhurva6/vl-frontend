import { NavLink } from 'react-router-dom'

const tabs = [
  { label: 'OVERVIEW', path: '/dashboard' },
  { label: 'WATCHMAN', path: '/watchman' },
  { label: 'PHONE USAGE', path: '/phone-usage' },
  { label: 'INTRUSION', path: '/intrusion' },
  { label: 'MACHINE', path: '/machine' },
  { label: 'TRUCK ANPR', path: '/anpr' },
  { label: 'ALERTS', path: '/alerts' },
]

const ModuleTabs = () => {
  return (
    <nav className="sticky top-[64px] z-30 border-b border-[#F3F4F6] bg-white px-6">
      <div className="flex gap-6 overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
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
