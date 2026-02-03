"use client"

import React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Globe2, Landmark, Plane, Send } from "lucide-react"
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog"
import { motion } from "framer-motion"
import { OrbitingCircles } from "@/components/ui/orbiting-circles"

const suggestions = [
  {
    title: "Create New Trip",
    icon: <Globe2 className="h-4 w-4 text-yellow-500" />,
  },
  {
    title: "Inspire me where to go",
    icon: <Plane className="h-4 w-4 text-emerald-500" />,
  },
  {
    title: "Discover Hidden Gems",
    icon: <Landmark className="h-4 w-4 text-slate-500" />,
  },
  {
    title: "Adventure Destination",
    icon: <Globe2 className="h-4 w-4 text-blue-500" />,
  },
]

const Hero = () => {
  return (
    <section className="mt-28 w-full flex justify-center px-4">
      <div className="max-w-3xl w-full text-center space-y-8">

        {/* Headline */}
        <h1 className="text-4xl font-bold tracking-tight md:text-4xl">
          Hey, I’m your personal{" "}
          <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
            Trip Planner
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Tell me what you want, and I’ll handle the rest — flights, hotels, and
          complete trip planning in seconds.
        </p>

        {/* Input Card with Orbiting Background */}
        <div className="relative">

          {/* Orbiting Circles (subtle, behind textarea) */}
          <OrbitingCircles
            radius={140}
            duration={40}
            className="absolute inset-0 -z-10 opacity-20 pointer-events-none"
          >
            <Plane className="h-4 w-4 text-pink-400" />
            <Globe2 className="h-4 w-4 text-fuchsia-400" />
            <Landmark className="h-4 w-4 text-rose-400" />
          </OrbitingCircles>

          {/* Textarea Card */}
          <div
            className="
              relative
              rounded-2xl
              border
              bg-white/80 backdrop-blur
              shadow-lg
              p-4
              transition
              hover:shadow-xl
            "
          >
            <Textarea
              placeholder="Create a trip…"
              className="
                h-28
                resize-none
                border-none
                bg-transparent
                focus-visible:ring-0
                text-base
              "
            />

            <Button
              size="icon"
              className="
                absolute
                bottom-4 right-4
                rounded-full
                bg-gradient-to-r from-pink-500 to-fuchsia-500
                shadow-md
                hover:shadow-lg
                hover:scale-105
                transition
              "
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="
                flex items-center gap-2
                px-4 py-2
                rounded-full
                border
                bg-white
                text-sm
                cursor-pointer
                transition-all
                hover:bg-pink-50
                hover:border-pink-300
                hover:scale-105
              "
            >
              {suggestion.icon}
              <span>{suggestion.title}</span>
            </div>
          ))}
        </div>

        {/* Hero Video (clean, focused) */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="w-full"
        >
          <HeroVideoDialog
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/mkdGSlmLO6U"
            thumbnailSrc="/travelback.jpg"
            thumbnailAlt="Travel video thumbnail"
            className="
              w-full
              max-w-3xl
              mx-auto
              aspect-video
              rounded-2xl
              overflow-hidden
              [&_img]:object-cover
              [&_img]:object-center
            "
          />
        </motion.div>

      </div>
    </section>
  )
}

export default Hero
