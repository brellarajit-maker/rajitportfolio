"use client"

import { ArrowUp, Mail, MessageCircle } from "lucide-react"
import type { SVGProps } from "react"
import { person, socials } from "@/data/site"
import { blip } from "@/lib/sound"

/* lucide dropped its brand marks, so GitHub's comes in by hand */
function GithubMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.15v3.18c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

const icons = { mail: Mail, github: GithubMark, message: MessageCircle }

export function Footer() {
  return (
    <footer className="relative z-10 mt-10 border-t border-line px-5 pb-28 pt-12 sm:px-8 lg:pb-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <a
            href="#hero"
            onClick={() => blip(520)}
            className="font-display text-2xl font-extrabold tracking-[0.12em] text-bone transition-colors hover:text-neon"
          >
            RB
          </a>
          <p className="mt-2 text-sm text-muted">
            © {new Date().getFullYear()} {person.name}. Built in New Delhi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {socials.map((s) => {
            const Icon = icons[s.icon]
            return (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer noopener"
                onClick={() => blip(700)}
                title={s.label}
                className="grid h-11 w-11 place-items-center rounded-full border border-bone/10 text-muted transition-colors hover:border-neon/50 hover:text-neon"
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="sr-only">{s.label}</span>
              </a>
            )
          })}
          <a
            href="#hero"
            onClick={() => blip(760)}
            className="ml-2 inline-flex items-center gap-2 rounded-full border border-bone/10 px-4 py-3 text-sm font-medium text-muted transition-colors hover:border-neon/50 hover:text-neon"
          >
            <ArrowUp className="h-4 w-4" aria-hidden />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
