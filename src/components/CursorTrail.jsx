import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const GLYPHS = '*+.:#@~;'
const COLORS = ['#d8b4fe', '#f9a8d4', '#a5b4fc', '#7dd3fc']

/** A trail of fading ASCII glyphs behind the pointer (fine pointers only). */
export default function CursorTrail({ mouse }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const cv = ref.current
    if (!cv || reduce || !window.matchMedia('(pointer: fine)').matches) return undefined
    const ctx = cv.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const fit = () => {
      cv.width = window.innerWidth * dpr
      cv.height = window.innerHeight * dpr
      cv.style.width = `${window.innerWidth}px`
      cv.style.height = `${window.innerHeight}px`
    }
    fit()
    const parts = []
    let last = { x: -999, y: -999 }
    let raf = 0
    let prev = performance.now()
    let n = 0

    const move = () => {
      const x = mouse.x.get()
      const y = mouse.y.get()
      if (Math.hypot(x - last.x, y - last.y) < 22) return
      last = { x, y }
      n += 1
      parts.push({
        x, y,
        vx: (Math.random() - 0.5) * 30,
        vy: 20 + Math.random() * 30,
        life: 1,
        ch: GLYPHS[(Math.random() * GLYPHS.length) | 0],
        c: COLORS[n % COLORS.length],
        s: 11 + Math.random() * 7,
      })
      if (parts.length > 60) parts.shift()
    }

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min((now - prev) / 1000, 0.05)
      prev = now
      if (!parts.length) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (let i = parts.length - 1; i >= 0; i -= 1) {
        const p = parts[i]
        p.life -= dt * 1.5
        if (p.life <= 0) {
          parts.splice(i, 1)
          continue
        }
        p.x += p.vx * dt
        p.y += p.vy * dt
        ctx.globalAlpha = p.life * 0.8
        ctx.fillStyle = p.c
        ctx.font = `bold ${p.s}px "JetBrains Mono", monospace`
        ctx.fillText(p.ch, p.x, p.y)
      }
      ctx.globalAlpha = 1
      if (!parts.length) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }

    const unsub = mouse.x.on('change', move)
    window.addEventListener('resize', fit)
    raf = requestAnimationFrame(tick)
    return () => {
      unsub()
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', fit)
    }
  }, [mouse.x, mouse.y, reduce]) // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[59]" />
}
