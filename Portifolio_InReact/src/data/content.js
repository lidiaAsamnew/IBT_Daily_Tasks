import lidiaPhoto from '../assets/img/Lidia.jpg'
import htmlIcon from '../assets/img/skills-frontend-1.svg'
import cssIcon from '../assets/img/skills-frontend-2.svg'
import jsIcon from '../assets/img/skills-frontend-3.svg'
import reactIcon from '../assets/img/skills-frontend-4.svg'
import tailwindIcon from '../assets/img/skills-frontend-8.svg'
import postgresIcon from '../assets/img/skills-backend-2.svg'
import nodeIcon from '../assets/img/skills-backend-3.svg'
import gitIcon from '../assets/img/skills-frontend-6.svg'
import githubIcon from '../assets/img/skills-frontend-7.svg'
import workImg1 from '../assets/img/work-img-1.png'
import workImg2 from '../assets/img/work-img-2.png'
import workImg3 from '../assets/img/work-img-3.png'
import workImg4 from '../assets/img/work-img-4.png'
import workImg5 from '../assets/img/work-img-5.png'

export const navLinks = [
  { href: '#home', label: 'Home', className: 'nav__link' },
  { href: '#about', label: 'About', className: 'nav__link' },
  { href: '#work', label: 'Works', className: 'nav__link' },
  { href: '#service', label: 'What I Do', className: 'nav__link' },
  { href: '#skills', label: 'Skills', className: 'nav__link' },
  { href: '#experience', label: 'Experience', className: 'nav__link' },
  { href: '#contact', label: 'Contact me', className: 'nav__contact' }
]

export const typedStrings = [
  'Full-Stack Developer',
  'Backend Developer',
  'Frontend Developer'
]

export const homePhoto = lidiaPhoto

export const works = [
  {
    number: '01',
    name: 'Food Recipes Platform',
    description:
      'Full-stack recipe sharing app: create and browse recipes, search and filter, bookmarks, ratings, comments, JWT auth, image uploads, and Chapa payments. Vue 3, Nuxt 3, Hasura GraphQL, Go, PostgreSQL, and Docker (January 2025 – May 2025).',
    tags: ['Vue 3', 'Nuxt 3', 'Go', 'GraphQL'],
    github: 'https://github.com/lidiaAsamnew/Food_Recipes-Website',
    image: workImg1
  },
  {
    number: '02',
    name: 'Addis Eat',
    description:
      'Ethiopian food ordering website for Addis Ababa, with searchable dishes, categories, and a checkout flow. Built with HTML, CSS, and JavaScript.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: workImg2
  },
  {
    number: '03',
    name: 'HahuJobs',
    description:
      'Layout redesign of three Hahu Jobs pages (home, jobs, and sector detail) during an internship at Minab Tech. Built with Nuxt 3 and Tailwind CSS, including a mobile-first layout and dark mode.',
    tags: ['Nuxt 3', 'Vue', 'Tailwind CSS'],
    github: 'https://github.com/lidiaAsamnew/Hahu-jobs',
    image: workImg3
  },
  {
    number: '04',
    name: 'Swift Supermarket Delivery PWA',
    description:
      'Frontend for a grocery delivery Progressive Web App: shopping cart, checkout, order tracking, delivery scheduling, and role-based dashboards. Next.js, TypeScript, and Tailwind CSS (June 2025 – August 2025).',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    image: workImg4
  },
  {
    number: '05',
    name: 'Hospital Management System Admin UI',
    description:
      'University group project (2024–2025) for a hospital management system. The public repository is mainly TypeScript, with HTML and CSS. I am listed as a team member on GitHub.',
    tags: ['TypeScript', 'HTML', 'CSS'],
    github: 'https://github.com/lidiaAsamnew/Essential_Hospital_Management_System_2024_25',
    image: workImg5
  },
  {
    number: '06',
    name: 'Smart Parking Backend',
    description:
      'Backend work for a smart parking system. A public repository is not available yet, so there is no GitHub or live demo link here.',
    tags: ['Backend'],
    icon: 'ri-parking-box-line'
  }
]

