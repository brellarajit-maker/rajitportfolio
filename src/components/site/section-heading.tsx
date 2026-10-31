/** Heading plus a rule that runs out to the edge — it marks where a section starts. */
export function SectionHeading({
  title,
  deck,
}: {
  title: string
  deck?: string
}) {
  return (
    <div>
      <div className="flex items-baseline gap-5">
        <h2 className="font-display text-[clamp(1.9rem,5vw,3rem)] font-bold leading-none">
          {title}
        </h2>
        <span aria-hidden className="h-px flex-1 bg-line" />
      </div>
      {deck ? (
        <p className="mt-4 max-w-lg text-[0.98rem] leading-relaxed text-muted">
          {deck}
        </p>
      ) : null}
    </div>
  )
}
