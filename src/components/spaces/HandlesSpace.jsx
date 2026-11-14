import { motion } from 'framer-motion'
import { handles } from '../../data/handles.js'

/** Minimalist glowing links: big serif labels, a hairline that lights up, an ASCII arrow that slides. */
export default function HandlesSpace() {
  return (
    <ul className="border-t border-white/10">
      {handles.map(({ id, label, handle, href, icon: Icon, color }, i) => (
        <motion.li
          key={id}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
            style={{ '--c': color }}
            className="group relative flex items-center gap-5 border-b border-white/10 py-7 transition-colors duration-300 hover:border-[var(--c)] focus-visible:border-[var(--c)] focus-visible:outline-none md:gap-8 md:py-9"
          >
            {/* glow wash */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
              style={{ background: `linear-gradient(90deg, ${color}18, transparent 65%)` }}
            />
            <Icon className="relative h-6 w-6 flex-none text-white/40 transition-colors duration-300 group-hover:text-[var(--c)]" aria-hidden="true" />
            <span className="relative min-w-0 transition-transform duration-300 group-hover:translate-x-2">
              <span className="block font-display text-4xl font-bold italic text-white/80 transition-colors duration-300 group-hover:text-white md:text-6xl">{label}</span>
              {/* small screens: the handle sits under the label (long addresses like the email need the room) */}
              <span className="mt-1 block truncate font-mono text-xs text-white/40 transition-colors duration-300 group-hover:text-[var(--c)] sm:hidden">{handle}</span>
            </span>
            <span className="relative ml-auto hidden truncate font-mono text-sm text-white/40 transition-colors duration-300 group-hover:text-[var(--c)] sm:block">
              {handle}
            </span>
            <span className="relative font-mono text-lg text-white/30 transition-all duration-300 group-hover:translate-x-2 group-hover:text-[var(--c)] max-sm:ml-auto">
              {'->'}
            </span>
          </a>
        </motion.li>
      ))}
    </ul>
  )
}
