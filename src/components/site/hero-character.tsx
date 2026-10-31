"use client"

import dynamic from "next/dynamic"
import { Component, Suspense, useEffect, useState, type ReactNode } from "react"
import { HalfBody } from "./half-body"
import { avatarUrl } from "@/data/site"
import { cn } from "@/lib/utils"

/* three plus a rigged model is a large download, and only fetched if present */
const Avatar = dynamic(() => import("./avatar"), {
  ssr: false,
  loading: () => null,
})

/** A broken or unreadable model must not take the hero down with it. */
class ModelBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error("[avatar] model failed to load, showing the drawing", error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/**
 * Renders the rigged 3D character once a model file exists, and the drawn
 * turnaround until then — which also covers the download and any load error,
 * so the hero is never empty.
 */
export function HeroCharacter({ className }: { className?: string }) {
  const [hasModel, setHasModel] = useState(false)
  const drawn = <HalfBody className={className} />

  useEffect(() => {
    let live = true
    fetch(avatarUrl, { method: "HEAD" })
      .then((r) => {
        /* a dev server can answer 404 with an HTML page, so check the type too */
        const type = r.headers.get("content-type") ?? ""
        if (live) setHasModel(r.ok && !type.includes("text/html"))
      })
      .catch(() => {
        if (live) setHasModel(false)
      })
    return () => {
      live = false
    }
  }, [])

  if (!hasModel) return drawn

  return (
    <ModelBoundary fallback={drawn}>
      <div className={cn("relative select-none", className)}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[8%] top-[12%] h-[64%] rounded-[50%] blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, color-mix(in oklab, var(--color-neon) 26%, transparent), color-mix(in oklab, var(--color-violet) 15%, transparent) 55%, transparent 72%)",
          }}
        />
        <div className="relative mx-auto h-[clamp(14rem,32dvh,20rem)] w-full max-w-[30rem] lg:h-[clamp(19rem,58dvh,32rem)]">
          {/* the drawing holds the frame while the model streams in */}
          <Suspense fallback={drawn}>
            <Avatar />
          </Suspense>
        </div>
      </div>
    </ModelBoundary>
  )
}
