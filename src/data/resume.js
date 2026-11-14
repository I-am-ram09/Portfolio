import { asset } from './asset.js'

// The PDF lives in /public/resume. Replace the file (same name) to update the site.
export const RESUME = {
  pdf: asset('resume/Ram_Bhosale_Resume.pdf'),
  preview: asset('resume/resume-preview.webp'),
  fileName: 'Ram_Bhosale_Resume.pdf',
  cgpa: '8.86',
  skills: [
    ['Languages', 'Python, JavaScript, HTML, CSS, SQL'],
    ['Frameworks', 'React, Node.js, Tailwind CSS'],
    ['Data & cloud', 'PostgreSQL, Supabase, Vercel'],
    ['Tools', 'Git, GitHub, Fusion 360, MATLAB, Simulink'],
  ],
  highlights: [
    ['education', 'B.E. Mechanical, SSGMCE Shegaon, 2nd year'],
    ['cgpa', '8.86'],
    ['built', 'DocYard, Northstar Cleargate, Team X-treme site, AI smart electric fence'],
    ['certified', 'Kaggle Python, MATLAB Onramp, Simulink Onramp'],
  ],
}
