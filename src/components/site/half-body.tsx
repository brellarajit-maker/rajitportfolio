"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"
import { heads } from "@/data/site"
import { cn } from "@/lib/utils"

/** Which drawn view sits closest to the yaw we want right now. */
function nearestHead(yaw: number) {
  let best = 0
  for (let i = 1; i < heads.length; i++) {
    if (Math.abs(yaw - heads[i].yaw) < Math.abs(yaw - heads[best].yaw)) best = i
  }
  return best
}

/**
 * Chest-up character that looks at the pointer.
 *
 * The gaze is not faked with pupils painted on top — it comes from the drawn
 * views themselves. The pointer sets a head yaw, the nearest drawing is
 * cross-faded in, and whatever angle that drawing cannot express is applied
 * as a small 3D rotation. So the head turns continuously rather than snapping,
 * and because each drawing's gaze follows its own head, he keeps looking at you.
 */
export function HalfBody({ className }: { className?: string }) {
  const stage = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(2)
  const [frameYaw, setFrameYaw] = useState(0)

  /* negative yaw looks towards the viewer's left, positive to their right */
  const yaw = useSpring(0, { stiffness: 64, damping: 17, mass: 0.75 })
  const pitch = useSpring(0, { stiffness: 64, damping: 17, mass: 0.75 })

  useMotionValueEvent(yaw, "change", (v) => {
    const next = nearestHead(v)
    if (next !== index) {
      setIndex(next)
      setFrameYaw(heads[next].yaw)
    }
  })

  const residual = useTransform(yaw, (v) => (v - frameYaw) * 0.4)
  const lean = useTransform(yaw, (v) => v * 0.045)
  const sway = useTransform(yaw, (v) => v * 0.2)

  const aim = useCallback(
    (clientX: number, clientY: number) => {
      const host = stage.current?.closest("section")
      if (!host) return
      const r = host.getBoundingClientRect()
      const px = Math.min(Math.max((clientX - r.left) / r.width, 0), 1) * 2 - 1
      const py = Math.min(Math.max((clientY - r.top) / r.height, 0), 1) * 2 - 1
      /* eased, so most of the screen keeps him near front-on and only the far
         edges turn him all the way to profile */
      yaw.set(Math.sign(px) * Math.pow(Math.abs(px), 1.6) * 90)
      pitch.set(-py * 6)
    },
    [pitch, yaw],
  )

  useEffect(() => {
    if (reduced) return
    const host = stage.current?.closest("section") ?? document.body
    const onMove = (e: PointerEvent) => aim(e.clientX, e.clientY)
    /* pointer gone: ease back to looking straight out of the page */
    const recentre = () => {
      yaw.set(0)
      pitch.set(0)
    }
    host.addEventListener("pointermove", onMove as EventListener)
    document.addEventListener("pointerleave", recentre)
    window.addEventListener("blur", recentre)
    return () => {
      host.removeEventListener("pointermove", onMove as EventListener)
      document.removeEventListener("pointerleave", recentre)
      window.removeEventListener("blur", recentre)
    }
  }, [aim, pitch, reduced, yaw])

  const view = heads[index]

  return (
    <div
      ref={stage}
      className={cn("relative select-none", className)}
      onPointerDown={(e) => aim(e.clientX, e.clientY)}
      role="img"
      aria-label="Illustrated portrait of Rajit Barella, turning towards the pointer"
    >
      {/* cinematic key light behind the shoulders */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[8%] top-[12%] h-[64%] rounded-[50%] blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, color-mix(in oklab, var(--color-neon) 26%, transparent), color-mix(in oklab, var(--color-violet) 15%, transparent) 55%, transparent 72%)",
        }}
      />

      <div
        className="relative mx-auto h-[clamp(14rem,32dvh,20rem)] w-full max-w-[30rem] lg:h-[clamp(19rem,58dvh,32rem)]"
        style={{ perspective: 1200 }}
      >
        <motion.div
          className="h-full w-full"
          style={{ rotateY: residual, rotateZ: lean, x: sway, rotateX: pitch }}
        >
          {/* breathing — the only motion that runs without being asked for */}
          <motion.div
            className="relative h-full w-full"
            animate={reduced ? undefined : { scale: [1, 1.013, 1], y: [0, -5, 0] }}
            transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {heads.map((h, i) => (
              <Image
                key={h.src}
                src={h.src}
                alt=""
                fill
                priority={i === 2}
                sizes="(max-width: 640px) 80vw, 30rem"
                className={cn(
                  "object-contain object-bottom transition-opacity duration-150 ease-out",
                  i === index ? "opacity-100" : "opacity-0",
                )}
                style={{
                  filter:
                    "drop-shadow(0 0 34px color-mix(in oklab, var(--color-neon) 18%, transparent)) drop-shadow(0 24px 44px rgb(0 0 0 / 0.7))",
                  /* the crop ends mid-chest, so dissolve it instead of
                     leaving a cut edge across his shirt */
                  maskImage:
                    "linear-gradient(to bottom, #000 68%, rgba(0,0,0,0.55) 88%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, #000 68%, rgba(0,0,0,0.55) 88%, transparent 100%)",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      <Readout yaw={yaw} label={view.label} />
    </div>
  )
}

function Readout({
  yaw,
  label,
}: {
  yaw: ReturnType<typeof useSpring>
  label: string
}) {
  const deg = useTransform(yaw, (v) => {
    const n = Math.round(v)
    const sign = n > 0 ? "+" : n < 0 ? "−" : "±"
    return `${sign}${String(Math.abs(n)).padStart(2, "0")}`
  })

  return (
    <div className="pointer-events-none absolute right-0 top-1 text-right font-mono text-[0.7rem] leading-5 tracking-widest text-muted">
      <motion.span className="block text-xl font-medium tabular-nums text-neon">
        {deg}
      </motion.span>
      <span className="block">head yaw</span>
      <span className="mt-2 block text-bone/70">{label}</span>
    </div>
  )
}
