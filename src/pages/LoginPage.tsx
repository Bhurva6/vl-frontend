import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/types'

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'ADMIN',
  FACTORY_MANAGER: 'FACTORY MANAGER',
}

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
    <div className="grid min-h-screen bg-white lg:grid-cols-[55fr_1px_45fr]">
      <section className="flex flex-col justify-between px-8 py-10 lg:px-14 lg:py-12">
        <div className="space-y-10">
          <div className="flex items-center gap-3">
            <span className="h-12 w-1 bg-[#0066FF]" />
            <div>
              <p className="font-display text-[20px] leading-none text-[#0A0A0A]">VIGILANT</p>
              <p className="font-mono text-[10px] tracking-[0.35em] text-[#6B7280]">LABS</p>
            </div>
          </div>

          <div className="max-w-xl space-y-8">
            <h1 className="font-display text-[52px] italic leading-[0.92] text-[#0A0A0A] md:text-[72px]">
              Factory
              <br />
              Intelligence,
              <br />
              <span className="text-[#0066FF]">Precisely.</span>
            </h1>

            <div className="space-y-0 border-t border-[#E5E7EB]">
              {[
                '342 Workers Monitored Daily',
                '91.3% PPE Compliance Target',
                '6 AI Cameras Active',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 border-b border-[#E5E7EB] py-4">
                  <span className="h-2 w-2 bg-[#0066FF]" />
                  <p className="font-mono text-[14px] text-[#0A0A0A]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-1 font-mono text-[12px] text-[#6B7280]">
          <p>support@vigilantlabs.in</p>
          <p>LinkedIn - Vigilant Labs</p>
        </div>
      </section>

      <div className="hidden bg-[#E5E7EB] lg:block" />

      <section className="relative flex items-center px-8 py-10 lg:px-14 lg:py-12">
        <form className="w-full max-w-md space-y-10" onSubmit={onSubmit}>
          <div className="space-y-5">
            <h2 className="font-display text-[32px] text-[#0A0A0A]">Sign In</h2>
            <div className="flex items-center gap-8">
              {(Object.keys(roleLabels) as UserRole[]).map((item) => {
                const active = role === item
                return (
                  <button
                    key={item}
                    type="button"
                    className={`border-b-2 pb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] ${active ? 'border-[#0066FF] text-[#0066FF]' : 'border-transparent text-[#6B7280]'}`}
                    onClick={() => setRole(item)}
                  >
                    {roleLabels[item]}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-8">
            <label className="block">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-[#6B7280]">Username</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={placeholders.user}
                className="w-full border-0 border-b-2 border-[#D1D5DB] px-0 py-3 font-mono text-[16px] text-[#0A0A0A] outline-none placeholder:text-[#9CA3AF] focus:border-[#0066FF]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-[#6B7280]">Password</span>
              <div className="flex items-center border-b-2 border-[#D1D5DB]">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={placeholders.pass}
                  className="w-full border-0 px-0 py-3 font-mono text-[16px] text-[#0A0A0A] outline-none placeholder:text-[#9CA3AF]"
                />
                <button type="button" className="text-[#6B7280]" onClick={() => setShowPassword((value) => !value)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-[52px] w-full items-center justify-center rounded-none bg-[#0066FF] px-4 font-sans text-[13px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#0052CC] disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  SIGNING IN
                </span>
              ) : 'SIGN IN ->'}
            </button>

            {hasError && <p className="font-mono text-[12px] text-[#E5000A]">INVALID CREDENTIALS</p>}
          </div>
        </form>

        <p className="absolute right-8 bottom-8 font-mono text-[10px] uppercase tracking-[0.18em] text-[#D1D5DB]">
          Powered by VIGILANT LABS
        </p>
      </section>
    </div>
  )
}

export default LoginPage
