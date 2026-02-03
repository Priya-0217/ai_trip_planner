import { create } from "zustand"

export type User = {
  id: string
  email: string | null
}

interface AuthState {
  user: User | null
  loading: boolean

  // Auth actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void

  // Auth modal control
  showAuthModal: boolean
  openAuthModal: () => void
  closeAuthModal: () => void

  // 🔹 NEW: handle email confirmation and redirect
  handleEmailConfirmation: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  // Existing
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null }),

  // Auth modal
  showAuthModal: false,
  openAuthModal: () => set({ showAuthModal: true }),
  closeAuthModal: () => set({ showAuthModal: false }),

  // 🔹 NEW
  handleEmailConfirmation: (user) => {
    set({ user })

    // Redirect in current window or parent if popup
    if (window.opener) {
      window.opener.location.href = "/" // or your dashboard route
      window.close()
    } else {
      window.location.href = "/" // or your dashboard route
    }
  },
}))
