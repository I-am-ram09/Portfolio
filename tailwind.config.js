/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Dramatic, high-contrast serif for PORTFOLIO and every space heading.
        // Loaded in index.html via Google Fonts; Georgia is the offline fallback.
        display: ['"Playfair Display"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        night: '#0a0a0a',
        pastel: {
          pink: '#f9a8d4',
          lilac: '#d8b4fe',
          indigo: '#a5b4fc',
          sky: '#7dd3fc',
          mint: '#86efac',
          peach: '#fdba74',
        },
      },
      boxShadow: {
        'neon-pink': '0 0 34px -6px #f9a8d4',
        'neon-lilac': '0 0 34px -6px #d8b4fe',
        'neon-sky': '0 0 34px -6px #7dd3fc',
      },
      keyframes: {
        caret: { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
        'hint-bob': {
          '0%,100%': { transform: 'translateY(0)', opacity: '0.35' },
          '50%': { transform: 'translateY(4px)', opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        caret: 'caret 1.05s steps(1) infinite',
        'hint-bob': 'hint-bob 2.4s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
}
