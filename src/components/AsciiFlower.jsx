import { useEffect, useRef } from 'react'
import { animate, motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import useDecode from '../hooks/useDecode.js'
import { ASCII_FLOWER } from '../data/ascii.js'

const SPRING = { stiffness: 90, damping: 14, mass: 0.8 }

/**
 * AsciiFlower: Code Block 1a
 *
 * - Sits dead centre, breathing + floating continuously.
 * - `aim` ({ angle, color, locked }) makes it turn to face a node: a 3D tilt (rotateX/Y),
 *   a roll, and a lean towards the target. Hover = gentle, locked = full commitment.
 * - `phase` drives the charge: on "aiming" the breathing pauses, the flower swells and glows
 *   in the target's colour; on "firing" it recoils against the beam.
 * - `decodeRun` replays the glyph-decode reveal (intro and when the hub is restored).
 *
 * mouseX / mouseY are smoothed, normalised pointer MotionValues (-1..1) for a faint
 * reverse parallax, so the flower always feels like it is floating in space.
 */
export default function AsciiFlower({ fs, mouseX, mouseY, aim, phase, decodeRun, paused }) {
  const reduce = useReducedMotion()
  const art = useDecode(ASCII_FLOWER, decodeRun, 1.7)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)
  const chargeK = useMotionValue(0)
  const recoilX = useMotionValue(0)
  const recoilY = useMotionValue(0)

  const rotX = useSpring(0, SPRING)
  const rotY = useSpring(0, SPRING)
  const rotZ = useSpring(0, SPRING)
  const leanX = useSpring(0, SPRING)
  const leanY = useSpring(0, SPRING)

  const glowRef = useRef(null)
  const preRef = useRef(null)
  const colorRef = useRef('#d8b4fe')
  const paintedRef = useRef('')
  if (aim) colorRef.current = aim.color
  const pausedRef = useRef(false)
  pausedRef.current = !!paused

  // Face the target
  useEffect(() => {
    if (!aim) {
      rotX.set(0)
      rotY.set(0)
      rotZ.set(0)
      leanX.set(0)
      leanY.set(0)
      return
    }
    const a = (aim.angle * Math.PI) / 180
    const c = Math.cos(a)
    const s = Math.sin(a)
    const k = aim.locked ? 1.4 : 0.8
    rotY.set(c * 20 * k)
    rotX.set(-s * 20 * k)
    rotZ.set(c * 7 * k)
    leanX.set(c * 16 * k)
    leanY.set(s * 12 * k)
  }, [aim?.angle, aim?.locked]) // eslint-disable-line react-hooks/exhaustive-deps

  // Charge / recoil
  useEffect(() => {
    if (phase === 'aiming') {
      animate(chargeK, 1, { duration: 0.45, ease: 'easeOut' })
    } else if (phase === 'firing') {
      animate(chargeK, 1, { duration: 0.1 })
      if (aim) {
        const a = (aim.angle * Math.PI) / 180
        recoilX.set(-Math.cos(a) * 26)
        recoilY.set(-Math.sin(a) * 20)
        animate(recoilX, 0, { type: 'spring', stiffness: 170, damping: 11 })
        animate(recoilY, 0, { type: 'spring', stiffness: 170, damping: 11 })
      }
    } else {
      animate(chargeK, 0, { duration: 0.6 })
    }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  useAnimationFrame((time) => {
    if (pausedRef.current) return // hidden under a content space: don't burn frames
    const t = time / 1000
    const k = chargeK.get()
    const calm = reduce ? 0 : 1
    const mx = mouseX.get()
    const my = mouseY.get()

    // breathing pauses as the charge builds
    const breath = 1 + Math.sin(t * 1.35) * 0.035 * calm * (1 - k)
    scale.set(breath * (1 + k * 0.22))
    x.set(leanX.get() - mx * 10 + recoilX.get())
    y.set(Math.sin(t * 0.9) * 7 * calm * (1 - k) + leanY.get() - my * 7 + recoilY.get())

    if (glowRef.current) {
      glowRef.current.style.opacity = String(0.35 + 0.65 * k + Math.sin(t * 1.35) * 0.08 * (1 - k))
      glowRef.current.style.transform = `translate(-50%, -50%) scale(${1 + k * 0.7})`
      if (paintedRef.current !== colorRef.current) {
        paintedRef.current = colorRef.current
        glowRef.current.style.background = `radial-gradient(closest-side, ${colorRef.current}55, rgba(244,114,182,0.10) 55%, transparent)`
      }
    }
    if (preRef.current) {
      preRef.current.style.filter =
        k > 0.02 ? `brightness(${1 + k * 0.8}) drop-shadow(0 0 ${6 + k * 20}px ${colorRef.current})` : 'none'
    }
  })

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <motion.div
        style={{ x, y, scale, rotateX: rotX, rotateY: rotY, rotate: rotZ, transformPerspective: 900 }}
        className="relative will-change-transform"
      >
        {/* soft glow disc (cheaper than a CSS filter on the text) */}
        <div
          ref={glowRef}
          className="absolute left-1/2 top-1/2 h-[130%] w-[130%] rounded-full blur-2xl"
          style={{ transform: 'translate(-50%, -50%)', willChange: 'transform, opacity' }}
        />
        <pre
          ref={preRef}
          aria-hidden="true"
          className="relative select-none whitespace-pre bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text font-mono font-bold text-transparent"
          style={{ fontSize: fs, lineHeight: 1.2 }}
        >
          {art}
        </pre>
      </motion.div>
    </div>
  )
}
