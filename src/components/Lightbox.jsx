import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * Lightbox: a full-screen viewer for certificates and the project poster.
 * Rendered in a portal on <body> (so no transformed ancestor can break `fixed`), below the glow cursor.
 * Esc closes the lightbox only: it is caught in the capture phase so it never triggers "back".
 */
export default function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [item, onClose])

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          key="lightbox"
          className="fixed inset-0 z-[58] flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.figure
            className="flex max-h-full max-w-6xl flex-col"
            initial={{ scale: 0.86, opacity: 0, y: 36 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={item.src}
              alt={item.caption}
              className="max-h-[80vh] w-auto max-w-full rounded-xl border border-white/10 object-contain shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]"
              style={{ boxShadow: `0 0 80px -20px ${item.color ?? '#d8b4fe'}` }}
            />
            <figcaption className="mt-3 flex items-center justify-between gap-4 font-mono text-xs text-white/60">
              <span>{item.caption}</span>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-white/70 transition-colors hover:text-white focus-visible:outline-none"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" /> close [esc]
              </button>
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
