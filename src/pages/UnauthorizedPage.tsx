import { ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 border border-[#E5E7EB] bg-white p-8 text-center">
      <ShieldAlert className="h-10 w-10 text-[#E5000A]" />
      <h2 className="font-display text-4xl italic text-[#0A0A0A]">Unauthorized Access</h2>
      <p className="font-sans text-[#6B7280]">You do not have permission to view this module with your current role.</p>
      <Link className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#0066FF]" to="/login">Return to Login</Link>
    </div>
  )
}

export default UnauthorizedPage
