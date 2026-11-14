import { AtSign, BadgeCheck, FileText, FolderKanban, Trophy, User } from 'lucide-react'

// One entry per orbital node.
// angle        : where the node sits on the orbit (degrees, 0 = right, 90 = down, 180 = left, 270 = up)
// mobileAngle  : same, for narrow screens
// absorb       : true = the beam is ABSORBED by the node (it glows, grows and opens) instead of shattering the hub
export const spaces = [
  { id: 'about', label: 'About', title: 'About', kicker: 'who is behind this', icon: User, color: '#d8b4fe', angle: 205, mobileAngle: 218 },
  { id: 'projects', label: 'Projects', title: 'Projects', kicker: 'things I have built', icon: FolderKanban, color: '#f9a8d4', angle: 340, mobileAngle: 322 },
  { id: 'certifications', label: 'Certifications', title: 'Certifications', kicker: 'proof of work, on paper', icon: BadgeCheck, color: '#86efac', angle: 165, mobileAngle: 170 },
  { id: 'achievements', label: 'Achievements', title: 'Achievements', kicker: 'podium finishes', icon: Trophy, color: '#fdba74', angle: 15, mobileAngle: 10 },
  { id: 'resume', label: 'Resume', title: 'Resume', kicker: 'the one-page version', icon: FileText, color: '#fde68a', angle: 58, mobileAngle: 52, absorb: true },
  { id: 'handles', label: 'Handles', title: 'Handles', kicker: 'find me elsewhere', icon: AtSign, color: '#7dd3fc', angle: 122, mobileAngle: 128 },
]

export const spaceById = (id) => spaces.find((s) => s.id === id)
