"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "framer-motion"

export function Counter({
  value,
  suffix = "",
  label,
}: {
  value: number
  suffix?: string
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setShown(value)
      return
    }

    const duration = 1100
    const start = performance.now()
    let frame = 0
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      /* ease-out so it lands softly on the real number */
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))))
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduced, value])

  return (
    <div ref={ref}>
      <div className="font-display text-4xl font-bold tabular-nums text-bone sm:text-5xl">
        {shown}
        {suffix}
      </div>
      <div className="mt-2 text-sm leading-snug text-muted">{label}</div>
    </div>
  )
}
