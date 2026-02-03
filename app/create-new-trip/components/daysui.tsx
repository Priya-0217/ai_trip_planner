"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus, Calendar } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

type Props = {
  onSelect?: (value: number) => void
}

export default function DaysUi({ onSelect }: Props) {
  const [days, setDays] = useState(2)

  const increase = () => setDays((d) => Math.min(d + 1, 30))
  const decrease = () => setDays((d) => Math.max(d - 1, 1))

  const handleConfirm = () => {
    onSelect?.(days)
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-center mb-2"
      >
        How many{" "}
        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          days
        </span>{" "}
        will you travel?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center text-muted-foreground mb-8"
      >
        Adjust the duration of your trip
      </motion.p>

      {/* Counter Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-xl p-6 mb-8"
      >
        <div className="flex items-center justify-center gap-8">
          {/* Minus */}
          <Button
            variant="outline"
            size="icon"
            onClick={decrease}
            className="h-12 w-12 rounded-full shadow-sm hover:shadow-md"
          >
            <Minus />
          </Button>

          {/* Number */}
          <div className="flex flex-col items-center">
            <Calendar className="h-6 w-6 text-orange-500 mb-1" />

            <AnimatePresence mode="wait">
              <motion.div
                key={days}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-4xl font-bold text-zinc-900 dark:text-zinc-100"
              >
                {days}
              </motion.div>
            </AnimatePresence>

            <span className="text-sm text-muted-foreground">
              {days === 1 ? "Day" : "Days"}
            </span>
          </div>

          {/* Plus */}
          <Button
            variant="outline"
            size="icon"
            onClick={increase}
            className="h-12 w-12 rounded-full shadow-sm hover:shadow-md"
          >
            <Plus />
          </Button>
        </div>
      </motion.div>

      {/* Confirm */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex justify-center"
      >
        <Button
          onClick={handleConfirm}
          className="px-10 py-5 rounded-full text-base font-semibold
          bg-gradient-to-r from-orange-500 to-amber-500
          hover:from-orange-600 hover:to-amber-600
          shadow-lg hover:shadow-xl transition-all"
        >
          Confirm Days
        </Button>
      </motion.div>
    </div>
  )
}
