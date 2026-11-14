import { motion } from 'framer-motion'

export const E_OUT = [0.16, 1, 0.3, 1]

const STATE = {
  idle: { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 },
  locked: { opacity: 1, scale: 1.14, x: 0, y: 0, rotate: 0 },
  dim: { opacity: 0.16, scale: 0.9, x: 0, y: 0, rotate: 0 },
  hit: { opacity: 0, scale: 1.6, x: 0, y: 0, rotate: 0 }, // replaced by flying letters in <AsciiImpact/>
  absorb: { opacity: 1, scale: 1.6, x: 0, y: 0, rotate: 0 }, // swallows the beam: swells and glows (see <AsciiAbsorb/>)
}

function transitionFor(status, phase, index, quick) {
  switch (status) {
    case 'idle':
      if (phase === 'intro') return { delay: 1.9 + index * 0.14, duration: 0.6, ease: E_OUT }
      // after an absorb nothing was destroyed, so the nodes only have to settle back
      if (phase === 'returning' && quick) return { delay: 0.5, duration: 0.55, ease: E_OUT }
      if (phase === 'returning') return { delay: 0.9 + index * 0.12, type: 'spring', stiffness: 110, damping: 13 }
      return { duration: 0.35 }
    case 'absorb':
      return { duration: 0.75, ease: [0.2, 0.9, 0.25, 1] }
    case 'hit':
      return { duration: 0.04 }
    case 'void':
      return { delay: 0.2 + index * 0.05, duration: 0.7, ease: [0.6, 0, 0.9, 0.4] }
    default:
      return { duration: 0.3 }
  }
}

const CORNERS = [
  'left-0 top-0 border-l-2 border-t-2',
  'right-0 top-0 border-r-2 border-t-2',
  'bottom-0 left-0 border-b-2 border-l-2',
  'bottom-0 right-0 border-b-2 border-r-2',
]

/**
 * OrbitNode
 * One floating menu node. Three nested layers so animations never fight:
 *   state layer : idle / locked / dim / hit / void (the phase-driven choreography)
 *   bob layer   : the endless floating drift (frozen while aiming so the beam lands true)
 *   button      : hover / tap, lock-on corners
 */
export default function OrbitNode({ space, pos, index, status, phase, voidVec, innerRef, onHover, onSelect, onEntered, last, compact, quick }) {
  const Icon = space.icon
  const target = status === 'void' ? { opacity: 0, scale: 0.3, x: voidVec.x, y: voidVec.y, rotate: voidVec.r } : STATE[status]
  const floating = status === 'idle' && phase !== 'intro'

  return (
    <div className="absolute z-20 -translate-x-1/2 -translate-y-1/2" style={{ left: pos.x, top: pos.y }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, x: 0, y: 0, rotate: 0 }}
        animate={target}
        transition={transitionFor(status, phase, index, quick)}
        onAnimationComplete={() => last && phase === 'intro' && onEntered()}
      >
        <motion.div
          animate={floating ? { y: [0, -9, 0], x: [0, 3, 0] } : { y: 0, x: 0 }}
          transition={
            floating
              ? { duration: 4 + index * 0.8, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.3 }
          }
        >
          <motion.button
            ref={innerRef}
            type="button"
            disabled={phase !== 'idle'}
            onClick={onSelect}
            onPointerEnter={() => onHover(space.id)}
            onPointerLeave={() => onHover(null)}
            onFocus={() => onHover(space.id)}
            onBlur={() => onHover(null)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            style={{
              '--c': space.color,
              borderColor: status === 'absorb' ? space.color : `${space.color}66`,
              color: status === 'absorb' ? '#fff' : space.color,
              boxShadow: status === 'absorb' ? `0 0 70px 14px ${space.color}aa, inset 0 0 26px 4px ${space.color}88` : undefined,
            }}
            className={`group relative flex items-center whitespace-nowrap rounded-full border bg-zinc-950/85 font-mono ${compact ? 'gap-1.5 px-3 py-1.5 text-[11px]' : 'gap-2.5 px-5 py-2.5 text-sm'} transition-[box-shadow,color,border-color] duration-500 hover:shadow-[0_0_36px_-4px_var(--c)] focus-visible:shadow-[0_0_36px_-4px_var(--c)] focus-visible:outline-none disabled:pointer-events-none`}
          >
            {/* absorbed: the node fills with light as the beam pours into it */}
            {status === 'absorb' && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-0 rounded-full"
                style={{ background: `radial-gradient(closest-side, ${space.color}, ${space.color}55)` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.75, 0.55] }}
                transition={{ duration: 0.7, times: [0, 0.55, 1] }}
              />
            )}

            <Icon className="relative h-4 w-4" aria-hidden="true" />
            <span className="relative flex items-center">
              <span className="inline-block w-0 overflow-hidden transition-all duration-200 group-hover:w-[1ch] group-focus-visible:w-[1ch]">[</span>
              <span className="px-0 group-hover:px-[0.6ch]" style={{ transition: 'padding .2s' }}>
                {space.label.toLowerCase()}
              </span>
              <span className="inline-block w-0 overflow-hidden transition-all duration-200 group-hover:w-[1ch] group-focus-visible:w-[1ch]">]</span>
            </span>

            {/* lock-on corners */}
            {status === 'locked' && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2"
                initial={{ scale: 2.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: E_OUT }}
              >
                {CORNERS.map((c) => (
                  <span key={c} className={`absolute h-3 w-3 border-white ${c}`} />
                ))}
              </motion.span>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
