"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

/**
 * Desktop pointer. The dot sits exactly under the finger; the ring lags,
 * and opens up over anything clickable so targets announce themselves.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.4 })
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.4 })

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)")
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!fine.matches || calm.matches) return
    setEnabled(true)

    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const el = e.target as HTMLElement | null
      setActive(Boolean(el?.closest("a, button, input, textarea, [data-cursor]")))
    }
    const leave = () => setVisible(false)

    window.addEventListener("pointermove", move)
    document.addEventListener("pointerleave", leave)
    return () => {
      window.removeEventListener("pointermove", move)
      document.removeEventListener("pointerleave", leave)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] hidden md:block"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <motion.span
        className="absolute h-1.5 w-1.5 rounded-full bg-neon"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.span
        className="absolute rounded-full border transition-[width,height,border-color,background-color] duration-200"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: active ? 46 : 26,
          height: active ? 46 : 26,
          borderColor: active
            ? "color-mix(in oklab, var(--color-neon) 80%, transparent)"
            : "color-mix(in oklab, var(--color-bone) 30%, transparent)",
          backgroundColor: active
            ? "color-mix(in oklab, var(--color-neon) 10%, transparent)"
            : "transparent",
        }}
      />
    </div>
  )
}
