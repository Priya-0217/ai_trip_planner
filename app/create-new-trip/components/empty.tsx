import { motion } from "framer-motion"
import { Sparkles, Compass, Mountain } from "lucide-react"

type Props = {
  onSelect: (text: string) => void
}

export default function EmptyState({ onSelect }: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto text-center mt-20 px-4">
      
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-3 text-zinc-900 dark:text-zinc-100"
      >
        Start Planning new{" "}
        <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
          Trip
        </span>{" "}
        using AI
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-muted-foreground max-w-2xl mx-auto mb-10"
      >
        Discover personalized travel itineraries, hidden gems, and adventure
        destinations with the power of AI.
      </motion.p>

      {/* Options */}
      <div className="space-y-4 max-w-xl mx-auto">
        
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("Inspire me where to go")}
          className="w-full flex items-center gap-3 px-5 py-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800/50 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:border-pink-300 dark:hover:border-pink-500/50 transition-all duration-300 text-left shadow-sm hover:shadow-md"
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-pink-100 to-fuchsia-100 dark:from-pink-900/30 dark:to-fuchsia-900/30">
            <Sparkles className="h-5 w-5 text-pink-600 dark:text-pink-400" />
          </div>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            Inspire me where to go
          </span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("Discover hidden gems")}
          className="w-full flex items-center gap-3 px-5 py-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800/50 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:border-pink-300 dark:hover:border-pink-500/50 transition-all duration-300 text-left shadow-sm hover:shadow-md"
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-pink-100 to-fuchsia-100 dark:from-pink-900/30 dark:to-fuchsia-900/30">
            <Compass className="h-5 w-5 text-pink-600 dark:text-pink-400" />
          </div>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            Discover hidden gems
          </span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("Suggest an adventure destination")}
          className="w-full flex items-center gap-3 px-5 py-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800/50 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:border-pink-300 dark:hover:border-pink-500/50 transition-all duration-300 text-left shadow-sm hover:shadow-md"
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-pink-100 to-fuchsia-100 dark:from-pink-900/30 dark:to-fuchsia-900/30">
            <Mountain className="h-5 w-5 text-pink-600 dark:text-pink-400" />
          </div>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            Adventure destination
          </span>
        </motion.button>

      </div>
    </div>
  )
}