export const services = [
  {
    id: 'service-panel-1',
    number: '01',
    name: 'Frontend Development',
    description:
      'User interfaces with React, Vue, Nuxt, JavaScript, TypeScript, and Tailwind CSS, including responsive layouts and clear interaction flows.',
    items: ['React & Vue', 'Nuxt', 'TypeScript', 'Tailwind CSS', 'Responsive UI']
  },
  {
    id: 'service-panel-2',
    number: '02',
    name: 'Backend Development',
    description: 'APIs and server-side logic with Node.js, NestJS, Python, Java, and Go.',
    items: ['Node.js & NestJS', 'Python & Java', 'Go', 'REST & GraphQL']
  },
  {
    id: 'service-panel-3',
    number: '03',
    name: 'Full-Stack Applications',
    description:
      'Connecting frontend and backend into complete applications, from data models to the screens people use.',
    items: ['End-to-end features', 'Authentication flows', 'Dashboards', 'PWAs']
  },
  {
    id: 'service-panel-4',
    number: '04',
    name: 'Data & Tooling',
    description:
      'Databases and development workflow with PostgreSQL, Prisma, GraphQL, Docker, Git, GitHub, and Azure DevOps.',
    items: ['PostgreSQL', 'Prisma & GraphQL', 'Docker', 'Git & GitHub', 'Azure DevOps']
  }
]

export const skillGroups = [
  {
    title: 'Frontend',
    titleIcon: 'ri-code-s-slash-line',
    items: [
      { name: 'HTML', image: htmlIcon },
      { name: 'CSS', image: cssIcon },
      { name: 'JavaScript', image: jsIcon },
      { name: 'TypeScript', icon: 'ri-hashtag' },
      { name: 'React', image: reactIcon },
      { name: 'Next.js', icon: 'ri-nextjs-line' },
      { name: 'Vue', icon: 'ri-vuejs-line' },
      { name: 'Nuxt', icon: 'ri-window-line' },
      { name: 'Tailwind CSS', image: tailwindIcon }
    ]
  },
  {
    title: 'Backend',
    titleIcon: 'ri-server-line',
    items: [
      { name: 'Python', icon: 'ri-code-line' },
      { name: 'Java', icon: 'ri-cup-line' },
      { name: 'Node.js', image: nodeIcon },
      { name: 'NestJS', icon: 'ri-terminal-box-line' },
      { name: 'Go', icon: 'ri-braces-line' },
      { name: 'PostgreSQL', image: postgresIcon },
      { name: 'GraphQL', icon: 'ri-share-line' },
      { name: 'Prisma', icon: 'ri-database-2-line' }
    ]
  },
  {
    title: 'Tools',
    titleIcon: 'ri-tools-line',
    items: [
      { name: 'Git', image: gitIcon },
      { name: 'GitHub', image: githubIcon },
      { name: 'Docker', icon: 'ri-ship-2-line' },
      { name: 'Azure DevOps', icon: 'ri-cloud-line' }
    ]
  }
]

export const experiences = [
  {
    date: 'February 2023 – June 2027',
    title: 'B.Sc. Software Engineering',
    place: 'Addis Ababa University',
    text: 'Undergraduate Software Engineering program. Expected graduation: 2027.'
  },
  {
    date: 'Internship',
    title: 'Hahu Jobs layout redesign',
    place: 'Minab Tech',
    text: 'Redesigned the home, jobs, and sector detail pages of the Hahu Jobs website with Nuxt 3 and Tailwind CSS.'
  },
  {
    date: 'June 2025 – August 2025',
    title: 'Swift Supermarket Delivery PWA',
    place: 'Frontend development',
    text: 'Built customer and staff interfaces, cart and checkout, order tracking, and role-based dashboards with Next.js, TypeScript, and Tailwind CSS.'
  },
  {
    date: 'January 2025 – May 2025',
    title: 'Food Recipes Platform',
    place: 'Full-stack development',
    text: 'Designed the database and GraphQL API, built the Vue 3 / Nuxt 3 frontend, and implemented JWT authentication, search, filtering, and bookmarks.'
  }
]

export const contactDetails = [
  {
    icon: 'ri-mail-line',
    title: 'Email',
    href: 'mailto:lidia.yirbe@gmail.com',
    label: 'lidia.yirbe@gmail.com'
  },
  {
    icon: 'ri-phone-line',
    title: 'Phone',
    href: 'tel:+251900024893',
    label: '+251 900 024 893'
  },
  {
    icon: 'ri-map-pin-line',
    title: 'Location',
    label: 'Addis Ababa, Ethiopia'
  },
  {
    icon: 'ri-github-fill',
    title: 'GitHub',
    href: 'https://github.com/lidiaAsamnew',
    label: 'github.com/lidiaAsamnew',
    external: true
  }
]
