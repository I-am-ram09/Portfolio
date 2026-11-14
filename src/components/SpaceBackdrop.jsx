import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const EMBERS = ['.', '*', '+', "'", ':', '`', '~']

/**
 * SpaceBackdrop
 * The look of the "void" after the impact: a glow centred on the impact point, a faint dot grid,
 * and ASCII embers drifting up from where the debris settled.
 */
export default function SpaceBackdrop({ color, point }) {
  const reduce = useReducedMotion()
  const embers = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        ch: EMBERS[(Math.random() * EMBERS.length) | 0],
        left: Math.random() * 100,
        dur: 10 + Math.random() * 10,
        delay: -Math.random() * 16,
        size: 11 + Math.random() * 10,
      })),
    []
  )

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at ${point.x}px ${point.y}px, ${color}26, transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: `radial-gradient(ellipse 80% 70% at ${point.x}px ${point.y}px, black, transparent 75%)`,
          WebkitMaskImage: `radial-gradient(ellipse 80% 70% at ${point.x}px ${point.y}px, black, transparent 75%)`,
        }}
      />
      {!reduce &&
        embers.map((e, i) => (
          <motion.span
            key={i}
            className="absolute top-full select-none font-mono"
            style={{ left: `${e.left}%`, fontSize: e.size, color, willChange: 'transform, opacity' }}
            initial={{ y: '0vh', opacity: 0 }}
            animate={{ y: '-115vh', opacity: [0, 0.55, 0] }}
            transition={{ duration: e.dur, delay: e.delay, repeat: Infinity, ease: 'linear' }}
          >
            {e.ch}
          </motion.span>
        ))}
    </div>
  )
}
