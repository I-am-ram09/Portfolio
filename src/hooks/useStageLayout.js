import { useEffect, useMemo, useState } from 'react'
import { spaces } from '../data/spaces.js'
import { FLOWER_COLS, FLOWER_ROWS } from '../data/ascii.js'

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

/**
 * Pure layout maths for the hub. Everything is in viewport pixels, measured from the
 * top-left, so the beam / impact / reveal can share one coordinate system.
 */
export function computeLayout(w, h) {
  const mobile = w < 700
  const cx = w / 2
  const cy = h / 2

  // Font size of the flower art. A mono glyph is ~0.6em wide, line-height is 1.2em.
  const fs = clamp(mobile ? w / 62 : Math.min(w / 68, h / 80), 5.2, 10.5)
  const flowerW = FLOWER_COLS * fs * 0.6
  const flowerH = FLOWER_ROWS * fs * 1.2

  const rx = mobile ? Math.min(w * 0.27, 150) : Math.min(w * 0.33, 470)
  const ry = mobile ? Math.min(h * 0.27, 230) : Math.min(h * 0.31, 270)

  const nodes = {}
  spaces.forEach((s) => {
    const deg = mobile ? s.mobileAngle : s.angle
    const rad = (deg * Math.PI) / 180
    nodes[s.id] = { x: cx + Math.cos(rad) * rx, y: cy + Math.sin(rad) * ry, deg }
  })

  return { w, h, cx, cy, mobile, fs, flowerW, flowerH, rx, ry, beamStart: flowerW * 0.26, nodes }
}

export default function useStageLayout() {
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))

  useEffect(() => {
    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setSize({ w: window.innerWidth, h: window.innerHeight }))
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return useMemo(() => computeLayout(size.w, size.h), [size])
}

/**
 * Plans a shot from the flower centre to the *boundary* of a node's box.
 * `box` is the node's measured { w, h }; the beam stops at its edge, not its centre.
 */
export function planShot(layout, space, box) {
  const n = layout.nodes[space.id]
  const dx = n.x - layout.cx
  const dy = n.y - layout.cy
  const dist = Math.hypot(dx, dy)
  const ux = dx / dist
  const uy = dy / dist

  const hw = box.w / 2 + 6
  const hh = box.h / 2 + 6
  const toEdge = Math.min(hw / Math.max(Math.abs(ux), 1e-4), hh / Math.max(Math.abs(uy), 1e-4))
  const length = Math.max(dist - toEdge, layout.beamStart + 60)

  return {
    id: space.id,
    absorb: !!space.absorb,
    color: space.color,
    label: space.label,
    angle: (Math.atan2(dy, dx) * 180) / Math.PI,
    ux,
    uy,
    cx: layout.cx,
    cy: layout.cy,
    start: layout.beamStart,
    length,
    node: { x: n.x, y: n.y },
    hit: { x: layout.cx + ux * length, y: layout.cy + uy * length },
  }
}
