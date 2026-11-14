import { Cpu, FileText, ShieldCheck, Users } from 'lucide-react'
import { asset } from './asset.js'

// The three software / web projects. `host` is shown in the browser-bar of each card.
export const projects = [
  {
    id: 'docyard',
    kind: 'Software',
    title: 'DocYard',
    // TODO: the live site is a client-rendered page I couldn't read; tweak this to match what DocYard really does.
    description:
      'A web app for keeping documents organised and easy to find, designed, built and deployed end to end.',
    tags: ['Web app', 'Full-stack', 'Vercel'],
    href: 'https://docyard-hazel.vercel.app/',
    host: 'docyard-hazel.vercel.app',
    icon: FileText,
    color: '#a5b4fc',
  },
  {
    id: 'northstar',
    kind: 'Software / AI',
    title: 'NorthStar ClearGate',
    description:
      'An AI-powered hiring platform with separate company and applicant portals, built to make candidate screening fair and transparent instead of a black box. HR teams define role blueprints and rank candidates on skills and verified experience; applicants see match scores and track their applications. Built for the Google Solution Challenge.',
    tags: ['AI', 'Hiring', 'Solution Challenge'],
    href: 'https://northstar-nu-puce.vercel.app/',
    host: 'northstar-nu-puce.vercel.app',
    icon: ShieldCheck,
    color: '#f9a8d4',
  },
  {
    id: 'xtreme',
    kind: 'Web / Team',
    title: 'Team X-treme Website',
    description:
      'The website for Team X-treme, the SSGMCE student motorsport team that designs, builds and races its own karts and CUV. It showcases the vehicles, the roughly 48 members across mechanical, electrical and electronics groups, podium results and ways to sponsor the team.',
    tags: ['Motorsport', 'Team', 'Web'],
    href: 'https://www.ssgmce.ac.in/xtreme/index.html',
    host: 'ssgmce.ac.in/xtreme',
    icon: Users,
    color: '#fdba74',
  },
]

// The hardware project, drawn from the Aavishkar poster.
export const fence = {
  id: 'fence',
  kind: 'Hardware / Edge AI',
  title: 'AI Driven Smart Electric Fence',
  subtitle: 'for Agricultural and Animal Security',
  icon: Cpu,
  color: '#86efac',
  abstract:
    'Conventional electric fences give the same shock to every touch and cannot tell a human, an animal or a branch apart. This fence uses sensors and an AI model to classify the intruder, responds in proportion, and reports to the farmer over a long-range LoRaWAN link, running off-grid on solar power.',
  pipeline: ['Sensors', 'Edge AI', 'Safety interlock', 'Pulse / siren', 'LoRa node', 'Gateway', 'Cloud + app'],
  response: [
    ['Human', 'Safe-mode pulse cut-off, alarm, alert'],
    ['Large animal', 'Deterrent pulse, notify'],
    ['Small animal / debris', 'Log only'],
    ['Fence cut / fault', 'Fault alert with location'],
  ],
  parts: ['ESP32 / SBC (edge AI)', 'Camera + PIR sensor', 'LoRa module + gateway', 'Current-limited energizer', 'Solar panel + battery'],
  tags: ['Edge AI', 'LoRaWAN', 'ESP32', 'Solar', 'Agriculture'],
  poster: asset('img/fence-poster.jpg'),
}
