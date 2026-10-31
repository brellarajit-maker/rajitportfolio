"use client"

import Image from "next/image"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { SectionHeading } from "./section-heading"
import { Counter } from "./counter"
import { Reveal } from "./reveal"
import { person, stats, timeline } from "@/data/site"

export function About() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  /* the card tilts back a touch as it passes — depth, not a party trick */
  const rotate = useTransform(scrollYProgress, [0, 1], [7, -7])
  const y = useTransform(scrollYProgress, [0, 1], [26, -26])

  return (
    <section id="about" className="relative px-5 py-28 sm:px-8 lg:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            title="About"
            deck="A political science graduate who builds websites, and cares as much about what a page says as how it looks."
          />
        </Reveal>

        <div
          ref={ref}
          className="mt-14 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"
        >
          <Reveal className="[perspective:1400px]">
            <motion.div style={{ rotateX: rotate, y }}>
              <Card className="glass relative overflow-hidden rounded-3xl border-0 p-0">
                <Spotlight
                  className="from-neon/20 via-violet/10 to-transparent"
                  size={320}
                />
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src="/media/rajit-portrait.jpg"
                    alt={`${person.name}, photographed in New Delhi`}
                    fill
                    sizes="(max-width: 1024px) 80vw, 24rem"
                    className="object-cover object-top"
                  />
                  {/* only the very bottom is pulled into the card, so the
                      photograph keeps its own colour everywhere else */}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/4"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--color-panel) 80%, transparent))",
                    }}
                  />
                </div>
                <div className="relative flex items-center justify-between gap-4 border-t border-bone/10 px-6 py-5">
                  <div>
                    <p className="font-display text-base font-bold">
                      {person.name}
                    </p>
                    <p className="text-sm text-muted">{person.location}</p>
                  </div>
                  <span className="font-mono text-[0.68rem] tracking-[0.25em] text-neon">
                    2026
                  </span>
                </div>
              </Card>
            </motion.div>
          </Reveal>

          <div>
            <Reveal>
              <div className="space-y-5 text-[1.02rem] leading-[1.75] text-bone/80">
                {person.intro.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-y border-line py-10 sm:grid-cols-4">
                {stats.map((s) => (
                  <Counter
                    key={s.label}
                    value={s.value}
                    suffix={s.suffix}
                    label={s.label}
                  />
                ))}
              </div>
            </Reveal>

            <ol className="mt-12 space-y-10">
              {timeline.map((entry, i) => (
                <Reveal key={entry.title} delay={i * 0.06}>
                  <li className="relative grid gap-3 pl-7 sm:grid-cols-[8.5rem_1fr] sm:gap-6 sm:pl-0">
                    <span
                      aria-hidden
                      className="absolute left-0 top-2 h-2 w-2 rounded-full bg-neon shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-neon)_15%,transparent)] sm:hidden"
                    />
                    {i < timeline.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute bottom-[-2.5rem] left-[3.5px] top-6 w-px bg-line sm:hidden"
                      />
                    )}
                    <p className="font-mono text-[0.72rem] tracking-[0.18em] text-muted sm:pt-1.5">
                      {entry.period}
                    </p>
                    <div className="sm:border-l sm:border-line sm:pl-6">
                      <h3 className="font-display text-lg font-bold leading-snug">
                        {entry.title}
                      </h3>
                      <p className="mt-1 text-sm text-neon/80">{entry.place}</p>
                      {entry.points.length > 0 && (
                        <ul className="mt-3 space-y-2 text-[0.95rem] leading-relaxed text-muted">
                          {entry.points.map((p) => (
                            <li key={p.slice(0, 20)} className="flex gap-3">
                              <span
                                aria-hidden
                                className="mt-2.5 h-px w-3 shrink-0 bg-line"
                              />
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
