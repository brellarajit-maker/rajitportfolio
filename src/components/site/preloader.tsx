"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { heads } from "@/data/site"

/**
 * The loader is the turnaround spun fast — the same drawings the hero uses,
 * so nothing is loading that the page will not use.
 */
export function Preloader() {
  const reduced = useReducedMotion()
  const [done, setDone] = useState(false)
  const [frame, setFrame] = useState(0)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (reduced) {
      setDone(true)
      return
    }
    document.body.style.overflow = "hidden"

    const spin = window.setInterval(
      () => setFrame((f) => (f + 1) % heads.length),
      120,
    )
    const climb = window.setInterval(() => {
      setPct((p) => (p >= 100 ? 100 : p + Math.ceil((100 - p) / 9)))
    }, 90)
    const finish = window.setTimeout(() => setDone(true), 1700)

    return () => {
      window.clearInterval(spin)
      window.clearInterval(climb)
      window.clearTimeout(finish)
      document.body.style.overflow = ""
    }
  }, [reduced])

  useEffect(() => {
    if (done) document.body.style.overflow = ""
  }, [done])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-ink"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          aria-live="polite"
          aria-label="Loading"
        >
          <div className="relative h-44 w-40">
            {heads.map((v, i) => (
              <Image
                key={v.src}
                src={v.src}
                alt=""
                fill
                priority={i === 2}
                sizes="160px"
                className="object-contain object-bottom"
                style={{ opacity: i === frame ? 1 : 0 }}
              />
            ))}
          </div>
          <div className="absolute bottom-16 left-1/2 w-56 -translate-x-1/2">
            <div className="h-px w-full bg-line">
              <motion.div
                className="h-px bg-neon"
                animate={{ width: `${pct}%` }}
                transition={{ ease: "linear", duration: 0.09 }}
              />
            </div>
            <p className="mt-3 text-center font-mono text-[0.7rem] tracking-[0.3em] tabular-nums text-muted">
              {String(pct).padStart(3, "0")}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
