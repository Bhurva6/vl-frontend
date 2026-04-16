import { create } from 'zustand'
import type { UserRole } from '@/types'

const AUTH_KEY = 'vl_factory_auth'

interface AuthState {
  token: string | null
  username: string
  role: UserRole | null
  isAuthenticated: boolean
  justLoggedIn: boolean
  login: (username: string, password: string, role: UserRole) => { ok: boolean }
  logout: () => void
  clearJustLoggedIn: () => void
}

interface PersistedAuth {
  token: string
  username: string
  role: UserRole
}

const stored = localStorage.getItem(AUTH_KEY)
const parsed: PersistedAuth | null = stored ? JSON.parse(stored) : null

const credentials: Record<UserRole, { username: string; password: string }> = {
  ADMIN: { username: 'admin', password: 'vigilant@admin' },
  FACTORY_MANAGER: { username: 'factory', password: 'kitchen@2024' },
}

export const useAuthStore = create<AuthState>((set) => ({
  token: parsed?.token ?? null,
  username: parsed?.username ?? '',
  role: parsed?.role ?? null,
  isAuthenticated: Boolean(parsed?.token),
  justLoggedIn: false,
  login: (username, password, role) => {
    const expected = credentials[role]
    if (username === expected.username && password === expected.password) {
      const token = `factory-token-${Date.now()}`
      localStorage.setItem(AUTH_KEY, JSON.stringify({ token, username, role }))
      set({ token, username, role, isAuthenticated: true, justLoggedIn: true })
      return { ok: true }
    }

    return { ok: false }
  },
  logout: () => {
    localStorage.removeItem(AUTH_KEY)
    set({ token: null, username: '', role: null, isAuthenticated: false, justLoggedIn: false })
  },
  clearJustLoggedIn: () => set({ justLoggedIn: false }),
}))
