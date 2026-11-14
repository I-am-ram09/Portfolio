import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { PORTRAIT } from '../data/portrait.js'
import { asset } from '../data/asset.js'

// public/img/ram.jpg is a square crop with the face ~50% across / ~39% down; it is centred and covered.
const PHOTO = asset('img/ram.jpg')

// The ASCII art is 84 columns x 43 rows. A mono glyph is 0.6em wide and rows are 1.2em tall,
// so the art is 50.4em x 51.6em. The font-size below is `100cqw / 50.4`, which makes the art fill
// its box EXACTLY at any width (no min-font-size clamping, no overflow, no per-breakpoint guesswork).
const EM_W = 50.4
const EM_H = 51.6
const ART_FONT = `calc(100cqw / ${EM_W})`

/**
 * PortraitReveal
 * The ASCII portrait. Move the pointer over it and a lens opens around the cursor that reveals the
 * real photo underneath; leave and it closes. On touch screens (or with Enter / Space) a tap pins the
 * photo fully open and a second tap closes it again.
 *
 * The lens is driven straight through CSS variables from one rAF loop that only runs while the lens
 * is moving, so hovering never triggers a React re-render.
 */
export default function PortraitReveal({ color }) {
  const box = useRef(null)
  const layer = useRef(null)
  const ring = useRef(null)
  const lens = useRef({ x: 0, y: 0, r: 0, tx: 0, ty: 0, tr: 0, raf: 0, size: 1, pinned: false })
  const [photoOk, setPhotoOk] = useState(null) // null = loading, true = loaded, false = missing
  const [pinned, setPinned] = useState(false)

  const paint = useCallback(() => {
    const L = lens.current
    const el = layer.current
    if (!el) return
    el.style.setProperty('--mx', `${L.x}px`)
    el.style.setProperty('--my', `${L.y}px`)
    el.style.setProperty('--r', `${L.r}px`)
    el.style.opacity = L.r > 1 ? '1' : '0'
    if (ring.current) {
      const k = L.r / (L.size * 0.5)
      ring.current.style.opacity = L.r > 2 && !L.pinned ? '1' : '0'
      ring.current.style.transform = `translate3d(${L.x - L.size * 0.5}px, ${L.y - L.size * 0.5}px, 0) scale(${k})`
    }
  }, [])

  const run = useCallback(() => {
    const L = lens.current
    if (L.raf) return
    const step = () => {
      const kp = 0.3
      const kr = 0.16
      L.x += (L.tx - L.x) * kp
      L.y += (L.ty - L.y) * kp
      L.r += (L.tr - L.r) * kr
      paint()
      const settled = Math.abs(L.tx - L.x) < 0.3 && Math.abs(L.ty - L.y) < 0.3 && Math.abs(L.tr - L.r) < 0.3
      if (settled) {
        L.x = L.tx
        L.y = L.ty
        L.r = L.tr
        paint()
        L.raf = 0
      } else {
        L.raf = requestAnimationFrame(step)
      }
    }
    L.raf = requestAnimationFrame(step)
  }, [paint])

  useEffect(() => () => cancelAnimationFrame(lens.current.raf), [])

  const measure = () => {
    const b = box.current.getBoundingClientRect()
    lens.current.size = b.width
    return b
  }

  const onMove = (e) => {
    if (e.pointerType === 'touch') return
    const L = lens.current
    const b = measure()
    const first = L.tr === 0 && L.r < 1
    L.tx = e.clientX - b.left
    L.ty = e.clientY - b.top
    if (first) {
      L.x = L.tx
      L.y = L.ty
    }
    L.tr = L.pinned ? Math.hypot(b.width, b.height) : b.width * 0.36
    run()
  }

  const onLeave = (e) => {
    if (e.pointerType === 'touch' || lens.current.pinned) return
    lens.current.tr = 0
    run()
  }

  const toggle = () => {
    const L = lens.current
    const b = measure()
    L.pinned = !L.pinned
    setPinned(L.pinned)
    if (L.pinned) {
      if (L.r < 1) {
        L.x = L.tx = b.width / 2
        L.y = L.ty = b.height / 2
      }
      L.tr = Math.hypot(b.width, b.height)
    } else {
      L.tr = 0
    }
    run()
  }

  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }

  // The same mask drives the photo and the fallback highlight.
  const mask = 'radial-gradient(circle at var(--mx) var(--my), #000 calc(var(--r) * 0.86), transparent var(--r))'

  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      {/* ambient glow */}
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[95%] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: `${color}22` }} />

      <div
        ref={box}
        role="button"
        tabIndex={0}
        aria-pressed={pinned}
        aria-label="ASCII portrait of Ram Bhosale. Hover to reveal the real photo; press Enter to pin it open."
        onPointerMove={onMove}
        onPointerEnter={onMove}
        onPointerLeave={onLeave}
        onClick={toggle}
        onKeyDown={onKey}
        className="relative w-full touch-manipulation select-none rounded-2xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
        style={{ aspectRatio: `${EM_W} / ${EM_H}`, containerType: 'inline-size' }}
      >
        {/* ASCII portrait, scanned in from the top */}
        <motion.pre
          aria-hidden="true"
          className="absolute inset-0 m-0 block select-none whitespace-pre font-mono font-bold leading-[1.2]"
          style={{
            fontSize: ART_FONT,
            backgroundImage: `linear-gradient(160deg, #fff, ${color} 50%, #a5b4fc)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitTextSizeAdjust: '100%',
          }}
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ delay: 1.6, duration: 2.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {PORTRAIT.replace(/^\n+/, '')}
        </motion.pre>

        {/* scan line */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 h-px"
          style={{ background: color, boxShadow: `0 0 14px 3px ${color}` }}
          initial={{ top: '0%', opacity: 1 }}
          animate={{ top: '100%', opacity: [1, 1, 0] }}
          transition={{ delay: 1.6, duration: 2.4, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* the lens: the real photo (or, until a photo is added, a lit-up copy of the ASCII) */}
        <div
          ref={layer}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl bg-zinc-950 opacity-0 will-change-[opacity]"
          style={{ WebkitMaskImage: mask, maskImage: mask, '--mx': '0px', '--my': '0px', '--r': '0px' }}
        >
          <img
            src={PHOTO}
            alt=""
            decoding="async"
            onLoad={() => setPhotoOk(true)}
            onError={() => setPhotoOk(false)}
            className={`absolute inset-0 h-full w-full object-cover object-[50%_50%] ${photoOk ? '' : 'hidden'}`}
          />
          {photoOk === false && (
            <pre
              className="absolute inset-0 m-0 block whitespace-pre font-mono font-bold leading-[1.2] text-white"
              style={{ fontSize: ART_FONT, textShadow: `0 0 10px ${color}` }}
            >
              {PORTRAIT.replace(/^\n+/, '')}
            </pre>
          )}
          {/* soft vignette so the photo melts into the page */}
          <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 60px 10px rgba(10,10,10,0.55)' }} />
        </div>

        {/* glowing rim that follows the lens */}
        <span
          ref={ring}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 rounded-full border opacity-0 will-change-transform"
          style={{ width: '100cqw', height: '100cqw', borderColor: color, boxShadow: `0 0 28px 2px ${color}88, inset 0 0 28px 2px ${color}44` }}
        />
      </div>

      <p className="relative mt-4 text-center font-mono text-[11px] text-white/35">
        <span className="hidden [@media(hover:hover)]:inline">ram_bhosale.ascii // hover to reveal the real me</span>
        <span className="[@media(hover:hover)]:hidden">ram_bhosale.ascii // tap to reveal the real me</span>
      </p>
    </div>
  )
}
