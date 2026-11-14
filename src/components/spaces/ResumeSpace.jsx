import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Expand, ExternalLink } from 'lucide-react'
import Lightbox from '../Lightbox.jsx'
import { RESUME } from '../../data/resume.js'

const EASE = [0.16, 1, 0.3, 1]

/** The resume: a glowing page preview (click to enlarge), download / open buttons, and the highlights. */
export default function ResumeSpace({ color }) {
  const [view, setView] = useState(null)

  return (
    <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
      {/* page preview */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -1.2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative mx-auto w-full max-w-[420px] lg:sticky lg:top-28"
        style={{ '--c': color }}
      >
        <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] opacity-70" style={{ background: `radial-gradient(closest-side, ${color}33, transparent)` }} />
        <button
          type="button"
          onClick={() => setView({ src: RESUME.preview, caption: 'Ram Bhosale · Resume', color })}
          aria-label="Enlarge the resume"
          className="group relative block w-full overflow-hidden rounded-xl border border-white/10 bg-white text-left transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-[var(--c)] hover:shadow-[0_28px_80px_-28px_var(--c)] focus-visible:border-[var(--c)] focus-visible:outline-none"
        >
          <img src={RESUME.preview} alt="Ram Bhosale's resume, page 1 of 1" width="1240" height="1754" decoding="async" className="block h-auto w-full" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="flex items-center gap-2 rounded-full bg-zinc-950/90 px-4 py-2 font-mono text-xs text-white">
              <Expand className="h-3.5 w-3.5" aria-hidden="true" /> enlarge
            </span>
          </span>
        </button>
      </motion.div>

      {/* details */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="flex flex-wrap gap-4"
        >
          <a
            href={RESUME.pdf}
            download={RESUME.fileName}
            style={{ '--c': color, backgroundColor: `${color}1f`, borderColor: `${color}99`, color }}
            className="group flex items-center gap-3 rounded-full border px-6 py-3 font-mono text-sm transition-shadow duration-300 hover:shadow-[0_0_40px_-6px_var(--c)] focus-visible:shadow-[0_0_40px_-6px_var(--c)] focus-visible:outline-none"
          >
            <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
            download pdf
          </a>
          <a
            href={RESUME.pdf}
            target="_blank"
            rel="noreferrer"
            style={{ '--c': color }}
            className="group flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 font-mono text-sm text-white/70 transition-all duration-300 hover:border-[var(--c)] hover:text-white focus-visible:border-[var(--c)] focus-visible:outline-none"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            open in new tab
          </a>
        </motion.div>

        <dl className="mt-10 rounded-2xl border border-white/10 bg-zinc-900/80 p-6 font-mono">
          {RESUME.highlights.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className={`flex flex-col gap-1 py-3 sm:flex-row sm:gap-6 ${i ? 'border-t border-white/5' : ''}`}
            >
              <dt className="w-24 flex-none text-xs" style={{ color }}>
                {k}:
              </dt>
              <dd className="text-sm text-white/75">{v}</dd>
            </motion.div>
          ))}
        </dl>

        <h3 className="mt-12 font-display text-3xl font-bold italic text-white/90">Toolbox</h3>
        <ul className="mt-5 space-y-5">
          {RESUME.skills.map(([group, list], i) => (
            <motion.li
              key={group}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.6, ease: EASE }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color }}>
                {group}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {list.split(', ').map((s) => (
                  <span key={s} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-white/70">
                    {s}
                  </span>
                ))}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      <Lightbox item={view} onClose={() => setView(null)} />
    </div>
  )
}
