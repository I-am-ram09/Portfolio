import { AnimatePresence, motion } from 'framer-motion'
import AimReticle from './AimReticle.jsx'
import AsciiBeam from './AsciiBeam.jsx'
import AsciiImpact from './AsciiImpact.jsx'
import AsciiAbsorb from './AsciiAbsorb.jsx'

const RING = Array.from({ length: 28 }, (_, i) => ({ a: (i / 28) * Math.PI * 2, ch: '*+o.'[i % 4] }))

/**
 * AsciiCombatNav: Code Block 1c / the sequencer
 *
 * Owns the Click -> Beam -> Impact portion of the state machine. Each stage is a mounted
 * component whose animation-complete callback advances the phase, so the sequence stays
 * locked together even if durations are tweaked:
 *
 *   aiming  : <ChargeRing/> converges on the flower        -> onComplete  => FIRE
 *   firing  : <AsciiBeam/> streams to the node boundary    -> onArrive    => IMPACT(point)
 *   impact  : <AsciiImpact/> + crack lines + shatter       -> (ContentSpace reveal takes over)
 *             (nodes flagged `absorb` get <AsciiAbsorb/> instead: no shatter, the node swallows the beam)
 */
export default function AsciiCombatNav({ shot, phase, shotId, dispatch }) {
  const aimingOrFiring = phase === 'aiming' || phase === 'firing'
  const showReticle = shot && (phase === 'idle' || aimingOrFiring)

  return (
    <>
      <AnimatePresence>
        {showReticle && <AimReticle key={`ret-${shot.id}-${aimingOrFiring}`} shot={shot} locked={aimingOrFiring} />}
      </AnimatePresence>

      {/* The Charge: a ring of glyphs collapses into the flower, 0.5s */}
      {phase === 'aiming' && shot && (
        <ChargeRing key={`charge-${shotId}`} shot={shot} onComplete={() => dispatch({ type: 'FIRE' })} />
      )}

      {/* The Beam */}
      {(phase === 'firing' || phase === 'impact') && shot && (
        <AsciiBeam
          key={`beam-${shotId}`}
          shot={shot}
          // an absorbing node opens the space from its own centre; everything else from the point of impact
          onArrive={() => phase === 'firing' && dispatch({ type: 'IMPACT', point: shot.absorb ? shot.node : shot.hit })}
        />
      )}

      {/* The Impact */}
      {phase === 'impact' && shot && (shot.absorb ? <AsciiAbsorb key={`absorb-${shotId}`} shot={shot} /> : <AsciiImpact key={`impact-${shotId}`} shot={shot} />)}
    </>
  )
}

function ChargeRing({ shot, onComplete }) {
  return (
    <div className="pointer-events-none absolute z-[14]" style={{ left: shot.cx, top: shot.cy }}>
      <motion.div
        initial={{ scale: 2.4, opacity: 0, rotate: 0 }}
        animate={{ scale: 0.45, opacity: [0, 1, 1], rotate: 140 }}
        transition={{ duration: 0.5, ease: [0.6, 0, 0.9, 0.5] }}
        onAnimationComplete={onComplete}
      >
        {RING.map(({ a, ch }, i) => (
          <span
            key={i}
            className="absolute -ml-1.5 -mt-2.5 select-none font-mono text-[15px] font-bold"
            style={{
              left: Math.cos(a) * 120,
              top: Math.sin(a) * 120,
              color: i % 2 ? '#fff' : shot.color,
              textShadow: `0 0 10px ${shot.color}`,
            }}
          >
            {ch}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
