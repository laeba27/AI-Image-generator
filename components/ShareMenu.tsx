"use client"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Mail, Download, MessageCircle, Facebook, Twitter } from 'lucide-react'
import { toast } from 'sonner'

interface ShareMenuProps {
  imageUrl: string
  onClose?: () => void
}

export default function ShareMenu({ imageUrl }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const downloadImage = async () => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      return blob
    } catch (error) {
      console.error('Error downloading image:', error)
      return null
    }
  }

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: async () => {
        if (navigator.share) {
          try {
            const blob = await downloadImage()
            if (blob) {
              const file = new File([blob], 'picturamind-image.png', { type: 'image/png' })
              await navigator.share({
                files: [file],
                title: 'AI Generated Image',
                text: 'Check out this AI-generated image from PicturaMind!'
              })
              toast.success('Shared successfully!')
            }
          } catch (error) {
            toast.error('Failed to share image')
          }
        } else {
          // Fallback for desktop or unsupported browsers
          window.open('https://web.whatsapp.com/send', '_blank')
        }
      },
      color: 'hover:bg-green-500/20 text-green-500'
    },
    {
      name: 'Email',
      icon: Mail,
      action: async () => {
        try {
          const blob = await downloadImage()
          if (blob) {
            const formData = new FormData()
            formData.append('image', blob, 'picturamind-image.png')
            
            // Create a mailto link with the image as an attachment
            const mailtoLink = `mailto:?subject=Check out this AI-generated image!&body=Generated with PicturaMind`
            window.location.href = mailtoLink
            toast.success('Opening email client...')
          }
        } catch {
          toast.error('Failed to prepare email')
        }
      },
      color: 'hover:bg-blue-500/20 text-blue-500'
    },
    {
      name: 'Save Image',
      icon: Download,
      action: async () => {
        try {
          const blob = await downloadImage()
          if (blob) {
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'picturamind-image.png'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            toast.success('Image saved!')
          }
        } catch {
          toast.error('Failed to save image')
        }
      },
      color: 'hover:bg-purple-500/20 text-purple-500'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: async () => {
        try {
          const blob = await downloadImage()
          if (blob) {
            if (navigator.share) {
              const file = new File([blob], 'picturamind-image.png', { type: 'image/png' })
              await navigator.share({
                files: [file],
                title: 'AI Generated Image',
                text: 'Check out this AI-generated image from PicturaMind! #AI #ArtificialIntelligence'
              })
            } else {
              // Fallback for desktop
              window.open('https://twitter.com/compose/tweet', '_blank')
            }
          }
        } catch {
          toast.error('Failed to share on Twitter')
        }
      },
      color: 'hover:bg-sky-500/20 text-sky-500'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: async () => {
        try {
          const blob = await downloadImage()
          if (blob) {
            if (navigator.share) {
              const file = new File([blob], 'picturamind-image.png', { type: 'image/png' })
              await navigator.share({
                files: [file],
                title: 'AI Generated Image',
                text: 'Check out this AI-generated image from PicturaMind!'
              })
            } else {
              // Fallback for desktop
              window.open('https://www.facebook.com/sharer.php', '_blank')
            }
          }
        } catch {
          toast.error('Failed to share on Facebook')
        }
      },
      color: 'hover:bg-blue-600/20 text-blue-600'
    }
  ]

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-white/10 backdrop-blur-md rounded-full shadow-lg hover:bg-white/20 transition-all duration-300"
      >
        <Share2 className="w-5 h-5 text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Share Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute top-full right-0 mt-2 p-2 bg-black/80 backdrop-blur-lg rounded-xl shadow-xl z-50 min-w-[200px]"
            >
              <div className="flex flex-col gap-1">
                {shareOptions.map((option) => (
                  <motion.button
                    key={option.name}
                    onClick={() => {
                      option.action()
                      setIsOpen(false)
                    }}
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${option.color}`}
                  >
                    <option.icon className="w-4 h-4" />
                    <span className="text-sm text-white">{option.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
} 