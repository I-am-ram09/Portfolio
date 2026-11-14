import { motion } from 'framer-motion'

const CHEVRONS = '>  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >  >'

/**
 * AimReticle
 * A line of marching chevrons from the flower toward the aimed node.
 * Hover: a short, faint probe. Locked (after click): full length and bright.
 */
export default function AimReticle({ shot, locked }) {
  const reach = locked ? shot.length - shot.start : (shot.length - shot.start) * 0.42
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-[12]"
      style={{ left: shot.cx, top: shot.cy, transform: `rotate(${shot.angle}deg)`, transformOrigin: '0 0' }}
    >
      <motion.div
        className="absolute overflow-hidden"
        style={{ left: shot.start, top: -9, height: 18 }}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: reach, opacity: locked ? 1 : 0.5 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ duration: locked ? 0.35 : 0.45, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <motion.pre
          className="whitespace-pre font-mono text-[13px] font-bold leading-[18px]"
          style={{ color: shot.color, textShadow: `0 0 8px ${shot.color}` }}
          animate={{ x: ['0ch', '-3ch'] }}
          transition={{ duration: locked ? 0.25 : 0.9, ease: 'linear', repeat: Infinity }}
        >
          {CHEVRONS}
        </motion.pre>
      </motion.div>
    </div>
  )
}
