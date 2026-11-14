# Portfolio: ASCII Combat Nav

React 18 + Vite + Tailwind CSS 3 + Framer Motion 11 + Lucide-React.

```bash
npm install
npm run dev
```

## The sequence
`intro` flower decodes out of noise, PORTFOLIO rises letter by letter, nodes drift in
`idle` hover a node: the flower tilts to face it, a chevron probe points the way
`aiming` click: breathing stops, the flower swells and glows, a ring of glyphs collapses into it, the node is locked
`firing` an ASCII beam (`===///--->>`) streams to the node's edge
`impact` flash, ~90 glyph particles on spring physics, the label tears into letters, crack lines race across the page,
         the background glyph field is blasted away, everything flies off, leaving the void
`content_view` the space grows from the exact impact point (circular clip + glowing ring)
`returning` Back (`<--`) or Esc sucks the space into that point and the hub reassembles

State machine lives in `src/App.jsx` (a reducer; every transition is only legal from its predecessor).
Each stage advances the next through an animation-complete callback, so timing stays locked.

## Files
```
src/App.jsx                    phase reducer
src/components/HeroHub.jsx     title, flower, orbit nodes, field, HUD
src/components/AsciiFlower.jsx breathing, facing, charge, recoil, decode
src/components/AsciiCombatNav  sequencer: charge ring -> beam -> impact
src/components/AsciiBeam.jsx   streaming beam
src/components/AsciiImpact.jsx particles, rings, cracks, tearing label
src/components/AsciiField.jsx  canvas glyph environment (shatter / restore)
src/components/ContentSpace    circular reveal + back button
src/components/spaces/*        About, Projects (grid), Certifications, Achievements, Resume, Handles
src/components/AsciiAbsorb.jsx the Resume node's beam-swallowing effect
src/components/PortraitReveal  ASCII portrait + hover-reveal photo lens
src/data/*                     your content (about, handles, timeline) and spaces/ascii art
```

## Spaces
About (ASCII portrait; hover it to reveal your real photo), Projects (DocYard, NorthStar ClearGate, Team X-treme + the smart-fence hardware feature with poster),
Certifications, Achievements (3rd Met-Invent 2k26, 2nd Aavishkar 2026), Resume, Handles (GitHub, LinkedIn, Email).

## Resume node (absorb)
Every other node shatters the hub. The Resume node is flagged `absorb: true` in `src/data/spaces.js`, so the beam is
swallowed instead: the node swells and glows (OrbitNode status `absorb`), glyphs stream into it (`AsciiAbsorb.jsx`),
and the space opens straight out of the node's centre. Nothing is destroyed, so the return is quick.
Any other node can be given the same behaviour by adding `absorb: true`.
To update the resume: replace `public/resume/Ram_Bhosale_Resume.pdf` and regenerate the page image
(`pdftoppm -r 150 -png -singlefile public/resume/Ram_Bhosale_Resume.pdf page` then convert to `public/resume/resume-preview.webp`).

## About portrait reveal
`src/components/PortraitReveal.jsx`. Put your photo at **`public/img/ram.jpg`** (square-ish crop, face near the upper middle).
Hover = a lens opens around the cursor and shows the photo; click / tap / Enter pins it fully open, again to close.
(Your photo is already included there.) The art scales with its box (`100cqw / 50.4`), so it never overflows.

## Performance notes
Removed `backdrop-filter` blurs (nodes, cards, lightbox), the blend-mode + blurred cursor halo, and the filter on the title.
The glyph field draws at 30fps when idle with a capped glyph count, the impact has fewer particles, and while a space fully
covers the hub the hub is hidden and its loops (field, flower, orbit rings) are paused.

## Content to edit
- `src/data/resume.js`: resume path + the highlights / toolbox shown beside it
- `src/data/certifications.js`: add your LinkedIn credentials here (LinkedIn could not be read automatically)
- `src/data/projects.js`: DocYard description is a placeholder, adjust it
- Images live in `public/img/`

## Edit
- Timings: `OPEN`/`CLOSE` in ContentSpace.jsx, `travel` in AsciiBeam.jsx, delays in OrbitNode.jsx
- Node angles: `src/data/spaces.js`
