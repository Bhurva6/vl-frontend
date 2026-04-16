import { ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
      <ShieldAlert className="h-10 w-10 text-red-500" />
      <h2 className="text-2xl font-bold text-[#1A1A2E]">Unauthorized Access</h2>
      <p className="text-gray-500">You do not have permission to view this module with your current role.</p>
      <Link className="text-blue-600" to="/login">Return to Login</Link>
    </div>
  )
}

export default UnauthorizedPage
