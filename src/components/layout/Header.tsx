import { Activity } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const Header = () => {
  const navigate = useNavigate()
  const role = useAuthStore((state) => state.role)
  const username = useAuthStore((state) => state.username)

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b-2 border-black bg-white px-6 py-4">
      <div className="flex items-center justify-between gap-6">
        <Link to="/alerts" className="flex min-w-0 items-center gap-3 no-underline">
          <span className="h-12 w-1 shrink-0 bg-[#0066FF]" />
          <div className="min-w-0">
            <div className="font-display text-[20px] leading-none text-[#0A0A0A]">VIGILANT</div>
            <div className="font-mono text-[10px] tracking-[0.35em] text-[#6B7280]">LABS</div>
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center xl:flex">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
            KITCHEN ESSENTIALS FACTORY - LIVE OPERATIONS
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="hidden items-center gap-2 md:flex">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping bg-[#00B341]/35" />
              <span className="relative inline-flex h-2.5 w-2.5 bg-[#00B341]" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#0A0A0A]">LIVE</span>
          </div>

          <span
            className={`rounded-sm border px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.18em] ${
              role === 'ADMIN' ? 'border-[#0066FF] bg-blue-50 text-[#0066FF]' : 'border-[#FF6B00] bg-orange-50 text-[#FF6B00]'
            }`}
          >
            {role === 'ADMIN' ? 'ADMIN' : 'FACTORY'}
          </span>

          <span className="font-mono text-[12px] text-[#0A0A0A]">{username}</span>

          <button
            type="button"
            className="font-sans text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0A0A0A] transition hover:text-[#0066FF]"
            onClick={() => {
              useAuthStore.getState().logout()
              navigate('/login')
            }}
          >
            <span className="inline-flex items-center gap-2"><Activity className="h-3.5 w-3.5" />Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
