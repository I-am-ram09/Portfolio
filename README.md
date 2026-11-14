<div align="center">

# Ram Bhosale — Portfolio

**An interactive ASCII "combat nav" portfolio.** Hover a node, click to fire, and the page shatters open into the section you picked.

[![Live](https://img.shields.io/badge/live-portfolio--docyard--web.vercel.app-22d3ee?style=for-the-badge&logo=vercel&logoColor=white)](https://portfolio-docyard-web.vercel.app)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-0055FF?logo=framer&logoColor=white)

</div>

---

## About

I'm a second-year Mechanical Engineering student at SSGMCE, Shegaon, with a strong lean toward software. I like building where hardware, AI and web meet, and I compete in hackathons and engineering contests as part of Team X-treme.

This site is my portfolio. Instead of a plain scrolling page, the home screen is a living ASCII flower surrounded by orbiting nodes. Each node opens a section: About, Projects, Certifications, Achievements, Resume and Handles.

## Highlights

- **ASCII combat navigation:** hover a node and the flower turns to face it; click and it charges, fires an ASCII beam, and the page shatters into glyph particles and cracks.
- **Content spaces that grow from the impact point** with a circular reveal, and collapse back into it on Back or Esc.
- **Resume "absorb" effect:** the Resume node swallows the beam instead of shattering the page.
- **Hover-to-reveal portrait:** an ASCII portrait that opens a lens onto my real photo (tap or press Enter to pin it open).
- **Rotating ASCII gear** parked in the page corner.
- **Performance-minded:** no backdrop blurs, throttled canvas field, reduced particle counts, and loops that pause while a space covers the hub.
- Respects `prefers-reduced-motion`.

## Sections

| Space | What's inside |
| --- | --- |
| About | Bio, fact card, ASCII portrait with photo reveal |
| Projects | DocYard, NorthStar ClearGate, Team X-treme, and the smart-fence hardware project with poster |
| Certifications | Credentials and courses |
| Achievements | 3rd place Met-Invent 2k26, 2nd place Aavishkar 2026 |
| Resume | Inline preview and PDF download |
| Handles | GitHub, LinkedIn, Email |

## Tech stack

React 18 · Vite 5 · Tailwind CSS 3 · Framer Motion 11 · Lucide React · deployed on Vercel

## Getting started

Requires Node.js 18 or newer.

```bash
git clone https://github.com/I-am-ram09/portfolio.git
cd portfolio
npm install
npm run dev
```

Open http://localhost:5173.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |

## Project structure

```
src/
├── App.jsx                     phase reducer (intro → idle → aiming → firing → impact → content_view → returning)
├── components/
│   ├── HeroHub.jsx             title, flower, orbit nodes, glyph field, HUD
│   ├── AsciiFlower.jsx         breathing, facing, charge, recoil, decode
│   ├── AsciiCombatNav.jsx      sequencer: charge ring → beam → impact
│   ├── AsciiBeam.jsx           streaming beam
│   ├── AsciiImpact.jsx         particles, rings, cracks, tearing label
│   ├── AsciiField.jsx          canvas glyph environment
│   ├── AsciiAbsorb.jsx         Resume node's beam-swallowing effect
│   ├── ContentSpace.jsx        circular reveal + back button
│   ├── PortraitReveal.jsx      ASCII portrait + hover photo lens
│   ├── CornerGear.jsx          rotating gear in the page corner
│   └── spaces/                 About, Projects, Certifications, Achievements, Resume, Handles
├── data/                       all editable content (see below)
└── hooks/
public/
├── img/                        photos and posters
└── resume/                     resume PDF and preview image
```

## Editing the content

Almost everything you'd change lives in `src/data/`:

| File | Controls |
| --- | --- |
| `about.js` | Headline, bio, fact card |
| `projects.js` | Project cards and descriptions |
| `certifications.js` | Certifications list |
| `achievements.js` | Awards and results |
| `resume.js` | Resume path, highlights, toolbox |
| `handles.js` | GitHub, LinkedIn, Email links |
| `spaces.js` | Node labels, colors, angles, `absorb` flag |

**Photo:** replace `public/img/ram.jpg` with a square crop, face about halfway across and roughly 40% down.

**Resume:** replace `public/resume/Ram_Bhosale_Resume.pdf`, then regenerate the preview image:

```bash
pdftoppm -r 150 -png -singlefile public/resume/Ram_Bhosale_Resume.pdf page
# convert page.png to public/resume/resume-preview.webp
```

**Timings:** `OPEN` / `CLOSE` in `ContentSpace.jsx`, `travel` in `AsciiBeam.jsx`, delays in `OrbitNode.jsx`.

## Deployment

The site is deployed on Vercel. Every push to `main` triggers a new build automatically.

To deploy your own copy: push the repo to GitHub, import it in Vercel, keep the Vite defaults (build `npm run build`, output `dist`), and click Deploy.

## Contact

- GitHub: https://github.com/I-am-ram09
- Email: ramdcodes@gmail.com

---

<div align="center">
Built by Ram Bhosale · SSGMCE, Shegaon
</div>
