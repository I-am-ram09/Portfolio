import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const NOISE = '.:;+*=%#@01<>/|-_~^'
const blank = (t) => t.replace(/[^\n]/g, ' ')

/**
 * useDecode
 * Returns `text` with a "decoding" animation: the art grows outward from its centre,
 * the leading edge being a band of random glyphs that resolve into the real characters.
 * Bump `run` (any changing number > 0) to play it again. run = 0 shows the finished art.
 */
export default function useDecode(text, run, duration = 1.6) {
  const reduce = useReducedMotion()
  const [out, setOut] = useState(() => (run && !reduce ? blank(text) : text))

  useEffect(() => {
    if (!run || reduce) {
      setOut(text)
      return undefined
    }
    setOut(blank(text))
    const lines = text.split('\n')
    const H = lines.length
    const W = Math.max(...lines.map((l) => l.length))
    const maxR = Math.hypot(W / 2, H) + 14
    const band = 12
    let raf = 0
    let frame = 0
    const start = performance.now()

    const tick = (now) => {
      const p = Math.min((now - start) / (duration * 1000), 1)
      const R = (p * p * (3 - 2 * p)) * maxR // smoothstep
      frame += 1
      if (frame % 2 === 0 || p === 1) {
        let s = ''
        for (let y = 0; y < H; y += 1) {
          const line = lines[y]
          for (let x = 0; x < W; x += 1) {
            const ch = line[x] ?? ' '
            const d = Math.hypot(x - W / 2, (y - H / 2) * 2)
            if (ch === ' ' || d < R - band) s += ch
            else if (d < R) s += NOISE[(Math.random() * NOISE.length) | 0]
            else s += ' '
          }
          if (y < H - 1) s += '\n'
        }
        setOut(p === 1 ? text : s)
      }
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, run, duration, reduce])

  return out
}
