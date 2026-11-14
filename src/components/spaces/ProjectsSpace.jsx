import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Expand } from 'lucide-react'
import Lightbox from '../Lightbox.jsx'
import { fence, projects } from '../../data/projects.js'

const EASE = [0.16, 1, 0.3, 1]

/** Cursor-following spotlight shared by the cards. */
function useSpotlight() {
  const ref = useRef(null)
  const onMouseMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return { ref, onMouseMove }
}

const Spot = ({ color }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    style={{ background: `radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), ${color}24, transparent 70%)` }}
  />
)

function WebCard({ p, index }) {
  const spot = useSpotlight()
  const Icon = p.icon
  return (
    <motion.a
      {...spot}
      href={p.href}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: EASE }}
      whileHover={{ y: -8 }}
      style={{ '--c': p.color }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 transition-[border-color,box-shadow] duration-300 hover:border-[var(--c)] hover:shadow-[0_22px_70px_-20px_var(--c)] focus-visible:border-[var(--c)] focus-visible:outline-none"
    >
      <Spot color={p.color} />

      {/* browser bar */}
      <div className="relative flex items-center gap-3 border-b border-white/10 bg-black/30 px-4 py-3">
        <span className="flex gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <i className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <i className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-full bg-white/5 px-3 py-1 font-mono text-[11px] text-white/45">{p.host}</span>
        <ArrowUpRight className="h-4 w-4 text-white/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--c)]" aria-hidden="true" />
      </div>

      <div className="relative flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${p.color}1f`, color: p.color }}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: p.color }}>
            {p.kind}
          </span>
        </div>
        <h3 className="mt-6 font-display text-3xl font-bold italic leading-tight text-white/95">{p.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">{p.description}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <li key={t} className="rounded-full border px-3 py-1 font-mono text-[11px]" style={{ borderColor: `${p.color}44`, color: p.color }}>
              {t}
            </li>
          ))}
        </ul>
        <span className="mt-6 font-mono text-sm text-white/50 transition-colors group-hover:text-[var(--c)]">
          visit live <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">{'->'}</span>
        </span>
      </div>
    </motion.a>
  )
}

/** The hardware project: poster preview, ASCII signal pipeline, response logic. */
function FenceFeature() {
  const spot = useSpotlight()
  const [open, setOpen] = useState(false)
  const Icon = fence.icon

  return (
    <>
      <motion.section
        {...spot}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ '--c': fence.color }}
        className="group relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 p-6 transition-[border-color,box-shadow] duration-500 hover:border-[var(--c)] hover:shadow-[0_30px_100px_-30px_var(--c)] md:p-10"
      >
        <Spot color={fence.color} />
        <div className="relative grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${fence.color}1f`, color: fence.color }}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: fence.color }}>
                {fence.kind}
              </span>
            </div>
            <h3 className="mt-6 font-display text-4xl font-black italic leading-[1.05] text-white/95 md:text-5xl">{fence.title}</h3>
            <p className="mt-1 font-display text-xl italic text-white/45">{fence.subtitle}</p>
            <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-white/60">{fence.abstract}</p>

            {/* signal pipeline */}
            <div className="mt-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">signal path</p>
              <ol className="mt-3 flex flex-wrap items-center gap-y-2 font-mono text-xs">
                {fence.pipeline.map((step, i) => (
                  <li key={step} className="flex items-center">
                    <motion.span
                      className="rounded-md border px-2.5 py-1.5"
                      style={{ borderColor: `${fence.color}55`, color: fence.color }}
                      animate={{ backgroundColor: [`${fence.color}00`, `${fence.color}30`, `${fence.color}00`] }}
                      transition={{ duration: 2.4, delay: i * 0.3, repeat: Infinity, repeatDelay: fence.pipeline.length * 0.3 - 2.4 + 1.2 }}
                    >
                      {step}
                    </motion.span>
                    {i < fence.pipeline.length - 1 && <span className="px-1.5 text-white/30">{'->'}</span>}
                  </li>
                ))}
              </ol>
            </div>

            {/* response logic */}
            <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-white/5 text-white/45">
                    <th className="px-4 py-2.5 font-normal">detected</th>
                    <th className="px-4 py-2.5 font-normal">response</th>
                  </tr>
                </thead>
                <tbody>
                  {fence.response.map(([d, a]) => (
                    <tr key={d} className="border-t border-white/5">
                      <td className="whitespace-nowrap px-4 py-2.5" style={{ color: fence.color }}>{d}</td>
                      <td className="px-4 py-2.5 text-white/65">{a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="mt-6 flex flex-wrap gap-2">
              {fence.tags.map((t) => (
                <li key={t} className="rounded-full border px-3 py-1 font-mono text-[11px]" style={{ borderColor: `${fence.color}44`, color: fence.color }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* poster */}
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="View the project poster"
              className="group/poster relative overflow-hidden rounded-2xl border border-white/10 transition-[border-color,transform] duration-300 hover:-rotate-1 hover:scale-[1.02] hover:border-[var(--c)] focus-visible:border-[var(--c)] focus-visible:outline-none"
            >
              <img src={fence.poster} alt="Aavishkar poster: AI Driven Smart Electric Fence" loading="lazy" className="block w-full" />
              <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-transparent to-transparent pb-4 opacity-0 transition-opacity duration-300 group-hover/poster:opacity-100">
                <span className="flex items-center gap-2 rounded-full bg-zinc-950/80 px-4 py-2 font-mono text-xs text-white">
                  <Expand className="h-3.5 w-3.5" aria-hidden="true" /> view poster
                </span>
              </span>
            </button>
            <p className="mt-3 font-mono text-[11px] text-white/35">poster, Aavishkar 2026. Category: Agriculture and Animal Husbandry.</p>
            <ul className="mt-5 space-y-1.5 font-mono text-xs text-white/55">
              {fence.parts.map((x) => (
                <li key={x} className="flex gap-2">
                  <span style={{ color: fence.color }}>+</span> {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      <Lightbox
        item={open ? { src: fence.poster, caption: 'AI Driven Smart Electric Fence · Aavishkar poster', color: fence.color } : null}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

export default function ProjectsSpace() {
  return (
    <div>
      <p className="mb-6 font-mono text-xs text-white/35">// 3 software, 1 hardware</p>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <WebCard key={p.id} p={p} index={i} />
        ))}
      </div>
      <FenceFeature />
    </div>
  )
}
