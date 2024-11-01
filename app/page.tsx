"use client"
import Link from "next/link"
import { ArrowRight, Wand2, Zap, Image as ImageIcon, Palette } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Sparkles from "@/components/Sparkles"

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col text-white bg-gradient-to-b from-gray-900 via-[#0f1420] to-black overflow-hidden">
      {/* Cosmic background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black/50 to-black" />
        <Sparkles />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      <header className="container mx-auto flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 space-y-4 sm:space-y-0 mb-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-3 group cursor-pointer"
        >
          <Wand2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 group-hover:text-purple-600 transition-colors duration-500" />
          <span className="text-3xl sm:text-4xl font-extrabold tracking-wide bg-gradient-to-br from-blue-400 to-purple-700 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-blue-700 transition-all duration-500 ease-in-out">
            PicturaMind
          </span>
        </motion.div>

        <motion.nav 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden sm:block"
        >
          <Link href="/generate" passHref>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-colors duration-300">
              Start Creating
            </Button>
          </Link>
        </motion.nav>
      </header>

      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 md:px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="mb-4 md:mb-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
            Create Stunning Images
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent bg-size-200 animate-gradient">
              Powered by AI
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-6 md:mb-8 max-w-xl md:max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl text-gray-300"
        >
          Type your ideas, and watch as AI transforms them into amazing images instantly. No design skills needed!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          className="mb-12 md:mb-16"
        >
          <Link href="/generate" passHref>
            <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
              Start Creating Now
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[
            {
              icon: <Zap className="text-blue-500" />,
              title: "Lightning Fast",
              description: "See your ideas come to life in seconds"
            },
            {
              icon: <ImageIcon className="text-purple-500" />,
              title: "High Quality",
              description: "Get detailed, professional-looking images"
            },
            {
              icon: <Palette className="text-blue-500" />,
              title: "Endless Possibilities",
              description: "Create any image style you can imagine"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="flex flex-col items-center p-6 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-colors duration-300"
            >
              <div className="mb-3 md:mb-4 h-12 w-12 md:h-14 md:w-14">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg md:text-xl font-semibold">{feature.title}</h3>
              <p className="text-sm md:text-base text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}