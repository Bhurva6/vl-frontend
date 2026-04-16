import { LogOut } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'

const titleMap: Record<string, string> = {
  '/dashboard': 'Overview',
  '/footfall': 'Footfall & Headcount',
  '/worker-classification': 'Worker Classification',
  '/ppe-compliance': 'PPE Compliance',
  '/tobacco-detection': 'Gutka / Tobacco Detection',
  '/machine-activity': 'Machine Activity',
  '/packing-efficiency': 'Packing Efficiency',
  '/gate-activity': 'Gate Activity',
  '/anpr': 'ANPR / Truck Log',
  '/alerts': 'Alerts',
}

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const username = useAuthStore((state) => state.username)
 const role = useAuthStore((state) => state.role)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
      <div>
        <p className="font-heading text-lg font-bold text-[#1A1A2E]">VIGILANT LABS</p>
        <p className="text-xs text-gray-500">Factory Intelligence</p>
      </div>

      <h1 className="text-lg font-bold text-[#1A1A2E]">{titleMap[location.pathname] ?? 'Factory Intelligence'}</h1>

      <div className="flex items-center gap-2">
        <Badge className="bg-[#1A1A2E] text-white">KITCHEN ESSENTIALS</Badge>
        <Badge variant="outline">{username}</Badge>
        <Badge className={role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}>
          {role === 'ADMIN' ? 'ADMIN' : 'FACTORY'}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => {
            useAuthStore.getState().logout()
            navigate('/login')
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </header>
  )
}

export default Navbar
