import { motion, useSpring } from 'framer-motion'

/**
 * GlowCursor
 * Two layers following the pointer with different spring stiffness:
 * a soft halo (laggy) and a small bright core (snappy).
 * x / y are raw clientX / clientY MotionValues.
 *
 * The halo is a plain radial gradient on its own compositor layer. It used to be a CSS `blur-xl`
 * element with `mix-blend-screen`; a blurred, blended layer that moves every frame forces the
 * browser to re-composite everything behind it, and that was the biggest source of cursor lag.
 */
export default function GlowCursor({ x, y, visible }) {
  const halo = { stiffness: 110, damping: 18, mass: 0.7 }
  const core = { stiffness: 600, damping: 32, mass: 0.3 }

  const haloX = useSpring(x, halo)
  const haloY = useSpring(y, halo)
  const coreX = useSpring(x, core)
  const coreY = useSpring(y, core)

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{
          x: haloX,
          y: haloY,
          opacity: visible,
          background: 'radial-gradient(closest-side, rgba(216,180,254,0.55), rgba(244,114,182,0.2) 55%, transparent)',
          willChange: 'transform',
        }}
        className="pointer-events-none fixed left-0 top-0 z-[60] -ml-8 -mt-8 hidden h-16 w-16 rounded-full [@media(pointer:fine)]:block"
      />
      <motion.div
        aria-hidden="true"
        style={{ x: coreX, y: coreY, opacity: visible, willChange: 'transform' }}
        className="pointer-events-none fixed left-0 top-0 z-[61] -ml-1 -mt-1 hidden h-2 w-2 rounded-full bg-white shadow-[0_0_12px_3px_rgba(216,180,254,0.9)] [@media(pointer:fine)]:block"
      />
    </>
  )
}
