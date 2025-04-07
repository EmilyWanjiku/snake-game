"use client"

import { motion } from "framer-motion"
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Menu, Pause, Play } from "lucide-react"

interface GameControlsProps {
  onDirectionChange: (direction: "up" | "down" | "left" | "right") => void
  onPauseClick: () => void
  onMenuClick: () => void
  isPaused: boolean
}

export default function GameControls({ onDirectionChange, onPauseClick, onMenuClick, isPaused }: GameControlsProps) {
  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onDirectionChange("up")}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-gray-900 shadow-md"
        >
          <ArrowUp size={24} />
        </motion.button>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onDirectionChange("left")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-gray-900 shadow-md"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onDirectionChange("down")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-gray-900 shadow-md"
          >
            <ArrowDown size={24} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onDirectionChange("right")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-gray-900 shadow-md"
          >
            <ArrowRight size={24} />
          </motion.button>
        </div>
      </div>

      <div className="mt-2 flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPauseClick}
          className="flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 font-medium text-gray-900"
        >
          {isPaused ? <Play size={18} /> : <Pause size={18} />}
          {isPaused ? "Resume" : "Pause"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 font-medium text-gray-900"
        >
          <Menu size={18} />
          Menu
        </motion.button>
      </div>
    </>
  )
}
