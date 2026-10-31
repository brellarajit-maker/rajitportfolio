"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { navItems, person } from "@/data/site"
import { blip } from "@/lib/sound"
import { SoundToggle } from "./sound-toggle"
import { cn } from "@/lib/utils"

export function Nav() {
  const [active, setActive] = useState<string>(navItems[0].id)

  useEffect(() => {
    /* Intersection ratios favour short sections over tall ones, so go by
       position instead: the last section whose top has passed under the nav. */
    let queued = false

    const pick = () => {
      queued = false
      const line = window.scrollY + 140
      let current: string = navItems[0].id

      for (const item of navItems) {
        const el = document.getElementById(item.id)
        if (el && el.offsetTop <= line) current = item.id
      }
      /* the last section can be too short to ever reach the line */
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 80) {
        current = navItems[navItems.length - 1].id
      }
      setActive(current)
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(pick)
    }

    pick()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-neon focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <a
          href="#hero"
          onClick={() => blip(520)}
          className="pointer-events-auto font-display text-sm font-extrabold tracking-[0.2em] text-bone/90 transition-colors hover:text-neon"
        >
          RB
          <span className="sr-only"> — {person.name}, back to top</span>
        </a>

        <nav
          aria-label="Sections"
          className={cn(
            "glass pointer-events-auto fixed inset-x-5 bottom-5 flex items-center justify-between gap-1 rounded-full p-1.5",
            "sm:static sm:inset-auto sm:justify-center",
          )}
        >
          {navItems.map((item) => {
            const isActive = active === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => blip(isActive ? 420 : 660)}
                aria-current={isActive ? "true" : undefined}
                className="relative rounded-full px-3 py-2 text-[0.78rem] font-medium tracking-wide text-muted transition-colors hover:text-bone sm:px-4 sm:text-sm"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-bone/[0.08] ring-1 ring-inset ring-neon/30"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={cn("relative", isActive && "text-bone")}>
                  {item.label}
                </span>
              </a>
            )
          })}
        </nav>

        <SoundToggle className="glass pointer-events-auto grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:text-neon" />
      </header>
    </>
  )
}
