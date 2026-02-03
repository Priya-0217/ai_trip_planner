import { cn } from "@/lib/utils"
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion"
import { useCallback, useRef } from "react"

interface MagicCardProps {
  children: React.ReactNode
  className?: string
  gradientSize?: number
  gradientFrom?: string
  gradientTo?: string
}

export function MagicCard({
  children,
  className,
  gradientSize = 180, // ⬅️ slightly smaller = faster
  gradientFrom = "#9E7AFF",
  gradientTo = "#FE8BBB",
}: MagicCardProps) {
  const prefersReducedMotion = useReducedMotion()

  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)

  const frame = useRef<number | null>(null)

  const reset = useCallback(() => {
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
  }, [gradientSize, mouseX, mouseY])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return

      // ⛔ Throttle with requestAnimationFrame
      if (frame.current) return

      frame.current = requestAnimationFrame(() => {
        const rect = e.currentTarget.getBoundingClientRect()
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
        frame.current = null
      })
    },
    [mouseX, mouseY, prefersReducedMotion]
  )

  return (
    <div
      className={cn(
        "group relative rounded-xl will-change-transform",
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      {/* ✨ Border glow (GPU optimized) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: prefersReducedMotion
            ? undefined
            : useMotionTemplate`
              radial-gradient(
                ${gradientSize}px circle at ${mouseX}px ${mouseY}px,
                ${gradientFrom},
                ${gradientTo},
                transparent 80%
              )
            `,
        }}
      />

      {/* Card surface */}
      <div className="absolute inset-px rounded-[inherit] bg-background" />

      <div className="relative">{children}</div>
    </div>
  )
}
