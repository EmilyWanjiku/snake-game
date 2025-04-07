"use client"

import { motion } from "framer-motion"
import { useGameContext } from "@/context/game-context"

interface SettingsScreenProps {
  onBackClick: () => void
}

export default function SettingsScreen({ onBackClick }: SettingsScreenProps) {
  const { settings, updateSettings } = useGameContext()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex w-full max-w-md flex-col items-center rounded-lg bg-gray-800 p-8 shadow-xl"
    >
      <h2 className="mb-8 text-3xl font-bold text-emerald-400">Settings</h2>

      <div className="mb-8 w-full space-y-6">
        <div className="flex items-center justify-between">
          <label htmlFor="difficulty" className="text-lg font-medium text-white">
            Difficulty:
          </label>
          <select
            id="difficulty"
            value={settings.difficulty}
            onChange={(e) => updateSettings({ difficulty: e.target.value })}
            className="rounded-md bg-gray-700 px-3 py-2 text-white"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="theme" className="text-lg font-medium text-white">
            Theme:
          </label>
          <select
            id="theme"
            value={settings.theme}
            onChange={(e) => updateSettings({ theme: e.target.value })}
            className="rounded-md bg-gray-700 px-3 py-2 text-white"
          >
            <option value="forest">Forest</option>
            <option value="desert">Desert</option>
            <option value="snow">Snow</option>
            <option value="neon">Neon</option>
          </select>
        </div>
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
