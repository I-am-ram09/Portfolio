import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { IMPACT_CHARS } from '../data/ascii.js'

const rand = (a, b) => a + Math.random() * (b - a)
const PALETTE_EXTRA = ['#ffffff', '#f9a8d4', '#d8b4fe', '#a5b4fc']

/**
 * AsciiImpact: Code Block 2
 *
 * Everything that happens where the beam lands, in ASCII:
 *   1. a white flash + a screen-wide pulse
 *   2. ~90 glyph particles flung outward on springs (overshoot, settle, fall), then dissolve
 *   3. the letters of the hit node's label, torn off the button and scattered
 *   4. two shockwave rings made of characters
 *   5. crack lines `-=~_` racing across the page: the shattered environment
 *
 * Positions are relative to the impact point (the boundary of the node that was hit).
 */
export default function AsciiImpact({ shot }) {
  const { color } = shot
  const palette = [color, color, ...PALETTE_EXTRA]

  const particles = useMemo(
    () =>
      Array.from({ length: 54 }, (_, i) => {
        const a = rand(0, Math.PI * 2)
        const d = 50 + Math.pow(Math.random(), 1.7) * 380
        return {
          ch: IMPACT_CHARS[(Math.random() * IMPACT_CHARS.length) | 0],
          x: Math.cos(a) * d,
          y: Math.sin(a) * d + rand(30, 150), // gravity bias
          rot: rand(-720, 720),
          size: rand(12, 34),
          color: palette[i % palette.length],
          spring: { type: 'spring', stiffness: rand(28, 120), damping: rand(5, 13), mass: rand(0.6, 1.4) },
          fade: { delay: rand(0.35, 0.85), duration: rand(0.5, 1.0), ease: 'easeIn' },
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shot.id]
  )

  // The node's own label shatters into letters
  const letters = useMemo(() => {
    const chars = shot.label.toLowerCase().split('')
    const toNode = { x: shot.node.x - shot.hit.x, y: shot.node.y - shot.hit.y }
    return chars.map((ch, i) => {
      const startX = toNode.x + (i - (chars.length - 1) / 2) * 11
      const a = rand(0, Math.PI * 2)
      return {
        ch,
        x0: startX,
        y0: toNode.y,
        x: startX + shot.ux * rand(60, 200) + Math.cos(a) * rand(30, 120),
        y: toNode.y + shot.uy * rand(60, 200) + Math.sin(a) * rand(30, 120) + rand(40, 120),
        rot: rand(-540, 540),
      }
    })
  }, [shot])

  const rings = useMemo(
    () => [
      { n: 24, r: 190, delay: 0, chars: 'oO*0' },
      { n: 16, r: 120, delay: 0.1, chars: '+x#' },
    ],
    []
  )

  const cracks = useMemo(() => {
    const maxLen = Math.min(Math.max(window.innerWidth, window.innerHeight) * 0.75, 900)
    return Array.from({ length: 9 }, (_, i) => {
      const a = (i / 9) * 360 + rand(-14, 14)
      const len = rand(0.45, 1) * maxLen
      const n = Math.ceil(len / 9)
      let text = ''
      const set = ['-', '=', '~', '_', '-', '.', '*', "'"]
      for (let k = 0; k < n; k += 1) text += set[(Math.random() * set.length) | 0]
      return { a, len, text, delay: rand(0, 0.12) }
    })
  }, [])

  return (
    <>
      {/* screen flash */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[44] bg-white"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />

      <div className="pointer-events-none absolute z-[45]" style={{ left: shot.hit.x, top: shot.hit.y }}>
        {/* core flash */}
        <motion.div
          className="absolute -ml-[150px] -mt-[150px] h-[300px] w-[300px] rounded-full"
          style={{ background: `radial-gradient(closest-side, #fff, ${color}aa, transparent)` }}
          initial={{ scale: 0.15, opacity: 1 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        />

        {/* anamorphic lens flare */}
        <motion.div
          className="absolute -ml-[60vw] -mt-px h-[2px] w-[120vw]"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, #fff, ${color}, transparent)`, boxShadow: `0 0 24px 4px ${color}` }}
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }}
          transition={{ duration: 0.8, times: [0, 0.3, 1], ease: 'easeOut' }}
        />

        {/* crack lines across the environment */}
        {cracks.map((c, i) => (
          <div key={`c${i}`} className="absolute left-0 top-0" style={{ transform: `rotate(${c.a}deg)`, transformOrigin: '0 0' }}>
            <motion.div
              className="absolute overflow-hidden"
              style={{ top: -8, height: 16 }}
              initial={{ width: 0, opacity: 1 }}
              animate={{ width: c.len, opacity: [1, 1, 0] }}
              transition={{
                width: { duration: 0.5, delay: c.delay, ease: [0.1, 0.8, 0.2, 1] },
                opacity: { duration: 1.5, delay: c.delay, times: [0, 0.55, 1] },
              }}
            >
              <pre
                className="select-none whitespace-pre font-mono text-[13px] font-bold leading-[16px]"
                style={{ color, textShadow: `0 0 8px ${color}` }}
              >
                {c.text}
              </pre>
            </motion.div>
          </div>
        ))}

        {/* character shockwave rings */}
        {rings.map((ring, ri) =>
          Array.from({ length: ring.n }, (_, i) => {
            const a = (i / ring.n) * Math.PI * 2
            return (
              <motion.span
                key={`r${ri}-${i}`}
                className="absolute -ml-1.5 -mt-2.5 select-none font-mono text-[15px] font-bold"
                style={{ color: ri ? '#fff' : color }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos(a) * ring.r * 2.4, y: Math.sin(a) * ring.r * 2.4, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.85, delay: ring.delay, ease: [0.1, 0.8, 0.3, 1] }}
              >
                {ring.chars[i % ring.chars.length]}
              </motion.span>
            )
          })
        )}

        {/* the label tears off the node */}
        {letters.map((l, i) => (
          <motion.span
            key={`l${i}`}
            className="absolute -ml-2 -mt-3 select-none font-mono text-[22px] font-bold"
            style={{ color: '#fff', textShadow: `0 0 12px ${color}` }}
            initial={{ x: l.x0, y: l.y0, opacity: 1, rotate: 0 }}
            animate={{ x: l.x, y: l.y, opacity: 0, rotate: l.rot }}
            transition={{
              x: { type: 'spring', stiffness: 45, damping: 9 },
              y: { type: 'spring', stiffness: 45, damping: 9 },
              rotate: { duration: 1.1, ease: 'easeOut' },
              opacity: { duration: 0.7, delay: 0.5 },
            }}
          >
            {l.ch}
          </motion.span>
        ))}

        {/* glyph debris on spring physics */}
        {particles.map((p, i) => (
          <motion.span
            key={`p${i}`}
            className="absolute -ml-1.5 -mt-2.5 select-none font-mono font-bold"
            style={{ fontSize: p.size, color: p.color, textShadow: i % 3 === 0 ? `0 0 10px ${p.color}` : undefined, willChange: 'transform, opacity' }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rot, scale: 0.5 }}
            transition={{
              x: p.spring,
              y: p.spring,
              rotate: { duration: 1.4, ease: 'easeOut' },
              scale: { duration: 1.4, ease: 'easeOut' },
              opacity: p.fade,
            }}
          >
            {p.ch}
          </motion.span>
        ))}
      </div>
    </>
  )
}
