/**
 * Everything written on the page lives here, so the copy can be edited
 * without going near a component.
 */

export const person = {
  name: "Rajit Barella",
  first: "Rajit",
  last: "Barella",
  location: "New Delhi, India",
  email: "brellarajit@gmail.com",
  phone: "+91 7290966443",
  tagline: "Website developer and designer in New Delhi.",
  /* The hero cycles through these. They are the jobs on the CV, not adjectives. */
  roles: [
    "Website Developer",
    "Designer",
    "Frontend Developer",
    "Prompt Engineer",
  ],
  intro: [
    "I build small websites for people who need one that works — writing the pages, choosing the pictures, and getting the whole thing live.",
    "Most of my work is for local businesses, so a site has to load fast on a phone, say the right thing in the first few seconds, and be easy to change later. That is what I design for.",
  ],
} as const

export const socials = [
  { label: "Email", href: "mailto:brellarajit@gmail.com", icon: "mail" },
  { label: "GitHub", href: "https://github.com/brellarajit-maker", icon: "github" },
  { label: "WhatsApp", href: "https://wa.me/917290966443", icon: "message" },
] as const

/* Placeholders worth editing once there are real figures to quote. */
export const stats = [
  { value: 6, suffix: "", label: "Sites built and shipped" },
  { value: 2, suffix: "+", label: "Years freelancing" },
  { value: 21, suffix: "", label: "Tools and technologies in use" },
  { value: 2, suffix: "", label: "Languages — English, Hindi" },
] as const

export const timeline = [
  {
    period: "2024 — now",
    title: "Freelance website developer & designer",
    place: "New Delhi",
    points: [
      "Built and looked after websites for local businesses — layout, copy, images and the whole launch.",
      "Designed each site around what the business actually sells, and kept it easy for them to update afterwards.",
      "Used Claude and ChatGPT to move faster through build and copy work, with prompts written so the process repeats.",
    ],
  },
  {
    period: "2022 — 2025",
    title: "B.A. Political Science",
    place: "PGDAV College, University of Delhi",
    points: [
      "Media, public discourse and policy — where I learned to write clearly and argue a point.",
    ],
  },
  {
    period: "2021 — 2022",
    title: "Senior Secondary, 75%",
    place: "Masonic Public School, New Delhi",
    points: [],
  },
] as const

export const skillGroups = [
  {
    name: "Build",
    blurb: "What the pages are made of",
    items: ["HTML", "CSS", "JavaScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    name: "AI",
    blurb: "Where the work gets faster",
    items: ["Prompt engineering", "Claude", "ChatGPT", "Copy drafting", "Asset generation"],
  },
  {
    name: "Design",
    blurb: "How it ends up looking",
    items: ["Layout & type", "Graphic design", "Figma", "Canva", "Image selection"],
  },
  {
    name: "Ship",
    blurb: "Getting it onto the web",
    items: ["Git", "GitHub", "Vercel", "Responsive layout", "MS Office"],
  },
] as const

export const contact = {
  heading: "Let's build something worth visiting.",
  deck: "Tell me what the site is for and who it's for. I'll come back with what I'd build and how long it takes.",
} as const

export type ProjectCategory = "Web Development" | "UI/UX" | "3D"

export const projects: {
  title: string
  year: string
  category: ProjectCategory
  summary: string
  stack: string[]
  live?: string
  repo?: string
  image?: string
  accent: string
}[] = [
  {
    title: "Avanti Eventica",
    year: "2026",
    category: "Web Development",
    summary:
      "A site for a live music, events and choreography brand — bands, services, past performances and a booking enquiry, all on one long page.",
    stack: ["HTML", "CSS", "JavaScript", "Vercel"],
    live: "https://avanti-eventica-z9ka.vercel.app/",
    accent: "#7e3042",
  },
  {
    title: "Local business sites",
    year: "2025 — 2026",
    category: "Web Development",
    summary:
      "Small marketing sites for shops and studios around Delhi. Wrote the copy, sourced the photography and shipped each one end to end.",
    stack: ["HTML", "CSS", "Responsive layout"],
    accent: "#4cd9e8",
  },
  {
    title: "Character turnaround",
    year: "2026",
    category: "UI/UX",
    summary:
      "A six-view reference sheet drawn for this portfolio, then cut apart so the figure in the hero can actually be rotated.",
    stack: ["Illustration", "Image pipeline", "Art direction"],
    accent: "#8a6bff",
  },
  {
    title: "This portfolio",
    year: "2026",
    category: "3D",
    summary:
      "Built with Next.js and React Three Fiber. The dust field is real geometry; the figure in the hero turns to follow your pointer through a hand-drawn turnaround.",
    stack: ["Next.js", "React Three Fiber", "Framer Motion", "Tailwind"],
    accent: "#4cd9e8",
  },
]

/**
 * A rigged GLB with separate eye bones (a Ready Player Me export, or anything
 * with the bone names listed in avatar.tsx). Drop the file here and the hero
 * switches from the drawn turnaround to the 3D character automatically.
 */
export const avatarUrl = "/character/avatar.glb"

/**
 * Chest-up views, ordered left to right by where the face is pointing.
 * `yaw` is the direction he is looking, in degrees: negative towards the
 * viewer's left, zero straight out of the page.
 */
export const heads = [
  { src: "/character/half/profile-left.png", yaw: -90, label: "left profile" },
  { src: "/character/half/three-quarter-left.png", yaw: -40, label: "¾ left" },
  { src: "/character/half/front.png", yaw: 0, label: "front" },
  { src: "/character/half/three-quarter-right.png", yaw: 40, label: "¾ right" },
  { src: "/character/half/profile-right.png", yaw: 90, label: "right profile" },
] as const

/**
 * The six full-length cut-outs, in the order you walk around the figure.
 * `deg` is where each one sits on that turn — the revolve holds each frame
 * for as long as the gap to the next one, so the spin reads at an even speed
 * even though the drawings are not evenly spaced.
 */
export const turnaround = [
  { src: "/character/front.png", deg: 0 },
  { src: "/character/three-quarter-left.png", deg: 45 },
  { src: "/character/profile-left.png", deg: 90 },
  { src: "/character/back.png", deg: 180 },
  { src: "/character/profile-right.png", deg: 270 },
  { src: "/character/three-quarter-right.png", deg: 315 },
] as const

export const navItems = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const
