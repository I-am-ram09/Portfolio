import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import AsciiField from './AsciiField.jsx'
import AsciiFlower from './AsciiFlower.jsx'
import AsciiCombatNav from './AsciiCombatNav.jsx'
import OrbitNode, { E_OUT } from './OrbitNode.jsx'
import ShootingStars from './ShootingStars.jsx'
import useStageLayout, { planShot } from '../hooks/useStageLayout.js'
import { spaceById, spaces } from '../data/spaces.js'
import { about } from '../data/about.js'

const TITLE = 'PORTFOLIO'
// one colour per letter: white -> pink -> lilac -> indigo
const TITLE_COLORS = ['#ffffff', '#fdf2f8', '#fbcfe8', '#f9a8d4', '#e9b5f0', '#d8b4fe', '#c4b5fd', '#a5b4fc', '#93c5fd']

/**
 * HeroHub: Code Block 3
 *
 * The landing stage: dramatic serif PORTFOLIO, the centred flower, three orbiting nodes,
 * the ambient ASCII field, and the combat sequencer. It reads the global phase and decides
 * what is visible:
 *
 *   intro      title reveals, flower decodes, nodes drift in           -> INTRO_DONE
 *   idle       hover a node and the flower turns to face it            -> click = AIM
 *   aiming     flower charges + locks on, other nodes dim              -> (CombatNav) FIRE
 *   firing     beam streams to the node boundary                       -> (CombatNav) IMPACT
 *   impact     shake, shatter, everything blows away, void             -> (ContentSpace) REVEAL
 *   content_view  hub stays voided underneath the space
 *   returning  space collapses to the impact point, hub reassembles    -> (ContentSpace) RESET
 */
