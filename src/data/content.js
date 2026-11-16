/**
 * Portfolio content — derived from content.json (Spotlight handoff).
 * Named exports keep SEO metadata and older importers working.
 */
import site from './content.json' with { type: 'json' }

export { default as site } from './content.json' with { type: 'json' }

export const person = {
  firstName: 'Aditya',
  lastName: 'Vandan Sharma',
  name: site.nav.name,
  headline: site.hero.eyebrow,
  tagline: site.hero.tagline,
  location: 'Bangalore, India',
  email: site.contact.email,
  // Kept for SEO tests that assert the phone stays off published pages.
  phone: '+91-7566665551',
  website: site.meta.canonical,
  linkedin: site.footer.links.find((link) => link.label === 'LinkedIn')?.href,
  github: site.footer.links.find((link) => link.label === 'GitHub')?.href,
  profileImage: '/images/profile.png',
  resume: '/Aditya-Vandan-Sharma.pdf',
}

export const positioning = {
  audience: 'Recruiters, hiring managers, and companies looking for consultants',
  thesis: site.statement,
  proofPoints: site.impact.map(({ label, value, detail, lead }) => ({
    label,
    value,
    detail,
    lead: Boolean(lead),
  })),
}

export const experience = site.work.jobs.map((job) => ({
  role: job.role,
  company: job.company,
  url: job.url ?? null,
  location: 'Bangalore, India',
  start: job.start,
  end: job.end,
  highlights: job.highlights,
}))

export const projects = site.projects.map((project) => ({
  name: project.name,
  subtitle: project.kicker,
  about: project.about,
  stack: project.stack.split(', '),
  link: project.links?.find((item) => /demo/i.test(item.label))?.href ?? null,
  github: project.links?.find((item) => /source|github/i.test(item.label))?.href ?? null,
  image: project.image?.src?.replace('https://adityavandan.github.io', '') ?? null,
  imageAlt: project.image?.alt ?? null,
  art: project.art ?? null,
  links: project.links ?? [],
}))

export const skills = Object.fromEntries(
  site.stack.map((group) => {
    const key =
      group.label === 'Languages'
        ? 'languages'
        : group.label === 'Frameworks'
          ? 'frameworks'
          : group.label === 'AI'
            ? 'ai'
            : group.label === 'Databases'
              ? 'databases'
              : 'cicd'
    return [key, group.items.split(', ')]
  }),
)

export const nav = site.nav.links.map((link) => ({
  id: link.href.replace('#', ''),
  label: link.label,
  href: link.href,
}))

export const cta = {
  primary: site.hero.primaryAction.label,
  secondary: site.hero.secondaryAction.label.replace(/\s*›\s*$/, ''),
  resume: site.contact.resume.label.replace(/\s*›\s*$/, ''),
  consultingNote: site.contact.statement,
}

export const openSource = []

export const education = {
  degree: 'Bachelor of Technology',
  school: 'Ujjain Engineering College, Ujjain',
  start: 'June 2016',
  end: 'June 2020',
}
