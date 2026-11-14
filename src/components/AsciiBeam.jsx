import { motion } from 'framer-motion'
import { BEAM_PATTERN } from '../data/ascii.js'

const FONT = 15 // px; a mono glyph is 0.6em wide, so 1ch = 9px
const ROW = 16

/**
 * AsciiBeam: Code Block 1b
 *
 * A three-row ASCII beam (fringe / core / fringe) whose body grows from the flower to the
 * node's boundary in ~0.3s while the pattern `===///--->>` streams along it at high speed.
 * A bright head leads the way. When the head lands, `onArrive` fires: that callback is the
 * Beam -> Impact hand-off in the state machine.
 *
 * The beam is drawn along +x and rotated to shot.angle around the flower centre.
 */
export default function AsciiBeam({ shot, onArrive }) {
  const len = Math.max(shot.length - shot.start, 40)
  const reps = Math.ceil(len / (BEAM_PATTERN.length * FONT * 0.6)) + 4
  const core = BEAM_PATTERN.repeat(reps)
  const fringeA = '~ '.repeat(Math.ceil((core.length + 2) / 2))
  const fringeB = ' ~'.repeat(Math.ceil((core.length + 2) / 2))
  const glow = `0 0 6px ${shot.color}, 0 0 16px ${shot.color}`
  const travel = { duration: 0.3, ease: [0.45, 0, 0.9, 0.55] }

  return (
    <motion.div
      className="pointer-events-none absolute z-[30]"
      style={{ left: shot.cx, top: shot.cy, transform: `rotate(${shot.angle}deg)`, transformOrigin: '0 0' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 0.95, times: [0, 0.55, 1], ease: 'easeOut' }}
    >
      {/* muzzle flash at the flower */}
      <motion.span
        className="absolute rounded-full blur-md"
        style={{
          left: shot.start - 40,
          top: -32,
          width: 64,
          height: 64,
          background: `radial-gradient(closest-side, #fff, ${shot.color}, transparent)`,
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 1.7, 1], opacity: [1, 1, 0.5] }}
        transition={{ duration: 0.4 }}
      />

      {/* beam body */}
      <motion.div
        className="absolute overflow-hidden"
        style={{ left: shot.start, top: -ROW * 1.5, height: ROW * 3 }}
        initial={{ width: 0 }}
        animate={{ width: len }}
        transition={travel}
        onAnimationComplete={onArrive}
      >
        <motion.pre
          className="select-none whitespace-pre font-mono font-bold"
          style={{ fontSize: FONT, lineHeight: `${ROW}px`, textShadow: glow }}
          animate={{ x: ["0ch", `-${BEAM_PATTERN.length}ch`] }}
          transition={{ duration: 0.16, ease: 'linear', repeat: Infinity }}
        >
          <span style={{ color: shot.color, opacity: 0.8 }}>{fringeA}</span>
          {'\n'}
          <span style={{ color: '#fff' }}>{core}</span>
          {'\n'}
          <span style={{ color: shot.color, opacity: 0.8 }}>{fringeB}</span>
        </motion.pre>
      </motion.div>

      {/* bright head */}
      <motion.span
        className="absolute rounded-full blur-[3px]"
        style={{
          left: shot.start - 18,
          top: -18,
          width: 36,
          height: 36,
          background: `radial-gradient(closest-side, #fff, ${shot.color}, transparent)`,
        }}
        initial={{ x: 0 }}
        animate={{ x: len + 6 }}
        transition={travel}
      />
    </motion.div>
  )
}
