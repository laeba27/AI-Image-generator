"use client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Sparkle {
  id: number
  size: number
  style: {
    top: string
    left: string
    zIndex: number
  }
}

export default function Sparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles: Sparkle[] = []
      for (let i = 0; i < 50; i++) {
        newSparkles.push({
          id: i,
          size: Math.random() * 3 + 1,
          style: {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: 1
          }
        })
      }
      setSparkles(newSparkles)
    }

    generateSparkles()
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
          style={{
            position: "absolute",
            width: sparkle.size,
            height: sparkle.size,
            borderRadius: "50%",
            backgroundColor: "white",
            ...sparkle.style,
          }}
          className="animate-twinkle"
        />
      ))}
    </div>
  )
} 