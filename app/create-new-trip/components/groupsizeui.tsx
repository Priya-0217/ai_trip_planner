import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export const SelectTravelesList = [
  {
    id: 1,
    title: 'Just Me',
    desc: 'A sole traveler in exploration',
    icon: '✈️',
    people: '1 Person'
  },
  {
    id: 2,
    title: 'A Couple',
    desc: 'Two travelers in tandem',
    icon: '🥂',
    people: '2 People'
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A group of fun loving adventurers',
    icon: '🏠',
    people: '3 to 5 People'
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'A bunch of thrill-seekers',
    icon: '⛵',
    people: '5 to 10 People'
  },
]

const GroupSizeUi = ({onSelectedOption}: any) => {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Who's traveling?
        </h2>
        <p className="text-muted-foreground">
          Select the group size for your adventure
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SelectTravelesList.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectedOption(item.title+":"+item.people)}
            className={`
              relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300
              ${selected === item.id
                ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-fuchsia-50 dark:from-pink-900/20 dark:to-fuchsia-900/20 shadow-lg'
                : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:border-pink-300 dark:hover:border-pink-500/50 hover:shadow-md'
              }
            `}
          
          >
            {/* Selection Indicator */}
            {selected === item.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 flex items-center justify-center"
              >
                <Check className="h-4 w-4 text-white" />
              </motion.div>
            )}

            {/* Icon */}
            <div className="text-4xl mb-3">{item.icon}</div>

            {/* Title */}
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-1">
              {item.title}
            </h3>

            
            

            {/* People Count */}
            <div className={`
              inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
              ${selected === item.id
                ? 'bg-pink-200 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300'
                : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }
            `}>
              {item.people}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default GroupSizeUi