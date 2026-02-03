"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Logo from '@/components/ui/logo'
import { ThemeToggleButton } from '@/components/ui/skiper-ui/skiper26'

const menuOptions = [
  { label: 'Home', link: '/' },
  { label: 'Pricing', link: '/pricing' },
  { label: 'Contact Us', link: '/contact-us' },
]

const Header = () => {
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
            <h2 className="
              font-bold text-xl tracking-tight
              text-neutral-900 dark:text-neutral-100
              transition-colors
              group-hover:text-pink-500
            ">
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
                  after:h-[2px] after:w-0
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
              start='bottom-left'
              className="scale-90"
            />

            {/* CTA */}
            <Button
              className="
                rounded-full px-6
                bg-gradient-to-r from-pink-500 to-fuchsia-500
                text-white
                shadow-md
                hover:shadow-lg
                hover:scale-105
                transition-all
              "
            >
              Get Started
            </Button>

          </div>

        </div>
      </div>
    </header>
  )
}

export default Header
