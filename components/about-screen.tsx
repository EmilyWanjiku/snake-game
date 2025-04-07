"use client"

import { motion } from "framer-motion"

interface AboutScreenProps {
  onBackClick: () => void
}

export default function AboutScreen({ onBackClick }: AboutScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex w-full max-w-md flex-col items-center rounded-lg bg-gray-800 p-8 shadow-xl"
    >
      <h2 className="mb-6 text-3xl font-bold text-emerald-400">About</h2>

      <div className="mb-6 w-full space-y-4 text-gray-200">
        <p>Legendary Snake is an enhanced version of the classic Snake game with multiple levels and themes.</p>
        <p>Navigate the snake to eat food and grow longer. Be careful not to collide with yourself or obstacles!</p>
        <p>
          As you progress through levels, you'll encounter new challenges including villagers running away from your
          snake.
        </p>

        <h3 className="mt-6 text-xl font-semibold text-emerald-400">Controls:</h3>
        <ul className="list-inside list-disc space-y-1">
          <li>Arrow keys or on-screen buttons to move</li>
          <li>P or Pause button to pause the game</li>
          <li>M or Menu button to return to menu</li>
        </ul>

        <h3 className="mt-6 text-xl font-semibold text-emerald-400">Credits:</h3>
        <p>Created by Emily and cyberghost</p>
        <p>© 2025 Legendary Snake Game</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBackClick}
        className="rounded-md bg-emerald-500 px-6 py-3 text-lg font-semibold text-gray-900 transition-colors hover:bg-emerald-400"
      >
        Back to Menu
      </motion.button>
    </motion.div>
  )
}
