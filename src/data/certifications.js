import { asset } from './asset.js'

// TODO: LinkedIn blocks automated access, so credentials from your profile could not be pulled in.
// Add each one here ({ id, title, issuer, detail, date, image?, color }) and it appears automatically.
export const certifications = [
  {
    id: 'iei-excellence',
    title: 'Certificate of Excellence',
    issuer: 'The Institution of Engineers (India), Amravati Local Centre',
    detail: 'Project Competition “Met-Invent 2k26”',
    date: '7 April 2026',
    image: asset('img/iei-met-invent.jpg'),
    color: '#86efac',
  },
  {
    id: 'aavishkar-appreciation',
    title: 'Certificate of Appreciation',
    issuer: 'Sant Gadge Baba Amravati University · Aavishkar Cell',
    detail: 'District Level Student Research Convention, Aavishkar 2026',
    date: '29 October 2026',
    image: asset('img/aavishkar-2026.jpg'),
    color: '#a5b4fc',
  },
]
