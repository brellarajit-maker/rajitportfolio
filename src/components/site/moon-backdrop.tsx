"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

/**
 * The vortex loop, sitting behind the whole site.
 *
 * It is held well back: dimmed, drifting slowly, and covered by an ink wash
 * so every section above it still reads. On a reduced-motion setting the
 * poster frame stands in for the video, so the page is still composed the
 * same way without anything moving.
 */
export function MoonBackdrop() {
  const video = useRef<HTMLVideoElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  const [calm, setCalm] = useState(true)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setCalm(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  /* A slow lean towards the pointer, so the backdrop floats rather than sits. */
  useEffect(() => {
    if (calm) return
    let frame = 0
    const target = { x: 0, y: 0 }
    const at = { x: 0, y: 0 }

    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.y = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const tick = () => {
      at.x += (target.x - at.x) * 0.03
      at.y += (target.y - at.y) * 0.03
      if (layer.current) {
        layer.current.style.transform = `scale(1.14) translate3d(${at.x * -1.4}%, ${at.y * -1.2}%, 0)`
      }
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener("pointermove", onMove)
    frame = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(frame)
    }
  }, [calm])

  /* Autoplay is refused in some browsers until the page is interacted with;
     the poster covers that case, and the first tap starts it. */
  useEffect(() => {
    if (calm) return
    const el = video.current
    if (!el) return
    const start = () => void el.play().catch(() => {})
    start()
    document.addEventListener("pointerdown", start, { once: true })
    return () => document.removeEventListener("pointerdown", start)
  }, [calm])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div ref={layer} className="absolute inset-0 will-change-transform">
        {calm ? (
          <Image
            src="/media/moon-walk.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-[0.33]"
          />
        ) : (
          <video
            ref={video}
            className="h-full w-full object-cover opacity-[0.33]"
            src="/media/moon-walk.mp4"
            poster="/media/moon-walk.jpg"
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
      </div>

      {/* Ink wash: keeps the bright centre of the vortex off the type. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 85% at 50% 45%, transparent 0%, color-mix(in oklab, var(--color-ink) 80%, transparent) 48%, var(--color-ink) 92%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, var(--color-ink) 0%, color-mix(in oklab, var(--color-ink) 55%, transparent) 42%, transparent 70%)",
        }}
      />
    </div>
  )
}
