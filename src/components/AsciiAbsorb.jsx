import { useMemo } from 'react'
import { motion } from 'framer-motion'

const rand = (a, b) => a + Math.random() * (b - a)
const BEAM_GLYPHS = '=/->*+:'

/**
 * AsciiAbsorb: the Resume node's alternative to <AsciiImpact/>.
 *
 * Nothing shatters. The beam is swallowed: its glyphs stream into the node, a white flash and
 * a bloom swell out of it, and three soft rings pulse as it fills with light. The node itself
 * (see OrbitNode, status "absorb") swells and glows in sync, then ContentSpace opens straight
 * out of the node's centre.
 *
 * Positions are relative to the node centre. Only transform + opacity are animated, and there
 * are ~26 glyphs (no text-shadow on them), so it stays cheap.
 */
export default function AsciiAbsorb({ shot }) {
  const { color } = shot

  // glyphs pouring in: half along the beam's axis, half from all around
  const glyphs = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const along = i % 2 === 0
        let x
        let y
        if (along) {
          const d = rand(70, 300)
          const spread = rand(-26, 26)
          x = -shot.ux * d + -shot.uy * spread
          y = -shot.uy * d + shot.ux * spread
        } else {
          const a = rand(0, Math.PI * 2)
          const d = rand(90, 240)
          x = Math.cos(a) * d
          y = Math.sin(a) * d
        }
        return {
          ch: BEAM_GLYPHS[(Math.random() * BEAM_GLYPHS.length) | 0],
          x,
          y,
          delay: rand(0, 0.4),
          dur: rand(0.4, 0.6),
          white: i % 3 === 0,
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shot.id]
  )

  return (
    <div className="pointer-events-none absolute z-[45]" style={{ left: shot.node.x, top: shot.node.y }}>
      {/* bloom: the node drinking the beam */}
      <motion.div
        className="absolute -ml-[170px] -mt-[170px] h-[340px] w-[340px] rounded-full will-change-transform"
        style={{ background: `radial-gradient(closest-side, #fff 0%, ${color} 28%, ${color}55 55%, transparent)` }}
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: [0.2, 0.9, 1.35], opacity: [0, 0.9, 0.75] }}
        transition={{ duration: 1.2, times: [0, 0.45, 1], ease: 'easeOut' }}
      />

      {/* soft pulse rings */}
      {[0, 0.14, 0.28].map((delay) => (
        <motion.div
          key={delay}
          className="absolute -ml-[110px] -mt-[110px] h-[220px] w-[220px] rounded-full border-2 will-change-transform"
          style={{ borderColor: color, boxShadow: `0 0 18px 1px ${color}99` }}
          initial={{ scale: 0.3, opacity: 0.95 }}
          animate={{ scale: 2.6, opacity: 0 }}
          transition={{ duration: 0.95, delay, ease: [0.1, 0.7, 0.3, 1] }}
        />
      ))}

      {/* the beam's glyphs flowing in */}
      {glyphs.map((g, i) => (
        <motion.span
          key={i}
          className="absolute -ml-1.5 -mt-2.5 select-none font-mono text-[16px] font-bold will-change-transform"
          style={{ color: g.white ? '#fff' : color }}
          initial={{ x: g.x, y: g.y, opacity: 0, scale: 1.1 }}
          animate={{ x: 0, y: 0, opacity: [0, 1, 1, 0], scale: 0.3 }}
          transition={{ duration: g.dur, delay: g.delay, ease: [0.5, 0, 0.9, 0.4], opacity: { duration: g.dur, delay: g.delay, times: [0, 0.15, 0.8, 1] } }}
        >
          {g.ch}
        </motion.span>
      ))}

      {/* contact flash (plain white: no blend modes) */}
      <motion.div
        className="absolute -ml-[90px] -mt-[90px] h-[180px] w-[180px] rounded-full will-change-transform"
        style={{ background: 'radial-gradient(closest-side, #fff, rgba(255,255,255,0))' }}
        initial={{ scale: 0.2, opacity: 0.95 }}
        animate={{ scale: 1.4, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
    </div>
  )
}
