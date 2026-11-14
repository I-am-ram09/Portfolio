import { Github, Linkedin, Mail } from 'lucide-react'

export const EMAIL = 'ramdcodes@gmail.com'

export const handles = [
  {
    id: 'github',
    label: 'GitHub',
    handle: 'I-am-ram09',
    href: 'https://github.com/I-am-ram09',
    icon: Github,
    color: '#d8b4fe',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'ram-bhosale-735203384',
    href: 'https://www.linkedin.com/in/ram-bhosale-735203384',
    icon: Linkedin,
    color: '#7dd3fc',
  },
  {
    id: 'email',
    label: 'Email',
    handle: EMAIL,
    href: `mailto:${EMAIL}`,
    icon: Mail,
    color: '#f9a8d4',
  },
]

// Keep LinkedIn at index 1: the Certifications space links to it.
export const LINKEDIN_URL = handles.find((h) => h.id === 'linkedin').href
