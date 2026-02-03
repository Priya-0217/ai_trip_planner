import { motion } from "framer-motion"
import { DollarSign, Wallet, Sparkles, TrendingUp } from "lucide-react"
import { useState } from "react"

type BudgetOption = {
  id: number
  title: string
  desc: string
  icon: any
  value: string
}

const budgetOptions: BudgetOption[] = [
  {
    id: 1,
    title: "Budget Friendly",
    desc: "Keep costs low, maximize experiences",
    icon: Wallet,
    value: "cheap",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Balance between comfort and value",
    icon: DollarSign,
    value: "moderate",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Premium experiences and comfort",
    icon: Sparkles,
    value: "luxury",
  },
  {
    id: 4,
    title: "Ultra Luxury",
    desc: "Exclusive and unforgettable",
    icon: TrendingUp,
    value: "ultra",
  },
]

type Props = {
  onSelect?: (value: string) => void
}

export default function BudgetUi({ onSelect }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  const handleSelect = (option: BudgetOption) => {
    setSelected(option.id)
    onSelect?.(option.value)
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-4">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100"
      >
        What's your{" "}
        <span className="bg-linear-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
          Budget
        </span>
        ?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-muted-foreground mb-8"
      >
        Select the budget style that fits your trip
      </motion.p>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {budgetOptions.map((option, index) => {
          const Icon = option.icon
          const isSelected = selected === option.id

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(option)}
              className={`
                group relative w-full rounded-2xl border p-5 text-left transition-all duration-300
                ${
                  isSelected
                    ? "border-green-500 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 shadow-xl shadow-green-500/20 ring-2 ring-green-400/50"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-green-400/60 shadow-md"
                }
              `}
            >
              {/* Selected Badge */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 h-5 w-5 rounded-full bg-linear-to-r from-green-500 to-emerald-500 flex items-center justify-center"
                >
                  <div className="h-2 w-2 bg-white rounded-full" />
                </motion.div>
              )}

              {/* Icon */}
              <div
                className={`
                  mb-4 inline-flex rounded-xl p-3 transition-all
                  ${
                    isSelected
                      ? "bg-linear-to-br from-green-200 to-emerald-200 dark:from-green-900/50 dark:to-emerald-900/50"
                      : "bg-linear-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30"
                  }
                `}
              >
                <Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>

              {/* Text */}
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                {option.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {option.desc}
              </p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
