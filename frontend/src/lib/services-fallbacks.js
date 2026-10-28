// Offline fallback for the Hire Talent service cards.
//
// The five offerings were hard-coded in the original Services page, so they are
// kept here for the first paint / when the API is unreachable. Everything else
// (technologies) is managed in the Django admin and comes from /api/services/.
const service = (name, description, order) => ({
  id: name,
  name,
  title: name,
  slug: name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, ''),
  description,
  category: 'what_we_offer',
  image: null,
  order,
});

export const FALLBACK_SERVICES = [
  service(
    'Software Development as a Service',
    'We build customised software solutions for global clients. Our milestone-based payment model ensures we only proceed to the next phase when you are happy with the solution.',
    1,
  ),
  service(
    'Software Development as a Service (SAAs)',
    'End-to-end software development delivered as a recurring service, from discovery and design to build, release and ongoing support.',
    2,
  ),
  service(
    'Staff Augmentation',
    'Easily scale up teams with pre-vetted local developers. Pick from a diverse range of AI-ready talent proficient in Full Stack, Front End, Back End, DevOps, UI/UX and Business Analysis.',
    3,
  ),
  service(
    'Developers on Demand',
    'Full-time, part-time or project-based work, immediate access to proficient developers for flexible hiring in fintech, AI, blockchain and cybersecurity.',
    4,
  ),
  service(
    'Project Management',
    'Agile-certified project managers with end-to-end oversight, reporting and KPI-driven delivery from start to finish.',
    5,
  ),
];
