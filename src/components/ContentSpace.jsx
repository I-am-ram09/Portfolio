import { useEffect, useMemo, useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import SpaceBackdrop from './SpaceBackdrop.jsx'
import AboutSpace from './spaces/AboutSpace.jsx'
import ProjectsSpace from './spaces/ProjectsSpace.jsx'
import HandlesSpace from './spaces/HandlesSpace.jsx'
import CertificationsSpace from './spaces/CertificationsSpace.jsx'
import AchievementsSpace from './spaces/AchievementsSpace.jsx'
import ResumeSpace from './spaces/ResumeSpace.jsx'
import { spaceById } from '../data/spaces.js'

const EASE = [0.76, 0, 0.24, 1]
const OPEN = { delay: 0.8, duration: 1.15, ease: EASE } // waits for the debris + void to play out
const OPEN_ABSORB = { delay: 0.55, duration: 1.1, ease: EASE } // absorb spaces: starts while the node is still glowing
const CLOSE = { duration: 0.95, ease: EASE }

const BODY = {
  about: AboutSpace,
  projects: ProjectsSpace,
  certifications: CertificationsSpace,
  achievements: AchievementsSpace,
  handles: HandlesSpace,
  resume: ResumeSpace,
}

/**
 * ContentSpace: Code Block 4
 *
 * The requested space grows out of the exact impact point as an expanding circle
 * (clip-path), with a glowing ring riding the edge. Back (or Esc) runs it in reverse:
 * the space is sucked back into that same point.
 *
 *   impact       mounts, waits for the explosion, then opens   -> onAnimationComplete => REVEAL
 *   content_view fully open and scrollable
 *   returning    collapses into the point                      -> onAnimationComplete => RESET
 */
export default function ContentSpace({ id, point, phase, dispatch }) {
  const space = spaceById(id)
  const Body = BODY[id]
  const openT = space.absorb ? OPEN_ABSORB : OPEN
  const lead = space.absorb ? -0.25 : 0 // content settles in a touch earlier when there is no debris to wait for
  const opening = phase === 'impact' || phase === 'content_view'
  const scroller = useRef(null)
  const { scrollYProgress } = useScroll({ container: scroller })

  const R = useMemo(
    () =>
      Math.hypot(Math.max(point.x, window.innerWidth - point.x), Math.max(point.y, window.innerHeight - point.y)) + 40,
    [point]
  )
  const closed = `circle(0px at ${point.x}px ${point.y}px)`
  const open = `circle(${R}px at ${point.x}px ${point.y}px)`

  // Esc = back
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && dispatch({ type: 'RETURN' })
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dispatch])

  const onDone = () => {
    if (phase === 'impact') dispatch({ type: 'REVEAL' })
    else if (phase === 'returning') dispatch({ type: 'RESET' })
  }

  return (
    <>
      {/* glowing ring riding the circle's edge */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[55] rounded-full border-2"
        style={{
          left: point.x - R,
          top: point.y - R,
          width: R * 2,
          height: R * 2,
          borderColor: space.color,
          boxShadow: `0 0 28px 3px ${space.color}88`,
          willChange: 'transform, opacity',
        }}
        initial={{ scale: 0, opacity: 0.95 }}
        animate={opening ? { scale: 1, opacity: [0.95, 0.95, 0] } : { scale: 0, opacity: [0, 0.95, 0.95] }}
        transition={opening ? { ...openT, opacity: { ...openT, times: [0, 0.7, 1] } } : { ...CLOSE, opacity: { ...CLOSE, times: [0, 0.1, 1] } }}
      />

      <motion.div
        ref={scroller}
        className="space-scroll fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-zinc-950"
        initial={{ clipPath: closed }}
        animate={{ clipPath: opening ? open : closed }}
        transition={opening ? openT : CLOSE}
        onAnimationComplete={onDone}
      >
        <SpaceBackdrop color={space.color} point={point} />

        {/* scroll progress */}
        <motion.div
          aria-hidden="true"
          className="fixed left-0 right-0 top-0 z-[70] h-[2px] origin-left"
          style={{ scaleX: scrollYProgress, background: `linear-gradient(90deg, ${space.color}, #fff)`, boxShadow: `0 0 12px ${space.color}` }}
        />

        {/* Back: an ASCII arrow that reverses the whole animation */}
        <motion.button
          type="button"
          onClick={() => dispatch({ type: 'RETURN' })}
          disabled={phase !== 'content_view'}
          initial={{ opacity: 0, x: -12 }}
          animate={phase === 'content_view' ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
          transition={{ duration: 0.4 }}
          whileHover="hover"
          whileTap={{ scale: 0.96 }}
          aria-label="Back to the flower"
          style={{ '--c': space.color, color: space.color, borderColor: `${space.color}55` }}
          className="fixed left-4 top-4 z-[70] flex items-center gap-3 rounded-full border bg-zinc-950/90 px-5 py-2.5 font-mono text-sm transition-shadow duration-300 hover:shadow-[0_0_30px_-4px_var(--c)] focus-visible:shadow-[0_0_30px_-4px_var(--c)] focus-visible:outline-none disabled:pointer-events-none md:left-8 md:top-6"
        >
          <motion.span
            className="inline-block font-bold"
            variants={{ hover: { x: [0, -7, 0] } }}
            transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
          >
            {'<--'}
          </motion.span>
          <span className="text-white/70">back</span>
        </motion.button>

        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-32 pt-28 md:px-10 md:pt-32">
          <motion.header
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15 + lead, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-sm" style={{ color: space.color }}>
              // {space.kicker}
            </p>
            <h2
              className="mt-3 font-display text-[clamp(3.2rem,11vw,8.5rem)] font-black italic leading-[0.95] tracking-[0.005em] text-white/95"
              style={{ textShadow: `0 0 60px ${space.color}44` }}
            >
              {space.title}
            </h2>
            <div className="mt-6 h-px w-full max-w-md" style={{ background: `linear-gradient(90deg, ${space.color}, transparent)` }} />
          </motion.header>

          {/* ticker */}
          <div aria-hidden="true" className="-mx-6 mt-10 overflow-hidden border-y border-white/5 py-2 md:-mx-10">
            <motion.div
              className="flex w-max whitespace-nowrap font-mono text-xs uppercase tracking-[0.4em]"
              style={{ color: `${space.color}88` }}
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
            >
              {[0, 1].map((k) => (
                <span key={k} className="pr-6">
                  {Array.from({ length: 8 }, () => `${space.title} *** `).join('')}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="mt-14"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + lead, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <Body color={space.color} />
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
