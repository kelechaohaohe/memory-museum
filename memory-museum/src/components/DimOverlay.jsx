import { motion, AnimatePresence } from 'framer-motion'
import { useMemoryStore } from '../stores/useMemoryStore'

export default function DimOverlay() {
  const isTransitioning = useMemoryStore((s) => s.isTransitioning)

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, times: [0, 0.55, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, #ffffff 0%, #000000 75%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}
    </AnimatePresence>
  )
}