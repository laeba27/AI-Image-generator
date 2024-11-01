"use client"
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Type, X, Plus, Minus, Check, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface TextElement {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  color: string
}

interface ImageEditorProps {
  imageUrl: string
  onSave: (editedImageUrl: string) => void
  onClose: () => void
}

export default function ImageEditor({ imageUrl, onSave, onClose }: ImageEditorProps) {
  const [texts, setTexts] = useState<TextElement[]>([])
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [newText, setNewText] = useState("")
  const [fontSize, setFontSize] = useState(32)
  const [textColor, setTextColor] = useState("#ffffff")
  const [isDragging, setIsDragging] = useState(false)
  const lastClickTime = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const image = new Image()
    image.src = imageUrl
    image.onload = () => {
      canvas.width = image.width
      canvas.height = image.height
      ctx.drawImage(image, 0, 0)
      drawTexts()
    }
  }, [imageUrl])

  const drawTexts = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Redraw image
    const image = new Image()
    image.src = imageUrl
    ctx.drawImage(image, 0, 0)

    // Draw all texts
    texts.forEach((text) => {
      ctx.font = `${text.fontSize}px Arial`
      ctx.fillStyle = text.color
      ctx.fillText(text.text, text.x, text.y)

      // Highlight selected text
      if (selectedText === text.id) {
        ctx.strokeStyle = '#00ff00'
        ctx.lineWidth = 2
        const metrics = ctx.measureText(text.text)
        ctx.strokeRect(
          text.x - 5,
          text.y - text.fontSize + 5,
          metrics.width + 10,
          text.fontSize + 10
        )
      }
    })
  }

  useEffect(() => {
    drawTexts()
  }, [texts, selectedText])

  const handleTextDoubleClick = (textId: string) => {
    const textToEdit = texts.find(t => t.id === textId)
    if (textToEdit) {
      setIsEditing(textId)
      setNewText(textToEdit.text)
      setFontSize(textToEdit.fontSize)
      setTextColor(textToEdit.color)
      setIsAdding(true)
    }
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicked on any text
    const clickedText = texts.find((text) => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return false
      
      ctx.font = `${text.fontSize}px Arial`
      const metrics = ctx.measureText(text.text)
      
      return (
        x >= text.x - 5 &&
        x <= text.x + metrics.width + 5 &&
        y >= text.y - text.fontSize - 5 &&
        y <= text.y + 5
      )
    })

    const currentTime = new Date().getTime()
    const timeDiff = currentTime - lastClickTime.current

    if (clickedText) {
      if (timeDiff < 300) { // Double click detected
        handleTextDoubleClick(clickedText.id)
      } else {
        setSelectedText(clickedText.id)
        setIsDragging(true)
      }
    } else {
      setSelectedText(null)
    }

    lastClickTime.current = currentTime
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedText) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setTexts(texts.map((text) =>
      text.id === selectedText
        ? { ...text, x, y }
        : text
    ))
  }

  const handleCanvasMouseUp = () => {
    setIsDragging(false)
  }

  const handleCanvasMouseLeave = () => {
    setIsDragging(false)
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const editedImageUrl = canvas.toDataURL('image/png')
      onSave(editedImageUrl)
      toast.success('Image saved successfully!')
    } catch {
      toast.error('Failed to save image')
    }
  }

  const handleAddText = () => {
    if (!newText.trim()) {
      toast.error('Please enter some text')
      return
    }

    if (isEditing) {
      // Update existing text
      setTexts(texts.map(text => 
        text.id === isEditing 
          ? { ...text, text: newText, fontSize, color: textColor }
          : text
      ))
      setIsEditing(null)
      toast.success('Text updated!')
    } else {
      // Add new text
      const newTextElement: TextElement = {
        id: Date.now().toString(),
        text: newText,
        x: 50,
        y: 50 + fontSize,
        fontSize,
        color: textColor
      }
      setTexts([...texts, newTextElement])
      toast.success('Text added! Click and drag to position it.')
    }

    setNewText("")
    setIsAdding(false)
  }

  const handleDeleteText = (textId: string) => {
    setTexts(texts.filter(text => text.id !== textId))
    setSelectedText(null)
    setIsEditing(null)
    setIsAdding(false)
    toast.success('Text deleted!')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-gray-900 rounded-xl p-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Edit Image</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseLeave}
            className="max-w-full h-auto rounded-lg cursor-move"
          />

          <div className="absolute top-4 right-4 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => {
                setIsAdding(true)
                setIsEditing(null)
                setNewText("")
                setFontSize(32)
                setTextColor("#ffffff")
              }}
              className="p-3 bg-white/10 backdrop-blur-md rounded-full shadow-lg hover:bg-white/20 transition-all duration-300"
            >
              <Type className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-4 bg-black/50 rounded-lg"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">
                    {isEditing ? 'Edit Text' : 'Add New Text'}
                  </span>
                  {isEditing && (
                    <button
                      onClick={() => handleDeleteText(isEditing)}
                      className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Enter text..."
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-gray-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddText()
                    }
                  }}
                  autoFocus
                />
                
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFontSize(prev => Math.max(12, prev - 4))}
                      className="p-2 hover:bg-white/10 rounded-full"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-300">Font Size: {fontSize}</span>
                    <button
                      onClick={() => setFontSize(prev => Math.min(72, prev + 4))}
                      className="p-2 hover:bg-white/10 rounded-full"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  
                  <button
                    onClick={handleAddText}
                    className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    {isEditing ? 'Update Text' : 'Add Text'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
} 