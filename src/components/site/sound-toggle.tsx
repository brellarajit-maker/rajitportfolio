"use client"

import { useEffect, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { restoreSound, setSound } from "@/lib/sound"

export function SoundToggle({ className }: { className?: string }) {
  const [on, setOn] = useState(false)

  useEffect(() => {
    setOn(restoreSound())
    const sync = () => setOn(restoreSound())
    window.addEventListener("rb-sound-change", sync)
    return () => window.removeEventListener("rb-sound-change", sync)
  }, [])

  return (
    <button
      type="button"
      onClick={() => setSound(!on)}
      aria-pressed={on}
      className={className}
      title={on ? "Turn sound off" : "Turn sound on"}
    >
      {on ? (
        <Volume2 className="h-4 w-4" aria-hidden />
      ) : (
        <VolumeX className="h-4 w-4" aria-hidden />
      )}
      <span className="sr-only">{on ? "Turn sound off" : "Turn sound on"}</span>
    </button>
  )
}
