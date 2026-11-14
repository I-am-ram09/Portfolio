import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const COLORS = ['#d8b4fe', '#f9a8d4', '#a5b4fc', '#7dd3fc']

/** An occasional ASCII comet streaks across the upper sky while the hub is idle. */
export default function ShootingStars() {
  const reduce = useReducedMotion()
  const [stars, setStars] = useState([])

  useEffect(() => {
    if (reduce) return undefined
    let t
    let id = 0
    const spawn = () => {
      id += 1
      const w = window.innerWidth
      const h = window.innerHeight
      const s = {
        id,
        x: Math.random() * w * 0.7,
        y: Math.random() * h * 0.35,
        len: 6 + ((Math.random() * 8) | 0),
        color: COLORS[(Math.random() * COLORS.length) | 0],
        dist: 420 + Math.random() * 380,
      }
      setStars((a) => [...a, s])
      t = setTimeout(spawn, 5000 + Math.random() * 6000)
    }
    t = setTimeout(spawn, 3500)
    return () => clearTimeout(t)
  }, [reduce])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute left-0 top-0 origin-left"
          style={{ left: s.x, top: s.y, rotate: 24 }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x: s.dist, y: s.dist * 0.45, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.1, ease: 'easeIn', times: [0, 0.15, 0.7, 1] }}
          onAnimationComplete={() => setStars((a) => a.filter((q) => q.id !== s.id))}
        >
          <pre
            className="font-mono text-sm font-bold leading-none"
            style={{ color: s.color, textShadow: `0 0 10px ${s.color}` }}
          >
            {`${'-'.repeat(s.len)}=*>`}
          </pre>
        </motion.div>
      ))}
    </div>
  )
}
