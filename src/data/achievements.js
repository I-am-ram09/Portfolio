import { asset } from './asset.js'

export const achievements = [
  {
    id: 'iei',
    ordinal: '3',
    suffix: 'rd',
    place: '3rd Prize',
    title: 'Met-Invent 2k26',
    event: 'Project Competition',
    org: 'The Institution of Engineers (India), Amravati Local Centre',
    date: '7 April 2026',
    project: 'Solar Integrated Ethanol Flame Generation',
    note: 'Recognised for innovation, technical depth and contribution to the field of engineering.',
    image: asset('img/iei-met-invent.jpg'),
    color: '#fdba74',
  },
  {
    id: 'aavishkar',
    ordinal: '2',
    suffix: 'nd',
    place: '2nd Rank',
    title: 'Aavishkar 2026',
    event: 'District Level Student Research Convention',
    org: 'Sant Gadge Baba Amravati University, hosted at SSGMCE Shegaon',
    date: '29 October 2026',
    project: 'AI Driven Smart Electric Fence',
    note: 'Category: Agriculture and Animal Husbandry, UG level.',
    image: asset('img/aavishkar-2026.jpg'),
    color: '#d8b4fe',
  },
]
