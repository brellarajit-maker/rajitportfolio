"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { useReducedMotion } from "framer-motion"
import { turnaround } from "@/data/site"
import { cn } from "@/lib/utils"

/** One full turn, in milliseconds. */
const REVOLUTION = 16000

/**
 * The figure turning on the spot, continuously.
 *
 * There are only six drawings, so holding each one and swapping would read as
 * six steps. Instead an angle advances every frame and the two drawings either
 * side of it are always cross-faded against each other — the figure is never
 * parked on a single frame, so the turn never stops.
 *
 * Opacity is written straight to the DOM rather than through state: at 60fps
 * React would otherwise re-render the whole thing sixty times a second.
 */
export function RevolvingCharacter({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  const frames = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (reduced) {
      frames.current.forEach((el, i) => {
        if (el) el.style.opacity = i === 0 ? "1" : "0"
      })
      return
    }

    let raf = 0
    const start = performance.now()

    const tick = (now: number) => {
      const angle = (((now - start) / REVOLUTION) * 360) % 360

      /* the pair of drawings this angle currently sits between */
      let from = turnaround.length - 1
      for (let i = 0; i < turnaround.length; i++) {
        if (turnaround[i].deg <= angle) from = i
      }
      const to = (from + 1) % turnaround.length
      const span =
        (turnaround[to].deg - turnaround[from].deg + 360) % 360 || 360
      const travelled = (angle - turnaround[from].deg + 360) % 360
      const u = Math.min(travelled / span, 1)
      /* ease the blend so neither drawing lingers at half opacity */
      const blend = u * u * (3 - 2 * u)

      for (let i = 0; i < frames.current.length; i++) {
        const el = frames.current[i]
        if (!el) continue
        el.style.opacity =
          i === from ? String(1 - blend) : i === to ? String(blend) : "0"
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  return (
    <div className={cn("pointer-events-none relative", className)}>
      {/* the light he turns in */}
      <div
        aria-hidden
        className="absolute inset-x-[18%] bottom-[6%] h-10 rounded-[100%] blur-xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--color-neon) 55%, transparent), transparent 70%)",
        }}
      />
      {turnaround.map((view, i) => (
        <div
          key={view.src}
          ref={(el) => {
            frames.current[i] = el
          }}
          className="absolute inset-0"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <Image
            src={view.src}
            alt=""
            fill
            sizes="220px"
            className="object-contain object-bottom"
            style={{
              filter:
                "drop-shadow(0 0 16px color-mix(in oklab, var(--color-neon) 30%, transparent))",
              maskImage:
                "linear-gradient(to bottom, #000 90%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 90%, transparent 100%)",
            }}
          />
        </div>
      ))}
    </div>
  )
}
