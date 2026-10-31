"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { ArrowDown, ArrowUpRight, Mail } from "lucide-react"
import { useReducedMotion } from "framer-motion"
import { Spotlight } from "@/components/ui/spotlight"
import { HeroCharacter } from "./hero-character"
import { person } from "@/data/site"
import { blip } from "@/lib/sound"

/* three.js is a big download and the page reads fine without it */
const Particles = dynamic(() => import("./particles"), {
  ssr: false,
  loading: () => null,
})

function RoleTyper() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [len, setLen] = useState(0)
  const [erasing, setErasing] = useState(false)

  useEffect(() => {
    if (reduced) return
    const role = person.roles[index]
    const atEnd = len === role.length

    const wait = erasing ? 32 : atEnd ? 1500 : 58
    const t = window.setTimeout(() => {
      if (!erasing && atEnd) {
        setErasing(true)
        return
      }
      if (erasing && len === 0) {
        setErasing(false)
        setIndex((i) => (i + 1) % person.roles.length)
        return
      }
      setLen((n) => n + (erasing ? -1 : 1))
    }, wait)

    return () => window.clearTimeout(t)
  }, [len, erasing, index, reduced])

  if (reduced) {
    return <span>{person.roles.join(" · ")}</span>
  }

  return (
    <span>
      {person.roles[index].slice(0, len)}
      <span
        aria-hidden
        className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-neon"
      />
      <span className="sr-only">{person.roles.join(", ")}</span>
    </span>
  )
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-5 pb-24 pt-24 sm:px-8 sm:pt-32 lg:pb-20"
    >
      {/* No negative z-index here: body paints an opaque background over it. */}
      <div
        className="absolute inset-0"
        /* the dust belongs around the figure; it must not crawl over the name */
        style={{
          maskImage:
            "linear-gradient(to right, transparent 8%, rgba(0,0,0,0.3) 38%, #000 72%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 8%, rgba(0,0,0,0.3) 38%, #000 72%)",
        }}
      >
        <Particles />
      </div>

      {/* the lit horizon the figure stands against */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55vh]"
        style={{
          background:
            "radial-gradient(70% 100% at 68% 100%, color-mix(in oklab, var(--color-violet) 16%, transparent), transparent 70%)",
        }}
      />
      <Spotlight className="from-neon/25 via-violet/10 to-transparent" size={520} />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        <div className="relative z-10 max-w-xl">
          <p className="font-mono text-[0.72rem] tracking-[0.34em] text-muted">
            {person.location}
          </p>

          <h1 className="mt-4 font-display font-extrabold leading-[0.84] tracking-[-0.045em]">
            <span className="block text-[clamp(1rem,3vw,1.6rem)] font-semibold tracking-[-0.01em] text-muted">
              Hey, I&rsquo;m
            </span>
            <span className="etched mt-2 block text-[clamp(2.5rem,11vw,6rem)]">
              {person.first}
            </span>
            <span className="etched block text-[clamp(2.5rem,11vw,6rem)]">
              {person.last}
            </span>
          </h1>

          <div className="rule mt-5 max-w-sm sm:mt-7" />

          <p className="mt-4 min-h-[1.6em] font-display text-lg font-semibold text-bone sm:mt-6 sm:text-2xl">
            <RoleTyper />
          </p>

          <p className="mt-3 max-w-md text-[0.92rem] leading-relaxed text-muted sm:mt-4 sm:text-[0.98rem]">
            {person.tagline} I write the pages, choose the pictures, and get the
            whole thing live.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-9">
            <a
              href="#work"
              onClick={() => blip(700)}
              className="group inline-flex items-center gap-2 rounded-full bg-bone px-5 py-3 text-[0.82rem] font-semibold text-ink transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-12px_color-mix(in_oklab,var(--color-neon)_70%,transparent)] sm:px-6 sm:py-3.5 sm:text-sm"
            >
              Explore my work
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
            <a
              href="#contact"
              onClick={() => blip(520)}
              className="group inline-flex items-center gap-2 rounded-full border border-bone/15 px-5 py-3 text-[0.82rem] font-semibold text-bone transition-colors duration-300 hover:border-neon/60 hover:text-neon sm:px-6 sm:py-3.5 sm:text-sm"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Let&rsquo;s connect
            </a>
          </div>
        </div>

        <HeroCharacter className="relative z-10 mx-auto w-full max-w-md lg:max-w-none" />
      </div>

      <a
        href="#about"
        onClick={() => blip(480)}
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted transition-colors hover:text-neon lg:bottom-8 lg:flex"
      >
        <span className="font-mono text-[0.68rem] tracking-[0.3em]">SCROLL</span>
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-4 bg-neon"
            style={{ animation: "sweep 2.4s ease-in-out infinite" }}
          />
        </span>
        <ArrowDown className="h-3.5 w-3.5" aria-hidden />
      </a>
    </section>
  )
}
