"use client"

import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { skillGroups } from "@/data/site"

export function Skills() {
  return (
    <section id="skills" className="relative px-5 py-28 sm:px-8 lg:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            title="What I work with"
            deck="Four groups, in the order a job usually moves through them — build it, speed the work up, make it look right, then get it live."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, i) => (
            <Reveal key={group.name} delay={i * 0.07}>
              <Card className="glass group h-full rounded-2xl border-0 p-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5">
                <Spotlight
                  className="from-neon/25 via-violet/10 to-transparent"
                  size={220}
                />
                <div className="relative">
                  <h3 className="font-display text-xl font-bold">
                    {group.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted">{group.blurb}</p>
                  <div
                    aria-hidden
                    className="my-5 h-px w-full bg-line transition-colors duration-500 group-hover:bg-neon/40"
                  />
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-bone/10 bg-bone/[0.03] px-3 py-1.5 text-[0.82rem] text-bone/80 transition-colors duration-300 group-hover:border-bone/20"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
