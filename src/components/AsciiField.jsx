import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { FIELD_CHARS } from '../data/ascii.js'

const COLORS = ['#d8b4fe', '#f9a8d4', '#a5b4fc', '#7dd3fc']
const WAVE_SPEED = 2.1 // px per ms: how fast the shockwave crosses the screen

/**
 * AsciiField
 * The "environment" of the landing page: a sparse canvas grid of dim ASCII glyphs that
 * light up near the cursor. On impact the shockwave sweeps outward from the hit point and
 * blasts every glyph away (the shattered environment). `restore()` pulls them back together.
 *
 * Imperative API: ref.current.shatter(x, y) / ref.current.restore() / ref.current.setPaused(bool)
 */
const AsciiField = forwardRef(function AsciiField({ mouse }, ref) {
  const canvasRef = useRef(null)
  const reduce = useReducedMotion()
  const S = useRef({ glyphs: [], mode: 'normal', restoreUntil: 0, dpr: 1, w: 0, h: 0, lastDraw: 0, idle: false, paused: false })

  useImperativeHandle(ref, () => ({
    setPaused(v) {
      S.current.paused = !!v
      S.current.lastDraw = 0
    },
    shatter(x, y) {
      const s = S.current
      const now = performance.now()
      s.mode = 'shattered'
      s.idle = false
      s.glyphs.forEach((g) => {
        const d = Math.hypot(g.hx - x, g.hy - y)
        g.hit = false
        g.sx = x
        g.sy = y
        g.hitAt = now + d / WAVE_SPEED
      })
    },
    restore() {
      const s = S.current
      const now = performance.now()
      s.mode = 'restoring'
      s.idle = false
      s.restoreUntil = now + 2600
      s.glyphs.forEach((g) => {
        const d = Math.hypot(g.hx - s.w / 2, g.hy - s.h / 2)
        g.ox = (Math.random() - 0.5) * 220
        g.oy = (Math.random() - 0.5) * 220
        g.vx = g.vy = g.vr = 0
        g.rot = 0
        g.a = 0
        g.flash = 0
        g.hitAt = now + d * 0.7 + Math.random() * 350
      })
    },
  }))

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return undefined
    const ctx = cv.getContext('2d')
    const s = S.current
    let raf = 0

    const build = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.width = w * dpr
      cv.height = h * dpr
      cv.style.width = `${w}px`
      cv.style.height = `${h}px`
      s.w = w
      s.h = h
      s.dpr = dpr

      const cw = w < 700 ? 20 : 26
      const chh = w < 700 ? 22 : 26
      // cap the glyph count so huge / hi-res screens don't pay for thousands of fillText calls
      const keep = Math.min(0.4, 1000 / ((w / cw) * (h / chh)))
      const gone = s.mode === 'shattered'
      const g = []
      for (let y = chh / 2; y < h; y += chh) {
        for (let x = cw / 2; x < w; x += cw) {
          if (Math.random() > keep) continue
          g.push({
            hx: x + (Math.random() - 0.5) * 8,
            hy: y + (Math.random() - 0.5) * 8,
            ox: 0, oy: 0, vx: 0, vy: 0, rot: 0, vr: 0,
            a: gone ? 0 : 1,
            flash: 0,
            hit: gone,
            hitAt: 0,
            sx: 0, sy: 0,
            ch: FIELD_CHARS[(Math.random() * FIELD_CHARS.length) | 0],
            c: (Math.random() * COLORS.length) | 0,
            ph: Math.random() * Math.PI * 2,
            sz: 10 + ((Math.random() * 5) | 0),
          })
        }
      }
      g.sort((a, b) => a.c - b.c) // fewer fillStyle switches
      s.glyphs = g
    }

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      if (s.idle || s.paused) {
        s.lastDraw = 0
        return
      }
      // the ambient field is slow and soft: 30fps is indistinguishable and halves the cost
      if (s.mode === 'normal' && s.lastDraw && now - s.lastDraw < 30) return
      const dt = Math.min((now - (s.lastDraw || now)) / 1000, 0.05)
      s.lastDraw = now

      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0)
      ctx.clearRect(0, 0, s.w, s.h)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const mx = mouse ? mouse.x.get() : -999
      const my = mouse ? mouse.y.get() : -999
      const t = now / 1000
      let lastC = -1
      let lastSz = -1
      let alive = 0

      if (s.mode === 'restoring' && now > s.restoreUntil) s.mode = 'normal'

      for (let i = 0; i < s.glyphs.length; i += 1) {
        const g = s.glyphs[i]

        if (s.mode === 'shattered') {
          if (!g.hit) {
            if (now >= g.hitAt) {
              g.hit = true
              const dx = g.hx - g.sx
              const dy = g.hy - g.sy
              const d = Math.hypot(dx, dy) || 1
              const speed = 280 + 1100 * Math.exp(-d / 420) + Math.random() * 220
              g.vx = (dx / d) * speed
              g.vy = (dy / d) * speed - 120
              g.vr = (Math.random() - 0.5) * 14
              g.flash = 1
            }
          } else {
            g.vy += 640 * dt
            g.vx *= Math.pow(0.45, dt)
            g.ox += g.vx * dt
            g.oy += g.vy * dt
            g.rot += g.vr * dt
            g.a = Math.max(0, g.a - dt * 0.8)
          }
        } else if (s.mode === 'restoring') {
          if (now >= g.hitAt) {
            const k = 1 - Math.exp(-dt * 5)
            g.ox += (0 - g.ox) * k
            g.oy += (0 - g.oy) * k
            g.a += (1 - g.a) * (1 - Math.exp(-dt * 4))
          }
        } else {
          const k = 1 - Math.exp(-dt * 8)
          g.ox += (0 - g.ox) * k
          g.oy += (0 - g.oy) * k
          g.a += (1 - g.a) * k
        }

        g.flash = Math.max(0, g.flash - dt * 2.2)
        if (g.a < 0.01 && g.flash < 0.01) continue
        alive += 1

        const x = g.hx + g.ox
        const y = g.hy + g.oy
        const base = reduce ? 0.14 : 0.1 + 0.07 * Math.sin(t * 0.9 + g.ph)
        const near = Math.max(0, 1 - Math.hypot(x - mx, y - my) / 170) * 0.55
        const alpha = Math.min(1, g.a * (base + near) + g.flash * 0.7)
        if (alpha < 0.01) continue

        if (g.c !== lastC) {
          ctx.fillStyle = COLORS[g.c]
          lastC = g.c
        }
        if (g.sz !== lastSz) {
          ctx.font = `${g.sz}px "JetBrains Mono", ui-monospace, monospace`
          lastSz = g.sz
        }
        ctx.globalAlpha = alpha
        if (g.rot !== 0) {
          ctx.save()
          ctx.translate(x, y)
          ctx.rotate(g.rot)
          ctx.fillText(g.ch, 0, 0)
          ctx.restore()
        } else {
          ctx.fillText(g.ch, x, y)
        }
      }
      ctx.globalAlpha = 1

      // Everything has blown away: stop drawing until restore() is called.
      if (s.mode === 'shattered' && alive === 0 && s.glyphs.every((g) => g.hit)) s.idle = true
    }

    build()
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', build)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', build)
    }
  }, [mouse?.x, mouse?.y, reduce]) // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" />
})

export default AsciiField
