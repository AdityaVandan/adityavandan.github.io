/**
 * Shared portfolio content — source of truth for all design variations.
 * Story: expert full-stack AI software engineer for recruiters,
 * hiring managers, and consultancies.
 */

export const person = {
  firstName: 'Aditya',
  lastName: 'Vandan Sharma',
  name: 'Aditya Vandan Sharma',
  headline: 'Full-stack AI software engineer',
  tagline:
    'I design and ship AI systems that sit inside real products — triage agents, retrieval grounded in production code, and tooling that saves engineering hours every week.',
  location: 'Bangalore, India',
  email: 'adityavandan@outlook.com',
  phone: '+91-7566665551',
  website: 'https://adityavandan.github.io/',
  linkedin: 'https://www.linkedin.com/in/aditya-vandan-sharma/',
  github: 'https://github.com/AdityaVandan',
  profileImage: '/images/profilepic.jpg',
}

export const positioning = {
  audience: 'Recruiters, hiring managers, and companies looking for consultants',
  thesis:
    'I am an expert full-stack AI software engineer: I own the product surface, the services behind it, and the agents that make both faster.',
  proofPoints: [
    {
      label: 'AI triage at Tesco',
      value: '45 min → 5 min',
      detail: 'Root-cause before an engineer opens the ticket',
    },
    {
      label: 'Tickets grounded weekly',
      value: '63% of 500',
      detail: 'Correlated with Splunk logs and live production APIs',
    },
    {
      label: 'AI test-fix agent',
      value: '8–16 hrs/wk',
      detail: 'Auto-fixes failing tests and opens PRs across an 8-engineer team',
    },
  ],
}

export const experience = [
  {
    role: 'Software Engineer 2',
    company: 'Tesco',
    location: 'Bangalore, India',
    start: 'March 2025',
    end: 'Present',
    highlights: [
      'Built an AI triage agent that correlates Zendesk tickets with Splunk logs and live production APIs to identify root cause before an engineer opens the ticket, cutting first-response investigation from 45 mins to 5 mins on 63% of the 500 tickets/week.',
      'Designed the retrieval layer around ripgrep and git pickaxe over shallow clones pinned to deployed SHAs, grounding every diagnosis in the code actually running in production rather than HEAD.',
      'Redesigned single-product induction (45 min for 3 products) into Bulk Induction, cutting onboarding time by 85% (15–20 min for 30+ products) across a 300K+ SKU catalog serving 15,000 supplier/buyer/persona users.',
      'Architected Bulk Induction: batched attribute fetching (up to 500 attributes/product), lazy-loaded rendering for large hierarchical payloads (3–5MB/product), and IndexedDB caching, while designing the workflow to support 50 products.',
      'Rolled out an AI agent across an 8-engineer team that auto-fixes failing tests from dev-session changes and opens PRs for review, saving 8–16 engineer-hours weekly.',
      'Led a team of 2 engineers and mentored them.',
    ],
  },
  {
    role: 'Software Engineer 2',
    company: 'Rippling',
    location: 'Bangalore, India',
    start: 'July 2022',
    end: 'Feb 2025',
    highlights: [
      'Architected and rolled out a Design Tokens system that became the org-wide standard for the design-to-development pipeline, adopted across both mobile and web teams.',
      'Optimized People Directory and Settings in mobile to improve performance by more than 50%.',
      'Led the CI/CD overhaul for the mobile repo for screenshot testing, dead-code elimination, linting, testing, and cross-repo dependency handling — cutting build friction and improving developer experience across the team.',
      'Architected and shipped an end-to-end Tax & Exemptions Correction Framework, automating the quarterly amendment process and eliminating 9–10 person-weeks of manual analyst and support-engineering effort every quarter.',
    ],
  },
  {
    role: 'Software Development Engineer',
    company: 'Groww',
    location: 'Bangalore, India',
    start: 'October 2020',
    end: 'July 2022',
    highlights: [
      'Built the Fixed Deposit product end-to-end across mobile and web, driving 1 lakh FDs booked through the platform, and owned critical mutual funds journeys with full technical ownership.',
      'Optimised core website chunking/tree shaking to reduce size of the core chunk by 15%.',
      'Shipped the first version of Groww’s OSS Design System for the website.',
    ],
  },
  {
    role: 'Data Engineer',
    company: 'Almug.ai',
    location: 'Bangalore, India',
    start: 'June 2020',
    end: 'Sept 2020',
    highlights: [
      'Designed and implemented a data processing pipeline for financial data from press releases of Fortune 500 companies.',
    ],
  },
]

export const projects = [
  {
    name: 'Atlas',
    subtitle: 'Stock Trading Framework',
    about:
      'Atlas is a stock trading framework for trading, forward testing, and backtesting strategies — split into Atlas-Go (real-time multi-broker execution with notification and logging) and Atlas-Quant (backtesting on historical data).',
    stack: ['Go', 'Zerodha Go SDK', 'Fyers APIs', 'PostgreSQL', 'Python', 'SQLAlchemy', 'Quant'],
    link: null,
    github: null,
  },
  {
    name: 'Path Finder Visualizer',
    subtitle: 'Graph search & maze algorithms',
    about:
      'Visualizes graph searching algorithms used in solving and creating mazes: BFS, DFS, Dijkstra, Greedy BFS, A*, and Swarm, plus maze-generating algorithms.',
    stack: ['JavaScript ES6', 'React', 'Git'],
    link: 'https://adityavandan.github.io/path-finder',
    github: 'https://github.com/AdityaVandan/path-finder',
    image: '/images/portfolio/pathfinder.jpg',
  },
]

export const openSource = [
  {
    name: 'unimported',
    about: 'Contributed to a CLI tool that finds dead dependencies and code.',
    link: 'https://github.com/smeijer/unimported',
  },
  {
    name: 'webster',
    about:
      'Contributed to Groww’s mono-repo for design system, utilities, and charting solutions.',
    link: 'https://github.com/Groww/webster',
  },
]

export const skills = {
  languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'C++', 'Java'],
  frameworks: ['Django', 'FastAPI', 'React', 'Next.js', 'React Native'],
  databases: ['PostgreSQL', 'MongoDB', 'Redis'],
  ai: ['LangChain', 'RAG', 'Agent evaluation', 'LLM tooling'],
  cicd: ['Git', 'Docker', 'Kubernetes', 'GitHub Actions', 'Jenkins'],
}

export const education = {
  degree: 'Bachelor of Technology',
  school: 'Ujjain Engineering College, Ujjain',
  start: 'June 2016',
  end: 'June 2020',
}

export const nav = [
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export const cta = {
  primary: 'Discuss a role or consulting engagement',
  secondary: 'View GitHub',
  consultingNote:
    'Open to full-time roles and selective consulting where AI agents need to ship inside production systems — not demos.',
}
