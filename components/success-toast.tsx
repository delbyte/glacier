"use client"

import { useEffect } from "react"
import { CheckCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SuccessToastProps {
  show: boolean
  onClose: () => void
  title: string
  message?: string
  duration?: number
}

export function SuccessToast({ show, onClose, title, message, duration = 4000 }: SuccessToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-4 right-4 z-[9999] max-w-md"
        >
          <div className="relative backdrop-blur-xl bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/30 rounded-2xl shadow-2xl overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-emerald-400/5 to-teal-400/5 animate-pulse" />
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent opacity-50 blur-xl" />
            
            {/* Content */}
            <div className="relative p-4 flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/30 rounded-full blur-lg animate-pulse" />
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-2">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 pt-0.5">
                <h3 className="text-white font-semibold text-sm mb-0.5">
                  {title}
                </h3>
                {message && (
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {message}
                  </p>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
