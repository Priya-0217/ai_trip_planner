"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Logo from "@/components/ui/logo"
import { ThemeToggleButton } from "@/components/ui/skiper-ui/skiper26"
import { User, LogOut } from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"
import { supabase } from "@/lib/supabase"
import { AnimatePresence, motion } from "framer-motion"

const menuOptions = [
  { label: "Home", link: "/" },
  { label: "Pricing", link: "/pricing" },
  { label: "Contact Us", link: "/contact-us" },
]

const Header = () => {
  const { user, loading, openAuthModal } = useAuthStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header
      className="
        sticky top-0 z-50
        backdrop-blur-xl
        bg-white/70 dark:bg-neutral-900/70
        border-b border-pink-500/20
      "
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3 group">
            <Logo />
            <h2
              className="
                font-bold text-xl tracking-tight
                text-neutral-900 dark:text-neutral-100
                transition-colors
                group-hover:text-pink-500
              "
            >
              AI Trip Planner
            </h2>
          </div>

          {/* Menu */}
          <nav className="hidden md:flex gap-8">
            {menuOptions.map((menu) => (
              <Link
                key={menu.link}
                href={menu.link}
                className="
                  relative text-md font-medium
                  text-neutral-700 dark:text-neutral-300
                  transition-colors
                  hover:text-pink-500
                  after:absolute after:-bottom-1 after:left-0
                  after:h-0.5 after:w-0
                  after:bg-pink-500
                  after:transition-all after:duration-300
                  hover:after:w-full
                "
              >
                {menu.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">

            {/* Theme Toggle */}
            <ThemeToggleButton
              variant="circle"
              start="bottom-left"
              className="scale-90"
            />

            {/* User / Auth */}
            <AnimatePresence>
              {!loading && user ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5
                             bg-white/80 dark:bg-neutral-800/80
                             border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="h-8 w-8 rounded-full bg-linear-to-r from-pink-500 to-fuchsia-500 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>

                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                    {user.email?.split("@")[0]}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {/* ✅ THIS IS WHAT YOU ASKED */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={openAuthModal}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA */}
            <Link href="/create-new-trip">
              <Button
                className="
                  rounded-full px-6
                  bg-linear-to-r from-pink-500 to-fuchsia-500
                  text-white
                  shadow-md
                  hover:shadow-lg
                  hover:scale-105
                  transition-all
                "
              >
                Get Started
              </Button>
            </Link>

          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
