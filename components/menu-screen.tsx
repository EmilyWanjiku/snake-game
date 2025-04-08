"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useGameContext } from "@/context/game-context"
import { Play, Settings, Info, Trophy, Volume2, VolumeX } from "lucide-react"

interface MenuScreenProps {
  onPlayClick: () => void
  onSettingsClick: () => void
  onAboutClick: () => void
}

export default function MenuScreen({ onPlayClick, onSettingsClick, onAboutClick }: MenuScreenProps) {
  const { settings, updateSettings } = useGameContext()
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; size: number; speed: number; color: string; angle: number }>
  >([])
  const [soundMuted, setSoundMuted] = useState(!settings.soundEnabled)

  // Generate particles for background effect
  useEffect(() => {
    const newParticles = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 0.3 + 0.1,
        color: `hsl(${Math.random() * 60 + 120}, 100%, ${Math.random() * 30 + 60}%)`,
        angle: Math.random() * Math.PI * 2,
      })
    }
    setParticles(newParticles)

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x: (particle.x + Math.cos(particle.angle) * particle.speed) % 100,
          y: (particle.y + Math.sin(particle.angle) * particle.speed) % 100,
          angle: particle.angle + Math.random() * 0.1 - 0.05,
        })),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const toggleSound = () => {
    setSoundMuted(!soundMuted)
    updateSettings({ soundEnabled: soundMuted })
  }

  return (
    <div className="relative flex h-full w-full max-w-2xl flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8 shadow-2xl">
      {/* Particle background */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Game logo/title */}
      <div className="relative mb-8 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(16, 185, 129, 0.7)",
                "0 0 40px rgba(16, 185, 129, 0.5)",
                "0 0 20px rgba(16, 185, 129, 0.7)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="mb-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-3"
          >
            <h1 className="text-5xl font-bold tracking-tight text-white">LEGENDARY</h1>
          </motion.div>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-7xl font-extrabold tracking-tighter text-emerald-400 drop-shadow-glow"
          >
            SNAKE
          </motion.h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-lg font-medium text-gray-400"
        >
          by Emily and cyberghost
        </motion.div>
      </div>

      {/* Menu buttons */}
      <div className="z-10 flex w-full max-w-xs flex-col gap-4">
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#10b981" }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={onPlayClick}
          className="flex items-center justify-between rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4 text-xl font-bold text-white shadow-lg transition-all hover:shadow-emerald-500/30"
        >
          <span>PLAY GAME</span>
          <Play className="h-6 w-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#0ea5e9" }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onSettingsClick}
          className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-xl font-bold text-white shadow-lg transition-all hover:shadow-blue-500/30"
        >
          <span>SETTINGS</span>
          <Settings className="h-6 w-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#8b5cf6" }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={onAboutClick}
          className="flex items-center justify-between rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4 text-xl font-bold text-white shadow-lg transition-all hover:shadow-purple-500/30"
        >
          <span>ABOUT</span>
          <Info className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Bottom controls */}
      <div className="mt-8 flex w-full justify-between">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={toggleSound}
          className="flex items-center gap-2 rounded-full bg-gray-800 p-3 text-gray-300 hover:bg-gray-700"
        >
          {soundMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 rounded-full bg-gray-800 p-3 text-gray-300 hover:bg-gray-700"
        >
          <Trophy size={20} />
        </motion.button>
      </div>

      {/* Version number */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">v1.5.0</div>
    </div>
  )
}
