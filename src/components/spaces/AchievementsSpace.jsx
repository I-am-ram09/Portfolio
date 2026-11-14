import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Expand, Trophy } from 'lucide-react'
import Lightbox from '../Lightbox.jsx'
import { achievements } from '../../data/achievements.js'

const EASE = [0.16, 1, 0.3, 1]

const STATS = [
  ['2', 'podium finishes'],
  ['2', 'project expos'],
  ['2026', 'season'],
]

function Medal({ a }) {
  return (
    <div className="relative flex flex-none items-center justify-center md:w-56">
      {/* giant ordinal */}
      <motion.div
        className="relative select-none font-display font-black italic leading-none will-change-transform"
        initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
        whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 90, damping: 11, delay: 0.2 }}
      >
        <span
          className="text-[9rem] md:text-[11rem]"
          style={{
            backgroundImage: `linear-gradient(160deg, #fff, ${a.color} 55%, ${a.color}55)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            filter: `drop-shadow(0 0 28px ${a.color}77)`,
          }}
        >
          {a.ordinal}
        </span>
        <span className="absolute right-[-0.6rem] top-5 font-mono text-xl font-bold md:text-2xl" style={{ color: a.color }}>
          {a.suffix}
        </span>
      </motion.div>
      {/* orbiting ring of glyphs */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        <div className="h-[110%] w-[110%] rounded-full border border-dashed" style={{ borderColor: `${a.color}40` }} />
      </motion.div>
    </div>
  )
}

export default function AchievementsSpace() {
  const [view, setView] = useState(null)

  return (
    <div>
      {/* stat strip */}
      <div className="mb-10 grid grid-cols-3 gap-3 md:max-w-2xl">
        {STATS.map(([n, label], i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 + i * 0.1, duration: 0.6, ease: EASE }}
            className="rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3"
          >
            <div className="font-display text-3xl font-black italic text-white/90">{n}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-8">
        {achievements.map((a, i) => (
          <motion.article
            key={a.id}
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ '--c': a.color }}
            className="group relative overflow-hidden rounded-3xl p-px"
          >
            {/* shimmering border */}
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-shimmer opacity-60 transition-opacity duration-500 group-hover:opacity-100"
              style={{ backgroundImage: `linear-gradient(110deg, transparent 20%, ${a.color} 45%, #fff 50%, ${a.color} 55%, transparent 80%)`, backgroundSize: '220% 100%' }}
            />
            <div className="relative flex flex-col items-center gap-8 rounded-[calc(1.5rem-1px)] bg-zinc-950/95 p-8 md:flex-row md:gap-12 md:p-12">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full blur-3xl"
                style={{ background: `${a.color}26` }}
              />
              <Medal a={a} />

              <div className="relative flex-1 text-center md:text-left">
                <p className="flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] md:justify-start" style={{ color: a.color }}>
                  {i ? <Award className="h-4 w-4" aria-hidden="true" /> : <Trophy className="h-4 w-4" aria-hidden="true" />}
                  {a.place} · {a.date}
                </p>
                <h3 className="mt-3 font-display text-4xl font-black italic leading-tight text-white/95 md:text-5xl">{a.title}</h3>
                <p className="mt-1 font-display text-lg italic text-white/50">{a.event}</p>
                <p className="mt-4 text-sm text-white/55">{a.org}</p>

                <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">project</p>
                  <p className="mt-1 text-base text-white/85">{a.project}</p>
                  <p className="mt-2 text-sm text-white/45">{a.note}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setView({ src: a.image, caption: `${a.place} · ${a.title}`, color: a.color })}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-sm transition-shadow duration-300 hover:shadow-[0_0_30px_-4px_var(--c)] focus-visible:shadow-[0_0_30px_-4px_var(--c)] focus-visible:outline-none"
                  style={{ borderColor: `${a.color}66`, color: a.color }}
                >
                  <Expand className="h-4 w-4" aria-hidden="true" /> view certificate
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <Lightbox item={view} onClose={() => setView(null)} />
    </div>
  )
}
