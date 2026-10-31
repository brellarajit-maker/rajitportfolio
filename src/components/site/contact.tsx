"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { Spotlight } from "@/components/ui/spotlight"
import { RevolvingCharacter } from "./revolving-character"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { contact, person } from "@/data/site"
import { blip } from "@/lib/sound"
import { cn } from "@/lib/utils"

type Fields = { name: string; email: string; subject: string; message: string }
type Errors = Partial<Record<keyof Fields, string>>

const empty: Fields = { name: "", email: "", subject: "", message: "" }

function validate(values: Fields): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = "Add a name so I know who is writing."
  if (!values.email.trim()) errors.email = "Add an email so I can reply."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "That address is missing something — check it over."
  if (!values.subject.trim()) errors.subject = "A few words on what this is about."
  if (values.message.trim().length < 12)
    errors.message = "Tell me a little more — a sentence or two is plenty."
  return errors
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[0.8rem] font-medium tracking-wide text-bone/80"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-[0.8rem] text-alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

const inputClass =
  "w-full rounded-xl border border-bone/10 bg-ink/50 px-4 py-3 text-[0.95rem] text-bone transition-colors duration-200 hover:border-bone/20 focus:border-neon/70 focus:outline-none"

export function Contact() {
  const [values, setValues] = useState<Fields>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const set = (key: keyof Fields) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }))
    /* clear the complaint the moment they start fixing it */
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const checkOne = (key: keyof Fields) => () => {
    const next = validate(values)
    setErrors((e) => ({ ...e, [key]: next[key] }))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.values(found).some(Boolean)) {
      blip(300, 0.09)
      return
    }
    const body = `${values.message}\n\n— ${values.name} (${values.email})`
    window.location.href = `mailto:${person.email}?subject=${encodeURIComponent(
      values.subject,
    )}&body=${encodeURIComponent(body)}`
    setSent(true)
    blip(880, 0.08)
  }

  return (
    <section id="contact" className="relative px-5 py-28 sm:px-8 lg:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading title={contact.heading} deck={contact.deck} />
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <form onSubmit={onSubmit} noValidate className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Your name" error={errors.name}>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={values.name}
                    onChange={(e) => set("name")(e.target.value)}
                    onBlur={checkOne("name")}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={inputClass}
                  />
                </Field>
                <Field id="email" label="Email" error={errors.email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(e) => set("email")(e.target.value)}
                    onBlur={checkOne("email")}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field id="subject" label="Subject" error={errors.subject}>
                <input
                  id="subject"
                  name="subject"
                  value={values.subject}
                  onChange={(e) => set("subject")(e.target.value)}
                  onBlur={checkOne("subject")}
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                  className={inputClass}
                />
              </Field>

              <Field id="message" label="Message" error={errors.message}>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={values.message}
                  onChange={(e) => set("message")(e.target.value)}
                  onBlur={checkOne("message")}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={cn(inputClass, "resize-y")}
                />
              </Field>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-2 rounded-full bg-neon px-7 py-3.5 text-sm font-semibold text-ink transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_44px_-14px_color-mix(in_oklab,var(--color-neon)_85%,transparent)]"
                >
                  Send message
                  <Send
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </button>
                <p role="status" className="text-sm text-muted">
                  {sent
                    ? "Your email app should be opening with the message ready to send."
                    : "Goes straight to my inbox."}
                </p>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="glass relative overflow-hidden rounded-3xl p-7">
              <Spotlight
                className="from-neon/20 via-violet/10 to-transparent"
                size={300}
              />
              {/* the figure, turning on the spot */}
              <div className="relative h-72 sm:h-80">
                <RevolvingCharacter className="absolute inset-y-[4%] left-1/2 w-[9.5rem] -translate-x-1/2 sm:w-[11rem]" />
              </div>

              <ul className="relative mt-4 space-y-1">
                {[
                  {
                    icon: Mail,
                    label: person.email,
                    href: `mailto:${person.email}`,
                  },
                  {
                    icon: Phone,
                    label: person.phone,
                    href: `tel:${person.phone.replace(/\s/g, "")}`,
                  },
                  { icon: MapPin, label: person.location, href: undefined },
                ].map(({ icon: Icon, label, href }) => {
                  const content = (
                    <>
                      <Icon className="h-4 w-4 shrink-0 text-neon" aria-hidden />
                      <span>{label}</span>
                    </>
                  )
                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          onClick={() => blip(700)}
                          className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-[0.95rem] text-bone/85 transition-colors hover:bg-bone/[0.04] hover:text-neon"
                        >
                          {content}
                        </a>
                      ) : (
                        <span className="flex items-center gap-3 px-2 py-2.5 text-[0.95rem] text-muted">
                          {content}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
