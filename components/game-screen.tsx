"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameContext } from "@/context/game-context"
import GameControls from "./game-controls"

interface GameScreenProps {
  onMenuClick: () => void
  onGameOver: (score: number, level: number) => void
}

// Game constants
const CELL_SIZE = 20
const INITIAL_SPEED = 150
const SPEED_INCREASE = 10
const LEVEL_THRESHOLD = 5
const MAX_LEVEL = 5

type Direction = "up" | "down" | "left" | "right"
type Position = { x: number; y: number }

export default function GameScreen({ onMenuClick, onGameOver }: GameScreenProps) {
  const { settings } = useGameContext()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [snake, setSnake] = useState<Position[]>([
    { x: 3 * CELL_SIZE, y: 10 * CELL_SIZE },
    { x: 2 * CELL_SIZE, y: 10 * CELL_SIZE },
    { x: 1 * CELL_SIZE, y: 10 * CELL_SIZE },
  ])
  const [food, setFood] = useState<Position>({ x: 0, y: 0 })
  const [obstacles, setObstacles] = useState<Position[]>([])
  const [villagers, setVillagers] = useState<Position[]>([])
  const [direction, setDirection] = useState<Direction>("right")
  const [nextDirection, setNextDirection] = useState<Direction>("right")
  const [foodEatenInLevel, setFoodEatenInLevel] = useState(0)
  const [gameSpeed, setGameSpeed] = useState(
    INITIAL_SPEED - (settings.difficulty === "easy" ? 50 : settings.difficulty === "hard" ? -50 : 0),
  )

  // Theme colors
  const themes = {
    forest: {
      background: "#232931",
      snake: "#4ecca3",
      snakeHead: "#2e8b57",
      food: "#ff6b6b",
      obstacle: "#a0522d",
      villager: "#ffd700",
      border: "#4ecca3",
    },
    desert: {
      background: "#e6ccb2",
      snake: "#e67e22",
      snakeHead: "#d35400",
      food: "#3498db",
      obstacle: "#7f5539",
      villager: "#f4d03f",
      border: "#d35400",
    },
    snow: {
      background: "#ecf0f1",
      snake: "#3498db",
      snakeHead: "#2980b9",
      food: "#e74c3c",
      obstacle: "#7f8c8d",
      villager: "#bdc3c7",
      border: "#3498db",
    },
    neon: {
      background: "#000000",
      snake: "#39ff14",
      snakeHead: "#00ff00",
      food: "#ff00ff",
      obstacle: "#4b0082",
      villager: "#00ffff",
      border: "#ff00ff",
    },
  }

  // Initialize game
  useEffect(() => {
    placeFood()
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          changeDirection("up")
          break
        case "ArrowDown":
          changeDirection("down")
          break
        case "ArrowLeft":
          changeDirection("left")
          break
        case "ArrowRight":
          changeDirection("right")
          break
        case "p":
        case "P":
          togglePause()
          break
        case "m":
        case "M":
          onMenuClick()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  // Game loop
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(updateGame, gameSpeed)
      return () => clearInterval(interval)
    }
  }, [snake, food, obstacles, villagers, direction, nextDirection, isPaused, gameSpeed])

  // Draw game
  useEffect(() => {
    drawGame()
  }, [snake, food, obstacles, villagers, settings.theme])

  function updateGame() {
    // Update direction
    setDirection(nextDirection)

    // Move snake
    moveSnake()

    // Move villagers in higher levels
    if (level >= 3) {
      moveVillagers()
    }

    // Check for collisions
    if (checkCollision()) {
      onGameOver(score, level)
      return
    }

    // Check if food eaten
    checkFood()
  }

  function moveSnake() {
    const head = { ...snake[0] }

    // Move head based on direction
    switch (direction) {
      case "up":
        head.y -= CELL_SIZE
        break
      case "down":
        head.y += CELL_SIZE
        break
      case "left":
        head.x -= CELL_SIZE
        break
      case "right":
        head.x += CELL_SIZE
        break
    }

    // Handle wrapping around edges
    const canvas = canvasRef.current
    if (canvas) {
      if (head.x < 0) head.x = canvas.width - CELL_SIZE
      if (head.x >= canvas.width) head.x = 0
      if (head.y < 0) head.y = canvas.height - CELL_SIZE
      if (head.y >= canvas.height) head.y = 0
    }

    // Create new snake with new head
    const newSnake = [head, ...snake]

    // Remove tail unless food was eaten
    if (head.x !== food.x || head.y !== food.y) {
      newSnake.pop()
    }

    setSnake(newSnake)
  }

  function moveVillagers() {
    setVillagers((prevVillagers) => {
      return prevVillagers.map((villager) => {
        // Villagers try to move away from snake head
        const head = snake[0]
        const distX = head.x - villager.x
        const distY = head.y - villager.y

        // Determine direction to move (away from snake)
        let moveX = 0
        let moveY = 0

        if (Math.abs(distX) > Math.abs(distY)) {
          // Move horizontally
          moveX = distX > 0 ? -CELL_SIZE : CELL_SIZE
        } else {
          // Move vertically
          moveY = distY > 0 ? -CELL_SIZE : CELL_SIZE
        }

        // Only move if new position is valid
        const newX = villager.x + moveX
        const newY = villager.y + moveY
        const canvas = canvasRef.current

        if (
          canvas &&
          newX >= 0 &&
          newX < canvas.width &&
          newY >= 0 &&
          newY < canvas.height &&
          isValidPosition(newX, newY)
        ) {
          return { x: newX, y: newY }
        }

        return villager
      })
    })
  }

  function checkCollision() {
    const head = snake[0]

    // Check collision with self
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true
      }
    }

    // Check collision with obstacles
    for (const obstacle of obstacles) {
      if (head.x === obstacle.x && head.y === obstacle.y) {
        return true
      }
    }

    return false
  }

  function checkFood() {
    const head = snake[0]

    if (head.x === food.x && head.y === food.y) {
      // Increase score
      const newScore = score + level * 10
      setScore(newScore)

      // Place new food
      placeFood()

      // Increase speed slightly
      const newSpeed = Math.max(50, gameSpeed - SPEED_INCREASE)
      setGameSpeed(newSpeed)

      // Track food eaten in level
      const newFoodEaten = foodEatenInLevel + 1
      setFoodEatenInLevel(newFoodEaten)

      // Check for level up
      if (newFoodEaten >= LEVEL_THRESHOLD && level < MAX_LEVEL) {
        levelUp()
      }
    }
  }

  function levelUp() {
    const newLevel = level + 1
    setLevel(newLevel)
    setFoodEatenInLevel(0)

    // Show level up notification
    setShowLevelUp(true)
    setTimeout(() => setShowLevelUp(false), 2000)

    // Add obstacles based on level
    addObstacles(newLevel)

    // Add villagers in higher levels
    if (newLevel >= 3) {
      addVillagers(newLevel)
    }
  }

  function placeFood() {
    const canvas = canvasRef.current
    if (!canvas) return

    let validPosition = false
    let newFood = { x: 0, y: 0 }

    while (!validPosition) {
      newFood = {
        x: Math.floor(Math.random() * (canvas.width / CELL_SIZE)) * CELL_SIZE,
        y: Math.floor(Math.random() * (canvas.height / CELL_SIZE)) * CELL_SIZE,
      }

      validPosition = isValidPosition(newFood.x, newFood.y)
    }

    setFood(newFood)
  }

  function addObstacles(currentLevel: number) {
    const canvas = canvasRef.current
    if (!canvas) return

    const newObstacles: Position[] = []
    const numObstacles = currentLevel * 2

    for (let i = 0; i < numObstacles; i++) {
      let validPosition = false
      let position = { x: 0, y: 0 }

      while (!validPosition) {
        position = {
          x: Math.floor(Math.random() * (canvas.width / CELL_SIZE)) * CELL_SIZE,
          y: Math.floor(Math.random() * (canvas.height / CELL_SIZE)) * CELL_SIZE,
        }

        validPosition = isValidPosition(position.x, position.y)
      }

      newObstacles.push(position)
    }

    setObstacles(newObstacles)
  }

  function addVillagers(currentLevel: number) {
    const canvas = canvasRef.current
    if (!canvas) return

    const newVillagers: Position[] = []
    const numVillagers = currentLevel - 2 // Start with 1 villager at level 3

    for (let i = 0; i < numVillagers; i++) {
      let validPosition = false
      let position = { x: 0, y: 0 }

      while (!validPosition) {
        position = {
          x: Math.floor(Math.random() * (canvas.width / CELL_SIZE)) * CELL_SIZE,
          y: Math.floor(Math.random() * (canvas.height / CELL_SIZE)) * CELL_SIZE,
        }

        // Make sure villagers are placed away from snake
        let tooClose = false
        for (const segment of snake) {
          const distance = Math.sqrt(Math.pow(segment.x - position.x, 2) + Math.pow(segment.y - position.y, 2))
          if (distance < 5 * CELL_SIZE) {
            tooClose = true
            break
          }
        }

        validPosition = !tooClose && isValidPosition(position.x, position.y)
      }

      newVillagers.push(position)
    }

    setVillagers(newVillagers)
  }

  function isValidPosition(x: number, y: number) {
    // Check if position is occupied by snake
    for (const segment of snake) {
      if (segment.x === x && segment.y === y) {
        return false
      }
    }

    // Check if position is occupied by food
    if (food.x === x && food.y === y) {
      return false
    }

    // Check if position is occupied by obstacle
    for (const obstacle of obstacles) {
      if (obstacle.x === x && obstacle.y === y) {
        return false
      }
    }

    // Check if position is occupied by villager
    for (const villager of villagers) {
      if (villager.x === x && villager.y === y) {
        return false
      }
    }

    return true
  }

  function drawGame() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const colors = themes[settings.theme as keyof typeof themes]

    // Clear canvas
    ctx.fillStyle = colors.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? colors.snakeHead : colors.snake
      ctx.fillRect(snake[i].x, snake[i].y, CELL_SIZE, CELL_SIZE)

      // Add eyes to head
      if (i === 0) {
        ctx.fillStyle = "#000000"

        // Position eyes based on direction
        switch (direction) {
          case "up":
            ctx.fillRect(snake[i].x + 5, snake[i].y + 3, 3, 3)
            ctx.fillRect(snake[i].x + 12, snake[i].y + 3, 3, 3)
            break
          case "down":
            ctx.fillRect(snake[i].x + 5, snake[i].y + 14, 3, 3)
            ctx.fillRect(snake[i].x + 12, snake[i].y + 14, 3, 3)
            break
          case "left":
            ctx.fillRect(snake[i].x + 3, snake[i].y + 5, 3, 3)
            ctx.fillRect(snake[i].x + 3, snake[i].y + 12, 3, 3)
            break
          case "right":
            ctx.fillRect(snake[i].x + 14, snake[i].y + 5, 3, 3)
            ctx.fillRect(snake[i].x + 14, snake[i].y + 12, 3, 3)
            break
        }
      }
    }

    // Draw food
    ctx.fillStyle = colors.food
    ctx.beginPath()
    ctx.arc(food.x + CELL_SIZE / 2, food.y + CELL_SIZE / 2, CELL_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()

    // Draw obstacles
    ctx.fillStyle = colors.obstacle
    for (const obstacle of obstacles) {
      ctx.beginPath()
      ctx.moveTo(obstacle.x, obstacle.y + CELL_SIZE)
      ctx.lineTo(obstacle.x + CELL_SIZE / 3, obstacle.y + CELL_SIZE / 3)
      ctx.lineTo(obstacle.x + CELL_SIZE, obstacle.y + CELL_SIZE / 2)
      ctx.lineTo(obstacle.x + CELL_SIZE * 0.8, obstacle.y + CELL_SIZE)
      ctx.fill()
    }

    // Draw villagers
    ctx.fillStyle = colors.villager
    for (const villager of villagers) {
      // Head
      ctx.beginPath()
      ctx.arc(villager.x + CELL_SIZE / 2, villager.y + CELL_SIZE / 3, CELL_SIZE / 4, 0, Math.PI * 2)
      ctx.fill()

      // Body
      ctx.fillRect(villager.x + CELL_SIZE * 0.4, villager.y + CELL_SIZE / 3, CELL_SIZE * 0.2, CELL_SIZE * 0.5)

      // Arms
      ctx.fillRect(villager.x + CELL_SIZE * 0.2, villager.y + CELL_SIZE * 0.5, CELL_SIZE * 0.6, CELL_SIZE * 0.1)

      // Legs
      ctx.fillRect(villager.x + CELL_SIZE * 0.3, villager.y + CELL_SIZE * 0.7, CELL_SIZE * 0.1, CELL_SIZE * 0.3)
      ctx.fillRect(villager.x + CELL_SIZE * 0.6, villager.y + CELL_SIZE * 0.7, CELL_SIZE * 0.1, CELL_SIZE * 0.3)
    }
  }

  function changeDirection(newDirection: Direction) {
    // Prevent 180-degree turns
    if (
      (direction === "up" && newDirection === "down") ||
      (direction === "down" && newDirection === "up") ||
      (direction === "left" && newDirection === "right") ||
      (direction === "right" && newDirection === "left")
    ) {
      return
    }

    setNextDirection(newDirection)
  }

  function togglePause() {
    setIsPaused(!isPaused)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center"
    >
      <div className="mb-4 flex w-full justify-between">
        <div className="flex gap-4">
          <div className="rounded-md bg-gray-800 px-3 py-1 font-medium text-white">Score: {score}</div>
          <div className="rounded-md bg-gray-800 px-3 py-1 font-medium text-white">Level: {level}</div>
        </div>
        <div className="rounded-md bg-gray-800 px-3 py-1 font-medium text-white">
          Theme: {settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)}
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className={`rounded-lg border-4 ${
            settings.theme === "forest"
              ? "border-emerald-500"
              : settings.theme === "desert"
                ? "border-orange-500"
                : settings.theme === "snow"
                  ? "border-blue-500"
                  : "border-fuchsia-500"
          }`}
        />

        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-black/80 px-6 py-3 text-xl font-bold text-emerald-400"
            >
              Level Up!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex w-full flex-col items-center gap-4">
        <GameControls
          onDirectionChange={changeDirection}
          onPauseClick={togglePause}
          onMenuClick={onMenuClick}
          isPaused={isPaused}
        />
      </div>
    </motion.div>
  )
}