export default function HeroHub({ phase, target, shotId, point, dispatch, mouse }) {
  const layout = useStageLayout()
  const fieldRef = useRef(null)
  const nodeEls = useRef({})
  const [hovered, setHovered] = useState(null)
  const [decodeRun, setDecodeRun] = useState(1)

  // smoothed, normalised pointer (-1..1) for the flower's reverse parallax
  const nx = useTransform(mouse.x, (v) => (v / window.innerWidth) * 2 - 1)
  const ny = useTransform(mouse.y, (v) => (v / window.innerHeight) * 2 - 1)
  const mouseX = useSpring(nx, { stiffness: 55, damping: 18, mass: 0.9 })
  const mouseY = useSpring(ny, { stiffness: 55, damping: 18, mass: 0.9 })

  // `absorb` spaces (Resume) swallow the beam instead of shattering the hub: nothing is voided
  const absorb = !!(target && spaceById(target)?.absorb)
  const idle = phase === 'idle'
  const aimingOrFiring = phase === 'aiming' || phase === 'firing'
  const spaceUp = phase === 'impact' || phase === 'content_view'
  const voided = spaceUp && !absorb
  const dimmed = aimingOrFiring || (spaceUp && absorb)
  // once the space fully covers the screen, stop painting and animating everything underneath
  const covered = phase === 'content_view'

  // stale hover guard
  useEffect(() => {
    if (!idle) setHovered(null)
  }, [idle])

  // environment + decode choreography
  useEffect(() => {
    if (phase === 'impact' && point && !absorb) fieldRef.current?.shatter(point.x, point.y)
    if (phase === 'returning' && !absorb) {
      fieldRef.current?.restore()
      const t = setTimeout(() => setDecodeRun((r) => r + 1), 700)
      return () => clearTimeout(t)
    }
    return undefined
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fieldRef.current?.setPaused(covered)
  }, [covered])

  // what are we aiming at? the clicked node wins, otherwise the hovered one
  const aimId = target ?? (idle ? hovered : null)
  const shot = useMemo(() => {
    const space = aimId && spaceById(aimId)
    if (!space) return null
    const el = nodeEls.current[space.id]
    const box = el ? { w: el.offsetWidth, h: el.offsetHeight } : { w: 150, h: 46 }
    return planShot(layout, space, box)
  }, [aimId, layout])

  const aim = shot && (idle || aimingOrFiring) ? { angle: shot.angle, color: shot.color, locked: aimingOrFiring } : null

  const statusOf = (id) => {
    if (phase === 'aiming' || phase === 'firing') return id === target ? 'locked' : 'dim'
    if (phase === 'impact' || phase === 'content_view') {
      if (absorb) return id === target ? 'absorb' : 'dim'
      return id === target ? 'hit' : 'void'
    }
    return 'idle'
  }

  const voidVecOf = (id) => {
    const n = layout.nodes[id]
    const from = point ?? { x: layout.cx, y: layout.cy }
    const dx = n.x - from.x
    const dy = n.y - from.y
    const d = Math.hypot(dx, dy) || 1
    return { x: (dx / d) * 560, y: (dy / d) * 560 - 40, r: dx >= 0 ? 150 : -150 }
  }

  return (
    <motion.div
      className="fixed inset-0 z-10 overflow-hidden"
      style={{ visibility: covered ? 'hidden' : 'visible', willChange: phase === 'impact' && !absorb ? 'transform' : 'auto' }}
      animate={phase === 'impact' && !absorb ? { x: [0, -16, 13, -9, 6, -3, 0], y: [0, 9, -11, 6, -4, 2, 0], scale: [1, 1.035, 1.015, 1] } : { x: 0, y: 0 }}
      transition={phase === 'impact' && !absorb ? { duration: 0.65, ease: 'easeOut' } : { duration: 0 }}
    >
      {/* night-sky atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(139,92,246,0.16),transparent_62%),radial-gradient(ellipse_at_85%_95%,rgba(244,114,182,0.08),transparent_50%),radial-gradient(ellipse_at_10%_5%,rgba(56,189,248,0.06),transparent_45%)]" />

      <AsciiField ref={fieldRef} mouse={mouse} />

      {!covered && <OrbitRings layout={layout} visible={!voided} />}
      {(idle || phase === 'intro') && <ShootingStars />}

      {/* ---- Title ---- */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[5vh] z-[2] flex flex-col items-center md:top-[6.5vh]"
        animate={
          voided
            ? { y: -150, opacity: 0 }
            : { y: 0, opacity: dimmed ? 0.45 : 1 }
        }
        transition={
          voided
            ? { duration: 0.5, delay: 0.1, ease: [0.7, 0, 0.9, 0.3] }
            : phase === 'returning' && !absorb
              ? { duration: 0.9, delay: 0.9, ease: E_OUT }
              : { duration: 0.4 }
        }
      >
        <div className="relative">
          {/* outlined ghost for depth */}
          <h1
            aria-hidden="true"
            className="absolute inset-0 translate-x-[0.35rem] translate-y-[0.45rem] select-none whitespace-nowrap font-display text-[clamp(2.6rem,11.5vw,9.75rem)] font-black italic leading-[0.95] tracking-[0.01em] text-transparent [-webkit-text-stroke:1px_rgba(216,180,254,0.22)]"
          >
            {TITLE}
          </h1>
          <h1 className="relative select-none whitespace-nowrap font-display text-[clamp(2.6rem,11.5vw,9.75rem)] font-black italic leading-[0.95] tracking-[0.01em]">
            <span className="sr-only">{TITLE}</span>
            {TITLE.split('').map((ch, i) => (
              <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] pr-[0.1em] -mr-[0.06em] align-bottom">
                <motion.span
                  className="inline-block"
                  style={{ color: TITLE_COLORS[i], textShadow: `0 0 40px ${TITLE_COLORS[i]}44` }}
                  initial={{ y: '115%', opacity: 0, rotate: 6 }}
                  animate={{ y: '0%', opacity: 1, rotate: 0 }}
                  transition={{ duration: 1, delay: 0.15 + i * 0.07, ease: E_OUT }}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>
        <motion.p
          className="mt-2 font-mono text-[10px] uppercase tracking-[0.42em] text-white/45 md:text-xs"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {about.fullName} <span className="text-pastel-pink/70">//</span> mechanical x code
          <span className="ml-1 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] animate-caret bg-pastel-lilac/70" />
        </motion.p>
      </motion.div>

      {/* ---- Flower ---- */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10"
        initial={false}
        animate={voided ? { scale: 0.04, rotate: 200, opacity: 0 } : { scale: 1, rotate: 0, opacity: 1 }}
        transition={
          voided
            ? { delay: 0.15, duration: 0.55, ease: [0.7, 0, 0.9, 0.3] }
            : phase === 'returning' && !absorb
              ? { delay: 1.05, duration: 1, ease: E_OUT }
              : { duration: 0 }
        }
      >
        <AsciiFlower fs={layout.fs} mouseX={mouseX} mouseY={mouseY} aim={aim} phase={phase} decodeRun={decodeRun} paused={covered} />
      </motion.div>

      {/* ---- Orbital menu ---- */}
      {spaces.map((space, i) => (
        <OrbitNode
          key={space.id}
          space={space}
          pos={layout.nodes[space.id]}
          index={i}
          last={i === spaces.length - 1}
          compact={layout.mobile}
          quick={absorb}
          status={statusOf(space.id)}
          phase={phase}
          voidVec={voidVecOf(space.id)}
          innerRef={(el) => {
            nodeEls.current[space.id] = el
          }}
          onHover={(id) => idle && setHovered(id)}
          onSelect={() => dispatch({ type: 'AIM', target: space.id })}
          onEntered={() => dispatch({ type: 'INTRO_DONE' })}
        />
      ))}

      {/* ---- Beam, impact, reticle ---- */}
      <AsciiCombatNav shot={shot} phase={phase} shotId={shotId} dispatch={dispatch} />

      {/* ---- HUD ---- */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[3] font-mono text-[10px] uppercase tracking-[0.25em] text-white/30"
        animate={{ opacity: voided ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="absolute left-5 top-4">[ sys.online ]</span>
        <span className="absolute bottom-4 left-5">state: {phase}</span>
        <motion.span
          className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 normal-case tracking-[0.2em] md:block"
          animate={{ opacity: idle ? 1 : 0 }}
          transition={{ duration: 0.5, delay: idle ? 0.4 : 0 }}
        >
          <span className="inline-block animate-hint-bob">hover a node. click to fire.</span>
        </motion.span>
      </motion.div>

      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55))]" />
    </motion.div>
  )
}

/** Dashed orbit rings through the nodes, with a small satellite gliding around the outer one. */
function OrbitRings({ layout, visible }) {
  const { cx, cy, rx, ry, w, h } = layout
  const t = useMotionValue(0)
  useEffect(() => {
    const c = animate(t, 1, { duration: 26, ease: 'linear', repeat: Infinity })
    return () => c.stop()
  }, [t])
  const sx = useTransform(t, (v) => cx + Math.cos(v * Math.PI * 2) * rx)
  const sy = useTransform(t, (v) => cy + Math.sin(v * Math.PI * 2) * ry)

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[1]"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: visible ? 1.2 : 0.3, delay: visible ? 1.4 : 0 }}
    >
      <svg width={w} height={h} className="absolute inset-0">
        {[1.18, 1, 0.62].map((k, i) => (
          <motion.ellipse
            key={k}
            cx={cx}
            cy={cy}
            rx={rx * k}
            ry={ry * k}
            fill="none"
            stroke="white"
            strokeOpacity={i === 1 ? 0.14 : 0.07}
            strokeWidth={1}
            strokeDasharray={i === 1 ? '2 9' : '1 14'}
            animate={{ strokeDashoffset: i % 2 ? [0, 66] : [0, -66] }}
            transition={{ duration: 14 + i * 5, ease: 'linear', repeat: Infinity }}
          />
        ))}
      </svg>
      <motion.span
        className="absolute left-0 top-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-white shadow-[0_0_14px_4px_rgba(216,180,254,0.8)]"
        style={{ x: sx, y: sy }}
      />
    </motion.div>
  )
}
