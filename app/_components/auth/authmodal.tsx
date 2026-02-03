"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useAuthStore } from "@/stores/useAuthStore"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { Github } from "lucide-react"
import { MagicCard } from "@/components/ui/magic-card"

export default function AuthModal() {
  const { showAuthModal, closeAuthModal } = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Email / Password auth
  const handleSubmit = async () => {
    if (!email || !password) return
    setIsSubmitting(true)

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) alert(error.message)
      else alert("Check your email to confirm your account!")
    }

    setIsSubmitting(false)
    closeAuthModal()
    setEmail("")
    setPassword("")
  }

  // GitHub OAuth
  const handleGithubAuth = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.origin },
    })
  }

  return (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md group hover:scale-[1.01] transition-transform"
          >
            {/* MagicCard — hover only */}
            <MagicCard
              className="
                 p-6 rounded-2xl
    bg-white dark:bg-zinc-900
    border border-zinc-200 dark:border-zinc-800
    shadow-lg dark:shadow-black/30
    transition-all
    group-hover:border-pink-500/40
              "
            >
              <h2 className="text-xl font-semibold mb-4">
                {mode === "login" ? "Sign in" : "Create account"}
              </h2>

              {/* GitHub */}
              <Button
                variant="outline"
                className="w-full mb-4 flex items-center justify-center gap-2"
                onClick={handleGithubAuth}
              >
                <Github className="h-5 w-5" />
                Continue with GitHub
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Email */}
              <input
                className="w-full mb-3 rounded-lg border px-4 py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Password */}
              <input
                type="password"
                className="w-full mb-4 rounded-lg border px-4 py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Submit */}
              <Button
                className="w-full mb-2"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Continue"}
              </Button>

              {/* Switch */}
              <button
                className="text-sm text-muted-foreground hover:text-foreground transition"
                onClick={() =>
                  setMode(mode === "login" ? "signup" : "login")
                }
              >
                {mode === "login"
                  ? "Create an account"
                  : "Already have an account?"}
              </button>
            </MagicCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
