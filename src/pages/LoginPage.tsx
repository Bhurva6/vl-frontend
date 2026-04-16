import { Building2, Eye, EyeOff, Loader2, Lock, User } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/types'

const LoginPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const [role, setRole] = useState<UserRole>('ADMIN')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasError, setHasError] = useState(false)

  const placeholders = role === 'ADMIN'
    ? { user: 'admin', pass: 'vigilant@admin' }
    : { user: 'factory', pass: 'kitchen@2024' }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setHasError(false)
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))
    const result = login(username, password, role)
    setIsSubmitting(false)

    if (!result.ok) {
      setHasError(true)
      return
    }

    navigate(role === 'ADMIN' ? '/dashboard' : '/ppe-compliance')
  }

  return (
    <div className="grid min-h-screen md:grid-cols-[3fr_2fr]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1A2E] via-[#1e2f5f] to-[#00C2FF] p-10 text-white">
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[#00C2FF]/25 blur-2xl" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <div className="mb-8">
              <p className="font-heading text-3xl font-bold">VIGILANT LABS</p>
              <p className="text-xs tracking-[0.25em] text-cyan-100">MEASURED. MONITORED. MASTERED.</p>
              <p className="mt-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">KITCHEN ESSENTIALS</p>
            </div>
            <h1 className="max-w-xl text-4xl font-bold leading-tight text-white">Master Your Factory Intelligence.</h1>
            <p className="mt-4 max-w-xl text-blue-100">
              Real-time AI video analytics for safety, compliance & production efficiency - built for manufacturing.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/20 px-4 py-2">🔴 Live Factory Monitoring</span>
              <span className="rounded-full bg-white/20 px-4 py-2">🟢 AI-Powered Safety Alerts</span>
              <span className="rounded-full bg-white/20 px-4 py-2">🔵 PPE & Machine Compliance</span>
            </div>
          </div>

          <div className="text-sm text-blue-100">
            <p>hello@vigilantlabs.in</p>
            <p>Support - +91 957432221</p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center bg-white p-6">
        <Card className="w-full max-w-md border border-gray-100">
          <p className="text-xs font-bold tracking-[0.24em] text-gray-500">WELCOME BACK</p>
          <h2 className="mt-2 text-3xl font-bold text-[#1A1A2E]">Sign In</h2>

          <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)} className="mt-6">
            <TabsList className="w-full">
              <TabsTrigger className="flex-1" value="ADMIN">ADMIN</TabsTrigger>
              <TabsTrigger className="flex-1" value="FACTORY_MANAGER">FACTORY MANAGER</TabsTrigger>
            </TabsList>
          </Tabs>

          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-600">Username</label>
              <div className="relative">
                <User className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9"
                  placeholder={placeholders.user}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-600">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 pl-9"
                  placeholder={placeholders.pass}
                />
                <button
                  type="button"
                  className="absolute top-2.5 right-2 rounded-md p-1 text-gray-500"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {hasError && <p className="text-sm font-medium text-red-500">Invalid credentials</p>}

            <Button type="submit" className="font-heading w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing In
                </span>
              ) : (
                'Sign In →'
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
            <Building2 className="h-4 w-4" />
            Powered by Vigilant Labs
          </div>
        </Card>
      </section>
    </div>
  )
}

export default LoginPage
