import { motion } from 'framer-motion'
import { SHADE_RAMP } from '../data/ascii.js'

/** Procedural ASCII gear (64 x 32 glyphs is physically square). Built once, at module load. */
function buildGear(cols = 64, rows = 32, teeth = 14) {
  const mask = []
  const shade = []
  for (let y = 0; y < rows; y += 1) {
    mask.push([])
    shade.push([])
    for (let x = 0; x < cols; x += 1) {
      const px = (x + 0.5 - cols / 2) / (cols / 2)
      const py = (y + 0.5 - rows / 2) / (rows / 2)
      const r = Math.hypot(px, py)
      const th = Math.atan2(py, px)
      const tooth = Math.max(-1, Math.min(1, Math.sin(th * teeth) * 3))
      const outer = 0.8 + 0.1 * tooth
      const ring = r < outer && r > 0.56
      const spoke = r > 0.26 && r <= 0.56 && Math.abs(Math.sin(th * 2.5)) > 0.9
      const hub = r > 0.12 && r <= 0.26
      mask[y].push(ring || spoke || hub)
      shade[y].push(0.5 + 0.35 * Math.cos(th + 0.9) * r + 0.15 * Math.sin(r * 18))
    }
  }
  return mask
    .map((row, y) =>
      row
        .map((on, x) => {
          if (!on) return ' '
          const edge = !mask[y - 1]?.[x] || !mask[y + 1]?.[x] || !row[x - 1] || !row[x + 1]
          if (edge) return '#'
          const v = Math.max(0, Math.min(0.999, shade[y][x]))
          return SHADE_RAMP[Math.floor(v * SHADE_RAMP.length)]
        })
        .join('')
    )
    .join('\n')
}

const GEAR = buildGear()

/**
 * CornerGear
 * A slowly rotating ASCII gear parked in the bottom-right corner of the PAGE (viewport), not inside the portrait box.
 * `fixed` pins it to the corner while the space scrolls. framer-motion's `rotate` overwrites CSS translate, so the
 * wrapper does the positioning and only the inner <pre> rotates, about its own centre.
 * The gear's outer diameter is 34.56em, so `100cqw / 34.56` makes it fill its square wrapper exactly (never clipped).
 */
export default function CornerGear({ color }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-5 right-5 z-[5] flex items-center justify-center md:bottom-8 md:right-8"
      style={{ width: 'clamp(104px, 13vw, 190px)', aspectRatio: '1 / 1', containerType: 'inline-size' }}
    >
      <motion.pre
        className="m-0 shrink-0 select-none whitespace-pre font-mono font-bold leading-[1.2] opacity-[0.2] will-change-transform md:opacity-[0.4]"
        style={{ fontSize: 'calc(100cqw / 34.56)', color }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
      >
        {GEAR}
      </motion.pre>
    </div>
  )
}
