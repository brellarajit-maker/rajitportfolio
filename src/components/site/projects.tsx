"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { projects, type ProjectCategory } from "@/data/site"
import { blip } from "@/lib/sound"
import { cn } from "@/lib/utils"

const filters = ["All", "Web Development", "UI/UX", "3D"] as const
type Filter = (typeof filters)[number]

/** A card that leans towards the pointer. */
function TiltCard({ project }: { project: (typeof projects)[number] }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const onMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setTilt({ x: -py * 7, y: px * 9 })
  }

  return (
    <div className="h-full [perspective:1200px]">
      <Card
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        className="glass group h-full overflow-hidden rounded-3xl border-0 p-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
        }}
      >
        <Spotlight className="from-neon/20 via-violet/10 to-transparent" size={340} />

        <div className="relative aspect-[16/10] overflow-hidden border-b border-bone/10">
          {project.image ? (
            <Image
              src={project.image}
              alt={`Screenshot of ${project.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 46rem"
              className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          ) : (
            /* No screenshot to show, so the plate states the project rather
               than borrowing an unrelated stock photo. */
            <div
              className="absolute inset-0 grid place-items-center"
              style={{
                background: `radial-gradient(120% 100% at 20% 0%, color-mix(in oklab, ${project.accent} 34%, transparent), transparent 62%), linear-gradient(160deg, #0d1521, #070a11)`,
              }}
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
                  backgroundSize: "46px 46px",
                  maskImage:
                    "radial-gradient(80% 70% at 50% 40%, #000, transparent)",
                  WebkitMaskImage:
                    "radial-gradient(80% 70% at 50% 40%, #000, transparent)",
                }}
              />
              <span className="relative px-6 text-center font-display text-[clamp(1.6rem,5vw,2.6rem)] font-extrabold leading-tight tracking-tight text-bone/25">
                {project.title}
              </span>
            </div>
          )}

          <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-[0.66rem] tracking-[0.18em] text-bone/70 backdrop-blur">
            {project.year}
          </span>
        </div>

        <div className="relative p-7">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-2xl font-bold leading-tight">
              {project.title}
            </h3>
            <span className="shrink-0 pt-1 text-xs text-muted">
              {project.category}
            </span>
          </div>

          <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-muted">
            {project.summary}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li
                key={s}
                className="rounded-full border border-bone/10 px-2.5 py-1 text-[0.76rem] text-bone/65"
              >
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => blip(760)}
                className="inline-flex items-center gap-2 rounded-full bg-bone px-5 py-2.5 text-sm font-semibold text-ink transition-transform duration-300 hover:-translate-y-0.5"
              >
                Visit the site
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            ) : (
              <span className="text-sm text-muted">
                Private client work — happy to walk you through it.
              </span>
            )}
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-bone/15 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-neon/60 hover:text-neon"
              >
                Code
              </a>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  )
}

export function Projects() {
  const [filter, setFilter] = useState<Filter>("All")
  const shown = projects.filter(
    (p) => filter === "All" || p.category === (filter as ProjectCategory),
  )

  return (
    <section id="work" className="relative px-5 py-28 sm:px-8 lg:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            title="Selected work"
            deck="Four things worth showing — what the job was, what it is built from, and where to see it."
          />
        </Reveal>

        <Reveal delay={0.06}>
          <div
            role="tablist"
            aria-label="Filter projects by kind"
            className="mt-10 flex flex-wrap gap-2"
          >
            {filters.map((f) => {
              const isActive = filter === f
              return (
                <button
                  key={f}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => {
                    setFilter(f)
                    blip(isActive ? 420 : 640)
                  }}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive ? "text-ink" : "text-muted hover:text-bone",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-bone"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{f}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        <motion.div layout className="mt-10 grid gap-6 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {shown.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
