import { motion } from 'framer-motion'
import PortraitReveal from '../PortraitReveal.jsx'
import CornerGear from '../CornerGear.jsx'
import { about } from '../../data/about.js'

export default function AboutSpace({ color }) {
  return (
    <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
      <CornerGear color={color} />

      {/* text */}
      <div className="min-w-0">
        <h3 className="font-display text-3xl font-bold italic text-white/90 md:text-5xl">{about.headline}</h3>
        <p className="mt-2 font-mono text-sm text-white/40">{about.fullName}</p>
        <div className="mt-8 max-w-prose space-y-5 text-base leading-relaxed text-white/65 md:text-lg">
          {about.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <dl className="mt-10 max-w-xl rounded-2xl border border-white/10 bg-zinc-900/80 px-6 py-2 font-mono">
          {about.facts.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className={`grid gap-1 py-3.5 sm:grid-cols-[6.5rem_1fr] sm:gap-6 ${i ? 'border-t border-white/5' : ''}`}
            >
              <dt className="text-xs leading-6" style={{ color }}>
                {k}:
              </dt>
              <dd className="text-sm leading-6 text-white/75">{v}</dd>
            </motion.div>
          ))}
        </dl>
      </div>

      {/* portrait: stays in view beside the text on wide screens */}
      <div className="min-w-0 overflow-x-clip lg:sticky lg:top-28">
        <PortraitReveal color={color} />
      </div>
    </div>
  )
}
