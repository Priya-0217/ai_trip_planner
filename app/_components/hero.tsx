"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation" // ✅ Added
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ArrowDown, Globe2, Landmark, Plane, Send } from "lucide-react"
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

import { useAuthStore } from "../../stores/useAuthStore"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { supabase } from "@/lib/supabase"

const suggestions = [
  { title: "Create New Trip", icon: <Globe2 className="h-4 w-4 text-yellow-500" /> },
  { title: "Inspire me where to go", icon: <Plane className="h-4 w-4 text-emerald-500" /> },
  { title: "Discover Hidden Gems", icon: <Landmark className="h-4 w-4 text-slate-500" /> },
  { title: "Adventure Destination", icon: <Globe2 className="h-4 w-4 text-blue-500" /> },
]

const Hero = () => {
  const { user, openAuthModal } = useAuthStore() // ✅ Added openAuthModal
  const searchParams = useSearchParams() // ✅ Added
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const [profile, setProfile] = useState<{ full_name?: string } | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  // ✅ Auto-open auth modal if redirected from protected route
  useEffect(() => {
    if (searchParams.get('auth') === 'signup') {
      openAuthModal()
    }
  }, [searchParams, openAuthModal])

  // Fetch profile when user is available
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setLoadingProfile(true)
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single()
        if (error) {
          console.error("Failed to fetch profile:", error)
        } else {
          setProfile(data)
        }
        setLoadingProfile(false)
      }
      fetchProfile()
    }
  }, [user])

  const handleSendClick = () => {
    router.push("/create-new-trip")
  }

  return (
    <section className="relative mt-28 w-full flex justify-center px-4 transition-colors duration-300 min-h-screen">
      
      {/* Modern animated glass effect background */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        {/* Main pink glow */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-1/4 w-250 h-200 bg-linear-to-br from-pink-500/10 via-fuchsia-500/5 to-transparent rounded-full blur-3xl"
        />
        
        {/* Secondary blue glow */}
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-1/4 w-200 h-150 bg-linear-to-tl from-blue-500/5 via-cyan-500/5 to-transparent rounded-full blur-3xl"
        />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[50px_50px] mask-[radial-gradient(ellipse_80%_80%_at_50%_50%,black_30%,transparent_100%)]" />
      </div>

      <div className="max-w-3xl w-full text-center space-y-8">

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-snug text-center"
        >
          {user ? (
            <>
              Welcome back,{" "}
              <span className="bg-linear-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
                {loadingProfile ? "..." : profile?.full_name || user.email?.split("@")[0]}
              </span>
            </>
          ) : (
            <TypingAnimation>
              Hey, I'm your Personal Trip Planner
            </TypingAnimation>
          )}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          {user 
            ? "Ready to plan your next adventure? Tell me what you want, and I'll handle everything."
            : "Tell me what you want, and I'll handle the rest — flights, hotels, and complete trip planning in seconds."}
        </motion.p>

        {/* Input Card - Only show if user is logged in */}
        {user && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-full rounded-2xl border bg-white/80 dark:bg-zinc-900/80 border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-xl shadow-2xl dark:shadow-black/40 p-6 transition-all hover:shadow-3xl focus-within:shadow-3xl max-w-2xl mx-auto"
              style={{ boxShadow: "0 8px 32px rgba(236, 72, 153, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1) inset" }}
            >
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/10 to-transparent pointer-events-none" />
              
              {/* Textarea wrapper with button inside */}
              <div className="relative">
                <Textarea
                  placeholder="Where would you like to go? (e.g., '3 days in Tokyo with budget hotels')"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="h-32 resize-none border-none bg-transparent focus-visible:ring-0 text-base text-zinc-900 dark:text-zinc-100 placeholder:text-muted-foreground/70 p-0 pr-14"
                />

                <Button
                  size="icon"
                  onClick={handleSendClick}
                  className="absolute bottom-2 right-2 rounded-full bg-linear-to-r from-pink-500 to-fuchsia-500 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* Suggestions - Now outside the card */}
            <div className="flex flex-wrap justify-center gap-3">
              {suggestions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border bg-white/90 dark:bg-zinc-800/90 border-zinc-200 dark:border-zinc-700 text-sm cursor-pointer transition-all duration-300 hover:border-pink-300 dark:hover:border-pink-500/50 hover:shadow-lg backdrop-blur-sm"
                >
                  {s.icon}
                  <span className="text-zinc-800 dark:text-zinc-100 font-medium">{s.title}</span>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Helper section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="my-12 mt-16 space-y-2"
        >
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span className="text-sm">Not sure where to start?</span>
            <strong className="text-zinc-900 dark:text-zinc-100 text-sm font-semibold">
              See how it works
            </strong>
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
          </div>
        </motion.div>

        {/* Video section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-linear-to-r from-pink-500/10 to-blue-500/10 blur-xl rounded-2xl -z-10" />
          
          <HeroVideoDialog
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/mkdGSlmLO6U"
            thumbnailSrc="/travelback.jpg"
            thumbnailAlt="Travel video thumbnail"
            className="w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden ring-1 ring-white/20 dark:ring-white/10 shadow-2xl hover:shadow-3xl transition-shadow duration-300 [&_img]:object-cover"
          />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-linear-to-r from-pink-500/20 to-blue-500/20 blur-md" />
          </div>
        </motion.div>

        {/* Floating elements */}
        <div className="absolute -left-10 top-1/4 -z-10">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-pink-400/20"
          >
            <Plane className="h-16 w-16 rotate-45" />
          </motion.div>
        </div>

        <div className="absolute -right-8 bottom-1/4 -z-10">
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            className="text-blue-400/20"
          >
            <Globe2 className="h-20 w-20" />
          </motion.div>
        </div>
      </div>                      
    </section>
  )
}

export default Hero