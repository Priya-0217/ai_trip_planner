"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/stores/useAuthStore"

export default function AuthListener() {
  const { setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    // 1️⃣ Initial session check
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email ?? null,
        })
      } else {
        logout()
      }
      setLoading(false)
    })

    // 2️⃣ Auth state changes (login / logout / refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? null,
        })
      } else {
        logout()
      }

      // 🔑 THIS WAS MISSING
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, logout, setLoading])

  return null
}
