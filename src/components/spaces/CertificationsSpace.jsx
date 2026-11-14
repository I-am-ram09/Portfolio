import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Expand, Linkedin } from 'lucide-react'
import Lightbox from '../Lightbox.jsx'
import { certifications } from '../../data/certifications.js'
import { LINKEDIN_URL } from '../../data/handles.js'

const EASE = [0.16, 1, 0.3, 1]

export default function CertificationsSpace({ color }) {
  const [view, setView] = useState(null)

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2">
        {certifications.map((c, i) => (
          <motion.article
            key={c.id}
            initial={{ opacity: 0, y: 50, rotate: i % 2 ? 1.5 : -1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
            style={{ '--c': c.color }}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-2 hover:border-[var(--c)] hover:shadow-[0_26px_80px_-24px_var(--c)]"
          >
            <button
              type="button"
              onClick={() => setView({ src: c.image, caption: `${c.title} · ${c.detail}`, color: c.color })}
              aria-label={`View ${c.title}`}
              className="relative block w-full overflow-hidden focus-visible:outline-none"
            >
              <img src={c.image} alt={`${c.title}: ${c.detail}`} loading="lazy" className="block w-full transition-transform duration-700 group-hover:scale-[1.05]" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex items-center gap-2 rounded-full bg-zinc-950/85 px-4 py-2 font-mono text-xs text-white">
                  <Expand className="h-3.5 w-3.5" aria-hidden="true" /> open certificate
                </span>
              </span>
            </button>
            <div className="p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: c.color }}>
                {c.date}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold italic text-white/95">{c.title}</h3>
              <p className="mt-1 text-sm text-white/70">{c.detail}</p>
              <p className="mt-2 text-sm text-white/45">{c.issuer}</p>
            </div>
          </motion.article>
        ))}
      </div>

      {/* LinkedIn: where the rest of the credentials live */}
      <motion.a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noreferrer"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ '--c': color }}
        className="group mt-6 flex items-center gap-5 overflow-hidden rounded-2xl border border-dashed border-white/15 p-6 transition-all duration-300 hover:border-[var(--c)] hover:shadow-[0_20px_70px_-26px_var(--c)] focus-visible:border-[var(--c)] focus-visible:outline-none md:p-8"
      >
        <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl" style={{ backgroundColor: `${color}1f`, color }}>
          <Linkedin className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-2xl font-bold italic text-white/90">More credentials on LinkedIn</span>
          <span className="block font-mono text-xs text-white/40">courses, licences and certifications live on my profile</span>
        </span>
        <ArrowUpRight className="h-6 w-6 flex-none text-white/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--c)]" aria-hidden="true" />
      </motion.a>

      <Lightbox item={view} onClose={() => setView(null)} />
    </div>
  )
}
